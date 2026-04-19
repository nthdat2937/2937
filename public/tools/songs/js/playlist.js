// ===== CUSTOM PLAYLISTS STATE & CRUD (SUPABASE) =====
import { supabase } from './supabase-client.js';

window.customPlaylists = [];
window.currentCustomPlaylistState = {
  active: false,
  playlistId: null,
  currentIndex: -1
};

// Khởi tạo Playlist
window.loadCustomPlaylists = async function() {
  if (!window.currentUser) {
    window.customPlaylists = [];
    return;
  }
  
  try {
    const { data, error } = await supabase
      .from('custom_playlists')
      .select('*')
      .eq('user_id', window.currentUser.id)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    window.customPlaylists = data || [];
  } catch (e) {
    console.error('Lỗi khi tải Custom Playlists từ Supabase:', e);
    // Nếu bảng chưa được tạo, backend sẽ chửi lỗi, ta catch ở đây.
    window.customPlaylists = [];
  }
};

// Hàm cập nhật lên DB
async function updatePlaylistInDb(playlistId, payload) {
  if (!window.currentUser) return false;
  try {
    const { error } = await supabase
      .from('custom_playlists')
      .update(payload)
      .eq('id', playlistId)
      .eq('user_id', window.currentUser.id);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('Lỗi khi cập nhật Playlist:', e);
    return false;
  }
}

window.createCustomPlaylist = async function(name) {
  if (!window.currentUser) {
    showToast('⚠️ Vui lòng đăng nhập để tạo!');
    return;
  }
  if (!name || !name.trim()) return;
  
  const newRaw = {
    user_id: window.currentUser.id,
    name: name.trim(),
    songs: []
  };
  
  try {
    const { data, error } = await supabase
      .from('custom_playlists')
      .insert([newRaw])
      .select()
      .single();
      
    if (error) throw error;
    if (data) {
      window.customPlaylists.unshift(data);
    }
    showToast('✅ Đã tạo playlist mới: ' + name);
    renderCustomPlaylistsDialog();
  } catch (e) {
    console.error(e);
    showToast('❌ Lỗi tạo playlist (Cần chạy SQL tạo bảng)');
  }
};

window.deleteCustomPlaylist = async function(id) {
  if (!window.currentUser) return;
  
  if (confirm('Bạn có chắc chắn muốn xóa playlist này không?')) {
    try {
      const { error } = await supabase
        .from('custom_playlists')
        .delete()
        .eq('id', id)
        .eq('user_id', window.currentUser.id);
        
      if (error) throw error;
      
      window.customPlaylists = window.customPlaylists.filter(pl => pl.id !== id);
      
      // Nếu đang phát playlist này thì nên dừng
      if (window.currentCustomPlaylistState.playlistId === id) {
        resetCustomPlaylistState();
        try { stopYoutube(); } catch(e){}
        try { stopNct(); } catch(e){}
      }
  
      renderCustomPlaylistsDialog();
    } catch(e) {
      console.error(e);
      showToast('❌ Lỗi khi xoá playlist');
    }
  }
};

window.renameCustomPlaylist = async function(id) {
  const pl = window.customPlaylists.find(p => p.id === id);
  if (!pl) return;
  const newName = prompt('Nhập tên mới cho playlist:', pl.name);
  if (newName !== null && newName.trim() !== '') {
    const originalName = pl.name;
    pl.name = newName.trim();
    
    // Optimistic UI
    renderCustomPlaylistsDialog();
    if (window.customPlaylistDetailsDialog && window.customPlaylistDetailsDialog.open) {
      document.getElementById('cpDetailsTitle').textContent = pl.name;
    }
    
    const success = await updatePlaylistInDb(id, { name: pl.name });
    if (!success) {
      // Revert if error
      pl.name = originalName;
      renderCustomPlaylistsDialog();
      showToast('❌ Lỗi khi đổi tên');
    }
  }
};

window.addSongToCustomPlaylist = async function(playlistId, songData) {
  if (!window.currentUser) {
    showToast('⚠️ Yêu cầu đăng nhập!');
    return;
  }
  const pl = window.customPlaylists.find(p => p.id === playlistId);
  if (!pl) return;
  
  const songs = pl.songs || [];
  // Tránh trùng bài
  const isDuplicate = songs.some(s => 
    (s.type === 'internal' && songData.type === 'internal' && s.songId === songData.songId) ||
    (s.type === 'external' && songData.type === 'external' && s.url && s.url === songData.url)
  );

  if (isDuplicate) {
    showToast('⚠️ Bài hát này đã có trong playlist!');
    return;
  }

  const newSong = {
    ...songData,
    addedAt: Date.now()
  };
  
  const newSongsList = [...songs, newSong];
  
  // Optimistic update
  pl.songs = newSongsList;
  if (window.customPlaylistDetailsDialog && window.customPlaylistDetailsDialog.open && window.currentViewingPlaylistId === playlistId) {
    renderCustomPlaylistDetails(playlistId);
  }
  
  const success = await updatePlaylistInDb(playlistId, { songs: newSongsList });
  if (success) {
    showToast('✅ Đã thêm bài hát vào playlist');
  } else {
    // Revert
    pl.songs = songs;
    if (window.customPlaylistDetailsDialog && window.customPlaylistDetailsDialog.open && window.currentViewingPlaylistId === playlistId) {
       renderCustomPlaylistDetails(playlistId);
    }
    showToast('❌ Có lỗi xảy ra');
  }
};

window.removeSongFromCustomPlaylist = async function(playlistId, songIndex) {
  const pl = window.customPlaylists.find(p => p.id === playlistId);
  if (!pl) return;
  
  const originalSongs = [...(pl.songs || [])];
  pl.songs.splice(songIndex, 1);
  
  // Optimistic
  if (window.customPlaylistDetailsDialog && window.customPlaylistDetailsDialog.open && window.currentViewingPlaylistId === playlistId) {
    renderCustomPlaylistDetails(playlistId);
  }
  renderCustomPlaylistsDialog();
  
  const success = await updatePlaylistInDb(playlistId, { songs: pl.songs });
  if (success) {
    showToast('🗑 Đã xóa bài hát khỏi playlist');
  } else {
    pl.songs = originalSongs;
    showToast('❌ Lỗi khi xoá bài');
    renderCustomPlaylistsDialog();
  }
};

window.resetCustomPlaylistState = function() {
  window.currentCustomPlaylistState = {
    active: false,
    playlistId: null,
    currentIndex: -1
  };
};

/* ===== UI LOGIC ===== */

window.openCustomPlaylistsDialog = async function() {
  if (!window.currentUser) {
     showToast('⚠️ Vui lòng đăng nhập để xem playlist!');
     return;
  }
  await loadCustomPlaylists();
  renderCustomPlaylistsDialog();
  document.getElementById('customPlaylistsDialog').showModal();
};

window.renderCustomPlaylistsDialog = function() {
  const container = document.getElementById('customPlaylistsList');
  if (!container) return;

  if (window.customPlaylists.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: var(--text-muted);">
        <i class="fa-solid fa-folder-open" style="font-size: 48px; margin-bottom: 16px; opacity: 0.3;"></i>
        <p>Bạn chưa có playlist tuỳ chọn nào.</p>
        <p style="font-size: 13px;">Hãy tạo một playlist mới để bắt đầu lưu trữ bài hát theo ý thích!</p>
      </div>`;
    return;
  }

  container.innerHTML = window.customPlaylists.map(pl => `
    <div style="
      display: flex; align-items: center; justify-content: space-between;
      padding: 16px; background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-color); border-radius: 12px; margin-bottom: 12px;
    ">
      <div style="cursor: pointer; flex: 1;" onclick="openCustomPlaylistDetails('${pl.id}')">
        <div style="font-weight: 700; font-size: 16px; color: var(--text-primary); margin-bottom: 4px;">
          ${escapeHtml(pl.name)}
        </div>
        <div style="font-size: 13px; color: var(--text-muted);">
          <i class="fa-solid fa-music"></i> ${pl.songs.length} bài hát
        </div>
      </div>
      <div style="display: flex; gap: 8px;">
        <button onclick="renameCustomPlaylist('${pl.id}')" class="btn" title="Đổi tên" style="background: rgba(245, 158, 11, 0.1); color: #f59e0b;">
          <i class="fa-solid fa-pen"></i>
        </button>
        <button onclick="deleteCustomPlaylist('${pl.id}')" class="btn" title="Xoá" style="background: rgba(239, 68, 68, 0.1); color: #ef4444;">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    </div>
  `).join('');
};

window.handleCreateCustomPlaylist = function() {
  const input = document.getElementById('newCustomPlaylistName');
  if (input) {
    createCustomPlaylist(input.value);
    input.value = '';
  }
};

window.openCustomPlaylistDetails = function(playlistId) {
  const pl = window.customPlaylists.find(p => p.id === playlistId);
  if (!pl) return;
  
  window.currentViewingPlaylistId = playlistId;
  document.getElementById('cpDetailsTitle').textContent = pl.name;
  renderCustomPlaylistDetails(playlistId);
  
  // Close the parent dialog if open
  if (document.getElementById('customPlaylistsDialog').open) {
    document.getElementById('customPlaylistsDialog').close();
  }
  
  document.getElementById('customPlaylistDetailsDialog').showModal();
};

window.renderCustomPlaylistDetails = function(playlistId) {
  const pl = window.customPlaylists.find(p => p.id === playlistId);
  const container = document.getElementById('cpDetailsSongsList');
  if (!pl || !container) return;

  if (pl.songs.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: var(--text-muted);">
        <i class="fa-solid fa-music" style="font-size: 48px; margin-bottom: 16px; opacity: 0.3;"></i>
        <p>Playlist này chưa có bài hát nào.</p>
        <p style="font-size: 13px;">Nhấn "Thêm Bài Mới" hoặc thêm trực tiếp từ danh sách bài hát của web!</p>
      </div>`;
    return;
  }

  container.innerHTML = pl.songs.map((song, index) => {
    let icon, title, artist;
    if (song.type === 'internal') {
      const dbSong = (window._songs || []).find(s => s.Id === song.songId);
      icon = '<i class="fa-solid fa-database" title="Bài hát gốc (từ web)" style="color: #3b82f6;"></i>';
      title = dbSong ? dbSong['Tên'] : `Bài hát gốc (ID: ${song.songId})`;
      artist = dbSong ? dbSong['Ca sĩ'] : '...';
    } else {
      title = song.title || 'Không rõ';
      artist = song.artist || 'Không có';
      if (song.url) {
        if (song.url.includes('youtube') || song.url.includes('youtu.be')) {
          icon = '<i class="fa-brands fa-youtube" title="YouTube" style="color: #ef4444;"></i>';
        } else if (song.url.includes('spotify')) {
          icon = '<i class="fa-brands fa-spotify" title="Spotify" style="color: #10b981;"></i>';
        } else {
          icon = '<i class="fa-solid fa-link" title="Đường dẫn ngoài"></i>';
        }
      } else {
        icon = '<i class="fa-solid fa-pen-nib" title="Thêm tự do"></i>';
      }
    }

    return `
      <div style="
        display: flex; align-items: center; justify-content: space-between;
        padding: 12px 16px; background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; margin-bottom: 8px;
      ">
        <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
          <div style="font-size: 20px; opacity: 0.8; width: 24px; text-align: center;">${icon}</div>
          <div>
            <div style="font-weight: 700; color: var(--text-primary); font-size: 15px;">${escapeHtml(title)}</div>
            <div style="font-size: 12px; color: var(--text-muted);">${escapeHtml(artist)}</div>
          </div>
        </div>
        <button onclick="removeSongFromCustomPlaylist('${playlistId}', ${index})" class="btn" title="Xoá bản ghi" style="background: rgba(239, 68, 68, 0.1); color: #ef4444;">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    `;
  }).join('');
};

window.promptAddCurrentSongToPlaylist = async function(optionalSongId) {
  if (!window.currentUser) {
    showToast('⚠️ Vui lòng đăng nhập để thêm vào playlist!');
    return;
  }
  
  await loadCustomPlaylists();

  const songId = optionalSongId || window.currentSongId;
  if (!songId) {
    showToast('❌ Không tìm thấy thông tin bài hát!');
    return;
  }
  
  if (window.customPlaylists.length === 0) {
    await createCustomPlaylist("Playlist 1"); // auto create if empty
    // Lấy lại danh sách vừa tạo
    if (window.customPlaylists.length > 0) {
       addSongToCustomPlaylist(window.customPlaylists[0].id, { type: 'internal', songId });
    }
  } else if (window.customPlaylists.length === 1) {
    // Hiển thị dialog nhỏ để chọn playlist (hoặc auto add vào 1 cái duy nhất nếu chỉ có 1)
    addSongToCustomPlaylist(window.customPlaylists[0].id, { type: 'internal', songId });
  } else {
    // Render list ra dialog CHỌN PLAYLIST
    const container = document.getElementById('selectPlaylistList');
    if (container) {
      container.innerHTML = window.customPlaylists.map(pl => `
        <button onclick="addSongToCustomPlaylist('${pl.id}', { type: 'internal', songId: ${songId} }); selectPlaylistDialog.close();" 
          style="
            background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); 
            padding: 12px; border-radius: 8px; color: white; cursor: pointer; display: flex; align-items: center; justify-content: space-between;
          "
          onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='rgba(255,255,255,0.05)'"
        >
          <span style="font-weight: 600;">${escapeHtml(pl.name)}</span>
          <span style="font-size: 12px; opacity: 0.5;">${pl.songs.length} bài</span>
        </button>
      `).join('');
      document.getElementById('selectPlaylistDialog').showModal();
    }
  }
};

window.promptAddExternalSong = async function() {
  if (!window.currentUser) {
    showToast('⚠️ Vui lòng đăng nhập!');
    return;
  }
  
  const playlistId = window.currentViewingPlaylistId;
  const input = prompt("Nhập link YouTube / Spotify HOẶC Tên bài hát:");
  if (!input || !input.trim()) return;
  const val = input.trim();
  
  showToast('⏳ Đang phân tích thông tin...');
  
  if (val.includes('youtube.com') || val.includes('youtu.be')) {
    // 1. Link YouTube: dùng noembed lấy tên
    let title = 'Bài hát YouTube';
    let artist = 'YouTube';
    try {
      const res = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(val)}`);
      const data = await res.json();
      if (data && data.title) {
        title = data.title;
        artist = data.author_name || 'YouTube';
      }
    } catch(e) {
      console.error('Không lấy được tên YT:', e);
    }
    
    addSongToCustomPlaylist(playlistId, {
      type: 'external',
      url: val,
      title: title,
      artist: artist
    });
    
  } else if (val.includes('spotify.com/track')) {
    // 2. Link Spotify: lấy tên (thử qua oEmbed), sau đó khi phát sẽ chơi qua Youtube
    let title = 'Bài hát Spotify';
    let artist = 'Spotify';
    try {
      const res = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(val)}`);
      const data = await res.json();
      if (data && data.title) {
        // format usually "TrackName" maybe artist is not separated
        let fullTitle = data.title;
        // Spotify returned title is usually just the track name, so we use it as is.
        title = fullTitle;
      }
    } catch(e) {
      console.error('Không lấy được tên Spotify:', e);
    }
    
    addSongToCustomPlaylist(playlistId, {
      type: 'external',
      url: val, // Dùng url spotify, logic play sẽ tự động query tên qua YT
      title: title,
      artist: artist
    });
    
  } else {
    // 3. Tên tùy chọn - Gọi YT API trực tiếp để lấy bài chuẩn xác
    try {
      const gKey = 'AIzaSy' + 'AS6c7bto_vvZ60g_Fsd' + 'A60od3Fgw0y67g'; // Split to avoid bots but reuse main.js key
      const searchRes = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(val)}&key=${gKey}`);
      const searchData = await searchRes.json();
      
      if (searchData.error) {
        if (searchData.error.errors?.some(e => e.reason === 'quotaExceeded')) {
          showToast('❌ Hạn mức tìm kiếm đã hết. Thử lại sau hoặc dùng link trực tiếp!');
          // Fallback: Thêm dạng title thuần nếu user vẫn muốn
          if (confirm('Hạn mức API đã hết. Bạn có muốn thêm bài này như một bài hát "Chờ xử lý" không? (Bạn sẽ phải tự tìm link sau)')) {
            addSongToCustomPlaylist(playlistId, {
              type: 'external',
              url: '', 
              title: val,
              artist: 'Chờ tìm link'
            });
          }
        } else {
          showToast('❌ Lỗi tra cứu YouTube: ' + (searchData.error.message || 'Unknown'));
        }
        return;
      }

      if (searchData.items && searchData.items.length > 0) {
        const video = searchData.items[0];
        const ytTitle = video.snippet.title;
        const ytId = video.id.videoId;
        
        // Hỏi lại người dùng để confirm
        if (confirm(`Tìm thấy video: "${ytTitle}"\nBạn có muốn thêm video này vào Playlist không?`)) {
           addSongToCustomPlaylist(playlistId, {
             type: 'external',
             url: `https://www.youtube.com/watch?v=${ytId}`, 
             title: ytTitle,
             artist: 'Tìm kiếm ngoài'
           });
        }
      } else {
        showToast('❌ Không tìm thấy video nào trên YouTube cho từ khoá này!');
      }
    } catch(e) {
      console.error('Lỗi search YT:', e);
      showToast('❌ Lỗi tra cứu YouTube!');
    }
  }
};

function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
}

/* ===== PLAYBACK ENGINE ===== */

window.playCustomPlaylist = function(optionalId, startIndex = 0) {
  const playlistId = optionalId || window.currentViewingPlaylistId;
  const pl = window.customPlaylists.find(p => p.id === playlistId);
  if (!pl || pl.songs.length === 0) {
    showToast('❌ Playlist trống!');
    return;
  }
  
  // Dừng Favourite Playlist nếu đang chạy
  if (window.favouritePlaylistState) window.favouritePlaylistState.active = false;
  
  window.currentCustomPlaylistState = {
    active: true,
    playlistId: playlistId,
    currentIndex: startIndex,
    songs: pl.songs
  };
  
  if (document.getElementById('customPlaylistsDialog').open) customPlaylistsDialog.close();
  if (document.getElementById('customPlaylistDetailsDialog').open) customPlaylistDetailsDialog.close();
  
  showToast(`▶️ Đang phát playlist: ${pl.name}`);
  playCustomPlaylistAt(startIndex);
};

window.playCustomPlaylistAt = async function(index) {
  const state = window.currentCustomPlaylistState;
  if (!state.active || !state.songs || !state.songs[index]) return;
  state.currentIndex = index;
  
  const track = state.songs[index];
  
  if (track.type === 'internal') {
    const dbSong = (window._songs || []).find(s => s.Id === track.songId);
    if (dbSong) {
      if (window.searchYoutubeVideo) {
         await searchYoutubeVideo(dbSong['Tên'], dbSong['Ca sĩ'] || '', { playlistMode: true });
      }
    } else {
      showToast('❌ Bài hát gốc không tồn tại nữa');
      playNextCustomPlaylistSong();
    }
  } else if (track.type === 'external') {
    if (track.url) {
      if (track.url.includes('youtube') || track.url.includes('youtu.be')) {
        let title = track.title;
        let videoIdMatch = track.url.match(/(?:v=|youtu\.be\/)([^&?]+)/);
        if (videoIdMatch && videoIdMatch[1]) {
           const videoId = videoIdMatch[1];
           if (window.loadYoutubeVideo) {
             // Main functions use isYoutubePlaylistMode() internally now
             await window.loadYoutubeVideo(videoId, title, track.artist);
             
             // Open dialog if not open
             const diag = document.getElementById('youtubePlaylistDialog');
             if (diag && !diag.open) diag.showModal();
           }
        } else {
           if (window.searchYoutubeVideo) {
             await searchYoutubeVideo(title, track.artist || '', { playlistMode: true });
           }
        }
      } else if (track.url.includes('spotify.com')) {
         if (window.searchYoutubeVideo) {
           await searchYoutubeVideo(track.title, track.artist || '', { playlistMode: true });
         }
      } else {
         showToast('⚠️ Nguồn nhạc không xác định, tự động qua bài');
         setTimeout(() => playNextCustomPlaylistSong(), 2000);
      }
    } else {
      if (window.searchYoutubeVideo) {
        await searchYoutubeVideo(track.title, track.artist || '', { playlistMode: true });
      }
    }
  }
};

window.playNextCustomPlaylistSong = function() {
  const state = window.currentCustomPlaylistState;
  if (!state.active) return;
  
  const nextIdx = state.currentIndex + 1;
  if (nextIdx < state.songs.length) {
    showToast(`⏭ Đang load bài tiếp theo (${nextIdx + 1}/${state.songs.length})`);
    playCustomPlaylistAt(nextIdx);
  } else {
    showToast('✅ Đã phát hết Playlist tuỳ chọn');
    window.currentCustomPlaylistState.active = false;
  }
};

// Khởi tạo ngay lúc load file
loadCustomPlaylists();
