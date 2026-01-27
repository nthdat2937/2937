function timCasi() {
  let t = document.getElementById("songName").value;
  t.trim() ? window.open(`https://www.google.com/search?q=ca+sĩ+thể+hiện+bài+${encodeURIComponent(t)}`, '_blank') : alert('Vui lòng nhập tên bài hát trước')
}

function timSangtac() {
  let t = document.getElementById("songName").value;
  t.trim() ? window.open(`https://www.google.com/search?q=ai+đã+sáng+tác bài+${encodeURIComponent(t)}`, '_blank') : alert('Vui lòng nhập tên bài hát trước')
}

function timNgayphathanh() {
  let t = document.getElementById("songName").value;
  t.trim() ? window.open(`https://www.google.com/search?q=${encodeURIComponent(t)}&udm=7`, '_blank') : alert('Vui lòng nhập tên bài hát trước')
}

function timLoibaihat() {
  let t = document.getElementById("songName").value;
  t.trim() ? window.open(`https://www.google.com/search?q=${encodeURIComponent(t)}+lyric`, '_blank') : alert('Vui lòng nhập tên bài hát trước')
}

function timAvatar1() {
  let t = document.getElementById("songName").value;
  t.trim() ? window.open(`https://www.google.com/search?q=${encodeURIComponent(t)}&udm=2`, '_blank') : alert('Vui lòng nhập tên bài hát trước')
}

function timAvatar() {
  let t = document.getElementById("editSongName").value;
  t.trim() ? window.open(`https://www.google.com/search?q=${encodeURIComponent(t)}&udm=2`, '_blank') : alert('Vui lòng nhập tên bài hát trước')
}

function timLinkbaihat() {
  let t = document.getElementById("songName").value;
  t.trim() ? window.open(`https://www.google.com/search?q=${encodeURIComponent(t)}+official+site:youtube.com+&btnI=1`, '_blank') : alert('Vui lòng nhập tên bài hát trước')
}

function timTag() {
  let t = document.getElementById("songName").value;
  t.trim() ? window.open(`https://www.google.com/search?q=thể+loại+của+bài+${encodeURIComponent(t)}`) : alert('Vui lòng nhập tên bài hát trước')
}

function timTag2() {
  let t = `${document.getElementById("editSongName").value} của ${document.getElementById("editArtist").value}`;
  t.trim() ? window.open(`https://www.google.com/search?q=trả+lời+ngắn+gọn+bài+${encodeURIComponent(t)}+thuộc+những+thể+loại+nào+trong+số: ${window.availableTags}&udm=50`) : alert('Vui lòng nhập tên bài hát trước')
}

function spotifyThismusic() {
  window.open(`https://www.duckduckgo.com/search?q=!spy+${encodeURIComponent(document.getElementById("dTitle").textContent)}+${encodeURIComponent(document.getElementById("dArtist").textContent)}`)
}

function zingmp3Thismusic() {
  window.open(`https://www.google.com/search?q=${encodeURIComponent(document.getElementById("dTitle").textContent)}+site:zingmp3.vn+&btnI=1`)
}

function nctThismusic() {
  window.open(`https://www.google.com/search?q=${encodeURIComponent(document.getElementById("dTitle").textContent)}+site:nhaccuatui.com+&btnI=1`)
}

function youtubeThismusic() {
  window.open(`https://www.google.com/search?q=${encodeURIComponent(document.getElementById("dTitle").textContent)}+official+site:youtube.com+&btnI=1`)
}

function facebookThismusic() {
  window.open(`https://www.facebook.com/search?q=${encodeURIComponent(document.getElementById("dTitle").textContent)}+${encodeURIComponent(document.getElementById("dArtist").textContent)}`)
}

function tiktokThismusic() {
  window.open(`https://www.tiktok.com/search?q=${encodeURIComponent(document.getElementById("dTitle").textContent)}`)
}

function hoiAI() {
  const cauHoi = prompt("Nhập câu cần hỏi:")
  console.log(cauHoi)

  if (cauHoi !== null && cauHoi !== "") {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(cauHoi)}+&udm=50`);
  } else {
    alert("Không có câu hỏi! Huỷ thao tác!")
  }
}

const searchInput = document.getElementById("searchInput");

document.addEventListener("keydown", function(e) {
  if (e.key === "Tab") return;
  if (e.key === "Enter") return;
  const openDialogs = document.querySelectorAll('dialog[open]');
  const hasOpenDialog = openDialogs.length > 0;

  if (e.key === "Escape") {
    searchInput.blur();
    return;
  }

  if (
    e.target.tagName === "INPUT" ||
    e.target.tagName === "TEXTAREA" ||
    e.target.isContentEditable
  ) {
    return;
  };

  if (hasOpenDialog) {
    if (e.key === "Escape") {
      return;
    }
    e.preventDefault();
    return;
  }

  if (e.shiftKey && e.key === "R") {
    e.preventDefault();
    document.getElementById("btn-reload-sc").click();
  };
  if (e.shiftKey && e.key === "A") {
    e.preventDefault();
    document.getElementById("btn-add-sc").click();
  };
  if (e.shiftKey && e.key === "C") {
    e.preventDefault();
    document.getElementById("btn-hoiAI-sc").click();
  };
  if (e.shiftKey && e.key === "I") {
    e.preventDefault();
    document.getElementById("btn-info-sc").click();
  };
  if (e.shiftKey && e.key === "T") {
    e.preventDefault();
    document.getElementById("btn-theme-sc").click();
  };
  if (e.shiftKey && e.key === "H") {
    e.preventDefault();
    document.getElementById("btn-home-sc").click();
  };
  if (e.shiftKey && e.key === "B") {
    e.preventDefault();
    document.getElementById("btn-rank-sc").click();
  };
  if (e.shiftKey && e.key === "M") {
    e.preventDefault();
    document.getElementById("btn-menu").click();
  };
  if (e.shiftKey && e.key === "S") {
    e.preventDefault();
    document.getElementById("btn-streak-sc").click();
  };
  if (e.shiftKey && e.key === "G") {
    e.preventDefault();
    document.getElementById("btn-guide-sc").click();
  };
  if (e.shiftKey && e.key === "U") {
    e.preventDefault();
    document.getElementById("btn-updates-sc").click();
  };
  if (e.shiftKey && e.key === "Y") {
    e.preventDefault();
    document.getElementById("btn-youtube-sc").click();
  };
  if (e.shiftKey && e.key === "L") {
    e.preventDefault();
    const ttdn = document.getElementById("userDisplayName").textContent

    if (ttdn === "") {
    document.getElementById("btn-login").click();
    } else if (ttdn !== "") {
      document.getElementById("btn-logout").click();
    }
  };
  if (e.shiftKey && e.key === "O") {
    e.preventDefault();
    document.getElementById("btn-history-sc").click();
  };
  if (e.shiftKey && e.key === "D") {
    e.preventDefault();
    document.getElementById("btn-album-sc").click();
  }
  if (e.key === " ") {
    e.preventDefault();
    document.getElementById("btn-menu").click();
  };
  if (e.key === "/") {
    e.preventDefault();
    document.getElementById("searchInput").focus();
  };
  if ("qwertyuiopasdfghjklzxcvbnm".includes(e.key)) {
    e.preventDefault();
    document.getElementById("searchInput").focus();
  };

  if (!e.ctrlKey) return;
  const allowKeys = ["c", "v", "x"];
  if (allowKeys.includes(e.key.toLowerCase())) {
    return;
  }
  e.preventDefault();
});

function roleCheck() {
  const role = document.getElementById("role").textContent

  if (role === "Admin") {
    alert("Bạn là Admin!")
  } else if (role === "Member" || role === "Moderator") {
    alert(`Bạn là ${role}!\nLiên hệ Admin qua email để được thăng chức!`)
    const ok = confirm("Liên hệ qua email: nthdat.2937@gmail.com\nNhấn Enter / OK để truy cập Gmail")

    if (ok === true) {
      window.open("https://mail.google.com/mail/?view=cm&fs=1&to=nthdat.2937@gmail.com")
    }
  } else if (role === "Ủa" || role === "Phép thuật winx enchantix biến hình" || role === "WTF") {
    alert("Chịu")
  } else {
    alert(`Còn cái nịt!`)
  }
}


function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const body = document.body;
  
  sidebar.classList.toggle('active');
  overlay.classList.toggle('active');
  body.classList.toggle('sidebar-open');
}

// Đóng sidebar khi nhấn ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const sidebar = document.getElementById('sidebar');
    if (sidebar.classList.contains('active')) {
      toggleSidebar();
    }
  }
});

// ==================== THÊM VÀO CUỐI FILE main.js ====================

// Hàm mở dialog xem video YouTube
async function openYoutubeVideoDialog() {
  const songName = document.getElementById("dTitle").textContent;
  const artist = document.getElementById("dArtist").textContent.replace('ㅤ', '').trim();
  
  const searchQuery = `${songName} ${artist} official`;
  
  // Hiển thị loading
  document.getElementById('youtubeVideoIframe').innerHTML = `
    <div style="text-align: center; padding: 100px 20px; color: var(--text-muted);">
      <i class="fa-solid fa-spinner fa-spin" style="font-size: 48px; margin-bottom: 20px;"></i>
      <p>Đang tải video! Vui lòng chờ...</p>
    </div>
  `;
  document.getElementById('youtubeVideoSongName').textContent = `${songName} - ${artist}`;
  youtubeVideoDialog.showModal();
  
  try {
    // Tìm video đầu tiên từ YouTube API
    const searchRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(searchQuery)}&key=AIzaSyAS6c7bto_vvZ60g_FsdA60od3Fgw0y67g`
    );
    const searchData = await searchRes.json();
    
    if (!searchData.items?.length) {
      document.getElementById('youtubeVideoIframe').innerHTML = `
        <div style="text-align: center; padding: 100px 20px; color: var(--text-muted);">
          <i class="fa-solid fa-circle-exclamation" style="font-size: 48px; margin-bottom: 20px; color: #ef4444;"></i>
          <p>Không tìm thấy video phù hợp</p>
        </div>
      `;
      return;
    }
    
    const videoId = searchData.items[0].id.videoId;
    
    // Tạo iframe với video tìm được
    const iframeHtml = `
      <iframe 
        width="100%" 
        height="650" 
        src="https://www.youtube.com/embed/${videoId}?autoplay=1&vq=large" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen
        style="border-radius: 16px;"
      ></iframe>
    `;
    
    document.getElementById('youtubeVideoIframe').innerHTML = iframeHtml;
    
  } catch (error) {
    console.error('Lỗi khi tìm video:', error);
    document.getElementById('youtubeVideoIframe').innerHTML = `
      <div style="text-align: center; padding: 100px 20px; color: var(--text-muted);">
        <i class="fa-solid fa-triangle-exclamation" style="font-size: 48px; margin-bottom: 20px; color: #f59e0b;"></i>
        <p>Có lỗi xảy ra khi tìm video</p>
      </div>
    `;
  }
}

// Event listener đóng dialog khi click overlay
youtubeVideoDialog.addEventListener('click', (e) => {
  if (e.target === youtubeVideoDialog) {
    youtubeVideoDialog.close();
    // KHÔNG xóa iframe để video tiếp tục phát
  }
});

// Hiển thị mini player khi đóng YouTube dialog
youtubeVideoDialog.addEventListener('close', () => {
  const iframe = document.getElementById('youtubeVideoIframe');
  if (iframe.innerHTML.trim() !== '') {
    showYoutubeMiniPlayer();
  }
});

function showYoutubeMiniPlayer() {
  let miniPlayer = document.getElementById('youtubeMiniPlayer');
  if (!miniPlayer) {
    miniPlayer = document.createElement('div');
    miniPlayer.id = 'youtubeMiniPlayer';
    miniPlayer.style = 'cursor: pointer;';
    miniPlayer.innerHTML = `
      <div onclick="reopenYoutubeDialog()" style="display: flex; align-items: center; gap: 12px; flex: 1; padding: 15px;">
        <i class="fa-brands fa-youtube" style="font-size: 20px; color: white;"></i>
        <span id="miniPlayerYoutubeName" style="font-weight: 600; font-size: 14px;">Đang phát video...</span>
      </div>
      <button onclick="reopenYoutubeDialog()" style="
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid var(--glass-border);
        padding: 8px 12px;
        border-radius: 13px;
        color: white;
        cursor: pointer;
        font-size: 13px;
        transition: all 0.3s;
      " onmouseover="this.style.background='rgba(255, 255, 255, 0.2)'" 
         onmouseout="this.style.background='rgba(255, 255, 255, 0.1)'">
        <i class="fa-solid fa-expand"></i>
      </button>
      <button onclick="stopYoutube()" style="
        background: linear-gradient(135deg, #ef4444, #dc2626);
        border: none;
        padding: 8px 12px;
        border-radius: 13px;
        color: white;
        cursor: pointer;
        font-size: 13px;
        transition: all 0.3s;
      " onmouseover="this.style.transform='scale(1.05)'" 
         onmouseout="this.style.transform='scale(1)'">
        <i class="fa-solid fa-stop"></i>
      </button>
    `;
    document.body.appendChild(miniPlayer);
  }
  
  const songName = document.getElementById('youtubeVideoSongName').textContent;
  document.getElementById('miniPlayerYoutubeName').textContent = songName;
  
  miniPlayer.classList.add('show');
}

function reopenYoutubeDialog() {
  youtubeVideoDialog.showModal();
  const miniPlayer = document.getElementById('youtubeMiniPlayer');
  if (miniPlayer) miniPlayer.classList.remove('show');
}

function stopYoutube() {
  document.getElementById('youtubeVideoIframe').innerHTML = '';
  const miniPlayer = document.getElementById('youtubeMiniPlayer');
  if (miniPlayer) miniPlayer.remove();
}

// Tìm kiếm video YouTube theo từ khóa
function openYoutubeSearchDialog() {
  const songName = prompt("Nhập tên bài hát:");
  
  if (!songName || songName.trim() === "") {
    alert("Vui lòng nhập tên bài hát!");
    return;
  }
  
  const artist = prompt("Nhập tên ca sĩ (nếu biết, bỏ trống nếu không biết):");
  
  searchYoutubeVideo(songName.trim(), artist ? artist.trim() : "");
}

async function searchYoutubeVideo(songName, artist) {
  const searchQuery = artist 
    ? `${songName} ${artist} official` 
    : `${songName} official`;
  
  // Hiển thị loading
  document.getElementById('youtubeVideoIframe').innerHTML = `
    <div style="text-align: center; padding: 100px 20px; color: var(--text-muted);">
      <i class="fa-solid fa-spinner fa-spin" style="font-size: 48px; margin-bottom: 20px;"></i>
      <p>Đang tải video! Vui lòng chờ...</p>
    </div>
  `;
  document.getElementById('youtubeVideoSongName').textContent = artist 
    ? `${songName} - ${artist}` 
    : songName;
  youtubeVideoDialog.showModal();
  
  try {
    const searchRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(searchQuery)}&key=AIzaSyAS6c7bto_vvZ60g_FsdA60od3Fgw0y67g`
    );
    const searchData = await searchRes.json();
    
    if (!searchData.items?.length) {
      document.getElementById('youtubeVideoIframe').innerHTML = `
        <div style="text-align: center; padding: 100px 20px; color: var(--text-muted);">
          <i class="fa-solid fa-circle-exclamation" style="font-size: 48px; margin-bottom: 20px; color: #ef4444;"></i>
          <p>Không tìm thấy video phù hợp</p>
        </div>
      `;
      return;
    }
    
    const videoId = searchData.items[0].id.videoId;
    
    const iframeHtml = `
      <iframe 
        width="100%" 
        height="650" 
        src="https://www.youtube.com/embed/${videoId}?autoplay=1&vq=large" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen
        style="border-radius: 16px;"
      ></iframe>
    `;
    
    document.getElementById('youtubeVideoIframe').innerHTML = iframeHtml;
    
  } catch (error) {
    console.error('Lỗi khi tìm video:', error);
    document.getElementById('youtubeVideoIframe').innerHTML = `
      <div style="text-align: center; padding: 100px 20px; color: var(--text-muted);">
        <i class="fa-solid fa-triangle-exclamation" style="font-size: 48px; margin-bottom: 20px; color: #f59e0b;"></i>
        <p>Có lỗi xảy ra khi tìm video</p>
      </div>
    `;
  }
}

// Tag Selector Handler
function initTagSelector(selectorId, inputId) {
  const selector = document.getElementById(selectorId);
  const input = document.getElementById(inputId);
  
  if (!selector || !input) return;
  
  selector.addEventListener('click', (e) => {
    if (e.target.classList.contains('tag-option')) {
      e.target.classList.toggle('selected');
      
      // Update hidden input
      const selectedTags = Array.from(selector.querySelectorAll('.tag-option.selected'))
        .map(el => el.dataset.tag);
      input.value = JSON.stringify(selectedTags);
    }
  });
}

// Initialize tag selectors
window.addEventListener('DOMContentLoaded', () => {
  initTagSelector('tagSelector', 'selectedTags');
  initTagSelector('editTagSelector', 'editSelectedTags');
});

// Function to set selected tags (for edit mode)
function setSelectedTags(selectorId, tags) {
  const selector = document.getElementById(selectorId);
  if (!selector || !tags) return;
  
  // Clear all selections
  selector.querySelectorAll('.tag-option').forEach(el => {
    el.classList.remove('selected');
  });
  
  // Parse tags if string
  const tagArray = typeof tags === 'string' ? JSON.parse(tags) : tags;
  
  // Select matching tags
  tagArray.forEach(tag => {
    const option = selector.querySelector(`[data-tag="${tag}"]`);
    if (option) option.classList.add('selected');
  });
}

// Thêm các hàm tìm album
function timAlbum() {
  let songName = document.getElementById("songName").value;
  let artist = document.getElementById("artist").value;
  if (songName.trim() || artist.trim()) {
    window.open(`https://www.google.com/search?q=album+của+bài+${encodeURIComponent(songName)}+${encodeURIComponent(artist)}`, '_blank');
  } else {
    alert('Vui lòng nhập tên bài hát hoặc ca sĩ trước');
  }
}

function timAlbum2() {
  let songName = document.getElementById("editSongName").value;
  let artist = document.getElementById("editArtist").value;
  if (songName.trim() || artist.trim()) {
    window.open(`https://www.google.com/search?q=album+của+bài+${encodeURIComponent(songName)}+${encodeURIComponent(artist)}`, '_blank');
  } else {
    alert('Vui lòng nhập tên bài hát hoặc ca sĩ trước');
  }
}

// Toggle hiển thị input album
document.getElementById('hasAlbum').addEventListener('change', function() {
  document.getElementById('albumGroup').style.display = this.checked ? 'block' : 'none';
  if (!this.checked) {
    document.getElementById('album').value = '';
    document.getElementById('error-album').textContent = '';
  }
});

document.getElementById('editHasAlbum').addEventListener('change', function() {
  document.getElementById('editAlbumGroup').style.display = this.checked ? 'block' : 'none';
  if (!this.checked) {
    document.getElementById('editAlbum').value = '';
    document.getElementById('error-editAlbum').textContent = '';
  }
});