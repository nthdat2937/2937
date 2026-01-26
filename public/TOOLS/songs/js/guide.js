
const GUIDE_DATA = {
    privacy: {
      icon: "🔒",
      title: "Chính sách bảo mật",
      content: `
        • Thông tin cá nhân được mã hóa và bảo mật bởi Supabase
        • Email chỉ dùng để đăng nhập, không chia sẻ cho bên thứ ba
        • Số điện thoại chỉ hiển thị trong profile cá nhân
        • Mật khẩu được hash, admin không thể xem được
        • Dữ liệu bài hát và góp ý được lưu trữ an toàn
      `
    },
    
    copyright: {
      icon: "©️",
      title: "Chính sách bản quyền",
      content: `
        • Website này KHÔNG lưu trữ file nhạc
        • Chỉ lưu thông tin bài hát (tên, ca sĩ, lời bài hát)
        • Link dẫn đến các nền tảng hợp pháp (Spotify, YouTube, Zing MP3...)
        • Nếu bạn là chủ sở hữu bản quyền và muốn gỡ thông tin, vui lòng liên hệ admin
        • Người dùng tự chịu trách nhiệm khi thêm nội dung
      `
    },
    
    features: {
      icon: "⭐",
      title: "Các tính năng chính",
      content: `
        <strong>🎵 Quản lý bài hát:</strong>
        • Thêm/Sửa/Xóa bài hát (với quyền phù hợp)
        • Tìm kiếm theo tên, ca sĩ, sáng tác, lời bài hát
        • Xem lời bài hát đầy đủ
        • Đánh dấu câu HOT trong lời bài hát
        
        <strong>👤 Tài khoản:</strong>
        • Đăng ký/Đăng nhập
        • Chỉnh sửa thông tin cá nhân
        • Theo dõi số bài hát đã thêm
        
        <strong>🔥 Streak:</strong>
        • Điểm danh hàng ngày
        • Tích lũy streak để lên danh hiệu
        • Reset nếu bỏ lỡ 1 ngày
        
        <strong>🏆 Bảng xếp hạng:</strong>
        • Xem ai đóng góp nhiều bài nhất
        • Click vào tên để xem bài hát của họ
        
        <strong>⭐ Music for YOU:</strong>
        • Mỗi ngày 1 bài hát khác nhau
        • Hiển thị câu HOT của bài hát
      `
    },
    
    shortcuts: {
      icon: "⌨️",
      title: "Phím tắt",
      content: `
        <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 8px;">
          <strong>/</strong> <span>Focus tìm kiếm</span>
          <strong>Space</strong> <span>Mở/Đóng Menu</span>
          <strong>Shift + R</strong> <span>Làm mới trang</span>
          <strong>Shift + A</strong> <span>Thêm bài hát</span>
          <strong>Shift + C</strong> <span>Hỏi AI</span>
          <strong>Shift + I</strong> <span>Thông tin tài khoản</span>
          <strong>Shift + T</strong> <span>Đổi theme</span>
          <strong>Shift + H</strong> <span>Trang chủ</span>
          <strong>Shift + B</strong> <span>Bảng xếp hạng</span>
          <strong>Shift + S</strong> <span>Điểm danh streak</span>
          <strong>Shift + O</strong> <span>Lịch sử thêm bài</span>
          <strong>Shift + M</strong> <span>Menu</span>
          <strong>ESC</strong> <span>Đóng dialog/Bỏ focus</span>
        </div>
      `
    },
    
    tips: {
      icon: "💡",
      title: "Mẹo sử dụng",
      content: `
        • Click vào bất kỳ đâu trên row bài hát để xem chi tiết
        • Sử dụng nút 📅 và 🔍 để tự động tìm thông tin bài hát
        • Thêm "--hot" sau câu hát để đánh dấu là câu HOT
        • Streak càng cao, danh hiệu càng ngầu (tối đa: GOD)
        • Click vào số bài hát trong xếp hạng để xem chi tiết
        • Music for YOU thay đổi mỗi ngày dựa theo ngày trong năm
      `
    }
  };
  
  function openGuideDialog() {
    const content = document.getElementById('guideContent');
    
    content.innerHTML = Object.entries(GUIDE_DATA).map(([key, section]) => `
      <div style="
        margin-bottom: 28px;
        padding: 20px 24px;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid var(--border-color);
        border-radius: 16px;
        transition: all 0.3s;
      " onmouseover="this.style.borderColor='var(--accent-primary)'; this.style.background='linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(139, 92, 246, 0.05))'" 
         onmouseout="this.style.borderColor='var(--border-color)'; this.style.background='rgba(255, 255, 255, 0.03)'">
        
        <h3 style="
          font-size: 36px;
          font-weight: 700;
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-pink));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        ">
          ${section.icon} ${section.title}
        </h3>
        
        <div style="
          line-height: 1.5;
          color: var(--text-secondary);
          white-space: pre-line;
          font-size: 24px;
          font-weight: 800;
        ">
          ${section.content}
        </div>
      </div>
    `).join('');
    
    guideDialog.showModal();
  }
  
  guideDialog.addEventListener('click', (e) => {
    if (e.target === guideDialog) {
      guideDialog.close();
    }
  });