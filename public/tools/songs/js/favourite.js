// ===== FAVOURITE FEATURE =====

// Import supabase client từ file chung
import { supabase } from './supabase-client.js';

let userFavourites = [];
window.userFavourites = [];
window.currentSongId = null;

function tr(key, variables = {}) {
  if (window.getTranslatedText) {
    return window.getTranslatedText(key, variables);
  }
  return key;
}

function getFavouriteSongs() {
  if (!Array.isArray(window._songs) || !window._songs.length) {
    return [];
  }

  const songMap = new Map(window._songs.map(song => [song.Id.toString(), song]));
  return userFavourites
    .map(songId => songMap.get(songId))
    .filter(Boolean);
}

// Load favourites từ database
async function loadUserFavourites() {
  if (!window.currentUser) {
    userFavourites = [];
    window.userFavourites = [];
    return;
  }
  
  const { data, error } = await supabase
    .from('profiles')
    .select('favourites')
    .eq('id', window.currentUser.id)
    .single();
  
  if (error) {
    console.error('Error loading favourites:', error);
    userFavourites = [];
    window.userFavourites = [];
    return;
  }
  
  userFavourites = data?.favourites || [];
  window.userFavourites = userFavourites;
  
  // Re-render songs để update favourite buttons
  if (window._songs && window.renderSongs) {
    window.renderSongs(window._songs);
  }
}

// Export function để có thể gọi từ nơi khác
window.loadUserFavourites = loadUserFavourites;

// Toggle favourite
window.toggleFavourite = async function(songId) {
  if (!window.currentUser) {
    alert('Vui lòng đăng nhập để sử dụng tính năng này!');
    return;
  }
  
  // Nếu không truyền songId, lấy từ currentSongId (trong dialog)
  const targetSongId = songId || window.currentSongId;
  if (!targetSongId) return;
  
  const songIdStr = targetSongId.toString();
  const isFavourite = userFavourites.includes(songIdStr);
  
  let newFavourites;
  if (isFavourite) {
    // Remove
    newFavourites = userFavourites.filter(id => id !== songIdStr);
  } else {
    // Add
    newFavourites = [...userFavourites, songIdStr];
  }
  
  // Update database
  const { error } = await supabase
    .from('profiles')
    .update({ favourites: newFavourites })
    .eq('id', window.currentUser.id);
  
  if (error) {
    console.error('Error updating favourites:', error);
    alert('Có lỗi xảy ra!');
    return;
  }
  
  // Update local state
  userFavourites = newFavourites;
  window.userFavourites = newFavourites;
  
  // Update UI
  updateFavouriteButtons(targetSongId);
  
  // Show feedback
  if (!isFavourite) {
    showToast('❤️ Đã thêm vào yêu thích!');
  } else {
    showToast('💔 Đã xóa khỏi yêu thích!');
  }
  
  // Nếu đang mở favourite dialog, reload nó
  if (favouriteDialog.open) {
    openFavouriteDialog();
  }
};

// Update UI của tất cả favourite buttons
function updateFavouriteButtons(songId) {
  const songIdStr = songId.toString();
  const isActive = userFavourites.includes(songIdStr);
  
  // Update button trong table
  const tableBtn = document.querySelector(`[data-song-id="${songId}"][data-action="favourite"]`);
  if (tableBtn) {
    if (isActive) {
      tableBtn.classList.add('active');
    } else {
      tableBtn.classList.remove('active');
    }
  }
  
  // Update button trong lyric dialog
  const lyricBtn = document.getElementById('btnFavouriteLyric');
  if (lyricBtn && window.currentSongId == songId) {
    if (isActive) {
      lyricBtn.classList.add('active');
    } else {
      lyricBtn.classList.remove('active');
    }
  }
  
  // Update button trong youtube dialog
  const youtubeBtn = document.getElementById('btnFavouriteYoutube');
  if (youtubeBtn && window.currentSongId == songId) {
    if (isActive) {
      youtubeBtn.classList.add('active');
    } else {
      youtubeBtn.classList.remove('active');
    }
  }
}

// Toast notification
function showToast(message) {
  // Remove existing toast
  const existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();
  
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.textContent = message;
  toast.style = `
    position: fixed;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(17, 17, 39, 0.95);
    backdrop-filter: blur(10px);
    color: white;
    padding: 12px 24px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 14px;
    z-index: 10000;
    animation: toastSlideUp 0.3s ease;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.1);
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'toastSlideDown 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

window.showToast = showToast;

// Open favourite dialog
window.openFavouriteDialog = async function() {
  if (!window.currentUser) {
    alert('Vui lòng đăng nhập để xem bài hát yêu thích!');
    return;
  }
  
  await loadUserFavourites();
  
  const favouriteList = document.getElementById('favouriteList');
  const favouriteCount = document.getElementById('favouriteCount');
  const playlistButton = document.getElementById('btnFavouritePlaylist');
  const songs = getFavouriteSongs();
  
  favouriteCount.textContent = songs.length;
  
  if (songs.length === 0) {
    if (playlistButton) playlistButton.disabled = true;
    favouriteList.innerHTML = `
      <div style="text-align: center; padding: 60px 20px; color: var(--text-muted);">
        <i class="fa-solid fa-heart-crack" style="font-size: 64px; margin-bottom: 20px; opacity: 0.3;"></i>
        <p style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">Chưa có bài hát yêu thích</p>
        <p style="font-size: 14px;">Hãy thêm những bài hát bạn yêu thích vào đây! ❤️</p>
      </div>
    `;
  } else {
    if (playlistButton) playlistButton.disabled = songs.length === 0;
    
    favouriteList.innerHTML = songs.map(song => `
      <div class="favourite-item" onclick="showLyric(${song.Id}); favouriteDialog.close();">
        <div class="favourite-item-left">
          ${song.avatar 
            ? `<img src="${song.avatar}" alt="avatar">` 
            : '<div class="favourite-no-avatar">🎵</div>'
          }
          <div class="favourite-info">
            <div class="favourite-title">${song['Tên']}</div>
            <div class="favourite-artist">${song['Ca sĩ']}</div>
          </div>
        </div>
        <div class="favourite-item-right">
          <button 
            class="btn-remove-favourite" 
            onclick="event.stopPropagation(); toggleFavourite(${song.Id})"
            title="${tr('deleteTitle')}"
          >
            <i class="fa-solid fa-heart-crack"></i> ${tr('deleteTitle')}
          </button>
        </div>
      </div>
    `).join('');
  }
  
  favouriteDialog.showModal();
};

window.startFavouritePlaylistFromDialog = async function() {
  if (!window.currentUser) {
    alert('Vui lòng đăng nhập để xem bài hát yêu thích!');
    return;
  }

  await loadUserFavourites();

  const songs = getFavouriteSongs();
  if (!songs.length) {
    alert(tr('favouritePlaylistEmpty'));
    return;
  }

  favouriteDialog.close();
  await window.startFavouritePlaylist?.(songs, 0);
};

// Close favourite dialog khi click outside
favouriteDialog.addEventListener('click', (e) => {
  if (e.target === favouriteDialog) {
    favouriteDialog.close();
  }
});

document.addEventListener('app-languagechange', () => {
  if (favouriteDialog.open) {
    openFavouriteDialog();
  }
});
