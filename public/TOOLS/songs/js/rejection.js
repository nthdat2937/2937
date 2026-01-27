// ===== REJECTION FEATURE =====
// Tính năng từ chối bài hát với lý do

import { supabase } from './supabase-client.js';

// Mở dialog từ chối
window.openRejectDialog = function(songId) {
  window.currentRejectSongId = songId;
  
  // Reset form
  document.getElementById('rejectReason').value = '';
  document.getElementById('error-rejectReason').textContent = '';
  
  rejectDialog.showModal();
};

// Xử lý form từ chối
document.getElementById('rejectForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const reason = document.getElementById('rejectReason').value.trim();
  const songId = window.currentRejectSongId;
  
  // Validate
  if (!reason) {
    document.getElementById('error-rejectReason').textContent = 'Vui lòng nhập lý do từ chối';
    return;
  }
  
  if (reason.length < 10) {
    document.getElementById('error-rejectReason').textContent = 'Lý do quá ngắn (tối thiểu 10 ký tự)';
    return;
  }
  
  // Xác nhận
  if (!confirm('Bạn chắc chắn muốn từ chối bài hát này?')) return;
  
  try {
    // Update bài hát với trạng thái từ chối
    const { error } = await supabase
      .from('songs')
      .update({
        'Xác minh': false,
        'rejection_status': 'rejected',
        'rejection_reason': reason,
        'rejected_at': new Date().toISOString(),
        'rejected_by': window.currentUser.id
      })
      .eq('Id', songId);
    
    if (error) throw error;
    
    alert('✅ Đã từ chối bài hát!');
    rejectDialog.close();
    
    // Reload danh sách
    if (window.loadSongs) window.loadSongs();
    if (window.openPendingSongsDialog) window.openPendingSongsDialog();
    
  } catch (error) {
    console.error('Error rejecting song:', error);
    alert('❌ Có lỗi xảy ra: ' + error.message);
  }
});

// Đóng dialog khi click outside
rejectDialog.addEventListener('click', (e) => {
  if (e.target === rejectDialog) {
    rejectDialog.close();
  }
});

// Hàm approve bài hát (giữ nguyên)
window.approveSong = async function(songId) {
  if (!window.currentUser) {
    alert('Vui lòng đăng nhập!');
    return;
  }
  
  if (window.currentUserRole !== 'Admin') {
    alert('Chỉ Admin mới có quyền duyệt bài!');
    return;
  }
  
  if (!confirm('Duyệt bài hát này?')) return;
  
  try {
    const { error } = await supabase
      .from('songs')
      .update({
        'Xác minh': true,
        'rejection_status': null,
        'rejection_reason': null,
        'approved_at': new Date().toISOString(),
        'approved_by': window.currentUser.id
      })
      .eq('Id', songId);
    
    if (error) throw error;
    
    alert('✅ Đã duyệt bài hát!');
    
    // Reload danh sách
    if (window.loadSongs) window.loadSongs();
    if (window.openPendingSongsDialog) window.openPendingSongsDialog();
    
  } catch (error) {
    console.error('Error approving song:', error);
    alert('❌ Có lỗi xảy ra: ' + error.message);
  }
};

// Mở dialog xem bài hát chờ duyệt và bị từ chối
window.openPendingSongsDialog = async function() {
  if (!window.currentUser) {
    alert('Vui lòng đăng nhập!');
    return;
  }
  
  if (window.currentUserRole !== 'Admin') {
    alert('Chỉ Admin mới có quyền xem danh sách này!');
    return;
  }
  
  try {
    // Lấy tất cả bài chưa verify
    const { data: songs, error } = await supabase
      .from('songs')
      .select('*')
      .eq('Xác minh', false)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Phân loại bài hát
    const pendingSongs = songs.filter(s => !s.rejection_status || s.rejection_status === 'pending');
    const rejectedSongs = songs.filter(s => s.rejection_status === 'rejected');
    
    // Update counts
    document.getElementById('pendingCount').textContent = pendingSongs.length;
    document.getElementById('rejectedCount').textContent = rejectedSongs.length;
    
    // Render pending songs
    const pendingList = document.getElementById('pendingList');
    if (pendingSongs.length === 0) {
      pendingList.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
          <i class="fa-solid fa-circle-check" style="font-size: 48px; margin-bottom: 16px; color: #10b981;"></i>
          <p>Không có bài hát nào chờ duyệt</p>
        </div>
      `;
    } else {
      pendingList.innerHTML = pendingSongs.map(song => `
        <div class="pending-song-item">
          <div class="pending-song-info">
            ${song.avatar 
              ? `<img src="${song.avatar}" alt="avatar" class="pending-song-avatar">` 
              : '<div class="pending-song-no-avatar">🎵</div>'
            }
            <div class="pending-song-details">
              <div class="pending-song-title">${song['Tên']}</div>
              <div class="pending-song-artist">${song['Ca sĩ']}</div>
              <div class="pending-song-meta">
                Người thêm: <strong>${song.add_by || 'Không rõ'}</strong> • 
                ${new Date(song.created_at).toLocaleDateString('vi-VN')}
              </div>
            </div>
          </div>
          <div class="pending-song-actions">
            <button 
              class="btn-approve" 
              onclick="approveSong(${song.Id})"
              title="Duyệt bài"
            >
              <i class="fa-solid fa-check"></i> Duyệt
            </button>
            <button 
              class="btn-reject" 
              onclick="openRejectDialog(${song.Id})"
              title="Từ chối"
            >
              <i class="fa-solid fa-xmark"></i> Từ chối
            </button>
            <button 
              class="btn-view" 
              onclick="showLyric(${song.Id})"
              title="Xem chi tiết"
            >
              <i class="fa-solid fa-eye"></i>
            </button>
          </div>
        </div>
      `).join('');
    }
    
    // Render rejected songs
    const rejectedList = document.getElementById('rejectedList');
    if (rejectedSongs.length === 0) {
      rejectedList.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
          <i class="fa-solid fa-circle-check" style="font-size: 48px; margin-bottom: 16px; color: #10b981;"></i>
          <p>Không có bài hát nào bị từ chối</p>
        </div>
      `;
    } else {
      rejectedList.innerHTML = rejectedSongs.map(song => `
        <div class="pending-song-item rejected">
          <div class="pending-song-info">
            ${song.avatar 
              ? `<img src="${song.avatar}" alt="avatar" class="pending-song-avatar">` 
              : '<div class="pending-song-no-avatar">🎵</div>'
            }
            <div class="pending-song-details">
              <div class="pending-song-title">${song['Tên']}</div>
              <div class="pending-song-artist">${song['Ca sĩ']}</div>
              <div class="pending-song-meta">
                Người thêm: <strong>${song.add_by || 'Không rõ'}</strong> • 
                ${new Date(song.created_at).toLocaleDateString('vi-VN')}
              </div>
              <div class="rejection-reason">
                <strong>Lý do:</strong> ${song.rejection_reason || 'Không có lý do'}
              </div>
            </div>
          </div>
          <div class="pending-song-actions">
            <button 
              class="btn-approve" 
              onclick="approveSong(${song.Id})"
              title="Duyệt lại"
            >
              <i class="fa-solid fa-rotate-left"></i> Duyệt lại
            </button>
            <button 
              class="btn-delete" 
              onclick="deleteSong(${song.Id})"
              title="Xóa vĩnh viễn"
            >
              <i class="fa-solid fa-trash"></i> Xóa
            </button>
            <button 
              class="btn-view" 
              onclick="showLyric(${song.Id})"
              title="Xem chi tiết"
            >
              <i class="fa-solid fa-eye"></i>
            </button>
          </div>
        </div>
      `).join('');
    }
    
    pendingSongsDialog.showModal();
    
  } catch (error) {
    console.error('Error loading pending songs:', error);
    alert('❌ Có lỗi xảy ra: ' + error.message);
  }
};

// Toggle giữa tab Chờ duyệt và Bị từ chối
window.switchPendingTab = function(tab) {
  const pendingTab = document.getElementById('pendingTab');
  const rejectedTab = document.getElementById('rejectedTab');
  const pendingContent = document.getElementById('pendingContent');
  const rejectedContent = document.getElementById('rejectedContent');
  
  if (tab === 'pending') {
    pendingTab.classList.add('active');
    rejectedTab.classList.remove('active');
    pendingContent.style.display = 'block';
    rejectedContent.style.display = 'none';
  } else {
    pendingTab.classList.remove('active');
    rejectedTab.classList.add('active');
    pendingContent.style.display = 'none';
    rejectedContent.style.display = 'block';
  }
};

// Đóng dialog khi click outside
pendingSongsDialog.addEventListener('click', (e) => {
  if (e.target === pendingSongsDialog) {
    pendingSongsDialog.close();
  }
});