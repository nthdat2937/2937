(function () {
  const grid = document.getElementById('toolsGrid');
  if (!grid) return;

  function cardTemplate(tool) {
    const icon = tool.icon ? `<i class="fas ${tool.icon}"></i>` : '<i class="fas fa-toolbox"></i>';
    const safeDesc = tool.description || '';
    return `
      <div class="feature-card">
        <div class="feature-icon">${icon}</div>
        <h3 class="feature-title">${tool.name}</h3>
        <p class="feature-description">${safeDesc}</p>
        <div class="card-actions">
          <a class="nav-btn primary" href="${tool.path}" title="Mở ${tool.name}">Mở công cụ</a>
        </div>
      </div>
    `;
  }

  function render(tools) {
    if (!Array.isArray(tools) || tools.length === 0) {
      grid.innerHTML = '<p style="color:#fff;">Chưa có công cụ nào. Hãy thêm vào tools/manifest.json.</p>';
      return;
    }
    grid.innerHTML = tools.map(cardTemplate).join('');
  }

  async function load() {
    try {
      const res = await fetch('tools/manifest.json', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      render(data);
    } catch (err) {
      console.error('Không thể tải manifest công cụ:', err);
      grid.innerHTML = '<p style="color:#fff;">Không thể tải danh sách công cụ. Vui lòng thử lại sau.</p>';
    }
  }

  // Chỉ tải khi chuyển tới tab Công cụ lần đầu hoặc khi trang đã ở hash đó
  const initOnce = () => {
    load();
    document.removeEventListener('DOMContentLoaded', initOnce);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initOnce);
  } else {
    initOnce();
  }
})();
