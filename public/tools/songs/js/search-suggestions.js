// ===== SEARCH SUGGESTIONS + KEYWORD HIGHLIGHT =====
// Nâng cấp ô tìm kiếm: hiển thị gợi ý bài hát + đánh dấu từ khoá

// ── Helpers ──────────────────────────────────────────────────────────────────

function _sd(str) {
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
 * Escape HTML để tránh XSS khi nhúng vào innerHTML
 */
function _escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Đánh dấu (highlight) tất cả lần xuất hiện của query trong text.
 * Xử lý đúng diacritics tiếng Việt: tìm theo normalized, highlight bản gốc.
 *
 * Cách tiếp cận: xây 2 mảng song song từ chuỗi gốc:
 *   srcChars[i]  = ký tự gốc thứ i (codepoint)
 *   normChars[i] = ký tự đó sau khi normalize (1 char gốc → 1 char norm)
 * → normChars.join('') === _sd(text) theo từng codepoint
 * → index trong normChars khớp 1-1 với index trong srcChars, không bao giờ lệch.
 */
function highlightText(text, query) {
  if (!text || !query) return _escHtml(text);

  const normQuery = _sd(query);
  if (!normQuery) return _escHtml(text);

  // Tách chuỗi gốc theo codepoints (Unicode-safe)
  const srcChars = [...text];

  // Normalize từng codepoint riêng lẻ → 1 char gốc luôn cho ra 1 char norm
  // (vì NFD tách dấu, nhưng ta strip dấu ngay → mỗi char gốc → 0-1 char norm)
  // Dùng một mảng normChars cùng độ dài với srcChars.
  const normChars = srcChars.map(ch => {
    // NFD rồi strip combining marks + xử lý đ/Đ → luôn ra đúng 1 ký tự
    return ch
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace('đ', 'd')
      .replace('Đ', 'D')
      .toLowerCase();
  });

  const normText = normChars.join('');

  // Tìm tất cả vị trí match trong normText
  const matches = []; // [{start, end}] trên normChars index
  let searchFrom = 0;
  while (searchFrom < normText.length) {
    const pos = normText.indexOf(normQuery, searchFrom);
    if (pos === -1) break;
    matches.push({ start: pos, end: pos + normQuery.length });
    searchFrom = pos + normQuery.length;
  }

  if (!matches.length) return _escHtml(text);

  // Build kết quả: ghép srcChars lại, bọc mark tại đúng vị trí
  let result = '';
  let i = 0;
  let matchIdx = 0;

  while (i < srcChars.length) {
    const m = matches[matchIdx];
    if (!m) {
      // Không còn match nào, dump phần còn lại
      result += _escHtml(srcChars.slice(i).join(''));
      break;
    }

    if (i < m.start) {
      // Trước match
      result += _escHtml(srcChars.slice(i, m.start).join(''));
      i = m.start;
    } else if (i === m.start) {
      // Trong match
      result += `<mark class="search-highlight">${_escHtml(srcChars.slice(m.start, m.end).join(''))}</mark>`;
      i = m.end;
      matchIdx++;
    }
  }

  return result;
}

// Export để dùng ở nơi khác nếu cần
window.highlightText = highlightText;

// ── Suggestion Dropdown ───────────────────────────────────────────────────────

const SUGGESTION_LIMIT = 8;
let _activeSuggestionIdx = -1;
let _currentSuggestions  = [];

function _getOrCreateDropdown() {
  let el = document.getElementById('search-suggestions-dropdown');
  if (!el) {
    el = document.createElement('div');
    el.id = 'search-suggestions-dropdown';
    el.setAttribute('role', 'listbox');
    el.style.cssText = `
      position: absolute;
      top: calc(100% + 6px);
      left: 0;
      right: 0;
      background: var(--bg-secondary, #1a1a2e);
      border: 1px solid var(--border-color, rgba(255,255,255,0.1));
      border-radius: 16px;
      box-shadow: 0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px var(--glass-border, rgba(255,255,255,0.05));
      overflow: hidden;
      z-index: 99999;
      max-height: 400px;
      overflow-y: auto;
      display: none;
      backdrop-filter: blur(16px);
    `;

    // Wrapper để position:absolute hoạt động đúng
    const searchWrapper = document.getElementById('searchInput')?.parentElement;
    if (searchWrapper) {
      const prevPosition = searchWrapper.style.position;
      if (!prevPosition || prevPosition === 'static') {
        searchWrapper.style.position = 'relative';
      }
      searchWrapper.appendChild(el);
    } else {
      document.body.appendChild(el);
    }
  }
  return el;
}

function _closeSuggestions() {
  const dd = document.getElementById('search-suggestions-dropdown');
  if (dd) dd.style.display = 'none';
  _activeSuggestionIdx = -1;
  _currentSuggestions  = [];
}

function _renderSuggestions(query) {
  const songs = window._songs || [];
  if (!query || query.length < 1 || !songs.length) {
    _closeSuggestions();
    return;
  }

  const normQuery = _sd(query);

  // Scoring: ưu tiên match đầu tên > match tên > match ca sĩ > match lyric
  const scored = songs
    .map(song => {
      const normName   = _sd(song['Tên']);
      const normArtist = _sd(song['Ca sĩ']);
      const normLyric  = _sd(song['Lyric'] || '');

      let score = 0;
      if (normName.startsWith(normQuery))            score = 100;
      else if (normName.includes(normQuery))         score = 80;
      else if (normArtist.includes(normQuery))       score = 50;
      else if (normLyric.includes(normQuery))        score = 20;

      // Lấy snippet lyric nếu match lyric
      let lyricSnippet = null;
      if (score === 20) {
        const idx = normLyric.indexOf(normQuery);
        if (idx !== -1) {
          const raw = song['Lyric'] || '';
          const start = Math.max(0, idx - 20);
          const end   = Math.min(raw.length, idx + normQuery.length + 40);
          lyricSnippet = (start > 0 ? '…' : '') +
                          raw.slice(start, end).replace(/\n/g, ' ') +
                          (end < raw.length ? '…' : '');
        }
      }

      return { song, score, lyricSnippet };
    })
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, SUGGESTION_LIMIT);

  if (!scored.length) {
    _closeSuggestions();
    return;
  }

  _currentSuggestions = scored;
  _activeSuggestionIdx = -1;

  const dd = _getOrCreateDropdown();

  dd.innerHTML = scored.map((r, i) => {
    const { song, lyricSnippet } = r;
    const hlName   = highlightText(song['Tên'], query);
    const hlArtist = highlightText(song['Ca sĩ'], query);
    const hlLyric  = lyricSnippet ? highlightText(lyricSnippet, query) : '';

    return `
      <div
        class="suggestion-item"
        data-idx="${i}"
        data-song-id="${song.Id}"
        role="option"
        style="
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 16px;
          cursor: pointer;
          transition: background 0.15s;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        "
      >
        ${song.avatar
          ? `<img src="${_escHtml(song.avatar)}" alt="" style="width:44px;height:44px;border-radius:8px;object-fit:cover;flex-shrink:0;">`
          : `<div style="width:44px;height:44px;border-radius:8px;background:linear-gradient(135deg,var(--accent-primary,#6366f1),var(--accent-pink,#ec4899));display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">🎵</div>`
        }
        <div style="flex:1;min-width:0;">
          <div style="font-weight:700;font-size:15px;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
            ${hlName}
          </div>
          <div style="font-size:13px;color:var(--text-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
            ${hlArtist}
          </div>
          ${hlLyric ? `
            <div style="font-size:12px;color:var(--text-muted);margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
              🎵 ${hlLyric}
            </div>
          ` : ''}
        </div>
        <i class="fa-solid fa-arrow-up-left" style="color:var(--text-muted);font-size:12px;flex-shrink:0;opacity:0.5;"></i>
      </div>
    `;
  }).join('');

  // Thêm footer nếu còn kết quả
  const totalMatches = (window._songs || []).filter(s =>
    _sd(s['Tên']).includes(_sd(query)) ||
    _sd(s['Ca sĩ']).includes(_sd(query)) ||
    _sd(s['Lyric'] || '').includes(_sd(query))
  ).length;

  if (totalMatches > SUGGESTION_LIMIT) {
    dd.innerHTML += `
      <div style="
        text-align: center;
        padding: 10px;
        font-size: 12px;
        color: var(--text-muted);
        border-top: 1px solid rgba(255,255,255,0.06);
      ">
        Nhấn Enter để xem tất cả ${totalMatches} kết quả
      </div>
    `;
  }

  dd.style.display = 'block';

  // Hover events
  dd.querySelectorAll('.suggestion-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dd.querySelectorAll('.suggestion-item').forEach(i => i.style.background = '');
      el.style.background = 'rgba(255,255,255,0.07)';
      _activeSuggestionIdx = parseInt(el.dataset.idx);
    });
    el.addEventListener('mouseleave', () => {
      el.style.background = '';
    });
    el.addEventListener('mousedown', (e) => {
      e.preventDefault(); // tránh blur input trước khi click
      const songId = parseInt(el.dataset.songId);
      _closeSuggestions();
      if (window.showLyric) {
        window.showLyric(songId);
      }
    });
  });
}

function _highlightSuggestionItem(idx) {
  const dd = document.getElementById('search-suggestions-dropdown');
  if (!dd) return;
  dd.querySelectorAll('.suggestion-item').forEach((el, i) => {
    el.style.background = i === idx ? 'rgba(255,255,255,0.09)' : '';
  });
}

// ── Inject styles ─────────────────────────────────────────────────────────────

function _injectSearchStyles() {
  if (document.getElementById('search-upgrade-style')) return;
  const style = document.createElement('style');
  style.id = 'search-upgrade-style';
  style.textContent = `
    /* ── Highlight keyword trong bảng kết quả ── */
    mark.search-highlight {
      background: transparent;
      color: var(--accent-primary, #6366f1);
      font-weight: 800;
      text-decoration: underline;
      text-underline-offset: 2px;
      text-decoration-thickness: 2px;
    }

    /* ── Dropdown suggestion ── */
    #search-suggestions-dropdown::-webkit-scrollbar {
      width: 6px;
    }
    #search-suggestions-dropdown::-webkit-scrollbar-track {
      background: transparent;
    }
    #search-suggestions-dropdown::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.15);
      border-radius: 10px;
    }

    /* ── Highlight trong lyric dialog ── */
    .lyric-highlight {
      background: rgba(99, 102, 241, 0.25);
      color: var(--accent-primary, #6366f1);
      border-radius: 3px;
      font-weight: 700;
      padding: 0 2px;
    }
  `;
  document.head.appendChild(style);
}

// ── Patch renderSongs để highlight search keywords ────────────────────────────

function _patchRenderSongs() {
  const originalRenderSongs = window.renderSongs;
  if (!originalRenderSongs || window._renderSongsPatched) return;
  window._renderSongsPatched = true;

  window.renderSongs = function(songs) {
    // Gọi hàm gốc trước
    originalRenderSongs(songs);

    // Sau đó áp dụng highlight
    _applyTableHighlight();
  };
}

function _getSearchQuery() {
  const input = document.getElementById('searchInput');
  return input ? input.value.trim() : '';
}

function _applyTableHighlight() {
  const query = _getSearchQuery();
  if (!query) return;

  const list = document.getElementById('list') || document.querySelector('#songTable tbody');
  if (!list) return;

  // Highlight tên bài (cột thứ 2 - index 1)
  list.querySelectorAll('tr').forEach(row => {
    const songId = parseInt(row.dataset.songId);
    if (!songId || !window._songs) return;
    const song = window._songs.find(s => s.Id === songId);
    if (!song) return;

    // Cột tên bài hát (td index 1)
    const nameTd = row.querySelectorAll('td')[1];
    if (nameTd) {
      nameTd.innerHTML = highlightText(song['Tên'], query);
    }

    // Cột ca sĩ (td index 2)
    const artistTd = row.querySelectorAll('td')[2];
    if (artistTd) {
      artistTd.innerHTML = highlightText(song['Ca sĩ'], query);
    }

    // Cột sáng tác (td index 3) nếu có
    const composerTd = row.querySelectorAll('td')[3];
    if (composerTd && song['Sáng tác']) {
      composerTd.innerHTML = highlightText(song['Sáng tác'], query);
    }
  });
}

// ── Bind search input ─────────────────────────────────────────────────────────

function _bindSearchSuggestions() {
  const input = document.getElementById('searchInput');
  if (!input || input._suggestionsBound) return;
  input._suggestionsBound = true;

  // Tắt gợi ý mặc định của trình duyệt
  input.setAttribute('autocomplete', 'off');
  input.setAttribute('autocorrect', 'off');
  input.setAttribute('autocapitalize', 'off');
  input.setAttribute('spellcheck', 'false');

  let debounceTimer;

  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      _renderSuggestions(input.value.trim());
      // Highlight cũng được trigger qua patch renderSongs,
      // nhưng ta gọi thêm lần nữa để đảm bảo
      setTimeout(_applyTableHighlight, 350);
    }, 150);
  });

  input.addEventListener('focus', () => {
    if (input.value.trim()) {
      _renderSuggestions(input.value.trim());
    }
  });

  input.addEventListener('blur', () => {
    // Delay để mousedown trên suggestion item kịp xử lý
    setTimeout(_closeSuggestions, 200);
  });

  input.addEventListener('keydown', (e) => {
    const dd = document.getElementById('search-suggestions-dropdown');
    const isOpen = dd && dd.style.display !== 'none';

    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      _activeSuggestionIdx = Math.min(_activeSuggestionIdx + 1, _currentSuggestions.length - 1);
      _highlightSuggestionItem(_activeSuggestionIdx);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      _activeSuggestionIdx = Math.max(_activeSuggestionIdx - 1, -1);
      _highlightSuggestionItem(_activeSuggestionIdx);
    } else if (e.key === 'Enter') {
      if (_activeSuggestionIdx >= 0 && _currentSuggestions[_activeSuggestionIdx]) {
        e.preventDefault();
        const { song } = _currentSuggestions[_activeSuggestionIdx];
        _closeSuggestions();
        if (window.showLyric) window.showLyric(song.Id);
      } else {
        _closeSuggestions();
      }
    } else if (e.key === 'Escape') {
      _closeSuggestions();
    }
  });

  // Đóng khi click ngoài
  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !e.target.closest('#search-suggestions-dropdown')) {
      _closeSuggestions();
    }
  });
}

// ── Init ──────────────────────────────────────────────────────────────────────

function _initSearchUpgrade() {
  _injectSearchStyles();
  _bindSearchSuggestions();
  _patchRenderSongs();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', _initSearchUpgrade);
} else {
  _initSearchUpgrade();
}

// Patch lại sau khi _songs đã load (renderSongs có thể được gọi sau)
const _origLoadSongs = window.loadSongs;
if (_origLoadSongs) {
  window.loadSongs = async function(...args) {
    await _origLoadSongs.apply(this, args);
    _patchRenderSongs();
  };
}