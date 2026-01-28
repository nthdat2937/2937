// ===== BAN USER FEATURE =====

import { supabase } from './supabase-client.js';

// Kiểm tra user có bị ban không khi load trang
window.checkBanStatus = async function() {
  if (!window.currentUser) return;
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('ban, unban_date, reason_ban')
      .eq('id', window.currentUser.id)
      .single();
    
    if (error) throw error;
    
    // Nếu user bị ban
    if (data.ban) {
      // Kiểm tra xem đã hết hạn ban chưa
      if (data.unban_date) {
        const unbanDate = new Date(data.unban_date);
        const now = new Date();
        
        if (now >= unbanDate) {
          // Tự động unban
          await supabase
            .from('profiles')
            .update({ 
              ban: false, 
              unban_date: null, 
              reason_ban: null 
            })
            .eq('id', window.currentUser.id);
          
          return; // Không bị ban nữa
        }
      }
      
      // Vẫn còn bị ban - NGAY LẬP TỨC hiển thị trang ban và block mọi thứ
      setTimeout(() => {
        showBanPage(data.reason_ban, data.unban_date);
      }, 0);
      
      // Ngăn load tiếp các scripts khác
      throw new Error('ACCOUNT_BANNED');
    }
  } catch (error) {
    if (error.message === 'ACCOUNT_BANNED') {
      // Đã show ban page, không làm gì thêm
      throw error;
    }
    console.error('Error checking ban status:', error);
  }
};

// Function ngăn mọi hành động
function preventAllActions(e) {
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  return false;
}

// Hiển thị trang ban
function showBanPage(reason, unbanDate) {
  // Thêm class banned vào body để block mọi tương tác
  document.body.classList.add('banned');
  
  // Xóa hoàn toàn nội dung trang
  document.body.innerHTML = '';
  
  // Thêm inline CSS để đảm bảo styling luôn hoạt động
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from {
        transform: translateY(50px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    body.banned {
      overflow: hidden !important;
      pointer-events: none !important;
    }
    body.banned #banPage {
      pointer-events: auto !important;
    }
  `;
  document.head.appendChild(style);
  
  // Ngăn mọi sự kiện keyboard và mouse
  document.addEventListener('keydown', preventAllActions, true);
  document.addEventListener('click', preventAllActions, true);
  document.addEventListener('contextmenu', preventAllActions, true);
  document.addEventListener('mousedown', preventAllActions, true);
  document.addEventListener('mouseup', preventAllActions, true);
  
  // Ngăn F5, Ctrl+R, Ctrl+W
  window.onbeforeunload = function(e) {
    e.preventDefault();
    return "Tài khoản của bạn đã bị khóa.";
  };
  
  // Ngăn Ctrl+Shift+I, F12 (DevTools)
  document.addEventListener('keydown', function(e) {
    if (e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.key === 'U')) {
      e.preventDefault();
      return false;
    }
  });
  
  const unbanText = unbanDate 
    ? `Bạn sẽ được mở khóa vào: <strong>${new Date(unbanDate).toLocaleString('vi-VN')}</strong>` 
    : 'Tài khoản của bạn bị khóa vĩnh viễn';
  
  const banPage = document.createElement('div');
  banPage.id = 'banPage';
  banPage.style.cssText = `
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999999;
    animation: fadeIn 0.5s ease-in-out;
  `;
  
  banPage.innerHTML = `
    <div style="
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      padding: 48px;
      max-width: 600px;
      text-align: center;
      box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3);
      animation: slideUp 0.6s ease-out;
    ">
      <div style="
        width: 120px;
        height: 120px;
        background: linear-gradient(135deg, #ef4444, #dc2626);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 32px;
        box-shadow: 0 10px 40px rgba(239, 68, 68, 0.4);
        animation: pulse 2s infinite;
      ">
        <i class="fa-solid fa-ban" style="font-size: 64px; color: white;"></i>
      </div>
      
      <h1 style="
        font-size: 32px;
        font-weight: 800;
        color: #1f2937;
        margin: 0 0 16px 0;
      ">Tài khoản đã bị khóa</h1>
      
      <p style="
        font-size: 18px;
        color: #6b7280;
        margin: 0 0 32px 0;
        line-height: 1.6;
      ">${unbanText}</p>
      
      <div style="
        background: #fee2e2;
        border: 2px solid #ef4444;
        border-radius: 16px;
        padding: 24px;
        margin-bottom: 32px;
        text-align: left;
      ">
        <div style="
          font-size: 14px;
          font-weight: 700;
          color: #dc2626;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        ">Lý do:</div>
        <div style="
          font-size: 16px;
          color: #1f2937;
          line-height: 1.6;
          word-wrap: break-word;
        ">${reason || 'Không có lý do cụ thể'}</div>
      </div>
      
      <div style="
        background: #dbeafe;
        border: 2px solid #3b82f6;
        border-radius: 16px;
        padding: 24px;
        margin-bottom: 32px;
        text-align: left;
      ">
        <div style="
          font-size: 14px;
          font-weight: 700;
          color: #1e40af;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        ">
          <i class="fa-solid fa-circle-info"></i>
          <span>Thông tin liên hệ</span>
        </div>
        <div style="
          font-size: 15px;
          color: #1f2937;
          line-height: 1.8;
        ">
          Nếu bạn cho rằng đây là nhầm lẫn hoặc muốn khiếu nại, vui lòng liên hệ:<br>
          <strong style="color: #3b82f6;">
            <i class="fa-solid fa-envelope"></i> nthdat.2937@gmail.com
          </strong>
        </div>
      </div>
      
      <div style="
        font-size: 13px;
        color: #9ca3af;
        margin-top: 24px;
        word-wrap: break-word;
      ">
        Email: <strong>${window.currentUser ? window.currentUser.email : 'N/A'}</strong>
      </div>
      
      <div style="
        margin-top: 24px;
        padding-top: 24px;
        border-top: 1px solid rgba(0,0,0,0.1);
        font-size: 12px;
        color: #9ca3af;
      ">
        <i class="fa-solid fa-lock"></i> Bạn không thể đăng xuất hay thực hiện bất kỳ thao tác nào khác trên hệ thống.
      </div>
    </div>
  `;
  
  document.body.appendChild(banPage);
  
  // Disable tất cả console methods để ngăn debug
  if (typeof console !== 'undefined') {
    const noop = function() {};
    ['log', 'warn', 'error', 'info', 'debug'].forEach(method => {
      console[method] = noop;
    });
  }
}

// Mở dialog danh sách user
window.openUsersDialog = async function() {
  if (!window.currentUser) {
    alert('Vui lòng đăng nhập!');
    return;
  }
  
  try {
    // Lấy danh sách user
    const { data: users, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Lấy tất cả bài hát
    const { data: songs, error: songsError } = await supabase
      .from('songs')
      .select('add_by');
    
    if (songsError) throw songsError;
    
    // Đếm số bài hát của mỗi user
    const songCounts = {};
    if (songs) {
      songs.forEach(song => {
        if (song.add_by_id) {
          songCounts[song.add_by_id] = (songCounts[song.add_by_id] || 0) + 1;
        }
      });
    }
    
    // Render danh sách
    const userList = document.getElementById('userList');
    if (!userList) {
      console.error('userList element not found');
      return;
    }
    
    userList.innerHTML = users.map(user => {
      const songCount = songCounts[user.id] || 0;
      const isBanned = user.ban;
      const isCurrentUser = user.id === window.currentUser.id;
      const canBan = window.currentUserRole === 'Admin' && !isCurrentUser;
      
      return `
        <div class="user-item ${isBanned ? 'banned' : ''}">
          <div class="user-info">
            <div class="user-avatar">
              ${user.full_name ? user.full_name.charAt(0).toUpperCase() : user.email ? user.email.charAt(0).toUpperCase() : '?'}
            </div>
            <div class="user-details">
              <div class="user-name">
                ${user.full_name || user.display_name || 'Chưa cập nhật'}
                ${isCurrentUser ? '<span class="user-badge me">Bạn</span>' : ''}
                ${user.role === 'Admin' ? '<span class="user-badge admin">Admin</span>' : ''}
                ${isBanned ? '<span class="user-badge banned">BỊ KHÓA</span>' : ''}
              </div>
              <div class="user-meta">
                Email: ${canBan ? user.email : 'Không thể xem!'}
              </div>
              <div class="user-meta">
                SĐT: ${canBan ? user.phone : user.phone.slice(0, 3) + '*****' + user.phone.slice(-2)}
              </div>
              ${isBanned && user.reason_ban ? `
                <div class="user-ban-reason">
                  <i class="fa-solid fa-triangle-exclamation"></i> 
                  ${user.reason_ban}
                </div>
              ` : ''}
              ${isBanned && user.unban_date ? `
                <div class="user-unban-date">
                  Mở khóa: ${new Date(user.unban_date).toLocaleString('vi-VN')}
                </div>
              ` : ''}
            </div>
          </div>
          ${canBan ? `
            <div class="user-actions">
              ${isBanned ? `
                <button 
                  class="btn-unban" 
                  onclick="unbanUser('${user.id}')"
                  title="Mở khóa tài khoản"
                >
                  <i class="fa-solid fa-unlock"></i> Mở khóa
                </button>
              ` : `
                <button 
                  class="btn-ban" 
                  onclick="openBanDialog('${user.id}', '${(user.full_name || user.display_name || user.email).replace(/'/g, "\\'")}')"
                  title="Khóa tài khoản"
                >
                  <i class="fa-solid fa-ban"></i> Khóa
                </button>
              `}
            </div>
          ` : ''}
        </div>
      `;
    }).join('');
    
    const userCountEl = document.getElementById('userCount');
    if (userCountEl) {
      userCountEl.textContent = users.length;
    }
    
    const usersDialog = document.getElementById('usersDialog');
    if (usersDialog) {
      usersDialog.showModal();
    }
    
  } catch (error) {
    console.error('Error loading users:', error);
    alert('❌ Có lỗi xảy ra: ' + error.message);
  }
};

// Mở dialog ban user
window.openBanDialog = function(userId, userName) {
  window.currentBanUserId = userId;
  const banUserNameEl = document.getElementById('banUserName');
  if (banUserNameEl) {
    banUserNameEl.textContent = userName;
  }
  
  // Reset form
  document.getElementById('banReason').value = '';
  document.getElementById('banDuration').value = '7';
  document.getElementById('permanentBan').checked = false;
  document.getElementById('error-banReason').textContent = '';
  
  // Show duration group
  const durationGroup = document.getElementById('banDurationGroup');
  if (durationGroup) {
    durationGroup.style.display = 'block';
  }
  
  const banDialog = document.getElementById('banDialog');
  if (banDialog) {
    banDialog.showModal();
  }
};

// Xử lý form ban
const banForm = document.getElementById('banForm');
if (banForm) {
  banForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const reason = document.getElementById('banReason').value.trim();
    const duration = document.getElementById('banDuration').value;
    const isPermanent = document.getElementById('permanentBan').checked;
    const userId = window.currentBanUserId;
    
    // Validate
    if (!reason) {
      document.getElementById('error-banReason').textContent = 'Vui lòng nhập lý do khóa';
      return;
    }
    
    if (reason.length < 10) {
      document.getElementById('error-banReason').textContent = 'Lý do quá ngắn (tối thiểu 10 ký tự)';
      return;
    }
    
    // Xác nhận
    if (!confirm('Bạn chắc chắn muốn khóa tài khoản này?')) return;
    
    try {
      let unbanDate = null;
      
      if (!isPermanent) {
        unbanDate = new Date();
        unbanDate.setDate(unbanDate.getDate() + parseInt(duration));
      }
      
      // Update user status
      const { error } = await supabase
        .from('profiles')
        .update({
          ban: true,
          reason_ban: reason,
          unban_date: unbanDate ? unbanDate.toISOString() : null
        })
        .eq('id', userId);
      
      if (error) throw error;
      
      alert('✅ Đã khóa tài khoản!');
      const banDialog = document.getElementById('banDialog');
      if (banDialog) {
        banDialog.close();
      }
      
      // Reload danh sách
      if (window.openUsersDialog) window.openUsersDialog();
      
    } catch (error) {
      console.error('Error banning user:', error);
      alert('❌ Có lỗi xảy ra: ' + error.message);
    }
  });
}

// Unban user
window.unbanUser = async function(userId) {
  if (!confirm('Bạn chắc chắn muốn mở khóa tài khoản này?')) return;
  
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        ban: false,
        reason_ban: null,
        unban_date: null
      })
      .eq('id', userId);
    
    if (error) throw error;
    
    alert('✅ Đã mở khóa tài khoản!');
    
    // Reload danh sách
    if (window.openUsersDialog) window.openUsersDialog();
    
  } catch (error) {
    console.error('Error unbanning user:', error);
    alert('❌ Có lỗi xảy ra: ' + error.message);
  }
};

// Toggle permanent ban checkbox
const permanentBanCheckbox = document.getElementById('permanentBan');
if (permanentBanCheckbox) {
  permanentBanCheckbox.addEventListener('change', (e) => {
    const durationGroup = document.getElementById('banDurationGroup');
    if (durationGroup) {
      if (e.target.checked) {
        durationGroup.style.display = 'none';
      } else {
        durationGroup.style.display = 'block';
      }
    }
  });
}

// Đóng dialog khi click outside
const usersDialog = document.getElementById('usersDialog');
if (usersDialog) {
  usersDialog.addEventListener('click', (e) => {
    if (e.target === usersDialog) {
      usersDialog.close();
    }
  });
}

const banDialog = document.getElementById('banDialog');
if (banDialog) {
  banDialog.addEventListener('click', (e) => {
    if (e.target === banDialog) {
      banDialog.close();
    }
  });
}