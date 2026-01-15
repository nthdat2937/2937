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

function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  const icon = document.getElementById('themeIcon');
  const sidebarIcon = document.getElementById('themeIconSidebar'); // THÊM DÒNG NÀY

  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);

  if (newTheme === 'light') {
    icon.className = 'fa-solid fa-sun';
    if (sidebarIcon) sidebarIcon.className = 'fa-solid fa-sun'; // THÊM DÒNG NÀY
  } else {
    icon.className = 'fa-solid fa-moon';
    if (sidebarIcon) sidebarIcon.className = 'fa-solid fa-moon'; // THÊM DÒNG NÀY
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