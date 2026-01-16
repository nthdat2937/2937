


window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  const icon = document.getElementById('themeIcon');

  document.documentElement.setAttribute('data-theme', savedTheme);

  if (savedTheme === 'light') {
    icon.className = 'fa-solid fa-sun';
    const sidebarIcon = document.getElementById('themeIconSidebar');
    if (sidebarIcon) sidebarIcon.className = 'fa-solid fa-sun'; 
  };

  const rankBtn = document.getElementById("btn-ranking");
if (rankBtn) {
  rankBtn.addEventListener("click", openRankingDialog);
}

});

import {
  createClient
} from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient("https://ktqdzlhvdkerjajffgfi.supabase.co", "sb_publishable_1wm-eXETyu07vl61sY4mBQ_xwYZVOCj");

const list = document.getElementById('list'),
  lyricDialog = document.getElementById('lyricDialog'),
  addSongDialog = document.getElementById('addSongDialog'),
  editSongDialog = document.getElementById('editSongDialog'),
  songForm = document.getElementById('songForm'),
  editSongForm = document.getElementById('editSongForm'),
  dTitle = document.getElementById('dTitle'),
  dArtist = document.getElementById('dArtist'),
  dLyric = document.getElementById('dLyric'),
  dAvatar = document.getElementById('dAvatar'),
  searchInput = document.getElementById('searchInput');

let currentEditId = null;

async function loadSongs() {
  const {
    data,
    error
  } = await supabase.from('songs').select('*').eq('Xác minh', true);
  if (error) {
    console.error(error);
    return
  }
  data.sort((a, b) => a['Tên'].localeCompare(b['Tên'], 'vi'));
  window._songs = data;
  renderSongs(data);
  updateStats(data);
}

function renderSongs(songs) {
  const isAdmin = window.currentUserRole === 'Admin';
  list.innerHTML = songs.map(song => {
    const hotLines = (song['Lyric'] || '').split('\n').filter(line => line.includes('--hot')).map(line => line.replace('--hot', '').trim());
    const hotText = hotLines.length > 0 ? hotLines.join(' | ') : 'Không có';
    return `<tr data-song-id="${song.Id}"><td class="song-clickable">${song.avatar?`<img src="${song.avatar}" loading="lazy" alt="avatar" style="width:60px;
                height:60px;
                object-fit:cover;
                border-radius:8px">`:''}</td><td class="song-clickable" style="font-weight: bold; font-size: 20px;" title="${song['Tên']}">${song['Tên']}</td><td class="song-clickable" title="${song['Ca sĩ']}">${song['Ca sĩ']}</td><td class="song-clickable" title="${song['Sáng tác']||''}">${song['Sáng tác']||''}</td><td class="song-clickable" title="${song['Ngày phát hành']||''}">${song['Ngày phát hành']||''}</td><td class="song-clickable" style="overflow:hidden;
                text-overflow:ellipsis;
                white-space:normal;
                word-break:break-word" title="${hotText}"><span style="color:#fbbf24;
                font-weight:500;
                font-size:17px">🔥 ${hotText}</span></td><td><div class="actions-cell">
  ${isAdmin ? `
    <button class="btn btn-edit" data-action="edit" title="Chỉnh sửa">
      <i class="fa-solid fa-pen-to-square"></i>
    </button>
    <button class="btn btn-delete" data-action="delete" title="Xoá">
      <i class="fa-solid fa-delete-left"></i>
    </button>
  ` : ''}
  <button class="btn btn-lyric" data-action="lyric" title="Chi tiết">
    <i class="fa-solid fa-music"></i>
  </button>
</div></td></tr>`
  }).join('');

  updateStats(songs);
}


list.addEventListener('click', (e) => {
  const row = e.target.closest('tr');
  if (!row) return;
  
  const songId = parseInt(row.dataset.songId);
  const button = e.target.closest('button');
  
  if (button) {
    const action = button.dataset.action;
    if (action === 'edit') openEditDialog(songId);
    else if (action === 'delete') deleteSong(songId);
    else if (action === 'lyric') showLyric(songId);
  } else if (e.target.closest('.song-clickable')) {
    showLyric(songId);
  }
});

let searchTimeout;
searchInput.addEventListener('input', (e) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    const query = e.target.value.toLowerCase().trim();
    if (!query) {
      renderSongs(window._songs);
      return;
    }

    const filtered = window._songs.filter(song =>
      removeDiacritics(song['Tên']).includes(removeDiacritics(query)) ||
      removeDiacritics(song['Ca sĩ']).includes(removeDiacritics(query)) ||
      removeDiacritics(song['Sáng tác']).includes(removeDiacritics(query)) ||
      removeDiacritics(song['Lyric'] || '').includes(removeDiacritics(query))
    );
    renderSongs(filtered);
  }, 300);
});

window.showLyric = id => {
  const s = window._songs.find(x => x.Id === id);
  
  
  const updates = {
    title: s['Tên'],
    artist: `${s['Ca sĩ']}ㅤ`,
    date: `•ㅤ${s['Ngày phát hành']||''}`,
    addedBy: s['add_by'] ? `👤 Người thêm: ${s['add_by']}` : '',
    lyric: (s['Lyric'] || '').split('\n').map(line => {
      const cleanLine = line.replace('--hot', '').trim();
      const hasHot = line.includes('--hot');
      return `<span class="motLyric">${cleanLine}${hasHot?' 🔥':''}</span>`
    }).join('\n') || '<span>Chưa có lyric</span>',
    avatarSrc: s.avatar,
    avatarDisplay: s.avatar ? 'block' : 'none'
  };
  
  
  requestAnimationFrame(() => {
    dTitle.textContent = updates.title;
    dArtist.textContent = updates.artist;
    dDate.textContent = updates.date;
    dAddedBy.textContent = updates.addedBy;
    dLyric.innerHTML = updates.lyric;
    dAvatar.src = updates.avatarSrc || '';
    dAvatar.style.display = updates.avatarDisplay;
    lyricDialog.showModal();
  });
}

window.openEditDialog = id => {
  
  if (!currentUser) {
    alert('Vui lòng đăng nhập để chỉnh sửa!');
    return;
  }

  
  if (window.currentUserRole !== 'Admin') {
    alert('Chỉ Admin mới có quyền chỉnh sửa bài hát!');
    return;
  }
  const s = window._songs.find(x => x.Id === id);
  if (!s) return;
  currentEditId = id;
  document.getElementById('editSongName').value = s['Tên'];
  document.getElementById('editArtist').value = s['Ca sĩ'];
  document.getElementById('editComposer').value = s['Sáng tác'] || '';
  document.getElementById('editReleaseDate').value = s['Ngày phát hành'] || '';
  document.getElementById('editAvatar').value = s.avatar || '';
  document.getElementById('editLyric').value = s['Lyric'] || '';
  clearEditErrors();
  editSongDialog.showModal()
}
addSongDialog.addEventListener('click', async (e) => {
  if (e.target !== addSongDialog) return;
  addSongDialog.close();
});

window.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.getElementById('btn-add-sc');
  if (addBtn) {
    addBtn.addEventListener('click', async () => {
      if (currentUser) {
        const {
          data
        } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('id', currentUser.id)
          .single();

        if (data) {
          document.getElementById('addedBy').value = data.display_name;
        }
      } else {
        document.getElementById('addedBy').value = 'Khách! Đăng nhập để thay đổi';
      }
    });
  }
});
window.deleteSong = async id => {
  
  if (!currentUser) {
    alert('Vui lòng đăng nhập để xóa!');
    return;
  }

  
  if (window.currentUserRole !== 'Admin') {
    alert('Chỉ Admin mới có quyền xóa bài hát!');
    return;
  }
  if (!confirm('Bạn chắc chắn muốn xoá bài hát này?')) return;
  const {
    error
  } = await supabase.from('songs').delete().eq('Id', id);
  if (error) {
    console.error(error);
    alert('Lỗi khi xoá bài hát: ' + error.message);
    return
  }
  loadSongs()
}
lyricDialog.addEventListener('click', (e) => {
  if (e.target === lyricDialog) {
    lyricDialog.close()
  }
});

editSongDialog.addEventListener('click', (e) => {
  if (e.target === editSongDialog) {
    editSongDialog.close()
  }
});

songForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearErrors();
  const songName = document.getElementById('songName').value.trim();
  const artist = document.getElementById('artist').value.trim();
  const composer = document.getElementById('composer').value.trim();
  const releaseDate = document.getElementById('releaseDate').value;
  const avatar = document.getElementById('avatar').value.trim();
  const lyric = document.getElementById('lyric').value.trim();
  const adminCode = document.getElementById('adminCode').value.trim();
  const addedBy = document.getElementById('addedBy').value.trim();
  let isValid = true;
  if (!songName) {
    showError('songName', 'Vui lòng nhập tên bài hát');
    isValid = false
  }
  if (!artist) {
    showError('artist', 'Vui lòng nhập tên ca sĩ');
    isValid = false
  }
  if (!composer) {
    showError('composer', 'Vui lòng nhập tên sáng tác');
    isValid = false
  }
  if (!releaseDate) {
    showError('releaseDate', 'Vui lòng chọn ngày phát hành');
    isValid = false
  }
  if (!isValid) return;
  const correctAdminCode = 'xm1689';
  const isVerified = adminCode === correctAdminCode;
  const {
    error
  } = await supabase.from('songs').insert([{
    'Tên': songName,
    'Ca sĩ': artist,
    'Sáng tác': composer,
    'Ngày phát hành': releaseDate,
    'avatar': avatar || null,
    'Lyric': lyric,
    'Xác minh': isVerified,
    'add_by': addedBy
  }]);
  if (error) {
    console.error(error);
    alert('Lỗi khi thêm bài hát: ' + error.message);
    return
  }
  songForm.reset();
  addSongDialog.close();
  if (isVerified) {
    alert('Bài hát đã được thêm và xác minh thành công! ✅')
  } else {
    alert('Bài hát đã được thêm!\nVui lòng đợi duyệt trong giây lát!')
  }
  loadSongs()
});

editSongForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearEditErrors();
  const songName = document.getElementById('editSongName').value.trim();
  const artist = document.getElementById('editArtist').value.trim();
  const composer = document.getElementById('editComposer').value.trim();
  const releaseDate = document.getElementById('editReleaseDate').value;
  const avatar = document.getElementById('editAvatar').value.trim();
  const lyric = document.getElementById('editLyric').value.trim();
  let isValid = true;
  if (!songName) {
    showEditError('editSongName', 'Vui lòng nhập tên bài hát');
    isValid = false
  }
  if (!artist) {
    showEditError('editArtist', 'Vui lòng nhập tên ca sĩ');
    isValid = false
  }
  if (!composer) {
    showEditError('editComposer', 'Vui lòng nhập tên sáng tác');
    isValid = false
  }
  if (!releaseDate) {
    showEditError('editReleaseDate', 'Vui lòng chọn ngày phát hành');
    isValid = false
  }
  if (!isValid) return;
  const {
    error
  } = await supabase.from('songs').update({
    'Tên': songName,
    'Ca sĩ': artist,
    'Sáng tác': composer,
    'Ngày phát hành': releaseDate,
    'avatar': avatar || null,
    'Lyric': lyric
  }).eq('Id', currentEditId);
  if (error) {
    console.error(error);
    alert('Lỗi khi cập nhật bài hát: ' + error.message);
    return
  }
  editSongDialog.close();
  loadSongs()
});

function showError(fieldId, message) {
  document.getElementById(`error-${fieldId}`).textContent = message
}

function showEditError(fieldId, message) {
  document.getElementById(`error-${fieldId}`).textContent = message
}

function clearErrors() {
  document.querySelectorAll('#songForm .error').forEach(el => el.textContent = '')
}

function clearEditErrors() {
  document.querySelectorAll('#editSongForm .error').forEach(el => el.textContent = '')
}

const diacriticsCache = new Map();

function removeDiacritics(str) {
  if (diacriticsCache.has(str)) {
    return diacriticsCache.get(str);
  }
  
  const result = str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
  
  diacriticsCache.set(str, result);
  return result;
}



function buildRanking(songs) {
  const map = {};

  songs.forEach(song => {
    
    if (!song.add_by) return;
    
    const name = song.add_by.trim();
    map[name] = (map[name] || 0) + 1;
  });

  return Object.entries(map)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}


window.openRankingDialog = async function () {
  const rankingList = document.getElementById("rankingList");
  const currentUserRank = document.getElementById("currentUserRank");
  const dialog = document.getElementById("rankingDialog");

  if (!rankingList || !currentUserRank || !dialog) {
    console.error('Không tìm thấy elements');
    return;
  }

  rankingList.innerHTML = "<li>Đang tải...</li>";
  
  try {
    
    const { data: allSongs, error } = await supabase
      .from('songs')
      .select('*')
      .eq('Xác minh', true);

    if (error) throw error;

    const ranking = buildRanking(allSongs);
    
    
    let myName = "Khách";
    if (currentUser) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', currentUser.id)
        .single();
      
      if (profile) {
        myName = profile.display_name;
      }
    }

    rankingList.innerHTML = "";
    
    
ranking.forEach((u, i) => {
  const li = document.createElement("li");
  li.textContent = `${i + 1}. ${u.name} — ${u.count} bài`;
  
  
  li.style.cursor = "pointer";
  li.onclick = () => showUserSongs(u.name);
  
  if (u.name === myName) {
    li.style.fontWeight = "bold";
    li.style.color = "var(--accent-primary)";
  }
  rankingList.appendChild(li);
});

    const me = ranking.find(u => u.name === myName);
    currentUserRank.textContent = me
      ? `👤 Bạn (${myName}): đã thêm ${me.count} bài`
      : `👤 Bạn (${myName}): chưa thêm bài nào`;

    dialog.showModal();
    
  } catch (error) {
    console.error('Lỗi khi tải ranking:', error);
    rankingList.innerHTML = "<li style='color: #ef4444'>Lỗi khi tải dữ liệu</li>";
    dialog.showModal();
  }
};

loadSongs();

const YOUTUBE_API_KEY = "AIzaSyAS6c7bto_vvZ60g_FsdA60od3Fgw0y67g";

window.extractVideoId = function(url) {
  const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
  return match ? match[1] : null;
};

let isFetchingYoutube = false;

window.fetchYoutubeDate = async function(type) {
  if (isFetchingYoutube) return;
  isFetchingYoutube = true;
  
  const linkInput =
    type === 'add' ?
    document.getElementById('youtubeLinkAdd') :
    document.getElementById('youtubeLinkEdit');

  const dateInput =
    type === 'add' ?
    document.getElementById('releaseDate') :
    document.getElementById('editReleaseDate');

  const videoId = extractVideoId(linkInput.value.trim());
  if (!videoId) {
    isFetchingYoutube = false;
    return alert('Link YouTube không hợp lệ');
  }

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`
  );
  const data = await res.json();

  if (!data.items?.length) {
    alert('Không lấy được dữ liệu video');
    isFetchingYoutube = false;
    return;
  }

  const publishedAt = data.items[0].snippet.publishedAt;
  dateInput.value = publishedAt.substring(0, 10);
  isFetchingYoutube = false;
};

window.autoFindReleaseDate = async function() {
  const title = document.getElementById('songName').value.trim();
  const artist = document.getElementById('artist').value.trim();
  const dateInput = document.getElementById('releaseDate');

  if (!title) {
    alert('Vui lòng nhập tên bài hát trước');
    return;
  }

  const keyword = `${title} ${artist}`.trim();

  try {
    const searchRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search` +
      `?part=snippet&type=video&maxResults=1` +
      `&q=${encodeURIComponent(keyword)}` +
      `&key=${YOUTUBE_API_KEY}`
    );
    const searchData = await searchRes.json();

    if (!searchData.items?.length) {
      alert('Không tìm thấy video phù hợp');
      return;
    }

    const videoId = searchData.items[0].id.videoId;

    const videoRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos` +
      `?part=snippet&id=${videoId}` +
      `&key=${YOUTUBE_API_KEY}`
    );
    const videoData = await videoRes.json();

    if (!videoData.items?.length) {
      alert('Không lấy được ngày phát hành');
      return;
    }

    const publishedAt = videoData.items[0].snippet.publishedAt;
    dateInput.value = publishedAt.substring(0, 10);

  } catch (e) {
    console.error(e);
    alert('Lỗi khi tự tìm ngày phát hành');
  }
};

let currentUser = null;

async function checkAuth() {
  const {
    data: {
      session
    }
  } = await supabase.auth.getSession();
  if (session) {
    currentUser = session.user;
    await loadUserProfile();
    updateAuthUI(true);
  } else {
    updateAuthUI(false);
  }
}

async function loadUserProfile() {
  if (!currentUser) return;

  const {
    data,
    error
  } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', currentUser.id)
    .single();

  if (data) {
    const roleColors = {
      'Admin': '#ef4444',
      'Moderator': '#f59e0b',
      'Member': '#3b82f6',
      'Ủa': 'purple',
      'Jack': 'purple',
      'Bố con': 'purple',
      'Skibidi': 'purple',
      'Bồn cầu': 'purple',
      'WTF': 'purple',
      'Admin fake': 'purple',
      'Phép thuật winx enchantix biến hình': 'purple',
    };

    const roleColor = roleColors[data.role] || '#6b7280';

    document.getElementById('userDisplayName').innerHTML = `
              ${data.display_name} 
              <span style="
                  background: ${roleColor}; 
                  padding: 4px 10px; 
                  border-radius: 6px; 
                  font-size: 18px; 
                  font-weight: 600;
                  margin-left: 8px;
                  color: white;
              " id="role" onclick="roleCheck()">${data.role}</span>
          `;

    window.currentUserRole = data.role;
    
    
    if (window._songs && window._songs.length > 0) {
      renderSongs(window._songs);
    }
  }

 await loadStreakCard();
}

function updateAuthUI(isLoggedIn) {
  const authButtons = document.getElementById('authButtons');
  const userInfo = document.getElementById('userInfo');

  if (authButtons && userInfo) {
    authButtons.style.display = isLoggedIn ? 'none' : 'flex';
    userInfo.style.display = isLoggedIn ? 'flex' : 'none';
  }
}

document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  document.querySelectorAll('#registerForm .error').forEach(el => el.textContent = '');

  const displayName = document.getElementById('regDisplayName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const phone = document.getElementById('regPhone').value.trim();
  const password = document.getElementById('regPassword').value;
  const confirmPassword = document.getElementById('regConfirmPassword').value;

  let isValid = true;

  if (displayName.length < 3) {
    document.getElementById('error-regDisplayName').textContent = 'Tên hiển thị quá ngắn (tối thiểu 3 ký tự)';
    isValid = false;
  }

  
  const { data: existingUsers, error: checkError } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('display_name', displayName);

  if (checkError) {
    console.error('Lỗi kiểm tra tên:', checkError);
  } else if (existingUsers && existingUsers.length > 0) {
    document.getElementById('error-regDisplayName').textContent = 'Tên này đã được sử dụng! Vui lòng chọn tên khác.';
    isValid = false;
  }

  const phoneRegex = /^0\d{9}$/;
  if (!phoneRegex.test(phone)) {
    document.getElementById('error-regPhone').textContent = 'Số điện thoại không hợp lệ (VD: 0912345678)';
    isValid = false;
  }

  if (password.length < 6) {
    document.getElementById('error-regPassword').textContent = 'Mật khẩu phải có ít nhất 6 ký tự';
    isValid = false;
  }

  if (password !== confirmPassword) {
    document.getElementById('error-regConfirmPassword').textContent = 'Mật khẩu không khớp';
    isValid = false;
  }

  if (!isValid) return;

  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          display_name: displayName,
          phone: phone
        },
        emailRedirectTo: window.location.origin
      }
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        alert('Email này đã được đăng ký!');
      } else {
        alert('Lỗi đăng ký: ' + authError.message);
      }
      return;
    }

    if (!authData.user) {
      alert('Lỗi: Không tạo được tài khoản');
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', authData.user.id)
      .single();

    if (!existingProfile) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: authData.user.id,
          display_name: displayName,
          email: email,
          phone: phone,
          role: 'Member'
        }]);

      if (profileError) {
        console.error('Lỗi tạo profile:', profileError);
        alert('Tài khoản đã tạo nhưng có lỗi với profile. Vui lòng đăng nhập và cập nhật thông tin.');
        document.getElementById('registerForm').reset();
        registerDialog.close();
        return;
      }
    }

    currentUser = authData.user;
    await loadUserProfile();
    updateAuthUI(true);

    alert('Đăng ký thành công! Chào mừng bạn đến với ntdMUSIC! 🎵');
    document.getElementById('registerForm').reset();
    registerDialog.close();
    
  } catch (error) {
    console.error('Lỗi:', error);
    alert('Có lỗi xảy ra: ' + error.message);
  }
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  const {
    data,
    error
  } = await supabase.auth.signInWithPassword({
    email: email,
    password: password
  });

  if (error) {
    if (error.message === "Invalid login credentials") {
      alert('Lỗi đăng nhập: Thông tin đăng nhập sai!');
    } else (
      alert('Lỗi đăng nhập: '+error.messages)
    ) 
    return;
  }

  currentUser = data.user;
  await loadUserProfile();
  updateAuthUI(true);

  document.getElementById('loginForm').reset();
  loginDialog.close();

  alert('Đăng nhập thành công!');
  loadSongs(); 
});

window.handleLogout = async function() {
  if (!confirm('Bạn có chắc muốn đăng xuất?')) return;

  await supabase.auth.signOut();
  currentUser = null;
  updateAuthUI(false);
  alert('Đã đăng xuất!');
  loadSongs();
  updateStreakCard(0);
  location.reload()
};

supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    currentUser = session.user;
    loadUserProfile();
    updateAuthUI(true);
  } else if (event === 'SIGNED_OUT') {
    currentUser = null;
    updateAuthUI(false);
  }
});

let currentmfySong = null; 

function updateStats(songs) {
  
  document.getElementById('totalSongs').textContent = songs.length;
  
  
  const now = new Date();
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
  const mfyIndex = dayOfYear % songs.length;
  const mfySong = songs[mfyIndex];
  
  if (mfySong) {
    currentmfySong = mfySong; 
    document.getElementById('mfySong').textContent = mfySong['Tên'];
    
    
    const iconEl = document.querySelector('.mfy-card .stat-icon');
    if (mfySong.avatar) {
      iconEl.innerHTML = `<img src="${mfySong.avatar}" alt="avatar" style="width: 64px; height: 64px; border-radius: 12px; object-fit: cover; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">`;
    } else {
      iconEl.textContent = '⭐';
    }
    
    
    const lyricEl = document.getElementById('mfyLyric');
    
    if (mfySong['Lyric']) {
      
      const hotLines = mfySong['Lyric'].split('\n')
        .filter(line => line.includes('--hot'))
        .map(line => line.replace('--hot', '').trim());
      
      if (hotLines.length > 0) {
        
        lyricEl.innerHTML = '🔥 ' + hotLines.slice(0, 4).join('<br>🔥 ');
      } else {
        
        const lines = mfySong['Lyric'].split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0)
          .slice(0, 4);
        lyricEl.textContent = lines.join('\n');
      }
    } else {
      lyricEl.textContent = 'Chưa có lời bài hát';
    }
  } else {
    currentmfySong = null;
    document.getElementById('mfySong').textContent = '---';
    document.getElementById('mfyLyric').textContent = '';
    document.querySelector('.mfy-card .stat-icon').textContent = '⭐';
  }
}

window.showmfyDetail = function() {
  if (currentmfySong) {
    showLyric(currentmfySong.Id);
  }
};

window.openGopyDialog = async function() {
  if (!currentUser) {
    alert('Vui lòng đăng nhập để góp ý!');
    return;
  }
  
  
  const { data } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('id', currentUser.id)
    .single();
  
  if (data) {
    document.getElementById('gopyDisplayName').value = data.display_name;
  }
  
  
  document.getElementById('gopyTieude').value = '';
  document.getElementById('gopyNoidung').value = '';
  document.querySelectorAll('#gopyForm .error').forEach(el => el.textContent = '');
  
  viewProfileDialog.close();
  
document.getElementById('gopyWantReply').checked = false;
document.getElementById('gopyEmailGroup').style.display = 'none';
document.getElementById('gopyEmail').value = '';
  gopyDialog.showModal();
};


document.getElementById('gopyWantReply').addEventListener('change', async function() {
  const emailGroup = document.getElementById('gopyEmailGroup');
  const emailInput = document.getElementById('gopyEmail');
  
  emailGroup.style.display = this.checked ? 'block' : 'none';
  
  if (this.checked) {
    
    if (currentUser && currentUser.email) {
      emailInput.value = currentUser.email;
    }
  } else {
    
    emailInput.value = '';
    document.getElementById('error-gopyEmail').textContent = '';
  }
});

document.getElementById('gopyForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  
  document.querySelectorAll('#gopyForm .error').forEach(el => el.textContent = '');
  
  const tieude = document.getElementById('gopyTieude').value.trim();
  const noidung = document.getElementById('gopyNoidung').value.trim();
  const displayName = document.getElementById('gopyDisplayName').value;
  const wantReply = document.getElementById('gopyWantReply').checked;
const email = document.getElementById('gopyEmail').value.trim();
  
  let isValid = true;
  
  if (!tieude) {
    document.getElementById('error-gopyTieude').textContent = 'Vui lòng nhập tiêu đề';
    isValid = false;
  }
  
  if (!noidung) {
    document.getElementById('error-gopyNoidung').textContent = 'Vui lòng nhập nội dung';
    isValid = false;
  }

  if (wantReply && !email) {
    document.getElementById('error-gopyEmail').textContent = 'Vui lòng nhập email để nhận phản hồi';
    isValid = false;
  }
  
  if (!isValid) return;
  
  try {
    const { error } = await supabase
  .from('gopy')
  .insert([{
    display_name: displayName,
    tieude: tieude,
    noidung: noidung,
    want_reply: wantReply,
    reply_email: wantReply ? email : null
  }]);
    
    if (error) throw error;
    
    alert('Cảm ơn bạn đã góp ý! 💬\nChúng tôi sẽ xem xét và phản hồi sớm nhất.');
    gopyDialog.close();
    
  } catch (error) {
    console.error('Lỗi khi gửi góp ý:', error);
    alert('Có lỗi xảy ra: ' + error.message);
  }
});


gopyDialog.addEventListener('click', (e) => {
  if (e.target === gopyDialog) {
    gopyDialog.close();
  }
});


window.showUserSongs = async function(userName) {
  const dialog = document.getElementById("userSongsDialog");
  const nameEl = document.getElementById("userSongsName");
  const statsEl = document.getElementById("userSongsStats");
  const listEl = document.getElementById("userSongsList");
  
  if (!dialog || !nameEl || !statsEl || !listEl) {
    console.error('Không tìm thấy elements');
    return;
  }
  
  nameEl.textContent = userName;
  listEl.innerHTML = "<div style='text-align: center; padding: 20px; color: var(--text-muted);'>Đang tải...</div>";
  
  try {
    
    const { data: userSongs, error } = await supabase
      .from('songs')
      .select('*')
      .eq('add_by', userName)
      .eq('Xác minh', true)
      .order('Ngày phát hành', { ascending: false });
    
    if (error) throw error;
    
    
    statsEl.innerHTML = `📊 Tổng số bài đã thêm: <span style="color: var(--accent-primary); font-size: 20px;">${userSongs.length}</span> bài`;
    
    
    if (userSongs.length === 0) {
      listEl.innerHTML = "<div style='text-align: center; padding: 40px; color: var(--text-muted);'>Chưa có bài hát nào được xác minh</div>";
    } else {
      
listEl.innerHTML = userSongs.map(song => {
  
  const addedDate = song['Ngày thêm'] 
    ? new Date(song['Ngày thêm']).toLocaleDateString('vi-VN', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
      })
    : 'N/A';
  
  return `
    <div class="user-song-item" onclick="showLyric(${song.Id})">
      ${song.avatar ? `<img src="${song.avatar}" alt="avatar">` : '<div style="width: 50px; height: 50px; background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 24px;">🎵</div>'}
      <div class="user-song-info">
        <div class="user-song-title">${song['Tên']}</div>
        <div class="user-song-artist">${song['Ca sĩ']}</div>
      </div>
      <div class="user-song-date">📅 ${addedDate}</div>
    </div>
  `;
}).join('');
    }
    
    dialog.showModal();
    
  } catch (error) {
    console.error('Lỗi khi tải bài hát:', error);
    listEl.innerHTML = "<div style='text-align: center; padding: 20px; color: #ef4444;'>❌ Lỗi khi tải dữ liệu</div>";
    dialog.showModal();
  }
};




function getVietnamDate() {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const vnTime = new Date(utc + (3600000 * 7));
  return vnTime.toISOString().split('T')[0]; 
}


function daysDifference(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}


window.checkStreak = async function() {
  if (!currentUser) {
    alert('Vui lòng đăng nhập để sử dụng tính năng này!');
    return;
  }

  try {
    
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('Streak, "Ngày cuối"')
      .eq('id', currentUser.id)
      .single();

    if (fetchError) throw fetchError;

    const today = getVietnamDate();
    const lastDate = profile['Ngày cuối'];
    let currentStreak = profile.Streak || 0;

    
    if (!lastDate) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          Streak: 1,
          'Ngày cuối': today
        })
        .eq('id', currentUser.id);

      if (updateError) throw updateError;

      alert('🎉 Chúc mừng!\nBạn đã bắt đầu streak!\n\n🔥 Streak hiện tại: 1 ngày');
      updateStreakCard(1);
      return;
    }

    
    if (lastDate === today) {
      alert(`✅ Bạn đã điểm danh hôm nay rồi!\n\n🔥 Streak hiện tại: ${currentStreak} ngày\n💪 Hãy quay lại vào ngày mai!`);
      return;
    }

    
    const daysDiff = daysDifference(lastDate, today);

    
    if (daysDiff === 1) {
      const newStreak = currentStreak + 1;
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          Streak: newStreak,
          'Ngày cuối': today
        })
        .eq('id', currentUser.id);

      if (updateError) throw updateError;

      alert(`🎉 Điểm danh thành công!\n\n🔥 Streak mới: ${newStreak} ngày\n⭐ Tiếp tục phát huy!`);
      updateStreakCard(newStreak);
      
    } else {
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          Streak: 1,
          'Ngày cuối': today
        })
        .eq('id', currentUser.id);

      if (updateError) throw updateError;

      alert(`😢 Rất tiếc!\nBạn đã bỏ lỡ ${daysDiff - 1} ngày.\n\nStreak đã được reset về 1.\n💪 Hãy cố gắng duy trì streak mới!`);
      updateStreakCard(1);;
    }

  } catch (error) {
    console.error('Lỗi khi cập nhật streak:', error);
    alert('Có lỗi xảy ra: ' + error.message);
  }
};


function updateStreakDisplay(streakCount) {
  const streakText = document.getElementById('streakText');
  if (streakText) {
    streakText.innerHTML = `Điểm danh <span style="color: var(--accent-primary); font-weight: 700;">(${streakCount} 🔥)</span>`;
  }
}



async function loadStreakCard() {
  if (!currentUser) {
    updateStreakCard(0);
    return;
  }

  try {
    const { data } = await supabase
      .from('profiles')
      .select('Streak')
      .eq('id', currentUser.id)
      .single();

    if (data) {
      const streak = data.Streak || 0;
      updateStreakCard(streak);
      updateStreakDisplay(streak); 
    } else {
      updateStreakCard(0);
    }
  } catch (error) {
    console.error('Lỗi khi tải streak:', error);
    updateStreakCard(0);
  }
}


function getStreakTitle(streak) {
  if (streak < 0) return 'Hack';
  if (streak === 0) return 'Con gà';
  if (streak < 7) return 'Noob';
  if (streak < 30) return 'Beginner';
  if (streak < 50) return 'Amateur';
  if (streak < 100) return 'Pro';
  if (streak < 150) return 'Master';
  if (streak < 200) return 'Legend';
  if (streak < 365) return 'Mythical';
  return 'GOD';
}


function updateStreakCard(streakCount) {
  const streakLabel = document.getElementById('streakLabel');
  const streakValue = document.getElementById('streakValue');
  
  if (streakLabel && streakValue) {
    streakLabel.textContent = getStreakTitle(streakCount);
    streakValue.textContent = `${streakCount}`;
  }
}

checkAuth();


window.viewProfileDialog.addEventListener('click', async (e) => {
  if (e.target !== viewProfileDialog) return;
  viewProfileDialog.close();
});

window.showViewProfile = async function() {
  if (!currentUser) return;

  const {
    data
  } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', currentUser.id)
    .single();

  if (data) {
    document.getElementById('viewDisplayName').textContent = data.display_name;
    document.getElementById('viewEmail').textContent = currentUser.email;
    document.getElementById('viewPhone').textContent = data.phone || 'Chưa cập nhật';
    document.getElementById('viewRole').textContent = data.role;
  }

  viewProfileDialog.showModal();
}

window.openEditProfileDialog = async function() {
  viewProfileDialog.close();

  const {
    data
  } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', currentUser.id)
    .single();

  if (data) {
    document.getElementById('editDisplayName').value = data.display_name;
    document.getElementById('editPhone').value = data.phone || '';
  }

  document.getElementById('oldPassword').value = '';
  document.getElementById('newPassword').value = '';
  document.getElementById('confirmNewPassword').value = '';

  document.querySelectorAll('#editProfileForm .error').forEach(el => el.textContent = '');

  editProfileDialog.showModal();
}

document.getElementById('editProfileForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  document.querySelectorAll('#editProfileForm .error').forEach(el => el.textContent = '');

  const displayName = document.getElementById('editDisplayName').value.trim();
  const phone = document.getElementById('editPhone').value.trim();
  const oldPassword = document.getElementById('oldPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmNewPassword = document.getElementById('confirmNewPassword').value;

  let isValid = true;

  if (displayName.length < 3) {
    document.getElementById('error-editDisplayName').textContent = 'Tên hiển thị quá ngắn (tối thiểu 3 ký tự)';
    isValid = false;
  }

  
  const { data: existingUsers, error: checkError } = await supabase
    .from('profiles')
    .select('id, display_name')
    .eq('display_name', displayName);

  if (checkError) {
    console.error('Lỗi kiểm tra tên:', checkError);
  } else if (existingUsers && existingUsers.length > 0) {
    
    const isDuplicate = existingUsers.some(user => user.id !== currentUser.id);
    if (isDuplicate) {
      document.getElementById('error-editDisplayName').textContent = 'Tên này đã được sử dụng bởi người khác!';
      isValid = false;
    }
  }

  const phoneRegex = /^0\d{9}$/;
  if (!phoneRegex.test(phone)) {
    document.getElementById('error-editPhone').textContent = 'Số điện thoại không hợp lệ (VD: 0912345678)';
    isValid = false;
  }

  if (oldPassword || newPassword || confirmNewPassword) {
    if (!oldPassword) {
      document.getElementById('error-oldPassword').textContent = 'Vui lòng nhập mật khẩu cũ';
      isValid = false;
    }
    if (!newPassword) {
      document.getElementById('error-newPassword').textContent = 'Vui lòng nhập mật khẩu mới';
      isValid = false;
    } else if (newPassword.length < 6) {
      document.getElementById('error-newPassword').textContent = 'Mật khẩu phải có ít nhất 6 ký tự';
      isValid = false;
    }
    if (newPassword !== confirmNewPassword) {
      document.getElementById('error-confirmNewPassword').textContent = 'Mật khẩu không khớp';
      isValid = false;
    }
  }

  if (!isValid) return;

  try {
    const {
      error: updateError
    } = await supabase
      .from('profiles')
      .update({
        display_name: displayName,
        phone: phone
      })
      .eq('id', currentUser.id);

    if (updateError) throw updateError;

    if (oldPassword && newPassword) {
      const {
        error: signInError
      } = await supabase.auth.signInWithPassword({
        email: currentUser.email,
        password: oldPassword
      });

      if (signInError) {
        document.getElementById('error-oldPassword').textContent = 'Mật khẩu cũ không đúng';
        return;
      }

      const {
        error: passwordError
      } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (passwordError) throw passwordError;

      alert('Cập nhật thông tin và mật khẩu thành công! 🎉');
    } else {
      alert('Cập nhật thông tin thành công! ✅');
    }

    await loadUserProfile();
    editProfileDialog.close();

  } catch (error) {
    console.error(error);
    alert('Lỗi khi cập nhật: ' + error.message);
  }
});
