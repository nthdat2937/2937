// ===== DUPLICATE SONG DETECTOR =====
// Tự động kiểm tra bài hát trùng sau khi người dùng rời khỏi ô tên bài hát

// ── Helpers ──────────────────────────────────────────────────────────────────

function _removeDiacritics(str) {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

/**
 * Tính điểm tương đồng giữa hai chuỗi (0 → 1).
 * Dùng Dice coefficient trên bigram, nhanh và đủ tốt cho tên bài hát tiếng Việt.
 */
function _similarity(a, b) {
  a = _removeDiacritics(a);
  b = _removeDiacritics(b);
  if (!a || !b) return 0;
  if (a === b) return 1;

  function bigrams(s) {
    const set = new Map();
    for (let i = 0; i < s.length - 1; i++) {
      const bg = s.slice(i, i + 2);
      set.set(bg, (set.get(bg) || 0) + 1);
    }
    return set;
  }

  const biA = bigrams(a);
  const biB = bigrams(b);
  let intersection = 0;

  for (const [bg, count] of biA) {
    if (biB.has(bg)) {
      intersection += Math.min(count, biB.get(bg));
    }
  }

  const total = (a.length - 1) + (b.length - 1);
  return total <= 0 ? 0 : (2 * intersection) / total;
}

// ── Core detector ─────────────────────────────────────────────────────────────

const DUPLICATE_THRESHOLD = 0.72; // ≥ 72% → coi là trùng/gần trùng

/**
 * Tìm các bài hát trong _songs có tên tương đồng với query.
 * @returns {Array} danh sách { song, score }
 */
function findDuplicates(query) {
  const songs = window._songs || [];
  if (!query || !songs.length) return [];

  const results = songs
    .map(song => ({
      song,
      score: _similarity(query, song['Tên'])
    }))
    .filter(r => r.score >= DUPLICATE_THRESHOLD)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return results;
}

// ── UI ────────────────────────────────────────────────────────────────────────

const DUP_BANNER_ID = 'duplicate-warning-banner';

function _removeBanner() {
  document.getElementById(DUP_BANNER_ID)?.remove();
}

function _showDuplicateBanner(duplicates, inputEl) {
  _removeBanner();

  const banner = document.createElement('div');
  banner.id = DUP_BANNER_ID;
  banner.style.cssText = `
    margin-top: 10px;
    background: rgba(245, 158, 11, 0.12);
    border: 1px solid rgba(245, 158, 11, 0.45);
    border-radius: 14px;
    padding: 14px 16px;
    animation: dupFadeIn 0.3s ease;
  `;

  const exactMatches  = duplicates.filter(d => d.score >= 0.97);
  const similarMatches = duplicates.filter(d => d.score < 0.97);

  const isExact = exactMatches.length > 0;

  banner.innerHTML = `
    <div style="display:flex; align-items:flex-start; gap:10px;">
      <span style="font-size:22px; line-height:1.2;">${isExact ? '🚫' : '⚠️'}</span>
      <div style="flex:1">
        <div style="
          font-weight: 700;
          font-size: 14px;
          color: ${isExact ? '#ef4444' : '#f59e0b'};
          margin-bottom: 6px;
        ">
          ${isExact
            ? 'Bài hát này có thể đã tồn tại trong danh sách!'
            : 'Tìm thấy bài hát tương tự – hãy kiểm tra trước khi thêm:'}
        </div>
        <div id="dup-list" style="display:flex; flex-direction:column; gap:6px;"></div>
        <div style="
          margin-top: 10px;
          font-size: 12px;
          color: var(--text-muted);
        ">
          Nhấn vào tên bài để xem chi tiết. Nếu đây là bài hát khác, bạn vẫn có thể tiếp tục thêm.
        </div>
      </div>
      <button onclick="document.getElementById('${DUP_BANNER_ID}').remove()" style="
        background: none;
        border: none;
        cursor: pointer;
        color: var(--text-muted);
        font-size: 18px;
        padding: 0;
        line-height: 1;
        flex-shrink: 0;
      ">×</button>
    </div>
  `;

  const list = banner.querySelector('#dup-list');
  duplicates.forEach(({ song, score }) => {
    const percent = Math.round(score * 100);
    const isE = score >= 0.97;
    const item = document.createElement('div');
    item.style.cssText = `
      display: flex;
      align-items: center;
      gap: 10px;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 10px;
      padding: 8px 12px;
      cursor: pointer;
      transition: background 0.2s;
    `;
    item.onmouseenter = () => item.style.background = 'rgba(255,255,255,0.09)';
    item.onmouseleave = () => item.style.background = 'rgba(255,255,255,0.04)';
    item.onclick = () => {
      if (window.showLyric) {
        window.showLyric(song.Id);
      }
    };

    item.innerHTML = `
      ${song.avatar
        ? `<img src="${song.avatar}" alt="" style="width:40px;height:40px;border-radius:8px;object-fit:cover;flex-shrink:0;">`
        : `<div style="width:40px;height:40px;border-radius:8px;background:linear-gradient(135deg,var(--accent-primary),var(--accent-pink));display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">🎵</div>`
      }
      <div style="flex:1;min-width:0;">
        <div style="font-weight:700;font-size:14px;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
          ${song['Tên']}
        </div>
        <div style="font-size:12px;color:var(--text-muted);">${song['Ca sĩ']}</div>
      </div>
      <div style="
        padding: 3px 9px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 700;
        background: ${isE ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)'};
        color: ${isE ? '#ef4444' : '#f59e0b'};
        white-space: nowrap;
        flex-shrink: 0;
      ">
        ${isE ? 'Trùng' : `${percent}%`}
      </div>
    `;
    list.appendChild(item);
  });

  // Chèn banner ngay sau error div của songName
  const errorDiv = document.getElementById('error-songName');
  if (errorDiv) {
    errorDiv.insertAdjacentElement('afterend', banner);
  } else {
    inputEl.parentElement.appendChild(banner);
  }

  // Animation keyframe (chỉ inject 1 lần)
  if (!document.getElementById('dup-detector-style')) {
    const style = document.createElement('style');
    style.id = 'dup-detector-style';
    style.textContent = `
      @keyframes dupFadeIn {
        from { opacity: 0; transform: translateY(-6px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }
}

// ── Bind events ───────────────────────────────────────────────────────────────

function _bindDuplicateDetector() {
  const input = document.getElementById('songName');
  if (!input) return;

  // Khi rời khỏi ô nhập (blur)
  input.addEventListener('blur', () => {
    _removeBanner();
    const query = input.value.trim();
    if (!query || query.length < 2) return;

    const duplicates = findDuplicates(query);
    if (duplicates.length > 0) {
      _showDuplicateBanner(duplicates, input);
    }
  });

  // Xóa banner khi người dùng đang gõ lại
  input.addEventListener('input', () => {
    _removeBanner();
  });
}

// Chạy sau khi DOM sẵn sàng
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', _bindDuplicateDetector);
} else {
  _bindDuplicateDetector();
}

// Cũng bind lại khi dialog addSongDialog được mở (dialog có thể chưa render khi script chạy)
document.addEventListener('click', (e) => {
  if (e.target.closest('[onclick*="addSongDialog.showModal"]') ||
      e.target.id === 'btn-add-sc') {
    setTimeout(_bindDuplicateDetector, 50);
  }
}, true);

// Export
window.findDuplicates = findDuplicates;