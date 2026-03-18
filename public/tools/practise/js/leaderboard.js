import { supabase } from './auth.js';

function $(id) { return document.getElementById(id); }

let currentMetric = 'diamonds';

/**
 * Lấy dữ liệu bảng xếp hạng từ Supabase
 */
export async function fetchLeaderboard(metric) {
  const { data, error } = await supabase
    .from('leaderboard')
    .select(`
      user_id,
      diamonds, topik_score, xp,
      profiles ( display_name, avatar )
    `)
    .order(metric, { ascending: false })
    .limit(10);

  if (error) {
    console.error('Lỗi khi tải bảng xếp hạng:', error);
    return;
  }

  renderLeaderboard(data || [], metric);
}

/**
 * Hiển thị dữ liệu lên giao diện
 */
function renderLeaderboard(list, metric) {
  const podiumEl = $('lb-podium');
  const listEl = $('lb-list');
  if (!podiumEl || !listEl) return;

  podiumEl.innerHTML = '';
  listEl.innerHTML = '';

  const getMetricIcon = (m) => {
    if (m === 'diamonds') return '<i class="fa-solid fa-diamond" style="color:lightblue;"></i>';
    if (m === 'topik_score') return '<i class="fas fa-bullseye" style="color:#e05"></i>';
    if (m === 'xp') return '<i class="fas fa-star" style="color:#7c6ce0"></i>';
    return '<i class="fa-solid fa-diamond" style="color:lightblue;"></i>';
  };
  const metricIcon = getMetricIcon(metric);

  // Top 3 Podium: sắp xếp lại thứ tự vẽ (Hạng 2, Hạng 1, Hạng 3)
  const top3 = list.slice(0, 3);
  let podiumHtml = '';

  const getAvatarHtml = (profile, rank) => {
    const pClass = rank === 1 ? 'p1' : (rank === 2 ? 'p2' : 'p3');
    const avUrl = profile?.avatar;
    const initial = (profile?.display_name || '?')[0].toUpperCase();

    let avStyle = rank === 1 ? 'style="width:66px;height:66px"' : '';
    let content = avUrl ? `<img src="${avUrl}" style="width:100%;height:100%;border-radius:50%;object-fit:cover" />` : initial;

    return `
      <div class="podium-avatar-wrap">
          <div class="podium-rank-icon">${rank === 1 ? '🥇' : (rank === 2 ? '🥈' : '🥉')}</div>
          <div class="podium-avatar" ${avStyle}>${content}</div>
      </div>
    `;
  };

  const renderPodiumItem = (item, rank) => {
    if (!item) return '<div class="podium-item" style="opacity:0"></div>';
    const profile = Array.isArray(item.profiles) ? item.profiles[0] : item.profiles; // Đề phòng trường hợp quan hệ 1-N
    const pb = rank === 1 ? 'padding-bottom:10px' : '';
    return `
      <div class="podium-item p${rank}" style="${pb}">
          ${getAvatarHtml(profile, rank)}
          <div class="podium-name" title="${profile?.display_name || '...'}">${profile?.display_name || '...'}</div>
          <div class="podium-xp">${metricIcon} <span>${item[metric] || 0}</span></div>
      </div>
    `;
  };

  if (top3[1]) podiumHtml += renderPodiumItem(top3[1], 2);
  else podiumHtml += '<div class="podium-item" style="opacity:0"></div>';

  if (top3[0]) podiumHtml += renderPodiumItem(top3[0], 1);
  else podiumHtml += '<div class="podium-item" style="opacity:0"></div>';

  if (top3[2]) podiumHtml += renderPodiumItem(top3[2], 3);
  else podiumHtml += '<div class="podium-item" style="opacity:0"></div>';

  if (!top3.length) {
    podiumEl.innerHTML = '<div style="font-size:0.85rem;color:var(--text-muted);width:100%;text-align:center;padding:20px;">Chưa có dữ liệu.</div>';
    return;
  }

  podiumEl.innerHTML = podiumHtml;

  // Top 4 - 10
  const rem = list.slice(3, 10);
  let listHtml = '';
  rem.forEach((item, index) => {
    const rank = index + 4;
    const profile = Array.isArray(item.profiles) ? item.profiles[0] : item.profiles;
    const initial = (profile?.display_name || '?')[0].toUpperCase();
    const avUrl = profile?.avatar;
    let avContent = avUrl ? `<img src="${avUrl}" style="width:100%;height:100%;border-radius:50%;object-fit:cover" />` : initial;
    const bgClass = rank % 2 === 0 ? 'lb-av-a' : 'lb-av-b';
    const avStyle = avUrl ? 'background:transparent' : '';

    listHtml += `
      <div class="lb-row">
          <div class="lb-rank">${rank}</div>
          <div class="lb-avatar ${bgClass}" style="${avStyle}">${avContent}</div>
          <div class="lb-name" title="${profile?.display_name || '...'}">${profile?.display_name || '...'}</div>
          <div class="lb-score">${metricIcon} <span>${item[metric] || 0}</span></div>
      </div>
    `;
  });
  listEl.innerHTML = listHtml;
}

// Khởi tạo tab listener
function initTabs() {
  const tabs = document.querySelectorAll('.lb-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      // Remove active class
      tabs.forEach(t => t.classList.remove('active'));
      // Set active
      const el = e.currentTarget;
      el.classList.add('active');

      const metric = el.getAttribute('data-metric');
      if (metric && metric !== currentMetric) {
        currentMetric = metric;
        fetchLeaderboard(currentMetric);
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  fetchLeaderboard(currentMetric);

  // Sync login prompt
  const syncLBAuth = (isLoggedIn) => {
    $('lb-login-prompt')?.classList.toggle('hidden', isLoggedIn);
  };

  window.addEventListener('auth-changed', (e) => {
    syncLBAuth(!!e.detail.user);
  });

  // Initial check
  if (window.currentUser) syncLBAuth(true);
});
