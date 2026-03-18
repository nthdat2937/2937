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

document.addEventListener("keydown", function (e) {
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

  if (e.shiftKey && e.key === "R") { // Reload
    e.preventDefault();
    document.getElementById("btn-reload-sc").click();
  };
  if (e.shiftKey && e.key === "A") { // Them bai
    e.preventDefault();
    document.getElementById("btn-add-sc").click();
  };
  if (e.shiftKey && e.key === "Q") { // Chat Gemini
    e.preventDefault();
    document.getElementById("btn-hoiAI-sc").click();
  };
  if (e.shiftKey && e.key === "I") { // Thong tin
    e.preventDefault();
    document.getElementById("btn-info-sc").click();
  };
  if (e.shiftKey && e.key === "T") { // Dark/Light
    e.preventDefault();
    document.getElementById("btn-theme-sc").click();
  };
  if (e.shiftKey && e.key === "H") { // Home
    e.preventDefault();
    document.getElementById("btn-home-sc").click();
  };
  if (e.shiftKey && e.key === "B") { // Bang xep hang
    e.preventDefault();
    document.getElementById("btn-rank-sc").click();
  };
  if (e.shiftKey && e.key === "S") { // Streak
    e.preventDefault();
    document.getElementById("btn-streak-sc").click();
  };
  if (e.shiftKey && e.key === "G") { // Huong dan
    e.preventDefault();
    document.getElementById("btn-guide-sc").click();
  };
  if (e.shiftKey && e.key === "U") { // Thong bao
    e.preventDefault();
    document.getElementById("btn-updates-sc").click();
  };
  if (e.shiftKey && e.key === "Y") { // Youtube
    e.preventDefault();
    document.getElementById("btn-youtube-sc").click();
  };
  if (e.shiftKey && e.key === "L") { // Login/Logout
    e.preventDefault();
    const ttdn = document.getElementById("userDisplayName").textContent

    if (ttdn === "") {
      document.getElementById("btn-login").click();
    } else if (ttdn !== "") {
      document.getElementById("btn-logout").click();
    }
  };
  if (e.shiftKey && e.key === "O") { // Lich su
    e.preventDefault();
    document.getElementById("btn-history-sc").click();
  };
  if (e.shiftKey && e.key === "D") { // Album
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
  body.classList.toggle('sidebar-open');

  // Chỉ toggle overlay trên mobile
  if (overlay && window.innerWidth <= 768) {
    overlay.classList.toggle('active');
  }
}

// Đóng sidebar khi nhấn ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const body = document.body;

    if (sidebar.classList.contains('active')) {
      sidebar.classList.remove('active');
      body.classList.remove('sidebar-open');
      if (overlay) overlay.classList.remove('active');
    }
  }
});

// ===== YOUTUBE OTHER VIDEOS FEATURE =====
// Biến global để lưu danh sách other videos và video hiện tại
let otherVideosData = [];
let allAvailableVideos = [];
let currentVideoIndex = 0;
let currentYoutubeSearchContext = {
  songName: '',
  artist: '',
  searchQuery: ''
};
let youtubePlayer = null;
let youtubeIframeApiPromise = null;
let youtubeIframeApiResolver = null;
let suppressYoutubeMiniPlayer = false;
let currentYoutubeDisplayTitle = '';
let favouritePlaylistState = {
  active: false,
  songs: [],
  currentIndex: -1
};

function ytText(key, variables = {}, fallback = key) {
  if (window.getTranslatedText) {
    return window.getTranslatedText(key, variables);
  }

  return fallback;
}

function isYoutubePlaylistMode() {
  return favouritePlaylistState.active;
}

function getYoutubeDialogByMode(playlistMode = isYoutubePlaylistMode()) {
  return document.getElementById(playlistMode ? 'youtubePlaylistDialog' : 'youtubeVideoDialog');
}

function getCurrentYoutubeDialog() {
  return getYoutubeDialogByMode();
}

function getYoutubeDialogBody(playlistMode = isYoutubePlaylistMode()) {
  return getYoutubeDialogByMode(playlistMode)?.querySelector('.youtube-dialog-body');
}

function getYoutubePlayerContainer(playlistMode = isYoutubePlaylistMode()) {
  return document.getElementById(playlistMode ? 'youtubePlaylistIframe' : 'youtubeVideoIframe');
}

function getYoutubeSongNameElement(playlistMode = isYoutubePlaylistMode()) {
  return document.getElementById(playlistMode ? 'youtubePlaylistSongName' : 'youtubeVideoSongName');
}

function setYoutubeDisplayTitle(songName, artist, playlistMode = isYoutubePlaylistMode()) {
  currentYoutubeDisplayTitle = artist
    ? `${songName} - ${artist}`
    : songName;

  const songNameElement = getYoutubeSongNameElement(playlistMode);
  if (songNameElement) {
    songNameElement.textContent = currentYoutubeDisplayTitle;
  }
}

function openYoutubeDialogForMode(playlistMode) {
  const targetDialog = getYoutubeDialogByMode(playlistMode);
  const otherDialog = getYoutubeDialogByMode(!playlistMode);

  if (otherDialog?.open) {
    suppressYoutubeMiniPlayer = true;
    otherDialog.close();
    suppressYoutubeMiniPlayer = false;
  }

  if (targetDialog && !targetDialog.open) {
    targetDialog.showModal();
  }
}

function resetYoutubeOtherVideosState() {
  otherVideosData = [];
  allAvailableVideos = [];
  currentVideoIndex = 0;
  document.getElementById('otherVideosContainer').style.display = 'none';
  document.getElementById('btnShowOtherVideos').innerHTML = '<i class="fa-solid fa-list"></i> Hiển thị các video khác';
}

function renderYoutubeVersionButtons(songName, artist) {
  const remixQuery = `${songName.trim()}${artist ? ` - ${artist}` : ''} - remix`;
  const lofiQuery = `${songName.trim()}${artist ? ` - ${artist}` : ''} - lofi`;

  document.getElementById('ytVersionRemix').innerHTML = `<button onclick='searchYoutubeVideo(${JSON.stringify(remixQuery)}, "")' style="
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
"
onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(102, 126, 234, 0.6)';"
onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(102, 126, 234, 0.4)';"
onmousedown="this.style.transform='scale(0.95)';"
onmouseup="this.style.transform='translateY(-2px)';">
  Remix
</button>`;

  document.getElementById('ytVersionLofi').innerHTML = `<button onclick='searchYoutubeVideo(${JSON.stringify(lofiQuery)}, "")' style="
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
"
onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(102, 126, 234, 0.6)';"
onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(102, 126, 234, 0.4)';"
onmousedown="this.style.transform='scale(0.95)';"
onmouseup="this.style.transform='translateY(-2px)';">
  Lofi
</button>`;
}

function updateYoutubePlaylistStatus() {
  const statusEl = document.getElementById('youtubePlaylistStatus');
  if (!statusEl) return;

  if (!favouritePlaylistState.active || !favouritePlaylistState.songs.length || favouritePlaylistState.currentIndex < 0) {
    statusEl.style.display = 'none';
    statusEl.textContent = '';
    return;
  }

  statusEl.style.display = 'block';
  statusEl.textContent = ytText(
    'favouritePlaylistStatus',
    {
      current: favouritePlaylistState.currentIndex + 1,
      total: favouritePlaylistState.songs.length
    },
    `Playlist yêu thích ${favouritePlaylistState.currentIndex + 1}/${favouritePlaylistState.songs.length}`
  );
}

function updateYoutubeMiniPlayerLabel() {
  const miniPlayerLabel = document.getElementById('miniPlayerYoutubeName');
  if (!miniPlayerLabel) return;

  const songName = currentYoutubeDisplayTitle || 'Đang phát video...';
  if (favouritePlaylistState.active && favouritePlaylistState.songs.length) {
    miniPlayerLabel.textContent = `${songName} • ${favouritePlaylistState.currentIndex + 1}/${favouritePlaylistState.songs.length}`;
    return;
  }

  miniPlayerLabel.textContent = songName;
}

function renderFavouritePlaylistSongs() {
  const listEl = document.getElementById('youtubePlaylistSongs');
  if (!listEl) return;

  if (!favouritePlaylistState.songs.length) {
    listEl.innerHTML = `<div class="youtube-playlist-empty">${ytText('favouritePlaylistEmpty', {}, 'Chưa có bài yêu thích để phát.')}</div>`;
    return;
  }

  listEl.innerHTML = favouritePlaylistState.songs.map((song, index) => {
    const isActive = index === favouritePlaylistState.currentIndex;
    const cover = song.avatar
      ? `<img src="${song.avatar}" alt="${song['Tên']}" class="youtube-playlist-cover">`
      : `<span class="youtube-playlist-cover youtube-playlist-cover-fallback"><i class="fa-solid fa-music"></i></span>`;

    return `
      <button
        type="button"
        class="youtube-playlist-item${isActive ? ' active' : ''}"
        onclick="playFavouritePlaylistSongAtIndex(${index})"
      >
        <span class="youtube-playlist-index">${index + 1}</span>
        ${cover}
        <span class="youtube-playlist-info">
          <span class="youtube-playlist-song">${song['Tên']}</span>
          <span class="youtube-playlist-artist">${song['Ca sĩ'] || ''}</span>
        </span>
        <span class="youtube-playlist-current"><i class="fa-solid fa-volume-high"></i></span>
      </button>
    `;
  }).join('');
}

function resetFavouritePlaylistState() {
  favouritePlaylistState.active = false;
  favouritePlaylistState.songs = [];
  favouritePlaylistState.currentIndex = -1;
  const playlistSongName = document.getElementById('youtubePlaylistSongName');
  if (playlistSongName) {
    playlistSongName.textContent = '---';
  }
  updateYoutubePlaylistStatus();
  renderFavouritePlaylistSongs();
  updateYoutubeMiniPlayerLabel();
}

function clearYoutubePlayer(clearContainer = true) {
  if (youtubePlayer && typeof youtubePlayer.destroy === 'function') {
    youtubePlayer.destroy();
  }

  youtubePlayer = null;

  if (!clearContainer) return;

  ['youtubeVideoIframe', 'youtubePlaylistIframe'].forEach(id => {
    const container = document.getElementById(id);
    if (container) {
      container.innerHTML = '';
    }
  });
}

function ensureYoutubeIframeApi() {
  if (window.YT?.Player) {
    return Promise.resolve(window.YT);
  }

  if (youtubeIframeApiPromise) {
    return youtubeIframeApiPromise;
  }

  youtubeIframeApiPromise = new Promise((resolve, reject) => {
    youtubeIframeApiResolver = resolve;

    window.onYouTubeIframeAPIReady = () => {
      youtubeIframeApiResolver?.(window.YT);
      youtubeIframeApiResolver = null;
    };

    const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      script.onerror = () => reject(new Error('Failed to load YouTube IFrame API'));
      document.head.appendChild(script);
    }
  });

  return youtubeIframeApiPromise;
}

async function finishFavouritePlaylist() {
  const completedMessage = ytText(
    'favouritePlaylistCompleted',
    {},
    'Đã phát hết danh sách yêu thích.'
  );

  if (typeof window.showToast === 'function') {
    window.showToast(completedMessage);
  }

  stopYoutube();
}

async function playNextFavouritePlaylistSong() {
  const nextIndex = favouritePlaylistState.currentIndex + 1;
  if (nextIndex >= favouritePlaylistState.songs.length) {
    await finishFavouritePlaylist();
    return;
  }

  await window.startFavouritePlaylist(favouritePlaylistState.songs, nextIndex);
}

window.startFavouritePlaylist = async function(songs, startIndex = 0) {
  if (!Array.isArray(songs) || !songs.length) {
    alert(ytText('favouritePlaylistEmpty', {}, 'Chưa có bài yêu thích để phát.'));
    return;
  }

  const normalizedSongs = songs.filter(song => song && song.Id);
  if (!normalizedSongs.length) {
    alert(ytText('favouritePlaylistEmpty', {}, 'Chưa có bài yêu thích để phát.'));
    return;
  }

  const safeIndex = Math.min(Math.max(startIndex, 0), normalizedSongs.length - 1);
  favouritePlaylistState.active = true;
  favouritePlaylistState.songs = normalizedSongs;
  favouritePlaylistState.currentIndex = safeIndex;
  renderFavouritePlaylistSongs();
  updateYoutubePlaylistStatus();

  const song = normalizedSongs[safeIndex];
  const songName = song['Tên'];
  const artist = (song['Ca sĩ'] || '').trim();

  await searchYoutubeVideo(songName, artist, { playlistMode: true });
};

window.playFavouritePlaylistSongAtIndex = async function(index) {
  if (!favouritePlaylistState.songs.length) return;
  await window.startFavouritePlaylist(favouritePlaylistState.songs, index);
};

// ===== NCT MUSIC DIALOG FEATURE =====
// Biến global cho NCT Music
let otherNctSongsData = [];

const LYRIC_EMBED_DESKTOP_WIDTH = 1280;
const LYRIC_EMBED_DESKTOP_HEIGHT = 720;

function updateLyricEmbedScale() {
  const lyricDialog = document.getElementById('lyricDialog');
  const viewport = document.querySelector('#dLyricEmbed .lyric-embed-viewport');
  const stage = document.querySelector('#dLyricEmbed .lyric-embed-stage');

  if (!lyricDialog || !lyricDialog.classList.contains('lyric-embed-active') || !viewport || !stage) {
    return;
  }

  const availableWidth = viewport.clientWidth;
  const availableHeight = viewport.clientHeight;
  if (!availableWidth || !availableHeight) return;

  const scale = Math.min(
    availableWidth / LYRIC_EMBED_DESKTOP_WIDTH,
    availableHeight / LYRIC_EMBED_DESKTOP_HEIGHT
  );

  stage.style.transform = `scale(${scale})`;
}

// Function đóng NCT Music Dialog
function closeNctMusicDialog() {
  const nctDialog = document.getElementById('nctMusicDialog');
  if (nctDialog && nctDialog.open) {
    nctDialog.close();
  }

  // Đóng và xóa NCT mini player
  const miniPlayer = document.getElementById('nctMiniPlayer');
  if (miniPlayer) {
    miniPlayer.remove();
  }

  // Clear NCT iframe
  const nctIframe = document.getElementById('nctMusicIframe');
  if (nctIframe) {
    nctIframe.innerHTML = '';
  }
}

// Function đóng tất cả YouTube dialogs và mini player
function closeAllYoutubeDialogs() {
  suppressYoutubeMiniPlayer = true;
  ['youtubeVideoDialog', 'youtubePlaylistDialog'].forEach(id => {
    const dialog = document.getElementById(id);
    if (dialog?.open) {
      dialog.close();
    }
  });
  suppressYoutubeMiniPlayer = false;

  // Đóng và xóa YouTube mini player
  const miniPlayer = document.getElementById('youtubeMiniPlayer');
  if (miniPlayer) {
    miniPlayer.remove();
  }

  // Clear YouTube iframe
  clearYoutubePlayer();
  resetFavouritePlaylistState();
}

// ===== NCT MUSIC DIALOG FUNCTIONS =====

// Function mở NCT Music Dialog
async function openNctMusicDialog() {
  // Đóng tất cả YouTube dialogs trước
  closeAllYoutubeDialogs();

  const songName = document.getElementById("dTitle").textContent;
  const artist = document.getElementById("dArtist").textContent.replace('ㅤ', '').trim();

  const searchQuery = `${songName} ${artist}`;

  // Reset state
  otherNctSongsData = [];
  document.getElementById('otherNctSongsContainer').style.display = 'none';
  document.getElementById('btnShowOtherNctSongs').innerHTML = '<i class="fa-solid fa-list"></i> Hiển thị các bài khác';

  // Hiển thị loading
  document.getElementById('nctMusicIframe').innerHTML = `
    <div style="text-align: center; padding: 100px 20px; color: var(--text-muted);">
      <i class="fa-solid fa-spinner fa-spin" style="font-size: 48px; margin-bottom: 20px;"></i>
      <p>Đang tìm bài hát trên NhacCuaTui...</p>
    </div>
  `;
  document.getElementById('nctMusicSongName').textContent = `${songName} - ${artist}`;

  // Render nút Remix và Acoustic
  document.getElementById('nctVersionRemix').innerHTML = `<button onclick="searchNctMusic('${songName.trim()} ${artist} remix');" style="
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
"
onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(102, 126, 234, 0.6)';"
onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(102, 126, 234, 0.4)';"
onmousedown="this.style.transform='scale(0.95)';"
onmouseup="this.style.transform='translateY(-2px)';">
  Remix
</button>`;

  document.getElementById('nctVersionAcoustic').innerHTML = `<button onclick="searchNctMusic('${songName.trim()} ${artist} acoustic');" style="
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
"
onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(102, 126, 234, 0.6)';"
onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(102, 126, 234, 0.4)';"
onmousedown="this.style.transform='scale(0.95)';"
onmouseup="this.style.transform='translateY(-2px)';">
  Acoustic
</button>`;

  nctMusicDialog.showModal();

  // Load trang tìm kiếm NCT
  loadNctSearchPage(searchQuery);
}

// Function load trang tìm kiếm NCT Music
function loadNctSearchPage(searchQuery) {
  const nctSearchUrl = `https://www.nhaccuatui.com/tim-kiem?q=${encodeURIComponent(searchQuery)}`;

  const iframeHtml = `
    <iframe 
      width="100%" 
      height="650" 
      src="${nctSearchUrl}" 
      frameborder="0"
      style="border-radius: 16px; background: white;"
    ></iframe>
    <div style="text-align: center; margin-top: 16px; color: var(--text-muted); font-size: 14px;">
      <i class="fa-solid fa-info-circle"></i> Click vào bài hát để nghe trên NhacCuaTui
      <a 
        href="${nctSearchUrl}" 
        target="_blank"
        style="
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-left: 12px;
          color: var(--accent-primary);
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s;
        "
        onmouseover="this.style.color='var(--accent-secondary)'"
        onmouseout="this.style.color='var(--accent-primary)'"
      >
        <i class="fa-solid fa-external-link"></i>
        Mở trong tab mới
      </a>
    </div>
  `;

  document.getElementById('nctMusicIframe').innerHTML = iframeHtml;
}

// Function search NCT Music với query tùy chỉnh
function searchNctMusic(query) {
  // Đóng tất cả YouTube dialogs trước
  closeAllYoutubeDialogs();

  // Reset state
  otherNctSongsData = [];
  document.getElementById('otherNctSongsContainer').style.display = 'none';
  document.getElementById('btnShowOtherNctSongs').innerHTML = '<i class="fa-solid fa-list"></i> Hiển thị các bài khác';

  // Hiển thị loading
  document.getElementById('nctMusicIframe').innerHTML = `
    <div style="text-align: center; padding: 100px 20px; color: var(--text-muted);">
      <i class="fa-solid fa-spinner fa-spin" style="font-size: 48px; margin-bottom: 20px;"></i>
      <p>Đang tìm bài hát...</p>
    </div>
  `;

  document.getElementById('nctMusicSongName').textContent = query;
  nctMusicDialog.showModal();

  // Load trang tìm kiếm
  loadNctSearchPage(query);
}

// Function toggle hiển thị/ẩn other NCT songs
async function toggleOtherNctSongs() {
  const container = document.getElementById('otherNctSongsContainer');
  const btn = document.getElementById('btnShowOtherNctSongs');

  if (container.style.display === 'none') {
    // Hiển thị container
    container.style.display = 'block';
    btn.innerHTML = '<i class="fa-solid fa-chevron-up"></i> Ẩn các bài khác';

    // Nếu chưa có data, fetch từ API
    if (otherNctSongsData.length === 0) {
      await fetchOtherNctSongs();
    } else {
      // Nếu đã có data, chỉ cần render lại
      renderOtherNctSongs();
    }
  } else {
    // Ẩn container
    container.style.display = 'none';
    btn.innerHTML = '<i class="fa-solid fa-list"></i> Hiển thị các bài khác';
  }
}

// Function fetch other NCT songs
async function fetchOtherNctSongs() {
  const songName = document.getElementById("dTitle").textContent;
  const artist = document.getElementById("dArtist").textContent.replace('ㅤ', '').trim();

  // Hiển thị loading
  document.getElementById('otherNctSongsList').innerHTML = `
    <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
      <i class="fa-solid fa-spinner fa-spin" style="font-size: 36px; margin-bottom: 16px;"></i>
      <p>Đang tìm bài hát thay thế...</p>
    </div>
  `;

  // Tạo danh sách các query khác nhau để tìm
  const queries = [
    `${songName} ${artist}`,
    `${songName} remix`,
    `${songName} lofi`,
  ];

  // Mock data cho demo
  otherNctSongsData = queries.map((query, index) => ({
    title: query,
    artist: artist || 'Various Artists',
    url: `https://www.nhaccuatui.com/tim-kiem?q=${encodeURIComponent(query)}`,
    thumbnail: 'https://avatar-ex-swe.nixcdn.com/playlist/share/2023/08/24/3/1/5/a_1692840092851.jpg'
  }));

  renderOtherNctSongs();
}

// Function render danh sách other NCT songs
function renderOtherNctSongs() {
  const listContainer = document.getElementById('otherNctSongsList');

  if (otherNctSongsData.length === 0) {
    listContainer.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
        <p>Không có bài hát nào</p>
      </div>
    `;
    return;
  }

  listContainer.innerHTML = otherNctSongsData.map((song, index) => {
    return `
      <a 
        href="${song.url}"
        target="_blank"
        class="other-nct-item"
        title="Click để mở trên NhacCuaTui"
      >
        <img 
          src="https://apkcombo.vn/wp-content/uploads/2023/02/nct-nhaccuatui-nghe-mp3.png" 
          alt="${song.title}" 
          class="other-nct-thumbnail"
          onerror="this.src='https://avatar-ex-swe.nixcdn.com/playlist/share/2023/08/24/3/1/5/a_1692840092851.jpg'"
        >
        <div class="other-nct-info">
          <div class="other-nct-title">${song.title}</div>
          <div class="other-nct-artist">
            <i class="fa-solid fa-user"></i> ${song.artist}
          </div>
        </div>
        <div class="other-nct-play-icon">
          <i class="fa-solid fa-music"></i>
        </div>
      </a>
    `;
  }).join('');
}

// Override function nctThismusic
function nctThismusic() {
  openNctMusicDialog();
}

// Event listener đóng NCT dialog khi click overlay
nctMusicDialog.addEventListener('click', (e) => {
  if (e.target === nctMusicDialog) {
    nctMusicDialog.close();
  }
});

// Event listener khi đóng NCT dialog - hiển thị miniplayer
nctMusicDialog.addEventListener('close', () => {
  const iframe = document.getElementById('nctMusicIframe');
  // Chỉ hiển thị miniplayer nếu có nội dung iframe (đã load bài hát)
  if (iframe.innerHTML.trim() !== '' && !iframe.innerHTML.includes('fa-spinner')) {
    showNctMiniPlayer();
  }
});

// ===== NCT MINI PLAYER FUNCTIONS =====

function showNctMiniPlayer() {
  let miniPlayer = document.getElementById('nctMiniPlayer');
  if (!miniPlayer) {
    miniPlayer = document.createElement('div');
    miniPlayer.id = 'nctMiniPlayer';
    miniPlayer.style = 'cursor: pointer;';
    miniPlayer.innerHTML = `
      <div onclick="reopenNctDialog()" style="display: flex; align-items: center; gap: 12px; flex: 1; padding: 15px;">
        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2b/NhacCuaTui_2022logo.png" 
             style="height: 20px;" 
             alt="NCT">
        <span id="miniPlayerNctName" style="font-weight: 600; font-size: 14px;">Đang phát nhạc...</span>
      </div>
      <button onclick="reopenNctDialog()" style="
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
      <button onclick="stopNct()" style="
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

  const songName = document.getElementById('nctMusicSongName').textContent;
  document.getElementById('miniPlayerNctName').textContent = songName;

  miniPlayer.classList.add('show');
}

function reopenNctDialog() {
  nctMusicDialog.showModal();
  const miniPlayer = document.getElementById('nctMiniPlayer');
  if (miniPlayer) miniPlayer.classList.remove('show');
}

function stopNct() {
  document.getElementById('nctMusicIframe').innerHTML = '';
  const miniPlayer = document.getElementById('nctMiniPlayer');
  if (miniPlayer) miniPlayer.remove();
}


// ===== YOUTUBE FUNCTIONS =====

// Function toggle hiển thị/ẩn other videos
async function toggleOtherVideos() {
  const container = document.getElementById('otherVideosContainer');
  const btn = document.getElementById('btnShowOtherVideos');

  if (container.style.display === 'none') {
    container.style.display = 'block';
    btn.innerHTML = '<i class="fa-solid fa-chevron-up"></i> Ẩn các video khác';

    if (otherVideosData.length === 0) {
      await fetchOtherVideos();
    } else {
      renderOtherVideos();
    }
  } else {
    container.style.display = 'none';
    btn.innerHTML = '<i class="fa-solid fa-list"></i> Hiển thị các video khác';
  }
}

// Function fetch 3 videos đầu tiên từ YouTube API
async function fetchOtherVideos() {
  const searchQuery = currentYoutubeSearchContext.searchQuery
    || [
      currentYoutubeSearchContext.songName,
      currentYoutubeSearchContext.artist
    ].filter(Boolean).join(' ')
    || document.getElementById('youtubeVideoSongName').textContent.trim();

  document.getElementById('otherVideosList').innerHTML = `
    <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
      <i class="fa-solid fa-spinner fa-spin" style="font-size: 36px; margin-bottom: 16px;"></i>
      <p>Đang tìm video thay thế...</p>
    </div>
  `;

  try {
    const searchRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=3&q=${encodeURIComponent(searchQuery)}&key=AIzaSyAS6c7bto_vvZ60g_FsdA60od3Fgw0y67g`
    );
    const searchData = await searchRes.json();

    if (!searchData.items || searchData.items.length === 0) {
      document.getElementById('otherVideosList').innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
          <i class="fa-solid fa-circle-exclamation" style="font-size: 36px; margin-bottom: 16px; color: #ef4444;"></i>
          <p>Không tìm thấy video nào</p>
        </div>
      `;
      return;
    }

    otherVideosData = searchData.items;
    renderOtherVideos();

  } catch (error) {
    console.error('Lỗi khi tìm other videos:', error);
    document.getElementById('otherVideosList').innerHTML = `
      <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
        <i class="fa-solid fa-triangle-exclamation" style="font-size: 36px; margin-bottom: 16px; color: #f59e0b;"></i>
        <p>Có lỗi xảy ra khi tìm video</p>
      </div>
    `;
  }
}

// Function render danh sách other videos
function renderOtherVideos() {
  const listContainer = document.getElementById('otherVideosList');

  if (otherVideosData.length === 0) {
    listContainer.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
        <p>Không có video nào</p>
      </div>
    `;
    return;
  }

  listContainer.innerHTML = otherVideosData.map((video, index) => {
    const videoId = video.id.videoId;
    const title = video.snippet.title;
    const channelTitle = video.snippet.channelTitle;
    const thumbnail = video.snippet.thumbnails.medium.url;

    return `
      <div 
        class="other-video-item" 
        onclick="playOtherVideo('${videoId}')"
        title="Click để phát video này"
      >
        <img 
          src="${thumbnail}" 
          alt="${title}" 
          class="other-video-thumbnail"
        >
        <div class="other-video-info">
          <div class="other-video-title">${title}</div>
          <div class="other-video-channel">
            <i class="fa-solid fa-user"></i> ${channelTitle}
          </div>
        </div>
        <div class="other-video-play-icon">
          <i class="fa-brands fa-youtube"></i>
        </div>
      </div>
    `;
  }).join('');
}

// Function phát video từ danh sách other
function playOtherVideo(videoId) {
  loadYoutubeVideo(videoId, currentYoutubeSearchContext.songName, currentYoutubeSearchContext.artist);
  getYoutubeDialogBody(false)?.scrollTo({ top: 0, behavior: 'smooth' });
}

async function loadYoutubeVideo(videoId, songName, artist) {
  const playlistMode = isYoutubePlaylistMode();
  setYoutubeDisplayTitle(songName, artist, playlistMode);

  clearYoutubePlayer(false);
  const playerContainer = getYoutubePlayerContainer(playlistMode);
  if (!playerContainer) return;

  playerContainer.innerHTML = `
    <div id="mainYoutubePlayer" style="width: 100%; min-height: 650px; border-radius: 16px; overflow: hidden; background: #000;"></div>
    <div style="text-align: center; margin-top: 16px; color: var(--text-muted); font-size: 14px;">
      <i class="fa-solid fa-info-circle"></i> Video bị chặn?
      <button
        onclick="tryNextVideo(${JSON.stringify(songName)}, ${JSON.stringify(artist)})"
        style="
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          margin-left: 8px;
          transition: all 0.3s;
        "
        onmouseover="this.style.transform='translateY(-2px)'"
        onmouseout="this.style.transform='translateY(0)'"
      >
        Thử video khác
      </button>
    </div>
  `;

  try {
    await ensureYoutubeIframeApi();
    youtubePlayer = new YT.Player('mainYoutubePlayer', {
      height: '650',
      width: '100%',
      videoId,
      playerVars: {
        autoplay: 1,
        rel: 0,
        playsinline: 1
      },
      events: {
        onReady: () => {
          updateYoutubePlaylistStatus();
          updateYoutubeMiniPlayerLabel();
        },
        onStateChange: async (event) => {
          if (event.data === window.YT.PlayerState.ENDED && favouritePlaylistState.active) {
            await playNextFavouritePlaylistSong();
          }
        },
        onError: () => {
          tryNextVideo(currentYoutubeSearchContext.songName, currentYoutubeSearchContext.artist);
        }
      }
    });
  } catch (error) {
    console.error('Lỗi khi load YouTube player:', error);
    showVideoError();
  }
}

async function loadVideoByIndex(index, songName, artist) {
  if (index >= allAvailableVideos.length) {
    await showVideoNotAvailable(songName, artist);
    return;
  }

  currentVideoIndex = index;
  const videoId = allAvailableVideos[index].id.videoId;
  await loadYoutubeVideo(videoId, songName, artist);
}

function tryNextVideo(songName, artist) {
  loadVideoByIndex(currentVideoIndex + 1, songName, artist);
}

async function showVideoNotAvailable(songName, artist) {
  if (favouritePlaylistState.active) {
    await playNextFavouritePlaylistSong();
    return;
  }

  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(songName + ' ' + artist)}`;
  clearYoutubePlayer();

  const playerContainer = getYoutubePlayerContainer();
  if (!playerContainer) return;

  playerContainer.innerHTML = `
    <div style="text-align: center; padding: 100px 20px; color: var(--text-muted);">
      <i class="fa-solid fa-ban" style="font-size: 64px; margin-bottom: 20px; color: #ef4444;"></i>
      <h3 style="color: var(--text-primary); margin-bottom: 12px;">Video không có sẵn</h3>
      <p style="margin-bottom: 24px;">Tất cả video đều bị chặn embed hoặc không khả dụng ở khu vực của bạn.</p>
      <a 
        href="${searchUrl}" 
        target="_blank"
        style="
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          padding: 14px 28px;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 700;
          font-size: 16px;
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
          transition: all 0.3s;
        "
        onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 6px 25px rgba(239, 68, 68, 0.6)'"
        onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(239, 68, 68, 0.4)'"
      >
        <i class="fa-brands fa-youtube"></i>
        Xem trên YouTube
      </a>
      <p style="margin-top: 16px; font-size: 13px;">
        💡 Mẹo: Bạn có thể thử bấm nút <strong>"Hiển thị các video khác"</strong> bên dưới
      </p>
    </div>
  `;
}

function showVideoError() {
  clearYoutubePlayer();
  const playerContainer = getYoutubePlayerContainer();
  if (!playerContainer) return;

  playerContainer.innerHTML = `
    <div style="text-align: center; padding: 100px 20px; color: var(--text-muted);">
      <i class="fa-solid fa-triangle-exclamation" style="font-size: 48px; margin-bottom: 20px; color: #f59e0b;"></i>
      <p>Có lỗi xảy ra khi tìm video</p>
    </div>
  `;
}

// Function mở YouTube Video Dialog
async function openYoutubeVideoDialog() {
  const songName = document.getElementById("dTitle").textContent;
  const artist = document.getElementById("dArtist").textContent.replace('ㅤ', '').trim();
  await searchYoutubeVideo(songName, artist);
}

youtubeVideoDialog.addEventListener('click', (e) => {
  if (e.target === youtubeVideoDialog) {
    youtubeVideoDialog.close();
  }
});

youtubePlaylistDialog.addEventListener('click', (e) => {
  if (e.target === youtubePlaylistDialog) {
    youtubePlaylistDialog.close();
  }
});

function handleYoutubeDialogClose() {
  if (suppressYoutubeMiniPlayer) {
    return;
  }

  const hasPlayerContent = ['youtubeVideoIframe', 'youtubePlaylistIframe'].some(id => {
    const container = document.getElementById(id);
    return container && container.innerHTML.trim() !== '';
  });

  if (youtubePlayer || hasPlayerContent) {
    showYoutubeMiniPlayer();
  }
}

youtubeVideoDialog.addEventListener('close', handleYoutubeDialogClose);
youtubePlaylistDialog.addEventListener('close', handleYoutubeDialogClose);

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

  updateYoutubeMiniPlayerLabel();

  miniPlayer.classList.add('show');
}

function reopenYoutubeDialog() {
  const dialog = getCurrentYoutubeDialog();
  if (dialog && !dialog.open) {
    dialog.showModal();
  }
  const miniPlayer = document.getElementById('youtubeMiniPlayer');
  if (miniPlayer) miniPlayer.classList.remove('show');
}

function stopYoutube() {
  clearYoutubePlayer();
  resetFavouritePlaylistState();
  const miniPlayer = document.getElementById('youtubeMiniPlayer');
  if (miniPlayer) miniPlayer.remove();
}

function openYoutubeSearchDialog() {
  // Đóng NCT dialog trước
  closeNctMusicDialog();

  const songName = prompt("Nhập tên bài hát:");

  if (!songName || songName.trim() === "") {
    alert("Vui lòng nhập tên bài hát!");
    return;
  }

  const artist = prompt("Nhập tên ca sĩ (nếu biết, bỏ trống nếu không biết):");

  searchYoutubeVideo(songName.trim(), artist ? artist.trim() : "");
}

async function searchYoutubeVideo(songName, artist, options = {}) {
  // Đóng NCT dialog trước
  closeNctMusicDialog();

  const searchQuery = artist
    ? `${songName} ${artist}`
    : `${songName}`;

  if (!options.playlistMode) {
    resetFavouritePlaylistState();
  }

  currentYoutubeSearchContext = {
    songName,
    artist: artist || '',
    searchQuery
  };

  if (options.playlistMode) {
    renderFavouritePlaylistSongs();
  } else {
    resetYoutubeOtherVideosState();
    renderYoutubeVersionButtons(songName, artist || '');
  }

  clearYoutubePlayer();
  const playerContainer = getYoutubePlayerContainer(!!options.playlistMode);
  if (!playerContainer) return;

  playerContainer.innerHTML = `
    <div style="text-align: center; padding: 100px 20px; color: var(--text-muted);">
      <i class="fa-solid fa-spinner fa-spin" style="font-size: 48px; margin-bottom: 20px;"></i>
      <p>Đang tải video! Vui lòng chờ...</p>
    </div>
  `;
  setYoutubeDisplayTitle(songName, artist, !!options.playlistMode);
  updateYoutubePlaylistStatus();
  openYoutubeDialogForMode(!!options.playlistMode);

  try {
    const searchRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=5&q=${encodeURIComponent(searchQuery)}&key=AIzaSyAS6c7bto_vvZ60g_FsdA60od3Fgw0y67g`
    );
    const searchData = await searchRes.json();

    if (!searchData.items?.length) {
      await showVideoNotAvailable(songName, artist);
      return;
    }

    allAvailableVideos = searchData.items;
    await loadVideoByIndex(0, songName, artist);

  } catch (error) {
    console.error('Lỗi khi tìm video:', error);
    showVideoError();
  }
}

document.addEventListener('app-languagechange', () => {
  updateYoutubePlaylistStatus();
  renderFavouritePlaylistSongs();
  updateYoutubeMiniPlayerLabel();
});

// Tag Selector Handler
function initTagSelector(selectorId, inputId) {
  const selector = document.getElementById(selectorId);
  const input = document.getElementById(inputId);

  if (!selector || !input) return;

  selector.addEventListener('click', (e) => {
    if (e.target.classList.contains('tag-option')) {
      e.target.classList.toggle('selected');

      const selectedTags = Array.from(selector.querySelectorAll('.tag-option.selected'))
        .map(el => el.dataset.tag);
      input.value = JSON.stringify(selectedTags);
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  initTagSelector('tagSelector', 'selectedTags');
  initTagSelector('editTagSelector', 'editSelectedTags');
});

function setSelectedTags(selectorId, tags) {
  const selector = document.getElementById(selectorId);
  if (!selector || !tags) return;

  selector.querySelectorAll('.tag-option').forEach(el => {
    el.classList.remove('selected');
  });

  const tagArray = typeof tags === 'string' ? JSON.parse(tags) : tags;

  tagArray.forEach(tag => {
    const option = selector.querySelector(`[data-tag="${tag}"]`);
    if (option) option.classList.add('selected');
  });
}

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

document.getElementById('hasAlbum').addEventListener('change', function () {
  document.getElementById('albumGroup').style.display = this.checked ? 'block' : 'none';
  if (!this.checked) {
    document.getElementById('album').value = '';
    document.getElementById('error-album').textContent = '';
  }
});

document.getElementById('editHasAlbum').addEventListener('change', function () {
  document.getElementById('editAlbumGroup').style.display = this.checked ? 'block' : 'none';
  if (!this.checked) {
    document.getElementById('editAlbum').value = '';
    document.getElementById('error-editAlbum').textContent = '';
  }
});

async function audioVisual() {
  function normalizeString(input) {
    return input
      .normalize("NFD")                 // tách dấu tiếng Việt
      .replace(/[\u0300-\u036f]/g, "")  // xoá dấu
      .replace(/[^a-zA-Z0-9]/g, "")     // xoá ký tự đặc biệt, khoảng trắng
      .toLowerCase();                   // chuyển về chữ thường
  }

  const songName = normalizeString(document.getElementById("dTitle").textContent);
  const targetUrl = `https://2937.vercel.app/TOOLS/music/index.html?data=${songName}`;
  const lyricText = document.getElementById('dLyric');
  const lyricEmbed = document.getElementById('dLyricEmbed');
  const lyricDialog = document.getElementById('lyricDialog');

  if (!lyricText || !lyricEmbed) {
    window.location.href = targetUrl;
    return;
  }

  if (lyricDialog) {
    lyricDialog.classList.add('lyric-embed-active');
  }
  lyricText.style.display = 'none';
  lyricEmbed.style.display = 'block';
  lyricEmbed.innerHTML = `
    <div class="lyric-embed-viewport">
      <div class="lyric-embed-stage">
        <iframe
          src="${targetUrl}"
          title="Audio Visual"
          loading="lazy"
          allow="autoplay; encrypted-media; picture-in-picture"
          referrerpolicy="strict-origin-when-cross-origin"
        ></iframe>
      </div>
    </div>
  `;
  requestAnimationFrame(updateLyricEmbedScale);
}

window.addEventListener('resize', updateLyricEmbedScale);
