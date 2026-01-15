const UPDATES = [
    // {
    //     version: "",
    //     date: "",
    //     type: "",
    //     title: "",
    //     description: ""
    // },
    {
        version: "1.05",
        date: "2025-01-15",
        type: "update",
        title: "Thêm hướng dẫn sử dụng",
        description: "Bạn có thể đọc qua hướng dẫn sử dụng trang web trong phần MENU",
        action: `document.getElementById('btn-menu').click()`
    },
    {
      version: "1.04",
      date: "2025-01-15",
      type: "feature",
      title: "Thêm tính năng Streak",
      description: "Từ nay bạn có thể ghi lại hành trình SỐNG liên tục của mình bằng tính năng STREAK",
      action: `document.getElementById('btn-menu').click()`
    },
    {
      version: "1.03",
      date: "2025-01-15",
      type: "feature", // "feature", "bug", "update", "important"
      title: "Hệ thống thông báo cập nhật",
      description: "Thêm banner thông báo cập nhật ở đầu trang"
    },
    {
      version: "1.02",
      date: "2025-01-15",
      type: "important",
      title: "Fix lag",
      description: "Fix lỗi chồng animation và xoá những hàm không cần thiết"
    },
    {
      version: "1.00",
      date: "2025-01-05",
      type: "important",
      title: "Khởi đầu",
      description: "Ngày khởi tạo và chạy chính thức"
    },
  ];

  // Icon theo loại update
const UPDATE_ICONS = {
    feature: `<i class="fa-solid fa-star"></i>`,
    bug: `<i class="fa-solid fa-worm"></i>`, 
    update: `<i class="fa-solid fa-arrow-rotate-right"></i>`,
    important: `<i class="fa-solid fa-exclamation"></i>`
  };
  
  // Màu theo loại update
  const UPDATE_COLORS = {
    feature: "#10b981",
    bug: "#ef4444",
    update: "#3b82f6", 
    important: "#f59e0b"
  };
  
  // Tạo HTML cho update banner
  function createUpdateBanner() {
    if (UPDATES.length === 0) return;
    
    const latestUpdate = UPDATES[0];
    const icon = UPDATE_ICONS[latestUpdate.type] || "📢";
    const color = UPDATE_COLORS[latestUpdate.type];
    
    const banner = document.createElement('div');
    banner.id = 'updateBanner';
    banner.style.cssText = `
      background: linear-gradient(135deg, ${color}15, ${color}08);
      border-bottom: 1px solid ${color}40;
      padding: 12px 32px;
      display: flex;
      align-items: center;
      gap: 16px;
      position: sticky;
      top: 0;
      z-index: 99;
      backdrop-filter: blur(20px);
      animation: slideDown 0.5s ease;
    `;
    
    banner.innerHTML = `
      <span style="font-size: 24px; filter: drop-shadow(0 2px 8px ${color}60);">${icon}</span>
      <div style="flex: 1; display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
        <span style="
          background: ${color};
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.5px;
        ">v${latestUpdate.version}</span>
        <span style="
          color: var(--text-primary);
          font-weight: 600;
          font-size: 15px;
        ">${latestUpdate.title}</span>
        <span style="
          color: var(--text-muted);
          font-size: 13px;
        ">${latestUpdate.description}</span>
        <span style="
          color: var(--text-muted);
          font-size: 12px;
          margin-left: auto;
        ">${formatDate(latestUpdate.date)}</span>
      </div>
      <button id="viewAllUpdates" style="
        background: ${color}20;
        border: 1px solid ${color}40;
        color: ${color};
        padding: 8px 16px;
        border-radius: 10px;
        cursor: pointer;
        font-weight: 600;
        font-size: 13px;
        transition: all 0.3s;
        white-space: nowrap;
      ">Xem tất cả</button>
      <button id="closeBanner" style="
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid var(--glass-border);
        color: var(--text-primary);
        width: 32px;
        height: 32px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 16px;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
      ">×</button>
    `;
    
    // Thêm animation CSS
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-100%);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      #viewAllUpdates:hover {
        background: ${color}30;
        border-color: ${color};
        transform: translateY(-2px);
        box-shadow: 0 4px 12px ${color}40;
      }
      
      #closeBanner:hover {
        background: #ef4444;
        border-color: transparent;
        transform: rotate(90deg) scale(1.1);
        box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
      }
      
      @media screen and (max-width: 1300px) {
        #updateBanner {
          padding: 12px 16px !important;
          font-size: 13px;
        }
        
        #updateBanner > div > span:nth-child(4) {
          display: none;
        }
      }
      
      @media screen and (max-width: 480px) {
        #updateBanner {
          padding: 10px 12px !important;
        }
        
        #updateBanner > span:first-child {
          font-size: 20px !important;
        }
        
        #updateBanner > div {
          flex-direction: column;
          align-items: flex-start !important;
          gap: 6px !important;
        }
        
        #viewAllUpdates {
          font-size: 12px !important;
          padding: 6px 12px !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    // Chèn banner vào đầu body
    document.body.insertBefore(banner, document.body.firstChild);
    
    // Xử lý sự kiện
    document.getElementById('closeBanner').addEventListener('click', () => {
      banner.style.animation = 'slideDown 0.3s ease reverse';
      setTimeout(() => banner.remove(), 300);
      localStorage.setItem('updateBannerClosed', latestUpdate.version);
      if (window.updateUpdatesBadge) window.updateUpdatesBadge();
    });
    
    document.getElementById('viewAllUpdates').addEventListener('click', openUpdatesDialog);
  }
  
  // Tạo dialog hiển thị tất cả updates
  function openUpdatesDialog() {
    const dialog = document.createElement('dialog');
    dialog.id = 'updatesDialog';
    dialog.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      margin: 0;
      border: none;
      border-radius: 24px;
      width: min(800px, 92vw);
      max-height: 80vh;
      background: var(--bg-secondary);
      color: var(--text-primary);
      padding: 0;
      overflow: hidden;
      box-shadow: 
        0 0 0 1px var(--glass-border),
        0 25px 80px rgba(0, 0, 0, 0.6),
        0 0 120px rgba(99, 102, 241, 0.15);
    `;
    
    const updatesList = UPDATES.map((update, index) => {
      const icon = UPDATE_ICONS[update.type] || "📢";
      const color = UPDATE_COLORS[update.type];
      
      return `
        <div onclick="${update.action}${`;this.closest('dialog').close()`}" style="
          padding: 20px 24px;
          background: ${index === 0 ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(139, 92, 246, 0.05))' : 'rgba(255, 255, 255, 0.02)'};
          border: 1px solid ${index === 0 ? 'var(--accent-primary)' : 'var(--border-color)'};
          border-radius: 16px;
          margin-bottom: 12px;
          transition: all 0.3s;
          cursor: pointer;
        " onmouseover="this.style.background='linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(139, 92, 246, 0.08))'; this.style.borderColor='var(--accent-primary)'; this.style.transform='translateX(8px)'" 
           onmouseout="this.style.background='${index === 0 ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(139, 92, 246, 0.05))' : 'rgba(255, 255, 255, 0.02)'}'; this.style.borderColor='${index === 0 ? 'var(--accent-primary)' : 'var(--border-color)'}'; this.style.transform='translateX(0)'">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
            <span style="font-size: 24px;">${icon}</span>
            <span style="
              background: ${color};
              color: white;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 11px;
              font-weight: 700;
              letter-spacing: 0.5px;
            ">v${update.version}</span>
            <span style="color: var(--text-muted); font-size: 13px;">${formatDate(update.date)}</span>
            ${index === 0 ? '<span style="margin-left: auto; background: linear-gradient(135deg, var(--accent-primary), var(--accent-pink)); color: white; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;">MỚI NHẤT</span>' : ''}
          </div>
          <h3 style="
            font-size: 18px;
            font-weight: 700;
            margin: 0 0 8px 0;
            color: var(--text-primary);
          ">${update.title}</h3>
          <p style="
            font-size: 14px;
            color: var(--text-secondary);
            margin: 0;
            line-height: 1.6;
          ">${update.description}</p>
        </div>
      `;
    }).join('');
    
    dialog.innerHTML = `
      <button onclick="this.closest('dialog').close()" style="
        position: absolute;
        top: 16px;
        right: 16px;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid var(--glass-border);
        width: 40px;
        height: 40px;
        padding: 0;
        border-radius: 50%;
        color: var(--text-primary);
        cursor: pointer;
        font-size: 24px;
        transition: all 0.3s;
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: center;
      " onmouseover="this.style.background='linear-gradient(135deg, #ef4444, #dc2626)'; this.style.transform='rotate(90deg) scale(1.1)'" onmouseout="this.style.background='rgba(255, 255, 255, 0.08)'; this.style.transform='rotate(0) scale(1)'">×</button>
      
      <h2 style="
        background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary), var(--accent-pink));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-size: 28px;
        font-weight: 800;
        padding: 28px 32px 20px 32px;
        margin: 0;
        border-bottom: 1px solid var(--border-color);
      ">📝 Lịch sử cập nhật</h2>
      
      <div style="
        padding: 24px 32px 32px 32px;
        max-height: 60vh;
        overflow-y: auto;
      ">
        ${updatesList}
      </div>
    `;
    
    document.body.appendChild(dialog);
    dialog.showModal();
    
    // Xóa dialog khi đóng
    dialog.addEventListener('close', () => dialog.remove());
  }
  
  // Format ngày tháng
  function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = today - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Hôm nay";
    if (diffDays === 1) return "Hôm qua";
    if (diffDays < 7) return `${diffDays} ngày trước`;
    
    return date.toLocaleDateString('vi-VN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    });
  }
  
  // Khởi tạo khi trang load
  window.addEventListener('DOMContentLoaded', () => {
    const closedVersion = localStorage.getItem('updateBannerClosed');
    const latestVersion = UPDATES[0]?.version;
    
    // Chỉ hiển thị nếu chưa đóng hoặc có version mới hơn
    if (!closedVersion || closedVersion !== latestVersion) {
      createUpdateBanner();
    }
  });
  
  // Export function để có thể gọi từ nơi khác
  window.openUpdatesDialog = openUpdatesDialog;

  // Thêm vào cuối file update.js

// Cập nhật badge số lượng updates chưa xem
function updateUpdatesBadge() {
  const closedVersion = localStorage.getItem('updateBannerClosed');
  const latestVersion = UPDATES[0]?.version;
  
  const btn = document.getElementById('btn-updates-sc');
  if (!btn) return;
  
  // Xóa badge cũ nếu có
  const oldBadge = btn.querySelector('.update-badge');
  if (oldBadge) oldBadge.remove();
  
  // Nếu có version mới chưa đóng banner
  if (!closedVersion || closedVersion !== latestVersion) {
    const badge = document.createElement('span');
    badge.className = 'update-badge';
    badge.textContent = 'MỚI';
    badge.style.cssText = `
      position: absolute;
      right: 16px;
      background: linear-gradient(135deg, #ec4899, #f43f5e);
      color: white;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.5px;
      animation: pulse 2s infinite;
    `;
    btn.appendChild(badge);
  }
}

// Gọi khi load trang
window.addEventListener('DOMContentLoaded', () => {
  updateUpdatesBadge();
});

// Export để gọi từ nơi khác
window.updateUpdatesBadge = updateUpdatesBadge;