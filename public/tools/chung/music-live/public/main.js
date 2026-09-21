// Hide App Splash Loading Screen after 3 seconds so running bunny is fully visible
const appLoaderStartTime = Date.now();
function hideAppLoader() {
    const elapsed = Date.now() - appLoaderStartTime;
    const remaining = Math.max(0, 3000 - elapsed);
    setTimeout(() => {
        const loader = document.getElementById('app-loader-screen');
        if (loader && !loader.classList.contains('fade-out')) {
            loader.classList.add('fade-out');
            setTimeout(() => { if (loader.parentNode) loader.remove(); }, 500);
        }
    }, remaining);
}

if (document.fonts) {
    document.fonts.ready.then(() => { hideAppLoader(); });
}
window.addEventListener('load', () => {
    hideAppLoader();
});
setTimeout(hideAppLoader, 3000);

const socket = io();
let isAuthInitialized = false;

socket.on('connect', () => {
    if (isAuthInitialized && currentUserId && myUsername) {
        joinRoom();
    }
    socket.emit('getQuizPacks', (packs) => {
        if (Array.isArray(packs)) currentQuizPacks = packs;
    });
});
let player;
let isPlayerReady = false;
let isYoutubeApiLoaded = false;
let pendingVideoId = null;
let currentUserId = localStorage.getItem('musiclive_user_id') || null;
let myRole = localStorage.getItem('musiclive_user_role') || '';
let initialVideoId = '';
let myUsername = localStorage.getItem('musiclive_username') || '';
let myAvatarUrl = localStorage.getItem('musiclive_avatar_url') || '';
let myDisplayName = localStorage.getItem('musiclive_display_name') || '';
let myRawUsername = localStorage.getItem('musiclive_raw_username') || '';
let myPhone = localStorage.getItem('musiclive_phone') || '';
let pendingAvatarFile = null;
let myQuickLockType = localStorage.getItem('musiclive_quick_lock_type') || '';
let myQuickLockData = null;
try {
    const rawQLData = localStorage.getItem('musiclive_quick_lock_data');
    if (rawQLData) myQuickLockData = JSON.parse(rawQLData);
} catch (e) {
    myQuickLockData = null;
}


function toggleSidebar() {
    const sb = document.getElementById('sidebar');
    if (sb) sb.classList.toggle('mini');
}

let wasMutedBeforeTopTab = false;
let isMutedByTopTab = false;

function muteRoomPlayerForTopTab() {
    if (typeof player !== 'undefined' && player && typeof player.mute === 'function' && typeof player.isMuted === 'function') {
        try {
            if (!isMutedByTopTab) {
                wasMutedBeforeTopTab = player.isMuted();
                if (!wasMutedBeforeTopTab) {
                    player.mute();
                    isMutedByTopTab = true;
                    if (typeof showToastNotification === 'function') {
                        showToastNotification('🔇 Đã tắt tiếng nhạc phòng. Quay lại Trang chủ để bật lại tiếng!');
                    }
                }
            }
        } catch (e) {}
    }
}

function restoreRoomPlayerFromTopTab() {
    if (isMutedByTopTab) {
        if (typeof player !== 'undefined' && player && typeof player.unMute === 'function') {
            try {
                if (!wasMutedBeforeTopTab) {
                    player.unMute();
                }
            } catch (e) {}
        }
        isMutedByTopTab = false;
    }
}

function showTab(tab) {
    document.querySelectorAll('.sidebar-item').forEach(el => el.classList.remove('active'));
    const activeTab = document.querySelector(`.sidebar-item[data-tab="${tab}"]`);
    if (activeTab) activeTab.classList.add('active');

    document.getElementById('left-column').classList.remove('not-home');
    document.getElementById('left-column').classList.remove('hidden');
    document.getElementById('history-column').classList.add('hidden');
    document.getElementById('top-column').classList.add('hidden');
    const fbCol = document.getElementById('feedback-column');
    if (fbCol) fbCol.classList.add('hidden');
    const quizAdminCol = document.getElementById('quiz-admin-column');
    if (quizAdminCol) quizAdminCol.classList.add('hidden');
    const msgCol = document.getElementById('messenger-column');
    if (msgCol) msgCol.classList.add('hidden');
    const rightCol = document.querySelector('.right-column');
    if (rightCol) rightCol.classList.remove('hidden');

    if (tab === 'home') {
        miniPlayer.style.transform = '';
        restoreRoomPlayerFromTopTab();
    } else {
        document.getElementById('left-column').classList.add('not-home');
        applyMiniPlayerSavedPos();
        if (tab === 'messenger') {
            if (msgCol) msgCol.classList.remove('hidden');
            if (rightCol) rightCol.classList.add('hidden');
            restoreRoomPlayerFromTopTab();
            openMessengerTab();
        } else if (tab === 'history') {
            document.getElementById('history-column').classList.remove('hidden');
            restoreRoomPlayerFromTopTab();
            loadHistory();
        } else if (tab === 'top') {
            document.getElementById('top-column').classList.remove('hidden');
            loadTopNhac();
            muteRoomPlayerForTopTab();
        } else if (tab === 'feedback') {
            if (fbCol) fbCol.classList.remove('hidden');
            restoreRoomPlayerFromTopTab();
            loadFeedbackHistory();
        } else if (tab === 'quiz-admin') {
            if (quizAdminCol) quizAdminCol.classList.remove('hidden');
            restoreRoomPlayerFromTopTab();
            openQuizAdminTab();
        }
    }
}

async function loadHistory() {
    const list = document.getElementById('history-list');
    list.innerHTML = '<div style="color:var(--text-muted); padding:12px; text-align:center;">Đang tải lịch sử phát...</div>';

    try {
        const supabaseClient = supabase.createClient('https://wnioetdrphkdylkoybsu.supabase.co', 'sb_publishable_p0VSduH3epzQVUdvAf2kPQ_aoWk_l1T');
        const { data, error } = await supabaseClient
            .from('music_history')
            .select('*')
            .order('played_at', { ascending: false })
            .limit(50);

        if (error) throw error;

        if (!data || data.length === 0) {
            list.innerHTML = '<div style="color:var(--text-muted); padding:12px; text-align:center;">Chưa có lịch sử phát nào.</div>';
            return;
        }

        let groupedData = [];
        for (let i = 0; i < data.length; i++) {
            const current = data[i];
            if (groupedData.length > 0 && groupedData[groupedData.length - 1].video_id === current.video_id) {
                groupedData[groupedData.length - 1].count = (groupedData[groupedData.length - 1].count || 1) + 1;
            } else {
                current.count = 1;
                groupedData.push(current);
            }
        }

        const fallbackSvg = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='40' viewBox='0 0 60 40' fill='%23181824'><rect width='60' height='40' fill='%23181824'/><text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' fill='%23555' font-size='16'>🎵</text></svg>";

        list.innerHTML = groupedData.map(song => {
            const d = new Date(song.played_at);
            const timeStr = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
            const dateStr = d.toLocaleDateString('vi-VN');

            const isStacked = song.count > 1;
            const badgeHtml = isStacked ? `<div class="history-count-badge">x${song.count}</div>` : '';
            const thumbUrl = `https://img.youtube.com/vi/${song.video_id}/mqdefault.jpg`;

            return `
                <div class="history-item">
                    <div class="history-thumb-container">
                        <img src="${thumbUrl}" alt="thumbnail" class="history-thumb-img" onerror="this.onerror=null; this.src='${fallbackSvg}';">
                        ${badgeHtml}
                        <div class="history-play-overlay">
                            <span class="material-symbols-outlined">play_arrow</span>
                        </div>
                    </div>
                    <div class="history-info">
                        <div class="history-title" title="${escapeHtml(song.title)}">${escapeHtml(song.title)}</div>
                        <div class="history-meta">
                            <span>Thêm bởi: <strong class="history-meta-user">${escapeHtml(song.added_by)}</strong></span>
                            <span>•</span>
                            <span>${timeStr} ${dateStr}</span>
                        </div>
                    </div>
                    <button class="history-add-btn" onclick="addSongFromHistory('${song.video_id}', this)" title="Thêm vào hàng đợi"></button>
                </div>
            `;
        }).join('');
    } catch (err) {
        console.error(err);
        list.innerHTML = '<div style="color:#ff6b6b; padding:12px; text-align:center;">Lỗi tải dữ liệu lịch sử. Xin thử lại sau!</div>';
    }
}

const PRESET_TOP_TAB_URLS = ['https://open.spotify.com', 'https://www.nhaccuatui.com/'];

function updateTopTabNameInUI() {
    const sidebarLabel = document.getElementById('sidebar-top-label') || document.querySelector('.sidebar-item[data-tab="top"] .sidebar-label');
    const sidebarIcon = document.getElementById('sidebar-top-icon');
    const headerTitle = document.getElementById('top-column-title');

    const tabType = userBgState.top_tab_type || 'default';
    let tabUrl = (userBgState.top_tab_url || '').trim();

    let sidebarName = 'Top nhạc';
    let headerName = 'Top nhạc';
    let iconName = 'local_fire_department';

    if (tabType === 'spotify') {
        sidebarName = 'Spotify';
        headerName = 'Spotify';
        iconName = 'graphic_eq';
    } else if (tabType === 'nct') {
        sidebarName = 'NhạcCủaTui';
        headerName = 'NhạcCủaTui (NCT)';
        iconName = 'music_note';
    } else if (tabType === 'custom' && tabUrl) {
        try {
            const host = new URL(tabUrl).hostname.replace(/^www\./, '');
            sidebarName = host.charAt(0).toUpperCase() + host.slice(1);
            headerName = sidebarName;
            iconName = 'language';
        } catch(e) {
            sidebarName = 'Trang web';
            headerName = 'Trang web ngoài';
            iconName = 'language';
        }
    }

    if (sidebarLabel) sidebarLabel.textContent = sidebarName;
    if (sidebarIcon) sidebarIcon.textContent = iconName;
    if (headerTitle) headerTitle.textContent = headerName;
}

async function loadTopNhac(forceReload = false) {
    const list = document.getElementById('top-list');
    const headerActions = document.getElementById('top-column-actions');
    if (!list) return;

    updateTopTabNameInUI();

    const tabType = userBgState.top_tab_type || 'default';
    let tabUrl = (userBgState.top_tab_url || '').trim();

    if (tabType === 'spotify' && !tabUrl) {
        tabUrl = 'https://open.spotify.com';
    } else if (tabType === 'nct' && !tabUrl) {
        tabUrl = 'https://www.nhaccuatui.com/';
    }

    if (headerActions) {
        if (tabType !== 'default' && tabUrl) {
            headerActions.innerHTML = `
                <a href="${escapeHtml(tabUrl)}" target="_blank" rel="noopener noreferrer" style="display:inline-flex; align-items:center; gap:6px; padding:6px 14px; border-radius:18px; background:rgba(255,255,255,0.08); border:1px solid rgba(255,180,210,0.2); color:var(--accent); font-size:13px; font-weight:600; text-decoration:none; transition:all 0.2s;" title="Mở trang web ở cửa sổ mới">
                    <span class="material-symbols-outlined" style="font-size:16px;">open_in_new</span>
                    <span>Mở tab mới</span>
                </a>
            `;
        } else {
            headerActions.innerHTML = '';
        }
    }

    if (tabType !== 'default' && tabUrl) {
        const existingIframe = list.querySelector('iframe');
        if (!forceReload && existingIframe && existingIframe.getAttribute('data-url') === tabUrl) {
            return;
        }

        list.innerHTML = `
            <div class="top-iframe-wrapper">
                <iframe data-url="${escapeHtml(tabUrl)}" src="${escapeHtml(tabUrl)}" title="Top Nhạc Web" style="width:100%; height:100%; border:none;" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>
            </div>
        `;
    } else {
        const hasList = list.querySelector('.history-item');
        if (!forceReload && hasList && tabType === 'default') {
            return;
        }
        loadTopNhacList();
    }
}

async function loadTopNhacList() {
    const list = document.getElementById('top-list');
    if (!list) return;
    list.innerHTML = '<div style="color:var(--text-muted); padding:12px; text-align:center;">Đang tải Top nhạc...</div>';

    try {
        const supabaseClient = supabase.createClient('https://ktqdzlhvdkerjajffgfi.supabase.co', 'sb_publishable_1wm-eXETyu07vl61sY4mBQ_xwYZVOCj');
        const { data, error } = await supabaseClient
            .from('songs')
            .select('*')
            .order('Tên', { ascending: true })
            .limit(50);

        if (error) throw error;

        if (!data || data.length === 0) {
            list.innerHTML = '<div style="color:var(--text-muted); padding:12px; text-align:center;">Chưa có bài hát nào trong Top.</div>';
            return;
        }

        const fallbackSvg = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='40' viewBox='0 0 60 40' fill='%23181824'><rect width='60' height='40' fill='%23181824'/><text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' fill='%23555' font-size='16'>🎵</text></svg>";

        list.innerHTML = data.map((song, index) => {
            let avatarUrl = song.avatar;
            if (!avatarUrl || avatarUrl.includes('placeholder.com')) {
                avatarUrl = fallbackSvg;
            }

            const title = song['Tên'] || '';
            const artist = song['Ca sĩ'] || '';
            const query = (title + ' ' + artist).trim();

            return `
                <div class="history-item">
                    <div class="history-thumb-container">
                        <img src="${escapeHtml(avatarUrl)}" alt="thumbnail" class="history-thumb-img" onerror="this.onerror=null; this.src='${fallbackSvg}';">
                        <div class="history-play-overlay">
                            <span class="material-symbols-outlined">play_arrow</span>
                        </div>
                    </div>
                    <div class="history-info">
                        <div class="history-title" title="${escapeHtml(title)}">
                            ${escapeHtml(title)} ${artist ? `<span class="history-artist">- ${escapeHtml(artist)}</span>` : ''}
                        </div>
                        <div class="history-meta">
                            <span>Đóng góp: <strong class="history-meta-user">${escapeHtml(song.add_by || 'Cộng đồng')}</strong></span>
                        </div>
                    </div>
                    <button class="history-add-btn" onclick="addSongFromHistory('${escapeHtml(query)}', this)" title="Thêm vào hàng đợi"></button>
                </div>
            `;
        }).join('');
    } catch (err) {
        console.error(err);
        list.innerHTML = '<div style="color:#ff6b6b; padding:12px; text-align:center;">Lỗi tải Top nhạc. Xin thử lại sau!</div>';
    }
}

const SUPABASE_FEEDBACK_URL = 'https://wnioetdrphkdylkoybsu.supabase.co';
const SUPABASE_FEEDBACK_KEY = 'sb_publishable_p0VSduH3epzQVUdvAf2kPQ_aoWk_l1T';

let currentFeedbackType = 'gop_y';

function updateFbCharCount(textarea) {
    const counter = document.getElementById('fb-char-counter');
    if (counter && textarea) {
        counter.textContent = `${textarea.value.length}/500`;
    }
}

function selectFeedbackType(type) {
    currentFeedbackType = type;
    document.querySelectorAll('.fb-segment-btn').forEach(btn => {
        if (btn.getAttribute('data-type') === type) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    const txt = document.getElementById('feedback-content-input');
    if (txt) {
        if (type === 'bao_loi') {
            txt.classList.add('type-bao_loi');
        } else {
            txt.classList.remove('type-bao_loi');
        }
    }
}

async function submitFeedback() {
    const contentEl = document.getElementById('feedback-content-input');
    const btn = document.getElementById('btn-submit-feedback');
    if (!contentEl || !btn) return;

    const content = (contentEl.value || '').trim();
    const type = currentFeedbackType || 'gop_y';

    if (!content) {
        showToastNotification('⚠️ Vui lòng nhập nội dung phản hồi!');
        return;
    }

    const username = myUsername || 'Ẩn danh';
    btn.disabled = true;
    const origHtml = btn.innerHTML;
    btn.innerHTML = '<span class="material-symbols-outlined" style="font-size:16px; animation: spin 1s linear infinite;">sync</span> Gửi...';

    try {
        const supabaseClient = supabase.createClient(SUPABASE_FEEDBACK_URL, SUPABASE_FEEDBACK_KEY);
        const { data, error } = await supabaseClient
            .from('web_feedback')
            .insert([{
                username: username,
                type: type,
                content: content,
                created_at: new Date().toISOString()
            }]);

        if (error) {
            console.warn('Supabase direct insert error, fallback via socket:', error.message);
            socket.emit('submitFeedback', { username, type, content });
        }

        showToastNotification('🎉 Cảm ơn bạn! Ý kiến đóng góp đã được ghi nhận.');
        contentEl.value = '';
        updateFbCharCount(contentEl);
        setTimeout(() => loadFeedbackHistory(), 300);
    } catch (err) {
        console.error('Error submitting feedback:', err);
        socket.emit('submitFeedback', { username, type, content });
        showToastNotification('🎉 Cảm ơn bạn! Ý kiến đóng góp đã được ghi nhận.');
        contentEl.value = '';
        updateFbCharCount(contentEl);
        setTimeout(() => loadFeedbackHistory(), 300);
    } finally {
        btn.disabled = false;
        btn.innerHTML = origHtml;
    }
}

function assignFeedbackCodes(items) {
    if (!items || !items.length) return items;

    const dayCounts = {};

    // Sort chronologically ascending (oldest first) to compute correct daily indices
    const sorted = [...items].sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));

    sorted.forEach(item => {
        const d = new Date(item.created_at || Date.now());
        const dayStr = String(d.getDate()).padStart(2, '0');
        const monthStr = String(d.getMonth() + 1).padStart(2, '0');
        const yearStr = String(d.getFullYear()).slice(-2);
        const dateKey = `${dayStr}${monthStr}${yearStr}`;

        if (!dayCounts[dateKey]) {
            dayCounts[dateKey] = 0;
        }
        dayCounts[dateKey]++;

        const seqStr = String(dayCounts[dateKey]).padStart(2, '0');
        item.displayCode = `#${dateKey}${seqStr}`;
    });

    return items;
}

async function loadFeedbackHistory() {
    const list = document.getElementById('feedback-list');
    const countBadge = document.getElementById('fb-count-badge');
    if (!list) return;

    // Skeleton loading state
    list.innerHTML = `
        <div class="fb-skeleton-card">
            <div class="fb-skeleton-line" style="width: 35%;"></div>
            <div class="fb-skeleton-line" style="width: 80%;"></div>
            <div class="fb-skeleton-line" style="width: 60%;"></div>
        </div>
        <div class="fb-skeleton-card">
            <div class="fb-skeleton-line" style="width: 45%;"></div>
            <div class="fb-skeleton-line" style="width: 75%;"></div>
        </div>`;

    try {
        const supabaseClient = supabase.createClient(SUPABASE_FEEDBACK_URL, SUPABASE_FEEDBACK_KEY);
        const { data, error } = await supabaseClient
            .from('web_feedback')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100);

        if (error) throw error;

        if (countBadge) {
            countBadge.textContent = (data || []).length;
        }

        if (!data || data.length === 0) {
            list.innerHTML = `
                <div class="fb-state-card">
                    <span class="material-symbols-outlined fb-state-icon">rate_review</span>
                    <h4 class="fb-state-title">Chưa có đóng góp nào</h4>
                    <p class="fb-state-desc">Hãy là người đầu tiên chia sẻ ý kiến hoặc báo lỗi để hoàn thiện ứng dụng!</p>
                </div>`;
            return;
        }

        assignFeedbackCodes(data);

        list.innerHTML = data.map(item => {
            const d = new Date(item.created_at || Date.now());
            const timeStr = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
            const dateStr = d.toLocaleDateString('vi-VN');
            const isBug = item.type === 'bao_loi';
            const badgeClass = isBug ? 'type-bao_loi' : 'type-gop_y';
            const badgeIcon = isBug ? 'bug_report' : 'lightbulb';
            const badgeText = isBug ? 'Báo lỗi' : 'Góp ý';

            const initial = (item.username || '?').charAt(0).toUpperCase();
            const avatarBg = stringToColor(item.username || '');

            return `
                <div class="fb-feed-card ${badgeClass}">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div class="fb-avatar" style="background: ${escapeHtml(avatarBg)};">${escapeHtml(initial)}</div>
                            <div>
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <span class="fb-username">${escapeHtml(item.username || 'Ẩn danh')}</span>
                                    <span class="fb-code-badge">${escapeHtml(item.displayCode || '')}</span>
                                </div>
                                <div class="fb-timestamp">${timeStr} · ${dateStr}</div>
                            </div>
                        </div>
                        <span class="fb-type-pill ${badgeClass}">
                            <span class="material-symbols-outlined" style="font-size: 14px;">${badgeIcon}</span>
                            ${badgeText}
                        </span>
                    </div>
                    <div class="fb-content-text">${escapeHtml(item.content || '')}</div>
                </div>
            `;
        }).join('');

    } catch (err) {
        console.error(err);
        list.innerHTML = `
            <div class="fb-state-card" style="border-color: rgba(255, 117, 160, 0.3);">
                <span class="material-symbols-outlined fb-state-icon" style="color: var(--accent);">wifi_off</span>
                <h4 class="fb-state-title">Không thể tải dữ liệu</h4>
                <p class="fb-state-desc" style="margin-bottom: 16px;">Đã xảy ra sự cố khi kết nối tới máy chủ lưu trữ.</p>
                <button class="fb-refresh-btn" style="margin: 0 auto;" onclick="loadFeedbackHistory()">
                    <span class="material-symbols-outlined" style="font-size: 16px;">refresh</span> Thử lại
                </button>
            </div>`;
    }
}

function addSongFromHistory(videoId, btn) {
    btn.style.backgroundImage = 'none';
    btn.innerHTML = '<span class="material-symbols-outlined" style="font-size:18px; color: #fff; animation: spin 1s linear infinite;">sync</span>';
    btn.disabled = true;

    socket.emit('addSong', videoId, (res) => {
        if (res && res.success) {
            btn.innerHTML = '<span class="material-symbols-outlined" style="font-size:20px; color: #51cf66;">check</span>';
        } else {
            btn.innerHTML = '<span class="material-symbols-outlined" style="font-size:20px; color: #ff6b6b;">close</span>';
            showToastNotification('⚠️ ' + (res && res.message ? res.message : "Không tìm thấy bài hát hoặc có lỗi xảy ra!"));
        }
        setTimeout(() => {
            btn.innerHTML = '';
            btn.disabled = false;
            btn.style.backgroundImage = '';
        }, 2000);
    });
}

let myNameColor = localStorage.getItem('musiclive_namecolor') || '#3ea6ff';
let isLoopMode = false;
let selectedAdminType = null;

// ==========================================
// SUPABASE AUTH & USER PROFILE MANAGEMENT
// ==========================================
const SUPABASE_PROJECT_URL = 'https://wnioetdrphkdylkoybsu.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_p0VSduH3epzQVUdvAf2kPQ_aoWk_l1T';
let supabaseAuth = null;

function getSupabaseAuth() {
    if (!supabaseAuth && typeof supabase !== 'undefined' && supabase.createClient) {
        try {
            supabaseAuth = supabase.createClient(SUPABASE_PROJECT_URL, SUPABASE_ANON_KEY, {
                auth: {
                    persistSession: true,
                    autoRefreshToken: true,
                    detectSessionInUrl: true
                }
            });
        } catch (e) {
            console.warn('Error creating supabase client:', e);
        }
    }
    return supabaseAuth;
}

function switchAuthTab(tab) {
    const tabLogin = document.getElementById('tab-login');
    const tabSignup = document.getElementById('tab-signup');
    const formLogin = document.getElementById('form-login');
    const formSignup = document.getElementById('form-signup');
    const statusEl = document.getElementById('auth-status-msg');

    if (statusEl) {
        statusEl.className = 'auth-status-msg hidden';
        statusEl.innerText = '';
    }

    if (tab === 'login') {
        if (tabLogin) tabLogin.classList.add('active');
        if (tabSignup) tabSignup.classList.remove('active');
        if (formLogin) formLogin.classList.remove('hidden');
        if (formSignup) formSignup.classList.add('hidden');
    } else {
        if (tabSignup) tabSignup.classList.add('active');
        if (tabLogin) tabLogin.classList.remove('active');
        if (formSignup) formSignup.classList.remove('hidden');
        if (formLogin) formLogin.classList.add('hidden');
    }
}

function setAuthStatus(message, type = 'info') {
    const el = document.getElementById('auth-status-msg');
    if (!el) return;
    if (!message) {
        el.className = 'auth-status-msg hidden';
        el.innerText = '';
        return;
    }
    el.className = `auth-status-msg ${type}`;
    el.innerText = message;
}

async function loginWithGoogle() {
    const sp = getSupabaseAuth();
    if (!sp) {
        setAuthStatus('Supabase chưa sẵn sàng, vui lòng tải lại trang!', 'error');
        return;
    }
    setAuthStatus('Đang chuyển hướng tới đăng nhập Google...', 'info');
    try {
        const { error } = await sp.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + window.location.pathname
            }
        });
        if (error) {
            setAuthStatus(error.message, 'error');
        }
    } catch (err) {
        console.error('Google login error:', err);
        setAuthStatus(err.message || 'Lỗi đăng nhập Google', 'error');
    }
}

async function handleEmailLogin() {
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const submitBtn = document.getElementById('btn-submit-login');

    const email = (emailInput?.value || '').trim();
    const password = (passwordInput?.value || '').trim();

    if (!email || !password) {
        setAuthStatus('Vui lòng nhập đầy đủ Email và Mật khẩu!', 'error');
        return;
    }

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Đang đăng nhập...';
    }
    setAuthStatus('', '');

    try {
        const sp = getSupabaseAuth();
        if (!sp) throw new Error('Supabase client chưa tải xong');
        const { data, error } = await sp.auth.signInWithPassword({
            email,
            password
        });
        if (error) {
            setAuthStatus(error.message || 'Sai email hoặc mật khẩu', 'error');
            return;
        }

        if (data && data.user) {
            setAuthStatus('Đăng nhập thành công! Đang vào phòng...', 'success');
            await handleAuthSuccess(data.user);
            if (!myQuickLockType) {
                openQuickLockSetupModal(true);
            }
        }
    } catch (err) {
        console.error('Email login error:', err);
        setAuthStatus(err.message || 'Đăng nhập thất bại', 'error');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerText = 'Đăng Nhập';
        }
    }
}

async function handleEmailSignUp() {
    const usernameInput = document.getElementById('signup-username');
    const emailInput = document.getElementById('signup-email');
    const passwordInput = document.getElementById('signup-password');
    const colorInput = document.getElementById('signup-name-color');
    const submitBtn = document.getElementById('btn-submit-signup');

    const username = (usernameInput?.value || '').trim();
    const email = (emailInput?.value || '').trim();
    const password = (passwordInput?.value || '').trim();
    const color = colorInput?.value || '#3ea6ff';

    if (!username || !email || !password) {
        setAuthStatus('Vui lòng điền đầy đủ tất cả các trường!', 'error');
        return;
    }
    if (password.length < 6) {
        setAuthStatus('Mật khẩu phải có ít nhất 6 ký tự!', 'error');
        return;
    }

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Đang đăng ký...';
    }
    setAuthStatus('', '');

    try {
        const sp = getSupabaseAuth();
        if (!sp) throw new Error('Supabase client chưa tải xong');
        const { data, error } = await sp.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username: username,
                    name_color: color,
                    role: 'member'
                }
            }
        });

        if (error) {
            setAuthStatus(error.message || 'Đăng ký thất bại', 'error');
            return;
        }

        if (data && data.user) {
            // Direct profile upsert to ensure it exists in public.profiles table
            try {
                await sp.from('profiles').upsert([{
                    id: data.user.id,
                    email: data.user.email,
                    username: username,
                    name_color: color,
                    role: 'member',
                    updated_at: new Date().toISOString()
                }]);
            } catch (pErr) {
                console.warn('Profiles upsert warning:', pErr);
            }

            if (data.session) {
                setAuthStatus('Đăng ký thành công! Đang vào phòng...', 'success');
                await handleAuthSuccess(data.user, { username, name_color: color, role: 'member' });
                openQuickLockSetupModal(true);
            } else {
                // Try immediate sign-in with password (if email confirmation is turned off)
                const loginRes = await sp.auth.signInWithPassword({ email, password });
                if (loginRes.data && loginRes.data.session) {
                    setAuthStatus('Đăng ký thành công! Đang vào phòng...', 'success');
                    await handleAuthSuccess(loginRes.data.user, { username, name_color: color, role: 'member' });
                    openQuickLockSetupModal(true);
                } else {
                    setAuthStatus('Đăng ký thành công! Bạn có thể chuyển sang tab Đăng Nhập để vào phòng.', 'success');
                    switchAuthTab('login');
                    if (document.getElementById('login-email')) document.getElementById('login-email').value = email;
                }
            }
        }
    } catch (err) {
        console.error('Email signup error:', err);
        setAuthStatus(err.message || 'Đăng ký thất bại', 'error');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerText = 'Đăng Ký Tài Khoản';
        }
    }
}

async function handleAuthSuccess(user, fallbackProfile = null) {
    if (!user) return;
    currentUserId = user.id;
    localStorage.setItem('musiclive_user_id', currentUserId);

    const sp = getSupabaseAuth();
    let profile = fallbackProfile || null;

    if (sp) {
        try {
            let profRes = await sp
                .from('profiles')
                .select('username, display_name, phone, name_color, role, avatar_url, quick_lock_type, quick_lock_data')
                .eq('id', user.id)
                .maybeSingle();

            if (profRes.error && profRes.error.message && profRes.error.message.includes('quick_lock')) {
                // Table might not have quick_lock columns yet
                profRes = await sp
                    .from('profiles')
                    .select('username, display_name, phone, name_color, role, avatar_url')
                    .eq('id', user.id)
                    .maybeSingle();
            }

            if (profRes.data && !profRes.error) {
                profile = profRes.data;
            } else if (!profile) {
                // First time profile creation fallback (e.g. Google OAuth)
                const rawMeta = user.user_metadata || {};
                const initName = rawMeta.full_name || rawMeta.name || (user.email ? user.email.split('@')[0] : 'Người dùng');
                const initColor = rawMeta.name_color || '#3ea6ff';
                const initRole = (rawMeta.role || 'member').toLowerCase();
                const initAvatar = rawMeta.avatar_url || rawMeta.picture || '';

                const { data: createdProf } = await sp.from('profiles').upsert([{
                    id: user.id,
                    email: user.email,
                    username: initName,
                    display_name: initName,
                    name_color: initColor,
                    role: initRole,
                    avatar_url: initAvatar,
                    updated_at: new Date().toISOString()
                }]).select().maybeSingle();
                if (createdProf) profile = createdProf;
            }
        } catch (e) {
            console.warn('Fetch/create profile error:', e);
        }
    }

    if (profile && profile.quick_lock_type) {
        myQuickLockType = profile.quick_lock_type;
        myQuickLockData = profile.quick_lock_data;
        localStorage.setItem('musiclive_quick_lock_type', myQuickLockType);
        localStorage.setItem('musiclive_quick_lock_data', JSON.stringify(myQuickLockData));
    }

    const rawMeta = user.user_metadata || {};
    const rawUsername = profile?.username || rawMeta.username || (user.email ? user.email.split('@')[0] : 'user');
    const displayName = profile?.display_name 
        || profile?.username 
        || rawMeta.full_name 
        || rawMeta.name 
        || rawUsername;
    const color = profile?.name_color || rawMeta.name_color || '#3ea6ff';
    const role = (profile?.role || rawMeta.role || 'member').toLowerCase();
    const avatar = profile?.avatar_url || rawMeta.avatar_url || rawMeta.picture || '';
    const phone = profile?.phone || '';

    myUsername = displayName;
    myDisplayName = profile?.display_name || displayName;
    myRawUsername = rawUsername;
    myPhone = phone;
    myNameColor = color;
    myRole = role;
    myAvatarUrl = avatar;

    localStorage.setItem('musiclive_username', myUsername);
    localStorage.setItem('musiclive_display_name', myDisplayName);
    localStorage.setItem('musiclive_raw_username', myRawUsername);
    localStorage.setItem('musiclive_phone', myPhone);
    localStorage.setItem('musiclive_avatar_url', myAvatarUrl);
    localStorage.setItem('musiclive_namecolor', myNameColor);
    localStorage.setItem('musiclive_user_role', myRole);

    updateNavbarAvatarUI(myAvatarUrl);
    updateQuickLockStatusUI();

    if (window.location.hash && (window.location.hash.includes('access_token') || window.location.hash.includes('type='))) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    joinRoom();
    initMessenger();
}

function updateNavbarAvatarUI(avatarUrl) {
    const navAvatar = document.getElementById('navbar-avatar');
    if (!navAvatar) return;
    if (avatarUrl && avatarUrl.trim()) {
        navAvatar.src = avatarUrl.trim();
        navAvatar.classList.remove('hidden');
    } else {
        navAvatar.src = '';
        navAvatar.classList.add('hidden');
    }
}

// ==========================================
// PROFILE & SECURITY SETTINGS MODAL
// ==========================================
function openProfileSettingsModal() {
    const modal = document.getElementById('profile-settings-modal');
    if (!modal) return;

    // Populate Tab 1: Personal Info
    const displayNameInput = document.getElementById('profile-display-name');
    const usernameInput = document.getElementById('profile-username');
    const phoneInput = document.getElementById('profile-phone');
    const emailInput = document.getElementById('profile-email');
    const avatarPreview = document.getElementById('profile-avatar-preview');
    const avatarUrlInput = document.getElementById('profile-avatar-url');
    const colorInput = document.getElementById('profile-name-color');

    if (displayNameInput) displayNameInput.value = myDisplayName || myUsername || '';
    if (usernameInput) usernameInput.value = myRawUsername || '';
    if (phoneInput) phoneInput.value = myPhone || '';
    if (colorInput) colorInput.value = myNameColor || '#3ea6ff';
    if (avatarUrlInput) avatarUrlInput.value = myAvatarUrl || '';
    if (avatarPreview) {
        avatarPreview.src = myAvatarUrl || '/assets/images/placeholder.jpg';
    }

    // Try fetching fresh email and user metadata from Supabase
    const sp = getSupabaseAuth();
    if (sp) {
        sp.auth.getUser().then(({ data: { user } }) => {
            if (user) {
                if (emailInput) emailInput.value = user.email || '';
                if (!usernameInput.value && user.user_metadata?.username) {
                    usernameInput.value = user.user_metadata.username;
                }
            }
        }).catch(err => console.warn('Get user error:', err));
    }

    // Reset status messages
    setProfileStatus('', '');
    setSecurityStatus('', '');

    // Reset password inputs
    const newPwd = document.getElementById('profile-new-password');
    const confirmPwd = document.getElementById('profile-confirm-password');
    if (newPwd) newPwd.value = '';
    if (confirmPwd) confirmPwd.value = '';

    pendingAvatarFile = null;
    updateQuickLockStatusUI();
    switchProfileTab('personal');
    modal.classList.remove('hidden');
}

function closeProfileSettingsModal() {
    const modal = document.getElementById('profile-settings-modal');
    if (modal) modal.classList.add('hidden');
    pendingAvatarFile = null;
}

function switchProfileTab(tab) {
    const tabBtnPersonal = document.getElementById('tab-btn-personal');
    const tabBtnSecurity = document.getElementById('tab-btn-security');
    const contentPersonal = document.getElementById('profile-tab-personal');
    const contentSecurity = document.getElementById('profile-tab-security');

    if (tab === 'personal') {
        if (tabBtnPersonal) tabBtnPersonal.classList.add('active');
        if (tabBtnSecurity) tabBtnSecurity.classList.remove('active');
        if (contentPersonal) contentPersonal.classList.remove('hidden');
        if (contentSecurity) contentSecurity.classList.add('hidden');
    } else {
        if (tabBtnSecurity) tabBtnSecurity.classList.add('active');
        if (tabBtnPersonal) tabBtnPersonal.classList.remove('active');
        if (contentSecurity) contentSecurity.classList.remove('hidden');
        if (contentPersonal) contentPersonal.classList.add('hidden');
    }
}

function setProfileStatus(msg, type = 'info') {
    const el = document.getElementById('profile-status-msg');
    if (!el) return;
    if (!msg) {
        el.className = 'auth-status-msg hidden';
        el.innerText = '';
        return;
    }
    el.className = `auth-status-msg ${type}`;
    el.innerText = msg;
}

function setSecurityStatus(msg, type = 'info') {
    const el = document.getElementById('security-status-msg');
    if (!el) return;
    if (!msg) {
        el.className = 'auth-status-msg hidden';
        el.innerText = '';
        return;
    }
    el.className = `auth-status-msg ${type}`;
    el.innerText = msg;
}

function handleProfileAvatarFileSelect(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    pendingAvatarFile = file;
    const reader = new FileReader();
    reader.onload = (event) => {
        const preview = document.getElementById('profile-avatar-preview');
        if (preview) preview.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

function updateProfileAvatarUrlPreview(url) {
    const preview = document.getElementById('profile-avatar-preview');
    if (preview) {
        if (url && url.trim()) {
            preview.src = url.trim();
        } else {
            preview.src = myAvatarUrl || '/assets/images/placeholder.jpg';
        }
    }
}

async function uploadAvatarFileToSupabase(file) {
    if (!file) return '';
    try {
        const compressed = await compressImage(file, 400, 400, 0.9);
        const fileExt = (file.name && file.name.includes('.')) ? (file.name.split('.').pop() || 'jpg') : 'jpg';
        const fileName = `avatar_${currentUserId || 'user'}_${Date.now()}.${fileExt}`;

        const sp = getSupabaseAuth();
        if (sp) {
            const { data, error } = await sp.storage.from('chat_media').upload(fileName, compressed, {
                cacheControl: '3600',
                upsert: true
            });
            if (!error && data) {
                const { data: urlData } = sp.storage.from('chat_media').getPublicUrl(fileName);
                if (urlData && urlData.publicUrl) return urlData.publicUrl;
            } else if (error) {
                console.warn('Storage upload error, fallback to DataURL:', error.message);
            }
        }
    } catch (err) {
        console.warn('Upload avatar failed:', err);
    }

    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => resolve('');
        reader.readAsDataURL(file);
    });
}

async function saveUserProfile() {
    const displayNameInput = document.getElementById('profile-display-name');
    const usernameInput = document.getElementById('profile-username');
    const phoneInput = document.getElementById('profile-phone');
    const avatarUrlInput = document.getElementById('profile-avatar-url');
    const colorInput = document.getElementById('profile-name-color');
    const saveBtn = document.getElementById('btn-save-profile');

    const displayName = (displayNameInput?.value || '').trim();
    const username = (usernameInput?.value || '').trim();
    const phone = (phoneInput?.value || '').trim();
    let avatarUrl = (avatarUrlInput?.value || '').trim();
    const nameColor = colorInput?.value || '#3ea6ff';

    if (!displayName) {
        setProfileStatus('Vui lòng nhập tên hiển thị!', 'error');
        return;
    }

    if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<span class="material-symbols-outlined" style="font-size: 18px;">hourglass_top</span> Đang lưu...';
    }
    setProfileStatus('', '');

    try {
        if (pendingAvatarFile) {
            setProfileStatus('Đang tải ảnh đại diện lên...', 'info');
            const uploadedUrl = await uploadAvatarFileToSupabase(pendingAvatarFile);
            if (uploadedUrl) {
                avatarUrl = uploadedUrl;
                if (avatarUrlInput) avatarUrlInput.value = avatarUrl;
            }
        }

        const sp = getSupabaseAuth();
        if (sp && currentUserId) {
            const updatePayload = {
                id: currentUserId,
                username: username || displayName,
                display_name: displayName,
                phone: phone,
                avatar_url: avatarUrl,
                name_color: nameColor,
                updated_at: new Date().toISOString()
            };

            const { error } = await sp.from('profiles').upsert([updatePayload]);
            if (error) {
                if (error.message && (error.message.includes('display_name') || error.message.includes('phone'))) {
                    delete updatePayload.display_name;
                    delete updatePayload.phone;
                    await sp.from('profiles').upsert([updatePayload]);
                } else {
                    throw error;
                }
            }
        }

        // Update local state
        myDisplayName = displayName;
        myRawUsername = username || myRawUsername;
        myUsername = displayName;
        myPhone = phone;
        myAvatarUrl = avatarUrl;
        myNameColor = nameColor;

        localStorage.setItem('musiclive_username', myUsername);
        localStorage.setItem('musiclive_display_name', myDisplayName);
        localStorage.setItem('musiclive_raw_username', myRawUsername);
        localStorage.setItem('musiclive_phone', myPhone);
        localStorage.setItem('musiclive_avatar_url', myAvatarUrl);
        localStorage.setItem('musiclive_namecolor', myNameColor);

        // Update Navbar UI
        const navUser = document.getElementById('navbar-username');
        if (navUser) {
            navUser.textContent = myUsername;
            navUser.style.color = myNameColor;
        }
        updateNavbarAvatarUI(myAvatarUrl);

        // Notify socket server
        if (socket && socket.connected) {
            socket.emit('updateUserProfile', {
                userId: currentUserId,
                displayName: myDisplayName,
                username: myRawUsername,
                phone: myPhone,
                avatarUrl: myAvatarUrl,
                nameColor: myNameColor
            });
        }

        pendingAvatarFile = null;
        setProfileStatus('Đã lưu thông tin cá nhân thành công!', 'success');
        if (typeof showToastNotification === 'function') {
            showToastNotification('🎉 Đã cập nhật thông tin cá nhân thành công!');
        }

        setTimeout(() => {
            closeProfileSettingsModal();
        }, 1200);

    } catch (err) {
        console.error('Save profile error:', err);
        setProfileStatus(err.message || 'Lỗi khi lưu thông tin cá nhân', 'error');
    } finally {
        if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.innerHTML = '<span class="material-symbols-outlined" style="font-size: 18px;">check</span> Lưu Thông Tin';
        }
    }
}

async function updateUserPassword() {
    const newPwdInput = document.getElementById('profile-new-password');
    const confirmPwdInput = document.getElementById('profile-confirm-password');
    const submitBtn = document.getElementById('btn-update-password');

    const newPassword = (newPwdInput?.value || '').trim();
    const confirmPassword = (confirmPwdInput?.value || '').trim();

    if (!newPassword || !confirmPassword) {
        setSecurityStatus('Vui lòng điền đầy đủ cả 2 ô mật khẩu!', 'error');
        return;
    }
    if (newPassword.length < 6) {
        setSecurityStatus('Mật khẩu mới phải có ít nhất 6 ký tự!', 'error');
        return;
    }
    if (newPassword !== confirmPassword) {
        setSecurityStatus('Mật khẩu xác nhận không khớp, vui lòng kiểm tra lại!', 'error');
        return;
    }

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="material-symbols-outlined" style="font-size: 18px;">hourglass_top</span> Đang cập nhật...';
    }
    setSecurityStatus('', '');

    try {
        const sp = getSupabaseAuth();
        if (!sp) throw new Error('Supabase client chưa sẵn sàng!');

        const { data, error } = await sp.auth.updateUser({
            password: newPassword
        });

        if (error) {
            setSecurityStatus(error.message || 'Cập nhật mật khẩu thất bại!', 'error');
            return;
        }

        setSecurityStatus('🎉 Đã đổi mật khẩu mới thành công!', 'success');
        if (newPwdInput) newPwdInput.value = '';
        if (confirmPwdInput) confirmPwdInput.value = '';
        if (typeof showToastNotification === 'function') {
            showToastNotification('🔒 Đã đổi mật khẩu thành công!');
        }
    } catch (err) {
        console.error('Update password error:', err);
        setSecurityStatus(err.message || 'Đổi mật khẩu thất bại', 'error');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span class="material-symbols-outlined" style="font-size: 18px;">save</span> Cập Nhật Mật Khẩu';
        }
    }
}

async function sendPasswordResetEmail() {
    const emailInput = document.getElementById('profile-email');
    const sendBtn = document.getElementById('btn-send-reset-email');
    const email = (emailInput?.value || '').trim();

    if (!email) {
        setSecurityStatus('Không tìm thấy email tài khoản của bạn!', 'error');
        return;
    }

    if (sendBtn) {
        sendBtn.disabled = true;
        sendBtn.innerText = 'Đang gửi email...';
    }
    setSecurityStatus('', '');

    try {
        const sp = getSupabaseAuth();
        if (!sp) throw new Error('Supabase client chưa sẵn sàng!');

        const { error } = await sp.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + window.location.pathname
        });

        if (error) {
            setSecurityStatus(error.message || 'Gửi email đặt lại mật khẩu thất bại', 'error');
            return;
        }

        setSecurityStatus(`Đã gửi liên kết đặt lại mật khẩu tới hộp thư [${email}]. Vui lòng kiểm tra email của bạn!`, 'success');
    } catch (err) {
        console.error('Send reset email error:', err);
        setSecurityStatus(err.message || 'Gửi email thất bại', 'error');
    } finally {
        if (sendBtn) {
            sendBtn.disabled = false;
            sendBtn.innerHTML = '<span class="material-symbols-outlined" style="font-size: 18px;">outgoing_mail</span> Gửi Email Đặt Lại Mật Khẩu';
        }
    }
}

// ==========================================
// QUICK UNLOCK & QUICK LOCK SETUP SYSTEM
// ==========================================

const SECURITY_QUESTION_TEMPLATES = [
    { id: 'dob', text: 'Ngày tháng năm sinh của bạn là gì?' },
    { id: 'nickname', text: 'Tên ở nhà (biệt danh) của bạn là gì?' },
    { id: 'father_name', text: 'Tên của bố bạn là gì?' },
    { id: 'mother_name', text: 'Tên của mẹ bạn là gì?' },
    { id: 'important_date', text: 'Ngày quan trọng nhất cuộc đời của bạn là ngày nào?' },
    { id: 'important_person', text: 'Người quan trọng nhất cuộc đời của bạn là ai?' },
    { id: 'cccd', text: 'Mã số Căn cước công dân (CCCD) của bạn là gì?' }
];

async function hashQuickLockSecret(val) {
    if (val === null || val === undefined) return '';
    const norm = val.toString().trim().toLowerCase().replace(/\s+/g, ' ');
    if (!norm) return '';
    try {
        if (window.crypto && window.crypto.subtle) {
            const msgBuffer = new TextEncoder().encode(norm);
            const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        }
    } catch (e) {
        console.warn('Crypto subtle not available, fallback hashing:', e);
    }
    let hash = 0;
    for (let i = 0; i < norm.length; i++) {
        const char = norm.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0;
    }
    return 'fallback_' + Math.abs(hash).toString(16);
}

function setUnlockStatus(msg, type = 'info') {
    const el = document.getElementById('unlock-status-msg');
    if (!el) return;
    if (!msg) {
        el.className = 'auth-status-msg hidden';
        el.innerText = '';
        return;
    }
    el.className = `auth-status-msg ${type}`;
    el.innerText = msg;
}

function setSetupLockStatus(msg, type = 'info') {
    const el = document.getElementById('setup-lock-status-msg');
    if (!el) return;
    if (!msg) {
        el.className = 'auth-status-msg hidden';
        el.innerText = '';
        return;
    }
    el.className = `auth-status-msg ${type}`;
    el.innerText = msg;
}

function updateQuickLockStatusUI() {
    const iconEl = document.getElementById('profile-quick-lock-icon');
    const statusEl = document.getElementById('profile-quick-lock-status');
    if (!iconEl || !statusEl) return;

    if (myQuickLockType === 'pin') {
        iconEl.innerText = 'dialpad';
        statusEl.innerText = 'Đã cài: Mã PIN 6 số';
    } else if (myQuickLockType === 'pattern') {
        iconEl.innerText = 'gesture';
        statusEl.innerText = 'Đã cài: Khóa hình vẽ';
    } else if (myQuickLockType === 'questions') {
        iconEl.innerText = 'quiz';
        statusEl.innerText = 'Đã cài: 3 Câu hỏi bảo mật';
    } else {
        iconEl.innerText = 'shield';
        statusEl.innerText = 'Chưa thiết lập';
    }
}

let selectedQuickLockSetupType = 'pin';
let isFirstTimeLockPrompt = false;

function openQuickLockSetupModal(isFirstTime = false) {
    isFirstTimeLockPrompt = isFirstTime;
    const modal = document.getElementById('quick-lock-setup-modal');
    if (!modal) return;

    const skipBtn = document.getElementById('btn-skip-quick-lock');
    if (skipBtn) {
        skipBtn.innerText = isFirstTime ? 'Bỏ qua' : 'Đóng';
    }

    setSetupLockStatus('', '');

    const initialType = myQuickLockType || 'pin';
    selectQuickLockType(initialType);

    modal.classList.remove('hidden');
}

function closeQuickLockSetupModal(isSkip = false) {
    const modal = document.getElementById('quick-lock-setup-modal');
    if (modal) modal.classList.add('hidden');
}

function selectQuickLockType(type) {
    selectedQuickLockSetupType = type;

    const tabPin = document.getElementById('ql-tab-pin');
    const tabPattern = document.getElementById('ql-tab-pattern');
    const tabQuestions = document.getElementById('ql-tab-questions');
    if (tabPin) tabPin.classList.toggle('active', type === 'pin');
    if (tabPattern) tabPattern.classList.toggle('active', type === 'pattern');
    if (tabQuestions) tabQuestions.classList.toggle('active', type === 'questions');

    const formPin = document.getElementById('setup-form-pin');
    const formPattern = document.getElementById('setup-form-pattern');
    const formQuestions = document.getElementById('setup-form-questions');
    if (formPin) formPin.classList.toggle('hidden', type !== 'pin');
    if (formPattern) formPattern.classList.toggle('hidden', type !== 'pattern');
    if (formQuestions) formQuestions.classList.toggle('hidden', type !== 'questions');

    setSetupLockStatus('', '');

    if (type === 'pin') {
        resetSetupPin();
    } else if (type === 'pattern') {
        setTimeout(initSetupPatternCanvas, 50);
        resetSetupPattern();
    } else if (type === 'questions') {
        populateSetupQuestions();
    }
}

// ------------------------------------------
// Pattern Lock Engine (Setup + Unlock)
// ------------------------------------------
const PATTERN_GRID_NODES = [
    { index: 0, x: 45, y: 45 },
    { index: 1, x: 140, y: 45 },
    { index: 2, x: 235, y: 45 },
    { index: 3, x: 45, y: 140 },
    { index: 4, x: 140, y: 140 },
    { index: 5, x: 235, y: 140 },
    { index: 6, x: 45, y: 235 },
    { index: 7, x: 140, y: 235 },
    { index: 8, x: 235, y: 235 }
];

const PATTERN_MIDPOINTS = {
    '0-2': 1, '2-0': 1,
    '3-5': 4, '5-3': 4,
    '6-8': 7, '8-6': 7,
    '0-6': 3, '6-0': 3,
    '1-7': 4, '7-1': 4,
    '2-8': 5, '8-2': 5,
    '0-8': 4, '8-0': 4,
    '2-6': 4, '6-2': 4
};

function getPatternNodeAtPos(x, y, radius = 28) {
    for (let i = 0; i < PATTERN_GRID_NODES.length; i++) {
        const n = PATTERN_GRID_NODES[i];
        const dist = Math.hypot(n.x - x, n.y - y);
        if (dist <= radius) return n.index;
    }
    return null;
}

function drawPatternGrid(canvas, points = [], currentPos = null, state = 'normal') {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let primaryColor = '#ff75a0';
    let ringBgColor = 'rgba(255, 117, 160, 0.25)';

    if (state === 'error') {
        primaryColor = '#ff4757';
        ringBgColor = 'rgba(255, 71, 87, 0.3)';
    } else if (state === 'success') {
        primaryColor = '#51cf66';
        ringBgColor = 'rgba(81, 207, 102, 0.3)';
    }

    // 1. Draw connection lines
    if (points.length > 0) {
        ctx.beginPath();
        const firstNode = PATTERN_GRID_NODES[points[0]];
        ctx.moveTo(firstNode.x, firstNode.y);
        for (let i = 1; i < points.length; i++) {
            const n = PATTERN_GRID_NODES[points[i]];
            ctx.lineTo(n.x, n.y);
        }
        if (currentPos) {
            ctx.lineTo(currentPos.x, currentPos.y);
        }
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowColor = primaryColor;
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.shadowBlur = 0;
    }

    // 2. Draw all 9 nodes
    for (let i = 0; i < PATTERN_GRID_NODES.length; i++) {
        const node = PATTERN_GRID_NODES[i];
        const isVisited = points.includes(i);

        if (isVisited) {
            ctx.beginPath();
            ctx.arc(node.x, node.y, 22, 0, Math.PI * 2);
            ctx.fillStyle = ringBgColor;
            ctx.fill();
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = primaryColor;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(node.x, node.y, 7, 0, Math.PI * 2);
            ctx.fillStyle = primaryColor;
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.arc(node.x, node.y, 18, 0, Math.PI * 2);
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(node.x, node.y, 5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.fill();
        }
    }
}

function getPointerCanvasPos(canvas, e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
    };
}

// ------------------------------------------
// Pattern Setup Logic
// ------------------------------------------
let setupPatternStep = 1;
let setupPatternFirst = null;
let setupPatternConfirmed = null;
let isDrawingSetupPattern = false;
let currentSetupPattern = [];
let setupPatternCanvasInitialized = false;

function initSetupPatternCanvas() {
    const canvas = document.getElementById('setup-pattern-canvas');
    if (!canvas || setupPatternCanvasInitialized) {
        if (canvas) drawPatternGrid(canvas, []);
        return;
    }

    setupPatternCanvasInitialized = true;

    const onPointerDown = (e) => {
        e.preventDefault();
        try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
        isDrawingSetupPattern = true;
        currentSetupPattern = [];
        const pos = getPointerCanvasPos(canvas, e);
        const nodeIdx = getPatternNodeAtPos(pos.x, pos.y);
        if (nodeIdx !== null) {
            currentSetupPattern.push(nodeIdx);
        }
        drawPatternGrid(canvas, currentSetupPattern, pos);
    };

    const onPointerMove = (e) => {
        if (!isDrawingSetupPattern) return;
        e.preventDefault();
        const pos = getPointerCanvasPos(canvas, e);
        const nodeIdx = getPatternNodeAtPos(pos.x, pos.y);
        if (nodeIdx !== null && !currentSetupPattern.includes(nodeIdx)) {
            if (currentSetupPattern.length > 0) {
                const lastIdx = currentSetupPattern[currentSetupPattern.length - 1];
                const key = `${lastIdx}-${nodeIdx}`;
                if (PATTERN_MIDPOINTS[key] !== undefined) {
                    const mid = PATTERN_MIDPOINTS[key];
                    if (!currentSetupPattern.includes(mid)) {
                        currentSetupPattern.push(mid);
                    }
                }
            }
            currentSetupPattern.push(nodeIdx);
        }
        drawPatternGrid(canvas, currentSetupPattern, pos);
    };

    const onPointerUp = async (e) => {
        if (!isDrawingSetupPattern) return;
        isDrawingSetupPattern = false;
        try { canvas.releasePointerCapture(e.pointerId); } catch (_) {}

        const stepText = document.getElementById('setup-pattern-step-text');

        if (setupPatternStep === 1) {
            if (currentSetupPattern.length < 4) {
                setSetupLockStatus('Hình vẽ phải kết nối ít nhất 4 điểm!', 'error');
                drawPatternGrid(canvas, currentSetupPattern, null, 'error');
                canvas.classList.add('shake-anim');
                setTimeout(() => {
                    canvas.classList.remove('shake-anim');
                    currentSetupPattern = [];
                    drawPatternGrid(canvas, []);
                }, 600);
                return;
            }

            setupPatternFirst = [...currentSetupPattern];
            setupPatternStep = 2;
            currentSetupPattern = [];
            if (stepText) {
                stepText.innerHTML = 'Bước 2: Vẽ lại hình khóa để xác nhận';
            }
            setSetupLockStatus('Đã ghi nhận hình vẽ mẫu! Vui lòng vẽ lại một lần nữa để xác nhận.', 'info');
            drawPatternGrid(canvas, []);
        } else if (setupPatternStep === 2) {
            const isMatch = currentSetupPattern.length === setupPatternFirst.length &&
                currentSetupPattern.every((v, i) => v === setupPatternFirst[i]);

            if (isMatch) {
                setupPatternConfirmed = [...currentSetupPattern];
                if (stepText) {
                    stepText.innerHTML = '✅ Hình vẽ xác nhận khớp thành công!';
                }
                setSetupLockStatus('🎉 Hình vẽ đã xác nhận khớp! Hãy nhấn "Lưu Cài Đặt Khóa" bên dưới.', 'success');
                drawPatternGrid(canvas, setupPatternConfirmed, null, 'success');
            } else {
                if (stepText) {
                    stepText.innerHTML = '❌ Hình vẽ xác nhận không khớp!';
                }
                setSetupLockStatus('Hình vẽ xác nhận không khớp! Vui lòng vẽ lại từ Bước 1.', 'error');
                drawPatternGrid(canvas, currentSetupPattern, null, 'error');
                canvas.classList.add('shake-anim');
                setTimeout(() => {
                    canvas.classList.remove('shake-anim');
                    resetSetupPattern();
                }, 800);
            }
        }
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);

    drawPatternGrid(canvas, []);
}

function resetSetupPattern() {
    setupPatternStep = 1;
    setupPatternFirst = null;
    setupPatternConfirmed = null;
    currentSetupPattern = [];
    isDrawingSetupPattern = false;

    const stepText = document.getElementById('setup-pattern-step-text');
    if (stepText) {
        stepText.innerHTML = 'Bước 1: Vẽ hình khóa mẫu (kết nối tối thiểu 4 điểm)';
    }
    const canvas = document.getElementById('setup-pattern-canvas');
    if (canvas) {
        canvas.classList.remove('shake-anim');
        drawPatternGrid(canvas, []);
    }
}

// ------------------------------------------
// Pattern Unlock Logic
// ------------------------------------------
let isDrawingUnlockPattern = false;
let currentUnlockPattern = [];
let unlockPatternCanvasInitialized = false;

function initUnlockPatternCanvas() {
    const canvas = document.getElementById('unlock-pattern-canvas');
    if (!canvas) return;

    drawPatternGrid(canvas, []);

    if (unlockPatternCanvasInitialized) return;
    unlockPatternCanvasInitialized = true;

    const onPointerDown = (e) => {
        e.preventDefault();
        try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
        isDrawingUnlockPattern = true;
        currentUnlockPattern = [];
        setUnlockStatus('', '');
        const pos = getPointerCanvasPos(canvas, e);
        const nodeIdx = getPatternNodeAtPos(pos.x, pos.y);
        if (nodeIdx !== null) {
            currentUnlockPattern.push(nodeIdx);
        }
        drawPatternGrid(canvas, currentUnlockPattern, pos);
    };

    const onPointerMove = (e) => {
        if (!isDrawingUnlockPattern) return;
        e.preventDefault();
        const pos = getPointerCanvasPos(canvas, e);
        const nodeIdx = getPatternNodeAtPos(pos.x, pos.y);
        if (nodeIdx !== null && !currentUnlockPattern.includes(nodeIdx)) {
            if (currentUnlockPattern.length > 0) {
                const lastIdx = currentUnlockPattern[currentUnlockPattern.length - 1];
                const key = `${lastIdx}-${nodeIdx}`;
                if (PATTERN_MIDPOINTS[key] !== undefined) {
                    const mid = PATTERN_MIDPOINTS[key];
                    if (!currentUnlockPattern.includes(mid)) {
                        currentUnlockPattern.push(mid);
                    }
                }
            }
            currentUnlockPattern.push(nodeIdx);
        }
        drawPatternGrid(canvas, currentUnlockPattern, pos);
    };

    const onPointerUp = async (e) => {
        if (!isDrawingUnlockPattern) return;
        isDrawingUnlockPattern = false;
        try { canvas.releasePointerCapture(e.pointerId); } catch (_) {}

        if (currentUnlockPattern.length < 4) {
            setUnlockStatus('Hình vẽ không hợp lệ (quá ngắn)!', 'error');
            drawPatternGrid(canvas, currentUnlockPattern, null, 'error');
            canvas.classList.add('shake-anim');
            setTimeout(() => {
                canvas.classList.remove('shake-anim');
                currentUnlockPattern = [];
                drawPatternGrid(canvas, []);
            }, 600);
            return;
        }

        const patternStr = currentUnlockPattern.join(',');
        const hash = await hashQuickLockSecret(patternStr);

        if (myQuickLockData && hash === myQuickLockData.hash) {
            drawPatternGrid(canvas, currentUnlockPattern, null, 'success');
            setUnlockStatus('🎉 Mở khóa thành công!', 'success');
            setTimeout(completeQuickUnlock, 250);
        } else {
            drawPatternGrid(canvas, currentUnlockPattern, null, 'error');
            canvas.classList.add('shake-anim');
            setUnlockStatus('❌ Hình vẽ không đúng, vui lòng thử lại!', 'error');
            setTimeout(() => {
                canvas.classList.remove('shake-anim');
                currentUnlockPattern = [];
                drawPatternGrid(canvas, []);
            }, 700);
        }
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);
}

// ------------------------------------------
// 6-Digit PIN Logic (Randomized Keypad + Keyboard)
// ------------------------------------------

function getShuffledDigits() {
    const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = digits.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [digits[i], digits[j]] = [digits[j], digits[i]];
    }
    return digits;
}

function renderKeypadHTML(containerId, onDigitFnName, onClearFnName, onBackspaceFnName) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const digits = getShuffledDigits();
    let html = '';
    for (let i = 0; i < 9; i++) {
        html += `<button type="button" class="pin-key" onclick="${onDigitFnName}('${digits[i]}')">${digits[i]}</button>`;
    }
    // Row 4: Clear, 10th digit, Backspace
    html += `<button type="button" class="pin-key pin-key-action" onclick="${onClearFnName}()" title="Xóa toàn bộ">
        <span class="material-symbols-outlined" style="font-size: 18px;">restart_alt</span>
    </button>`;
    html += `<button type="button" class="pin-key" onclick="${onDigitFnName}('${digits[9]}')">${digits[9]}</button>`;
    html += `<button type="button" class="pin-key pin-key-action" onclick="${onBackspaceFnName}()" title="Xóa ký tự vừa nhập">
        <span class="material-symbols-outlined" style="font-size: 20px;">backspace</span>
    </button>`;

    container.innerHTML = html;
}

// --- Unlock PIN Logic ---
let unlockEnteredPin = '';

function renderUnlockPinKeypad() {
    renderKeypadHTML('unlock-pin-keypad', 'handlePinKeyClick', 'handlePinKeyClear', 'handlePinKeyBackspace');
}

function updateUnlockPinDots(state = 'normal') {
    const container = document.getElementById('unlock-pin-dots');
    if (!container) return;
    const dots = container.querySelectorAll('.pin-dot');
    dots.forEach((dot, idx) => {
        dot.className = 'pin-dot';
        if (idx < unlockEnteredPin.length) {
            dot.classList.add('filled');
        }
        if (state === 'error') dot.classList.add('error');
        if (state === 'success') dot.classList.add('success');
    });
}

function handlePinKeyClick(digit) {
    if (activeQuickUnlockType !== 'pin') return;
    if (unlockEnteredPin.length >= 6) return;

    unlockEnteredPin += digit.toString();
    updateUnlockPinDots('normal');
    setUnlockStatus('', '');

    if (unlockEnteredPin.length === 6) {
        setTimeout(verifyPinUnlock, 120);
    }
}

function handlePinKeyBackspace() {
    if (activeQuickUnlockType !== 'pin') return;
    if (unlockEnteredPin.length > 0) {
        unlockEnteredPin = unlockEnteredPin.slice(0, -1);
        updateUnlockPinDots('normal');
    }
}

function handlePinKeyClear() {
    if (activeQuickUnlockType !== 'pin') return;
    unlockEnteredPin = '';
    updateUnlockPinDots('normal');
    renderUnlockPinKeypad();
}

async function verifyPinUnlock() {
    if (unlockEnteredPin.length !== 6) return;

    const hash = await hashQuickLockSecret(unlockEnteredPin);
    if (myQuickLockData && hash === myQuickLockData.hash) {
        updateUnlockPinDots('success');
        setUnlockStatus('🎉 Mã PIN chính xác!', 'success');
        setTimeout(completeQuickUnlock, 250);
    } else {
        updateUnlockPinDots('error');
        const container = document.getElementById('unlock-pin-dots');
        if (container) {
            container.classList.add('shake-anim');
        }
        setUnlockStatus('❌ Mã PIN không chính xác, vui lòng nhập lại!', 'error');
        setTimeout(() => {
            if (container) container.classList.remove('shake-anim');
            unlockEnteredPin = '';
            updateUnlockPinDots('normal');
            // Reshuffle keypad on failed attempt (banking style)
            renderUnlockPinKeypad();
        }, 700);
    }
}

// --- Setup PIN Logic ---
let setupPinStep = 1;
let setupPinFirst = '';
let setupPinConfirmed = '';
let setupPinCurrent = '';

function renderSetupPinKeypad() {
    renderKeypadHTML('setup-pin-keypad', 'handleSetupPinKeyClick', 'handleSetupPinKeyClear', 'handleSetupPinKeyBackspace');
}

function updateSetupPinDots(state = 'normal') {
    const container = document.getElementById('setup-pin-dots');
    if (!container) return;
    const dots = container.querySelectorAll('.pin-dot');
    dots.forEach((dot, idx) => {
        dot.className = 'pin-dot';
        if (idx < setupPinCurrent.length) {
            dot.classList.add('filled');
        }
        if (state === 'error') dot.classList.add('error');
        if (state === 'success') dot.classList.add('success');
    });
}

function resetSetupPin() {
    setupPinStep = 1;
    setupPinFirst = '';
    setupPinConfirmed = '';
    setupPinCurrent = '';
    const stepText = document.getElementById('setup-pin-step-text');
    if (stepText) stepText.innerHTML = 'Bước 1: Nhập mã PIN 6 số mới';
    setSetupLockStatus('', '');
    updateSetupPinDots('normal');
    renderSetupPinKeypad();
}

function handleSetupPinKeyClick(digit) {
    if (selectedQuickLockSetupType !== 'pin') return;
    if (setupPinCurrent.length >= 6) return;

    setupPinCurrent += digit.toString();
    updateSetupPinDots('normal');
    setSetupLockStatus('', '');

    if (setupPinCurrent.length === 6) {
        setTimeout(processSetupPinStepCompletion, 150);
    }
}

function handleSetupPinKeyBackspace() {
    if (selectedQuickLockSetupType !== 'pin') return;
    if (setupPinCurrent.length > 0) {
        setupPinCurrent = setupPinCurrent.slice(0, -1);
        updateSetupPinDots('normal');
    }
}

function handleSetupPinKeyClear() {
    if (selectedQuickLockSetupType !== 'pin') return;
    setupPinCurrent = '';
    updateSetupPinDots('normal');
    renderSetupPinKeypad();
}

function processSetupPinStepCompletion() {
    const stepText = document.getElementById('setup-pin-step-text');

    if (setupPinStep === 1) {
        setupPinFirst = setupPinCurrent;
        setupPinStep = 2;
        setupPinCurrent = '';
        if (stepText) {
            stepText.innerHTML = 'Bước 2: Nhập lại mã PIN 6 số để xác nhận';
        }
        setSetupLockStatus('Đã ghi nhận mã PIN mẫu! Vui lòng nhập lại một lần nữa để xác nhận.', 'info');
        updateSetupPinDots('normal');
        // Reshuffle keypad for step 2!
        renderSetupPinKeypad();
    } else if (setupPinStep === 2) {
        if (setupPinCurrent === setupPinFirst) {
            setupPinConfirmed = setupPinCurrent;
            if (stepText) {
                stepText.innerHTML = '✅ Mã PIN xác nhận khớp thành công!';
            }
            updateSetupPinDots('success');
            setSetupLockStatus('🎉 Mã PIN đã xác nhận khớp! Hãy nhấn "Lưu Cài Đặt Khóa" bên dưới.', 'success');
        } else {
            if (stepText) {
                stepText.innerHTML = '❌ Mã PIN xác nhận không khớp!';
            }
            updateSetupPinDots('error');
            const container = document.getElementById('setup-pin-dots');
            if (container) container.classList.add('shake-anim');
            setSetupLockStatus('Mã PIN xác nhận không khớp! Vui lòng nhập lại từ Bước 1.', 'error');
            setTimeout(() => {
                if (container) container.classList.remove('shake-anim');
                resetSetupPin();
            }, 800);
        }
    }
}

// --- Keyboard listener for PIN entry ---
window.addEventListener('keydown', (e) => {
    // 1. If unlock modal is active and type is pin
    const unlockModal = document.getElementById('quick-unlock-modal');
    if (unlockModal && !unlockModal.classList.contains('hidden') && activeQuickUnlockType === 'pin') {
        if (e.key >= '0' && e.key <= '9') {
            e.preventDefault();
            handlePinKeyClick(e.key);
        } else if (e.key === 'Backspace') {
            e.preventDefault();
            handlePinKeyBackspace();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            handlePinKeyClear();
        }
        return;
    }

    // 2. If setup modal is active and tab is pin
    const setupModal = document.getElementById('quick-lock-setup-modal');
    if (setupModal && !setupModal.classList.contains('hidden') && selectedQuickLockSetupType === 'pin') {
        if (e.key >= '0' && e.key <= '9') {
            e.preventDefault();
            handleSetupPinKeyClick(e.key);
        } else if (e.key === 'Backspace') {
            e.preventDefault();
            handleSetupPinKeyBackspace();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            handleSetupPinKeyClear();
        }
        return;
    }
});

// ------------------------------------------
// Security Questions Logic (Setup + Unlock)
// ------------------------------------------
function populateSetupQuestions() {
    const s1 = document.getElementById('setup-q1-select');
    const s2 = document.getElementById('setup-q2-select');
    const s3 = document.getElementById('setup-q3-select');

    if (!s1 || !s2 || !s3) return;

    const renderOptions = (selectEl, defaultIndex) => {
        selectEl.innerHTML = '';
        SECURITY_QUESTION_TEMPLATES.forEach((q, idx) => {
            const opt = document.createElement('option');
            opt.value = q.id;
            opt.textContent = q.text;
            if (idx === defaultIndex) opt.selected = true;
            selectEl.appendChild(opt);
        });
    };

    renderOptions(s1, 0); // dob
    renderOptions(s2, 1); // nickname
    renderOptions(s3, 2); // father_name

    if (myQuickLockType === 'questions' && myQuickLockData?.items?.length === 3) {
        s1.value = myQuickLockData.items[0].id;
        s2.value = myQuickLockData.items[1].id;
        s3.value = myQuickLockData.items[2].id;
    }

    const a1 = document.getElementById('setup-q1-answer');
    const a2 = document.getElementById('setup-q2-answer');
    const a3 = document.getElementById('setup-q3-answer');
    if (a1) a1.value = '';
    if (a2) a2.value = '';
    if (a3) a3.value = '';
}

function populateUnlockQuestions() {
    const select = document.getElementById('unlock-question-select');
    const answerInput = document.getElementById('unlock-question-answer');
    if (!select) return;

    select.innerHTML = '';
    if (myQuickLockData?.items && Array.isArray(myQuickLockData.items)) {
        myQuickLockData.items.forEach(item => {
            const opt = document.createElement('option');
            opt.value = item.id;
            opt.textContent = item.text;
            select.appendChild(opt);
        });
    }

    if (answerInput) {
        answerInput.value = '';
        setTimeout(() => answerInput.focus(), 150);
    }
}

async function verifyQuestionUnlock() {
    if (activeQuickUnlockType !== 'questions') return;

    const select = document.getElementById('unlock-question-select');
    const answerInput = document.getElementById('unlock-question-answer');
    const qId = select?.value;
    const answer = (answerInput?.value || '').trim();

    if (!answer) {
        setUnlockStatus('Vui lòng nhập câu trả lời của bạn!', 'error');
        if (answerInput) answerInput.focus();
        return;
    }

    const item = myQuickLockData?.items?.find(i => i.id === qId);
    if (!item) {
        setUnlockStatus('Không tìm thấy thông tin câu hỏi này!', 'error');
        return;
    }

    const answerHash = await hashQuickLockSecret(answer);
    if (answerHash === item.hash) {
        setUnlockStatus('🎉 Câu trả lời chính xác!', 'success');
        setTimeout(completeQuickUnlock, 250);
    } else {
        setUnlockStatus('❌ Câu trả lời không chính xác, vui lòng thử lại!', 'error');
        if (answerInput) {
            answerInput.classList.add('shake-anim');
            setTimeout(() => answerInput.classList.remove('shake-anim'), 600);
            answerInput.select();
        }
    }
}

// ------------------------------------------
// Save Quick Lock Configuration
// ------------------------------------------
async function saveQuickLockConfiguration() {
    const saveBtn = document.getElementById('btn-save-quick-lock');
    setSetupLockStatus('', '');

    let lockData = null;

    if (selectedQuickLockSetupType === 'pin') {
        if (!setupPinConfirmed || setupPinConfirmed.length !== 6) {
            setSetupLockStatus('Vui lòng hoàn tất đủ 2 bước nhập và xác nhận mã PIN 6 số trên bàn phím!', 'error');
            return;
        }

        const hash = await hashQuickLockSecret(setupPinConfirmed);
        lockData = { type: 'pin', hash };

    } else if (selectedQuickLockSetupType === 'pattern') {
        if (!setupPatternConfirmed || setupPatternConfirmed.length < 4) {
            setSetupLockStatus('Vui lòng hoàn tất đủ 2 bước vẽ và xác nhận hình khóa!', 'error');
            return;
        }

        const patternStr = setupPatternConfirmed.join(',');
        const hash = await hashQuickLockSecret(patternStr);
        lockData = { type: 'pattern', hash };

    } else if (selectedQuickLockSetupType === 'questions') {
        const q1 = document.getElementById('setup-q1-select')?.value;
        const q2 = document.getElementById('setup-q2-select')?.value;
        const q3 = document.getElementById('setup-q3-select')?.value;

        const a1 = (document.getElementById('setup-q1-answer')?.value || '').trim();
        const a2 = (document.getElementById('setup-q2-answer')?.value || '').trim();
        const a3 = (document.getElementById('setup-q3-answer')?.value || '').trim();

        if (q1 === q2 || q1 === q3 || q2 === q3) {
            setSetupLockStatus('Vui lòng chọn 3 câu hỏi hoàn toàn khác nhau!', 'error');
            return;
        }

        if (!a1 || !a2 || !a3) {
            setSetupLockStatus('Vui lòng nhập câu trả lời cho cả 3 câu hỏi!', 'error');
            return;
        }

        const getQText = (id) => SECURITY_QUESTION_TEMPLATES.find(t => t.id === id)?.text || id;
        const [h1, h2, h3] = await Promise.all([
            hashQuickLockSecret(a1),
            hashQuickLockSecret(a2),
            hashQuickLockSecret(a3)
        ]);

        lockData = {
            type: 'questions',
            items: [
                { id: q1, text: getQText(q1), hash: h1 },
                { id: q2, text: getQText(q2), hash: h2 },
                { id: q3, text: getQText(q3), hash: h3 }
            ]
        };
    } else {
        setSetupLockStatus('Phương thức khóa không hợp lệ!', 'error');
        return;
    }

    if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<span class="material-symbols-outlined" style="font-size: 18px;">hourglass_top</span> Đang lưu...';
    }

    try {
        const sp = getSupabaseAuth();
        if (sp && currentUserId) {
            try {
                const updatePayload = {
                    id: currentUserId,
                    quick_lock_type: selectedQuickLockSetupType,
                    quick_lock_data: lockData,
                    updated_at: new Date().toISOString()
                };
                const { error } = await sp.from('profiles').upsert([updatePayload]);
                if (error) {
                    console.warn('Supabase upsert quick_lock failed (columns may need to be added to DB):', error.message);
                }
            } catch (e) {
                console.warn('Supabase upsert error:', e);
            }
        }

        localStorage.setItem('musiclive_quick_lock_type', selectedQuickLockSetupType);
        localStorage.setItem('musiclive_quick_lock_data', JSON.stringify(lockData));

        myQuickLockType = selectedQuickLockSetupType;
        myQuickLockData = lockData;

        updateQuickLockStatusUI();

        setSetupLockStatus('🎉 Đã lưu phương thức Đăng Nhập Nhanh thành công!', 'success');
        if (typeof showToastNotification === 'function') {
            showToastNotification('🔒 Đã kích hoạt Đăng Nhập Nhanh thành công!');
        }

        setTimeout(() => {
            closeQuickLockSetupModal();
        }, 1200);

    } catch (err) {
        console.error('Save quick lock error:', err);
        setSetupLockStatus(err.message || 'Lỗi khi lưu cài đặt khóa', 'error');
    } finally {
        if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.innerHTML = '<span class="material-symbols-outlined" style="font-size: 18px;">check</span> Lưu Cài Đặt Khóa';
        }
    }
}

// ------------------------------------------
// Quick Unlock Screen Lifecycle
// ------------------------------------------
let pendingUnlockSessionUser = null;
let pendingUnlockProfile = null;
let activeQuickUnlockType = '';

function showQuickUnlockScreen(user, profile) {
    pendingUnlockSessionUser = user;
    pendingUnlockProfile = profile;

    const modal = document.getElementById('quick-unlock-modal');
    if (!modal) return;

    const avatarEl = document.getElementById('unlock-user-avatar');
    const nameEl = document.getElementById('unlock-user-name');
    const emailEl = document.getElementById('unlock-user-email');

    const displayName = profile?.display_name || profile?.username || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Người dùng';
    const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture || '/assets/images/placeholder.jpg';
    const email = user.email || '';

    if (avatarEl) avatarEl.src = avatarUrl;
    if (nameEl) nameEl.textContent = displayName;
    if (emailEl) emailEl.textContent = email;

    setUnlockStatus('', '');

    const pinSec = document.getElementById('unlock-pin-section');
    const patSec = document.getElementById('unlock-pattern-section');
    const qSec = document.getElementById('unlock-questions-section');

    if (pinSec) pinSec.classList.add('hidden');
    if (patSec) patSec.classList.add('hidden');
    if (qSec) qSec.classList.add('hidden');

    activeQuickUnlockType = myQuickLockType;

    const promptText = document.getElementById('unlock-prompt-text');

    if (myQuickLockType === 'pin') {
        if (pinSec) pinSec.classList.remove('hidden');
        if (promptText) promptText.textContent = 'Nhập mã PIN 6 số để mở khóa';
        unlockEnteredPin = '';
        updateUnlockPinDots('normal');
        renderUnlockPinKeypad();
    } else if (myQuickLockType === 'pattern') {
        if (patSec) patSec.classList.remove('hidden');
        if (promptText) promptText.textContent = 'Vẽ hình khóa để mở khóa';
        setTimeout(initUnlockPatternCanvas, 50);
    } else if (myQuickLockType === 'questions') {
        if (qSec) qSec.classList.remove('hidden');
        if (promptText) promptText.textContent = 'Chọn 1 trong 3 câu hỏi bảo mật để mở khóa';
        populateUnlockQuestions();
    } else {
        completeQuickUnlock();
        return;
    }

    document.getElementById('login-section')?.classList.add('hidden');
    document.getElementById('main-room')?.classList.add('hidden');
    modal.classList.remove('hidden');
}

async function completeQuickUnlock() {
    const modal = document.getElementById('quick-unlock-modal');
    if (modal) modal.classList.add('hidden');

    if (typeof showToastNotification === 'function') {
        showToastNotification('🔓 Mở khóa thành công!');
    }

    if (pendingUnlockSessionUser) {
        await handleAuthSuccess(pendingUnlockSessionUser, pendingUnlockProfile);
    } else {
        joinRoom();
    }
}

function joinRoom() {
    const name = myUsername || localStorage.getItem('musiclive_username') || 'Người dùng';
    const nameColor = myNameColor || localStorage.getItem('musiclive_namecolor') || '#3ea6ff';
    const userId = currentUserId || localStorage.getItem('musiclive_user_id') || null;
    const role = myRole || localStorage.getItem('musiclive_user_role') || 'member';

    myUsername = name;
    myNameColor = nameColor;

    if (player && typeof player.playVideo === 'function') {
        try { player.playVideo(); } catch (e) {}
    }

    socket.emit('joinRoom', {
        name,
        nameColor,
        userId,
        role,
        isAdmin: (role === 'admin')
    });
}

async function initSupabaseAuth() {
    const sp = getSupabaseAuth();
    if (!sp) {
        isAuthInitialized = true;
        return;
    }

    try {
        const { data: { session } } = await sp.auth.getSession();
        if (session && session.user) {
            let profile = null;
            try {
                let profRes = await sp
                    .from('profiles')
                    .select('username, display_name, phone, name_color, role, avatar_url, quick_lock_type, quick_lock_data')
                    .eq('id', session.user.id)
                    .maybeSingle();

                if (profRes.error && profRes.error.message && profRes.error.message.includes('quick_lock')) {
                    profRes = await sp
                        .from('profiles')
                        .select('username, display_name, phone, name_color, role, avatar_url')
                        .eq('id', session.user.id)
                        .maybeSingle();
                }

                if (profRes.data && !profRes.error) {
                    profile = profRes.data;
                }
            } catch (pErr) {
                console.warn('Profile fetch error:', pErr);
            }

            const qType = profile?.quick_lock_type || localStorage.getItem('musiclive_quick_lock_type');
            let qData = profile?.quick_lock_data;
            if (!qData) {
                try {
                    const localQData = localStorage.getItem('musiclive_quick_lock_data');
                    if (localQData) qData = JSON.parse(localQData);
                } catch (_) {}
            }

            if (qType && qData) {
                myQuickLockType = qType;
                myQuickLockData = qData;
                localStorage.setItem('musiclive_quick_lock_type', qType);
                localStorage.setItem('musiclive_quick_lock_data', JSON.stringify(qData));

                // Intercept with Quick Unlock modal!
                showQuickUnlockScreen(session.user, profile);
            } else {
                await handleAuthSuccess(session.user, profile);
                openQuickLockSetupModal(true);
            }
        } else {
            localStorage.removeItem('musiclive_user_id');
            localStorage.removeItem('musiclive_user_role');
            currentUserId = null;
            myRole = '';
        }
    } catch (e) {
        console.warn('Check Supabase session error:', e);
    } finally {
        isAuthInitialized = true;
    }

    sp.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session && session.user) {
            const mainRoom = document.getElementById('main-room');
            const unlockModal = document.getElementById('quick-unlock-modal');
            const isUnlockActive = unlockModal && !unlockModal.classList.contains('hidden');

            if ((!mainRoom || mainRoom.classList.contains('hidden')) && !isUnlockActive) {
                await handleAuthSuccess(session.user);
                if (!myQuickLockType) {
                    openQuickLockSetupModal(true);
                }
            }
        }
    });
}

// Initialize Supabase Auth on script execution
initSupabaseAuth();

socket.on('authResult', (res) => {
    if (res.success) {
        myRole = res.role;

        if (res.userProfile) {
            if (res.userProfile.displayName) myDisplayName = res.userProfile.displayName;
            if (res.userProfile.username) myRawUsername = res.userProfile.username;
            if (res.userProfile.avatarUrl) myAvatarUrl = res.userProfile.avatarUrl;
        }
        updateNavbarAvatarUI(myAvatarUrl);

        if (myRole === 'admin') {
            localStorage.setItem('musiclive_admin_type', 'main');
        } else {
            localStorage.removeItem('musiclive_admin_type');
            localStorage.removeItem('musiclive_password');
        }

        document.getElementById('login-section').classList.add('hidden');
        document.getElementById('main-room').classList.remove('hidden');
        if (res.quizPublicState && res.quizPublicState.active) {
            currentQuizState = res.quizPublicState;
            renderMultiplayerQuizState(currentQuizState);
        } else if (typeof currentQuizState !== 'undefined' && currentQuizState && currentQuizState.active) {
            renderMultiplayerQuizState(currentQuizState);
        }

        if (res.currentVideoTitle) {
            document.title = res.currentVideoTitle;
            document.getElementById('welcome-title').innerText = res.currentVideoTitle;
            fetchLyrics(res.currentVideoTitle);
        }

        if (res.chatHistory && Array.isArray(res.chatHistory)) {
            document.getElementById('chat-box-ui').innerHTML = '';
            lastChatSenderId = null;
            isLoadingChatHistory = true;
            res.chatHistory.forEach(msg => {
                const listeners = socket.listeners('newMessage');
                listeners.forEach(fn => fn({ ...msg, isHistory: true }));
            });
            isLoadingChatHistory = false;
        }


        const navRight = document.getElementById('navbar-right');
        navRight.classList.remove('hidden');
        const navUsername = document.getElementById('navbar-username');
        navUsername.textContent = myUsername;
        navUsername.style.color = myNameColor;

        loadUserBackgrounds(myUsername);


        document.getElementById('navbar-search').classList.remove('hidden');
        document.getElementById('menu-btn').classList.remove('hidden');

        if (myRole === 'admin') {
            document.body.classList.add('admin-mode');
            document.getElementById('btn-next-song').classList.remove('hidden');
            document.getElementById('btn-loop').classList.remove('hidden');
            document.getElementById('btn-start-game').classList.remove('hidden');
            document.getElementById('player-container').style.pointerEvents = 'auto';
            const sidebarQuizAdmin = document.getElementById('sidebar-quiz-admin');
            if (sidebarQuizAdmin) sidebarQuizAdmin.classList.remove('hidden');
        }
        document.getElementById('sync-btn').classList.remove('hidden');


        if (res.drawGame && res.drawGame.active && res.drawGame.state === 'playing') {
            document.getElementById('draw-game-overlay').classList.remove('hidden');
            renderDrawScores(res.drawGame.scores || {});
            socket.emit('requestCanvasHistory');
        }


        if (res.loopMode !== undefined) {
            isLoopMode = res.loopMode;
            updateLoopUI();
        }

        initialVideoId = res.currentVideoId;
        if (!player) {
            createPlayer();
        } else if (typeof player.loadVideoById === 'function') {
            if (initialVideoId) {
                window.ignoreNextStateChange = true;
                window.lastSyncTime = Date.now() + 2000;
                if (isPlayerReady) {
                    player.loadVideoById(initialVideoId);
                    setTimeout(() => socket.emit('requestSync'), 1000);
                } else {
                    pendingVideoId = initialVideoId;
                }
            } else {
                player.stopVideo();
            }
        } else if (initialVideoId) {
            pendingVideoId = initialVideoId;
        }
        updatePlaylistUI(res.playlist);
        if (res.pinnedMessage) updatePinnedMessageUI(res.pinnedMessage);
        if (res.caroGame) updateCaroUI(res.caroGame);
        if (res.chessGame) socket._callbacks['$chessUpdate'][0](res.chessGame);
        if (res.xiangqiGame && socket._callbacks['$xiangqiUpdate']) socket._callbacks['$xiangqiUpdate'][0](res.xiangqiGame);
        if (res.unoPublicState && socket._callbacks['$unoUpdate']) socket._callbacks['$unoUpdate'][0](res.unoPublicState);
    } else {
        alert(res.message);
    }
});


async function logout() {
    const sp = getSupabaseAuth();
    if (sp) {
        try {
            await sp.auth.signOut();
        } catch (e) {
            console.warn('Supabase signOut error:', e);
        }
    }

    localStorage.removeItem('musiclive_username');
    localStorage.removeItem('musiclive_display_name');
    localStorage.removeItem('musiclive_raw_username');
    localStorage.removeItem('musiclive_phone');
    localStorage.removeItem('musiclive_avatar_url');
    localStorage.removeItem('musiclive_namecolor');
    localStorage.removeItem('musiclive_admin_type');
    localStorage.removeItem('musiclive_password');
    localStorage.removeItem('musiclive_user_id');
    localStorage.removeItem('musiclive_user_role');
    localStorage.removeItem('musiclive_quick_lock_type');
    localStorage.removeItem('musiclive_quick_lock_data');

    myRole = '';
    myUsername = '';
    myDisplayName = '';
    myRawUsername = '';
    myPhone = '';
    myAvatarUrl = '';
    myNameColor = '#3ea6ff';
    currentUserId = null;
    myQuickLockType = '';
    myQuickLockData = null;
    unlockEnteredPin = '';
    currentUnlockPattern = [];
    activeQuickUnlockType = '';
    updateNavbarAvatarUI('');
    updateQuickLockStatusUI();

    resetBackgroundsToDefault();

    const unlockModal = document.getElementById('quick-unlock-modal');
    if (unlockModal) unlockModal.classList.add('hidden');
    const setupModal = document.getElementById('quick-lock-setup-modal');
    if (setupModal) setupModal.classList.add('hidden');

    document.getElementById('main-room').classList.add('hidden');
    document.getElementById('login-section').classList.remove('hidden');
    document.getElementById('navbar-right').classList.add('hidden');
    document.getElementById('navbar-search').classList.add('hidden');
    document.getElementById('menu-btn').classList.add('hidden');

    document.body.classList.remove('admin-mode');
    document.getElementById('btn-next-song').classList.add('hidden');
    document.getElementById('sync-btn').classList.add('hidden');

    const emailIn = document.getElementById('login-email');
    const pwdIn = document.getElementById('login-password');
    const signupUser = document.getElementById('signup-username');
    const signupEmail = document.getElementById('signup-email');
    const signupPwd = document.getElementById('signup-password');

    if (emailIn) emailIn.value = '';
    if (pwdIn) pwdIn.value = '';
    if (signupUser) signupUser.value = '';
    if (signupEmail) signupEmail.value = '';
    if (signupPwd) signupPwd.value = '';
    setAuthStatus('', '');

    document.getElementById('chat-box-ui').innerHTML = '';
    lastChatSenderId = null;

    socket.disconnect();
    socket.connect();
}

let soundEnabled = true;
function toggleSound() {
    soundEnabled = !soundEnabled;
    document.getElementById('sound-btn').innerHTML = soundEnabled ? '<span class="material-symbols-outlined" style="font-size:18px;">notifications_active</span>' : '<span class="material-symbols-outlined" style="font-size:18px;">notifications_off</span>';
}

function playChatSound() {
    if (!soundEnabled) return;
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    } catch (e) { }
}

let currentReply = null;

function setReply(id, name, text) {
    currentReply = { id, name, text };
    document.getElementById('reply-container').classList.remove('hidden');
    document.getElementById('reply-author').innerText = name;
    document.getElementById('reply-text').innerText = text;
    document.getElementById('chat-input').focus();
}

function cancelReply() {
    currentReply = null;
    document.getElementById('reply-container').classList.add('hidden');
}

function sendChat() {
    stopTyping();
    const input = document.getElementById('chat-input');
    if (input.value.trim() !== "") {
        if (currentReply) {
            socket.emit('sendMessage', { type: 'text', text: input.value, replyTo: currentReply });
            cancelReply();
        } else {
            socket.emit('sendMessage', input.value);
        }
        input.value = '';
    }
    hideGifSuggestions();
}

function getTikTokVerifiedBadgeHtml(extraClass = '') {
    return `<span class="tiktok-verified-badge ${extraClass}" title="Xác minh Quản trị viên (Admin Real)"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#20D5EC"/><path d="M7.5 12L10.5 15L16.5 9" stroke="#ffffff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`;
}

function isUserAdmin(userOrRole) {
    if (!userOrRole) return false;
    if (typeof userOrRole === 'string') {
        const str = userOrRole.toLowerCase().trim();
        return str === 'admin' || str.includes('😎');
    }
    if (userOrRole.role === 'admin' || userOrRole.role === 'host') return true;
    if (userOrRole.isAdmin === true) return true;
    const name = String(userOrRole.displayName || userOrRole.username || userOrRole.name || '');
    if (name.includes('😎') || name.toLowerCase() === 'admin') return true;
    return false;
}

function updatePinnedMessageUI(msg) {
    const container = document.getElementById('pinned-message-container');
    if (msg) {
        container.classList.remove('hidden');
        const isAdm = isUserAdmin(msg);
        const badge = isAdm ? getTikTokVerifiedBadgeHtml() : '';
        const cleanName = escapeHtml((msg.name || '').replace(' 😎', '').trim());
        const authorEl = document.getElementById('pin-author');
        if (authorEl) authorEl.innerHTML = `${cleanName}${badge}`;
        document.getElementById('pin-text').innerText = msg.text;
        if (myRole === 'admin') document.getElementById('unpin-btn').classList.remove('hidden');
    } else {
        container.classList.add('hidden');
    }
}

socket.on('updatePinnedMessage', updatePinnedMessageUI);

socket.on('messageDeleted', (msgId) => {
    const el = document.getElementById('msg-' + msgId);
    if (el) {
        const wasLast = el.classList.contains('group-last');
        const prev = el.previousElementSibling;
        el.remove();
        if (wasLast && prev && prev.classList.contains('chat-message')) {
            prev.classList.add('group-last');
        }
    }
});

socket.on('viewersUpdate', (count) => {
    document.getElementById('viewer-count').innerHTML = `(<span class="material-symbols-outlined" style="font-size:14px; vertical-align:text-bottom;">visibility</span> ${count})`;
});

// --- FULLSCREEN ANNOUNCEMENT (/tb) LOGIC ---
let tbTypeInterval = null;
let tbAutoCloseTimeout = null;
let isTbTyping = false;

socket.on('fullscreenNotification', (data) => {
    if (!data || !data.text) return;
    showFullscreenNotification(data.text);
});

function showFullscreenNotification(text) {
    const overlay = document.getElementById('tb-fullscreen-overlay');
    const textEl = document.getElementById('tb-typed-text');
    const cursorEl = document.getElementById('tb-cursor');

    if (!overlay || !textEl) return;

    if (tbTypeInterval) {
        clearInterval(tbTypeInterval);
        tbTypeInterval = null;
    }
    if (tbAutoCloseTimeout) {
        clearTimeout(tbAutoCloseTimeout);
        tbAutoCloseTimeout = null;
    }

    isTbTyping = true;
    overlay.classList.add('typing');

    textEl.textContent = '';
    if (cursorEl) cursorEl.style.display = 'inline';

    overlay.classList.remove('hidden');
    void overlay.offsetWidth;
    overlay.classList.add('active');

    let charIndex = 0;
    const fullText = (text || '').trim();
    const typingSpeed = 85; // ms per character (slower, natural typing pace)

    tbTypeInterval = setInterval(() => {
        if (charIndex <= fullText.length) {
            textEl.textContent = fullText.substring(0, charIndex);
            charIndex++;
        } else {
            clearInterval(tbTypeInterval);
            tbTypeInterval = null;
            isTbTyping = false;
            overlay.classList.remove('typing');

            tbAutoCloseTimeout = setTimeout(() => {
                closeTbNotification(true);
            }, 5000);
        }
    }, typingSpeed);
}

function closeTbNotification(force = false) {
    if (isTbTyping && !force) return;

    if (tbTypeInterval) {
        clearInterval(tbTypeInterval);
        tbTypeInterval = null;
    }
    if (tbAutoCloseTimeout) {
        clearTimeout(tbAutoCloseTimeout);
        tbAutoCloseTimeout = null;
    }
    isTbTyping = false;

    const overlay = document.getElementById('tb-fullscreen-overlay');
    if (overlay) {
        overlay.classList.remove('typing');
        overlay.classList.remove('active');
        setTimeout(() => {
            overlay.classList.add('hidden');
        }, 300);
    }
}

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeTbNotification();
    }
});

let lastChatSenderId = null;
let isLoadingChatHistory = false;

// Generate a consistent color from a string
function stringToColor(str) {
    const colors = ['#e17076', '#7bc862', '#6ec9cb', '#65aadd', '#ee7aae', '#dda15e', '#a695e7', '#e8a752'];
    let hash = 0;
    for (let i = 0; i < (str || '').length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
}

// --- MESSENGER TYPING INDICATOR LOGIC ---
let myTypingTimeout = null;
let isCurrentlyTyping = false;

function notifyTyping() {
    const input = document.getElementById('chat-input');
    if (!input || !socket || !socket.connected) return;

    if (input.value.trim().length > 0) {
        if (!isCurrentlyTyping) {
            isCurrentlyTyping = true;
            socket.emit('userTyping', true);
        }
        clearTimeout(myTypingTimeout);
        myTypingTimeout = setTimeout(() => {
            stopTyping();
        }, 3000);
    } else {
        stopTyping();
    }
}

function stopTyping() {
    if (isCurrentlyTyping) {
        isCurrentlyTyping = false;
        clearTimeout(myTypingTimeout);
        if (socket && socket.connected) {
            socket.emit('userTyping', false);
        }
    }
}

socket.on('typingUsersUpdate', (users) => {
    const otherTypers = (users || []).filter(u => u.id !== socket.id);
    renderTypingIndicator(otherTypers);
});

function renderTypingIndicator(typers) {
    const container = document.getElementById('chat-typing-indicator');
    const avatarEl = document.getElementById('typing-avatar');
    const textEl = document.getElementById('typing-text');
    const chatBox = document.getElementById('chat-box-ui');
    if (!container || !avatarEl || !textEl || !chatBox) return;

    if (!typers || typers.length === 0) {
        container.classList.add('hidden');
        return;
    }

    const wasScrolledToBottom = chatBox.scrollHeight - chatBox.clientHeight <= chatBox.scrollTop + 120;

    const firstUser = typers[0];
    const initial = (firstUser.name || '?').charAt(0).toUpperCase();
    const color = firstUser.nameColor || stringToColor(firstUser.name || '');

    avatarEl.innerText = initial;
    avatarEl.style.background = color;

    if (typers.length === 1) {
        const cleanName = firstUser.name.replace(' 😎', '').trim();
        textEl.innerText = `${cleanName} đang nhập...`;
    } else if (typers.length === 2) {
        const name1 = typers[0].name.replace(' 😎', '').trim();
        const name2 = typers[1].name.replace(' 😎', '').trim();
        textEl.innerText = `${name1} và ${name2} đang nhập...`;
    } else {
        const name1 = typers[0].name.replace(' 😎', '').trim();
        textEl.innerText = `${name1} và ${typers.length - 1} người khác đang nhập...`;
    }

    container.classList.remove('hidden');

    if (wasScrolledToBottom) {
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

const chatInputEl = document.getElementById('chat-input');
if (chatInputEl) {
    chatInputEl.addEventListener('blur', () => {
        stopTyping();
    });
}

// --- VOICE MESSAGE LOGIC ---
let mediaRecorder = null;
let audioChunks = [];
let voiceRecTimerInterval = null;
let voiceRecSeconds = 0;
let currentVoiceAudio = null;
let currentVoiceId = null;

function formatVoiceDuration(sec) {
    const mins = Math.floor(sec / 60);
    const remainderSecs = Math.floor(sec % 60);
    return `${mins.toString().padStart(2, '0')}:${remainderSecs.toString().padStart(2, '0')}`;
}

let recordedVoiceBlob = null;
let recordedVoiceDuration = 0;

async function toggleVoiceRecording() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        finishVoiceRecording();
    } else if (recordedVoiceBlob) {
        sendProcessedVoiceRecording();
    } else {
        await startVoiceRecording();
    }
}

let wasMutedBeforeRecording = false;

async function startVoiceRecording() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Trình duyệt của bạn không hỗ trợ ghi âm micro!');
        return;
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: false,   // Tắt khử tiếng vang để giữ âm thanh chân thật
                noiseSuppression: false,   // Tắt lọc tạp âm môi trường
                autoGainControl: false,    // Tắt tự động điều chỉnh âm lượng
                sampleRate: 48000,
                channelCount: 1
            }
        });
        audioChunks = [];
        recordedVoiceBlob = null;
        recordedVoiceDuration = 0;

        // Tự động Mute nhạc để không bị dính tiếng nhạc vào ghi âm
        if (player && typeof player.isMuted === 'function' && typeof player.mute === 'function') {
            wasMutedBeforeRecording = player.isMuted();
            if (!wasMutedBeforeRecording) {
                player.mute();
            }
        }

        let options = {
            audioBitsPerSecond: 128000
        };
        if (typeof MediaRecorder !== 'undefined') {
            if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
                options.mimeType = 'audio/webm;codecs=opus';
            } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
                options.mimeType = 'audio/ogg;codecs=opus';
            } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
                options.mimeType = 'audio/mp4';
            }
        }

        mediaRecorder = new MediaRecorder(stream, options);

        mediaRecorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) {
                audioChunks.push(e.data);
            }
        };

        mediaRecorder.start(100);
        voiceRecSeconds = 0;

        document.getElementById('voice-rec-timer').innerText = '00:00';
        document.getElementById('voice-rec-dot').classList.remove('recorded');
        document.getElementById('voice-rec-wave').classList.remove('paused');
        document.getElementById('voice-effect-select').classList.add('hidden');
        document.getElementById('voice-rec-send-btn').classList.add('hidden');
        document.getElementById('voice-rec-stop-btn').classList.remove('hidden');
        document.getElementById('voice-rec-btn').classList.add('recording');
        document.getElementById('chat-input-wrapper').classList.add('hidden');
        document.getElementById('voice-recording-bar').classList.remove('hidden');

        if (voiceRecTimerInterval) clearInterval(voiceRecTimerInterval);
        voiceRecTimerInterval = setInterval(() => {
            voiceRecSeconds++;
            document.getElementById('voice-rec-timer').innerText = formatVoiceDuration(voiceRecSeconds);
            if (voiceRecSeconds >= 120) {
                finishVoiceRecording();
            }
        }, 1000);

    } catch (err) {
        console.error('Lỗi khi truy cập Microphone:', err);
        alert('Không thể mở micro! Vui lòng cho phép quyền sử dụng micro trên trình duyệt.');
        cleanupVoiceRecordingState();
    }
}

async function applyVoiceEffect(audioBlob, effectType) {
    if (!effectType || effectType === 'normal') {
        return audioBlob;
    }

    try {
        const arrayBuffer = await audioBlob.arrayBuffer();
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const decodedBuffer = await audioCtx.decodeAudioData(arrayBuffer);

        let playbackRate = 1.0;
        if (effectType === 'chipmunk') playbackRate = 1.4;
        if (effectType === 'monster') playbackRate = 0.72;

        const duration = decodedBuffer.duration / playbackRate;
        const sampleRate = decodedBuffer.sampleRate;
        const numberOfChannels = decodedBuffer.numberOfChannels;

        const offlineCtx = new OfflineAudioContext(
            numberOfChannels,
            Math.ceil(duration * sampleRate),
            sampleRate
        );

        const source = offlineCtx.createBufferSource();
        source.buffer = decodedBuffer;
        source.playbackRate.value = playbackRate;

        let lastNode = source;

        if (effectType === 'robot') {
            const osc = offlineCtx.createOscillator();
            osc.type = 'sawtooth';
            osc.frequency.value = 55;
            osc.start(0);

            const oscGain = offlineCtx.createGain();
            oscGain.gain.value = 0.5;

            const modGain = offlineCtx.createGain();
            modGain.gain.value = 0.5;

            osc.connect(oscGain);
            oscGain.connect(modGain.gain);
            source.connect(modGain);
            lastNode = modGain;
        } else if (effectType === 'radio') {
            const highpass = offlineCtx.createBiquadFilter();
            highpass.type = 'highpass';
            highpass.frequency.value = 800;

            const lowpass = offlineCtx.createBiquadFilter();
            lowpass.type = 'lowpass';
            lowpass.frequency.value = 2800;

            const gain = offlineCtx.createGain();
            gain.gain.value = 1.4;

            source.connect(highpass);
            highpass.connect(lowpass);
            lowpass.connect(gain);
            lastNode = gain;
        } else if (effectType === 'cave') {
            const delay = offlineCtx.createDelay();
            delay.delayTime.value = 0.22;

            const feedback = offlineCtx.createGain();
            feedback.gain.value = 0.45;

            const mixGain = offlineCtx.createGain();
            mixGain.gain.value = 0.85;

            source.connect(mixGain);
            source.connect(delay);
            delay.connect(feedback);
            feedback.connect(delay);
            delay.connect(mixGain);

            lastNode = mixGain;
        }

        lastNode.connect(offlineCtx.destination);
        source.start(0);

        const renderedBuffer = await offlineCtx.startRendering();
        return audioBufferToWavBlob(renderedBuffer);
    } catch (err) {
        console.error('Lỗi biến đổi giọng:', err);
        return audioBlob;
    }
}

function audioBufferToWavBlob(buffer) {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1;
    const bitDepth = 16;

    let result;
    if (numChannels === 2) {
        const inputL = buffer.getChannelData(0);
        const inputR = buffer.getChannelData(1);
        result = new Float32Array(inputL.length + inputR.length);
        let index = 0, inputIndex = 0;
        while (index < result.length) {
            result[index++] = inputL[inputIndex];
            result[index++] = inputR[inputIndex];
            inputIndex++;
        }
    } else {
        result = buffer.getChannelData(0);
    }

    const dataLength = result.length * 2;
    const bufferLength = 44 + dataLength;
    const arrayBuffer = new ArrayBuffer(bufferLength);
    const view = new DataView(arrayBuffer);

    function writeString(v, offset, str) {
        for (let i = 0; i < str.length; i++) {
            v.setUint8(offset + i, str.charCodeAt(i));
        }
    }

    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataLength, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numChannels * 2, true);
    view.setUint16(32, numChannels * 2, true);
    view.setUint16(34, bitDepth, true);
    writeString(view, 36, 'data');
    view.setUint32(40, dataLength, true);

    let offset = 44;
    for (let i = 0; i < result.length; i++, offset += 2) {
        const s = Math.max(-1, Math.min(1, result[i]));
        view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' });
}

let previewAudioPlayer = null;
let currentPreviewObjectUrl = null;

async function toggleVoicePreviewPlay() {
    const playBtn = document.getElementById('voice-rec-play-btn');
    const waveElem = document.getElementById('voice-rec-wave');

    if (previewAudioPlayer && !previewAudioPlayer.paused) {
        stopVoicePreviewPlayback();
        return;
    }

    if (!recordedVoiceBlob) return;

    if (playBtn) playBtn.disabled = true;

    try {
        const effectType = document.getElementById('voice-effect-select')?.value || 'normal';
        const processedBlob = await applyVoiceEffect(recordedVoiceBlob, effectType);

        stopVoicePreviewPlayback();

        currentPreviewObjectUrl = URL.createObjectURL(processedBlob);
        previewAudioPlayer = new Audio(currentPreviewObjectUrl);

        previewAudioPlayer.onended = () => {
            stopVoicePreviewPlayback();
        };

        previewAudioPlayer.onerror = (e) => {
            console.error('Lỗi khi phát thử ghi âm:', e);
            stopVoicePreviewPlayback();
        };

        await previewAudioPlayer.play();

        if (playBtn) {
            playBtn.disabled = false;
            playBtn.innerHTML = '<span class="material-symbols-outlined" style="font-size:18px;">pause</span>';
        }
        if (waveElem) waveElem.classList.remove('paused');
    } catch (err) {
        console.error('Lỗi nghe thử ghi âm:', err);
        stopVoicePreviewPlayback();
        if (playBtn) playBtn.disabled = false;
    }
}

function stopVoicePreviewPlayback() {
    if (previewAudioPlayer) {
        try {
            previewAudioPlayer.pause();
            previewAudioPlayer.currentTime = 0;
        } catch (e) { }
        previewAudioPlayer = null;
    }
    if (currentPreviewObjectUrl) {
        URL.revokeObjectURL(currentPreviewObjectUrl);
        currentPreviewObjectUrl = null;
    }
    const playBtn = document.getElementById('voice-rec-play-btn');
    if (playBtn) {
        playBtn.disabled = false;
        playBtn.innerHTML = '<span class="material-symbols-outlined" style="font-size:18px;">play_arrow</span>';
    }
    const waveElem = document.getElementById('voice-rec-wave');
    if (waveElem) waveElem.classList.add('paused');
}

function handleVoiceEffectChange() {
    if (previewAudioPlayer && !previewAudioPlayer.paused) {
        toggleVoicePreviewPlay();
    }
}

function finishVoiceRecording() {
    if (!mediaRecorder || mediaRecorder.state !== 'recording') {
        return;
    }

    if (voiceRecTimerInterval) {
        clearInterval(voiceRecTimerInterval);
        voiceRecTimerInterval = null;
    }

    recordedVoiceDuration = voiceRecSeconds;

    mediaRecorder.onstop = () => {
        const stream = mediaRecorder.stream;
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }

        if (audioChunks.length > 0 && recordedVoiceDuration > 0) {
            const mimeType = mediaRecorder.mimeType || 'audio/webm';
            recordedVoiceBlob = new Blob(audioChunks, { type: mimeType });

            // Chuyển sang giao diện Nghe thử & Chọn giọng & Gửi
            document.getElementById('voice-rec-dot').classList.add('recorded');
            document.getElementById('voice-rec-wave').classList.add('paused');
            document.getElementById('voice-rec-stop-btn').classList.add('hidden');
            document.getElementById('voice-rec-play-btn').classList.remove('hidden');
            document.getElementById('voice-effect-select').classList.remove('hidden');
            document.getElementById('voice-rec-send-btn').classList.remove('hidden');
        } else {
            alert('Tin nhắn thoại quá ngắn!');
            cleanupVoiceRecordingState();
        }
    };

    mediaRecorder.stop();
}

async function sendProcessedVoiceRecording() {
    if (!recordedVoiceBlob || recordedVoiceDuration <= 0) {
        cleanupVoiceRecordingState();
        return;
    }

    stopVoicePreviewPlayback();

    const sendBtn = document.getElementById('voice-rec-send-btn');
    if (sendBtn) sendBtn.disabled = true;

    const effectType = document.getElementById('voice-effect-select')?.value || 'normal';
    const processedBlob = await applyVoiceEffect(recordedVoiceBlob, effectType);

    let finalDuration = recordedVoiceDuration;
    if (effectType === 'chipmunk') finalDuration = Math.max(1, Math.round(recordedVoiceDuration / 1.4));
    if (effectType === 'monster') finalDuration = Math.max(1, Math.round(recordedVoiceDuration / 0.72));

    const reader = new FileReader();
    reader.onloadend = () => {
        const base64Audio = reader.result;
        if (currentReply) {
            socket.emit('sendMessage', {
                type: 'voice',
                audioUrl: base64Audio,
                duration: finalDuration,
                replyTo: currentReply
            });
            cancelReply();
        } else {
            socket.emit('sendMessage', {
                type: 'voice',
                audioUrl: base64Audio,
                duration: finalDuration
            });
        }
        cleanupVoiceRecordingState();
    };
    reader.readAsDataURL(processedBlob);
}

function cancelVoiceRecording() {
    stopVoicePreviewPlayback();
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.onstop = () => {
            const stream = mediaRecorder.stream;
            if (stream) stream.getTracks().forEach(track => track.stop());
            cleanupVoiceRecordingState();
        };
        mediaRecorder.stop();
    } else {
        cleanupVoiceRecordingState();
    }
}

function cleanupVoiceRecordingState() {
    stopVoicePreviewPlayback();

    if (voiceRecTimerInterval) {
        clearInterval(voiceRecTimerInterval);
        voiceRecTimerInterval = null;
    }
    voiceRecSeconds = 0;
    recordedVoiceDuration = 0;
    recordedVoiceBlob = null;
    audioChunks = [];
    mediaRecorder = null;

    // Tự động bật tiếng (unMute) lại trình phát nhạc nếu trước đó nhạc đang phát
    if (player && typeof player.unMute === 'function') {
        if (!wasMutedBeforeRecording) {
            player.unMute();
        }
    }
    wasMutedBeforeRecording = false;

    const sendBtn = document.getElementById('voice-rec-send-btn');
    if (sendBtn) sendBtn.disabled = false;

    const playBtn = document.getElementById('voice-rec-play-btn');
    if (playBtn) playBtn.classList.add('hidden');

    const voiceBtn = document.getElementById('voice-rec-btn');
    if (voiceBtn) voiceBtn.classList.remove('recording');

    const inputWrap = document.getElementById('chat-input-wrapper');
    if (inputWrap) inputWrap.classList.remove('hidden');

    const recBar = document.getElementById('voice-recording-bar');
    if (recBar) recBar.classList.add('hidden');

    const effectSelect = document.getElementById('voice-effect-select');
    if (effectSelect) {
        effectSelect.value = 'normal';
        effectSelect.classList.add('hidden');
    }
}

function triggerMediaUpload() {
    const fileInput = document.getElementById('media-file-input');
    if (fileInput) fileInput.click();
}

function compressImage(file, maxWidth = 1920, maxHeight = 1080, quality = 0.85) {
    return new Promise((resolve) => {
        if (!file.type.startsWith('image/') || file.type.includes('gif')) {
            return resolve(file);
        }
        const img = new Image();
        const reader = new FileReader();
        reader.onload = (e) => {
            img.onload = () => {
                let width = img.width;
                let height = img.height;

                if (width > maxWidth || height > maxHeight) {
                    if (width / height > maxWidth / maxHeight) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    } else {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    if (!blob) return resolve(file);
                    const compressedFile = new File([blob], file.name, {
                        type: 'image/jpeg',
                        lastModified: Date.now()
                    });
                    resolve(compressedFile);
                }, 'image/jpeg', quality);
            };
            img.onerror = () => resolve(file);
            img.src = e.target.result;
        };
        reader.onerror = () => resolve(file);
        reader.readAsDataURL(file);
    });
}

async function handleMediaFileSelect(event) {
    const originalFile = event.target.files[0];
    if (!originalFile) return;

    const mediaBtn = document.getElementById('media-upload-btn');
    const originalBtnHtml = mediaBtn ? mediaBtn.innerHTML : '';
    if (mediaBtn) {
        mediaBtn.innerHTML = '<span class="material-symbols-outlined spin" style="font-size:20px;">sync</span>';
        mediaBtn.disabled = true;
    }

    try {
        const isVideo = originalFile.type.startsWith('video/');
        const isImage = originalFile.type.startsWith('image/');

        if (!isImage && !isVideo) {
            alert('Chỉ hỗ trợ gửi file Hình ảnh hoặc Video!');
            if (mediaBtn) { mediaBtn.innerHTML = originalBtnHtml; mediaBtn.disabled = false; }
            return;
        }

        if (originalFile.size > 50 * 1024 * 1024) {
            alert('Kích thước file quá lớn (tối đa 50MB)!');
            if (mediaBtn) { mediaBtn.innerHTML = originalBtnHtml; mediaBtn.disabled = false; }
            return;
        }

        // Auto compress high resolution images client-side
        const file = isImage ? await compressImage(originalFile) : originalFile;

        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        let publicUrl = '';

        if (typeof supabase !== 'undefined' && supabase.createClient) {
            try {
                const supabaseStorage = supabase.createClient('https://wnioetdrphkdylkoybsu.supabase.co', 'sb_publishable_p0VSduH3epzQVUdvAf2kPQ_aoWk_l1T');
                const { data, error } = await supabaseStorage.storage.from('chat_media').upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
                });

                if (!error && data) {
                    const { data: urlData } = supabaseStorage.storage.from('chat_media').getPublicUrl(fileName);
                    publicUrl = urlData ? urlData.publicUrl : '';
                } else {
                    console.warn('Lỗi Supabase Storage Bucket, chuyển sang chế độ nạp trực tiếp:', error ? error.message : '');
                }
            } catch (storageErr) {
                console.warn('Cơ chế Supabase Storage ngoại lệ:', storageErr.message);
            }
        }

        if (!publicUrl) {
            publicUrl = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        }

        socket.emit('sendMessage', {
            type: isVideo ? 'video' : 'image',
            fileUrl: publicUrl,
            text: isVideo ? '[Video]' : '[Hình ảnh]',
            replyTo: currentReply
        });

        if (currentReply) cancelReply();

    } catch (err) {
        console.error('Lỗi khi xử lý file media:', err);
        alert('Không thể gửi file này!');
    } finally {
        if (mediaBtn) {
            mediaBtn.innerHTML = originalBtnHtml;
            mediaBtn.disabled = false;
        }
        event.target.value = '';
    }
}

let lightboxScale = 1;
let lightboxTranslateX = 0;
let lightboxTranslateY = 0;
let lightboxRotate = 0;
let lightboxFlipH = 1;
let lightboxFlipV = 1;
let isLightboxDragging = false;
let lightboxStartX = 0;
let lightboxStartY = 0;

function updateLightboxTransform() {
    const img = document.getElementById('lightbox-img');
    if (img) {
        img.style.transform = `translate(${lightboxTranslateX}px, ${lightboxTranslateY}px) scale(${lightboxScale}) rotate(${lightboxRotate}deg) scaleX(${lightboxFlipH}) scaleY(${lightboxFlipV})`;
    }
}

function openImageLightbox(imgSrc) {
    const modal = document.getElementById('image-lightbox-modal');
    const img = document.getElementById('lightbox-img');
    if (modal && img) {
        img.src = imgSrc;
        resetLightboxZoom();
        modal.classList.remove('hidden');
    }
}

function closeImageLightbox() {
    const modal = document.getElementById('image-lightbox-modal');
    if (modal) {
        modal.classList.add('hidden');
        resetLightboxZoom();
    }
}

function zoomLightboxImage(delta) {
    lightboxScale = Math.min(Math.max(0.5, lightboxScale + delta), 5);
    if (lightboxScale === 1) {
        lightboxTranslateX = 0;
        lightboxTranslateY = 0;
    }
    updateLightboxTransform();
}

function rotateLightboxImage(deg) {
    lightboxRotate = (lightboxRotate + deg) % 360;
    updateLightboxTransform();
}

function flipLightboxImage(axis) {
    if (axis === 'h') {
        lightboxFlipH = lightboxFlipH === 1 ? -1 : 1;
    } else if (axis === 'v') {
        lightboxFlipV = lightboxFlipV === 1 ? -1 : 1;
    }
    updateLightboxTransform();
}

function resetLightboxZoom() {
    lightboxScale = 1;
    lightboxTranslateX = 0;
    lightboxTranslateY = 0;
    lightboxRotate = 0;
    lightboxFlipH = 1;
    lightboxFlipV = 1;
    updateLightboxTransform();
}

function handleLightboxWheel(event) {
    event.preventDefault();
    const delta = event.deltaY < 0 ? 0.2 : -0.2;
    zoomLightboxImage(delta);
}

function toggleLightboxDblClick(event) {
    event.preventDefault();
    if (lightboxScale > 1.2) {
        resetLightboxZoom();
    } else {
        lightboxScale = 2.5;
        updateLightboxTransform();
    }
}

function startLightboxDrag(event) {
    if (event.button !== 0) return; // Only left click
    event.preventDefault();
    isLightboxDragging = true;
    lightboxStartX = event.clientX - lightboxTranslateX;
    lightboxStartY = event.clientY - lightboxTranslateY;

    const img = document.getElementById('lightbox-img');
    if (img) img.classList.add('dragging');

    window.addEventListener('mousemove', onLightboxDrag);
    window.addEventListener('mouseup', stopLightboxDrag);
}

function onLightboxDrag(event) {
    if (!isLightboxDragging) return;
    lightboxTranslateX = event.clientX - lightboxStartX;
    lightboxTranslateY = event.clientY - lightboxStartY;
    updateLightboxTransform();
}

function stopLightboxDrag() {
    isLightboxDragging = false;
    const img = document.getElementById('lightbox-img');
    if (img) img.classList.remove('dragging');
    window.removeEventListener('mousemove', onLightboxDrag);
    window.removeEventListener('mouseup', stopLightboxDrag);
}

let currentVoiceData = null;
let wasMutedBeforePlayback = false;

function mutePlayerForPlayback() {
    if (player && typeof player.isMuted === 'function' && typeof player.mute === 'function') {
        if (currentVoiceAudio && !currentVoiceAudio.paused) {
            if (!wasMutedBeforePlayback) {
                wasMutedBeforePlayback = player.isMuted();
            }
            if (!player.isMuted()) {
                player.mute();
            }
        }
    }
}

function restorePlayerAfterPlayback() {
    if (player && typeof player.unMute === 'function') {
        if (!wasMutedBeforePlayback) {
            player.unMute();
        }
    }
    wasMutedBeforePlayback = false;
}

function togglePlayVoice(msgId, audioSrc, totalDuration, event) {
    if (event) event.stopPropagation();

    const playBtn = document.getElementById(`voice-play-btn-${msgId}`);
    const timeEl = document.getElementById(`voice-duration-${msgId}`);
    const barsContainer = document.getElementById(`voice-bars-${msgId}`);

    if (currentVoiceId === msgId && currentVoiceAudio) {
        if (currentVoiceAudio.paused) {
            currentVoiceAudio.play();
            mutePlayerForPlayback();
            if (playBtn) playBtn.innerHTML = '<span class="material-symbols-outlined" style="font-size:18px;">pause</span>';
        } else {
            currentVoiceAudio.pause();
            restorePlayerAfterPlayback();
            if (playBtn) playBtn.innerHTML = '<span class="material-symbols-outlined" style="font-size:18px;">play_arrow</span>';
        }
        return;
    }

    stopCurrentVoiceAudio();

    currentVoiceId = msgId;
    currentVoiceData = { msgId, totalDuration };
    currentVoiceAudio = new Audio(audioSrc);

    if (playBtn) playBtn.innerHTML = '<span class="material-symbols-outlined" style="font-size:18px;">pause</span>';

    currentVoiceAudio.ontimeupdate = () => {
        if (currentVoiceAudio && currentVoiceAudio.duration) {
            const currentTime = currentVoiceAudio.currentTime;
            const duration = currentVoiceAudio.duration;
            const pct = currentTime / duration;

            if (timeEl) {
                timeEl.innerText = formatVoiceDuration(currentTime);
            }

            if (barsContainer) {
                const bars = barsContainer.querySelectorAll('span');
                const totalBars = bars.length;
                const playedCount = Math.round(pct * totalBars);
                bars.forEach((bar, idx) => {
                    if (idx < playedCount && pct > 0) {
                        bar.classList.add('played');
                    } else {
                        bar.classList.remove('played');
                    }
                });
            }
        }
    };

    currentVoiceAudio.onended = () => {
        stopCurrentVoiceAudio();
    };

    currentVoiceAudio.onerror = () => {
        alert('Không thể phát tin nhắn thoại này!');
        stopCurrentVoiceAudio();
    };

    currentVoiceAudio.play().then(() => {
        mutePlayerForPlayback();
    }).catch(err => {
        console.error('Audio play error:', err);
        stopCurrentVoiceAudio();
    });
}

function stopCurrentVoiceAudio() {
    if (currentVoiceAudio) {
        currentVoiceAudio.pause();
        currentVoiceAudio = null;
    }
    restorePlayerAfterPlayback();

    if (currentVoiceId && currentVoiceData) {
        const btn = document.getElementById(`voice-play-btn-${currentVoiceId}`);
        const timeEl = document.getElementById(`voice-duration-${currentVoiceId}`);
        const barsContainer = document.getElementById(`voice-bars-${currentVoiceId}`);

        if (btn) btn.innerHTML = '<span class="material-symbols-outlined" style="font-size:18px;">play_arrow</span>';
        if (timeEl) timeEl.innerText = formatVoiceDuration(currentVoiceData.totalDuration || 0);
        if (barsContainer) {
            barsContainer.querySelectorAll('span').forEach(b => b.classList.remove('played'));
        }
    }
    currentVoiceId = null;
    currentVoiceData = null;
}

function seekVoiceAudio(msgId, event) {
    if (currentVoiceId === msgId && currentVoiceAudio && currentVoiceAudio.duration) {
        const rect = event.currentTarget.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const pct = Math.max(0, Math.min(1, clickX / rect.width));
        currentVoiceAudio.currentTime = pct * currentVoiceAudio.duration;
    }
}

function showToastNotification(text) {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    // Limit max toasts to 3 to avoid screen clutter
    const activeToasts = toastContainer.querySelectorAll('.toast-notification:not(.hide)');
    if (activeToasts.length >= 3) {
        const oldest = activeToasts[0];
        oldest.classList.add('hide');
        setTimeout(() => oldest.remove(), 250);
    }

    const toast = document.createElement('div');
    toast.className = 'toast-notification';

    let iconHtml = '<span class="material-symbols-outlined" style="color:#4dabf7;">info</span>';
    const textLower = text.toLowerCase();

    if (textLower.includes('chuyển bài') || textLower.includes('đang phát')) {
        iconHtml = '<span class="material-symbols-outlined" style="color:#a9e34b;">skip_next</span>';
    } else if (textLower.includes('thêm') || textLower.includes('danh sách')) {
        iconHtml = '<span class="material-symbols-outlined" style="color:#38d9a9;">queue_music</span>';
    } else if (textLower.includes('admin') || text.includes('👑')) {
        iconHtml = '<span class="material-symbols-outlined" style="color:#fbbc04;">workspace_premium</span>';
    } else if (textLower.includes('rời') || text.includes('🏃')) {
        iconHtml = '<span class="material-symbols-outlined" style="color:#ff6b6b;">logout</span>';
    } else if (textLower.includes('tham gia') || text.includes('👋') || textLower.includes('chào mừng')) {
        iconHtml = '<span class="material-symbols-outlined" style="color:#51cf66;">login</span>';
    }

    const cleanText = text.replace(/\[(.*?)\]/g, '$1').replace(/\*\*(.*?)\*\*/g, '$1');

    toast.innerHTML = `
        <div class="toast-icon">${iconHtml}</div>
        <div class="toast-content">${escapeHtml(cleanText)}</div>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        if (toast.parentNode) {
            toast.classList.add('hide');
            setTimeout(() => toast.remove(), 300);
        }
    }, 3500);
}

socket.on('newMessage', (data) => {
    if (!data) return;
    if (data.id && document.getElementById('msg-' + data.id)) return;

    const isSystem = data.role === 'system';

    // Divert ALL system notifications (join/leave/admin/music change/queue/game sys) to toast instead of chat box
    if (isSystem && data.text) {
        showToastNotification(data.text);
        return;
    }

    const chatBox = document.getElementById('chat-box-ui');
    const isAdminMsg = isUserAdmin(data);
    const cleanDataName = (data.name || '').replace(' 😎', '').trim();
    const cleanMyName = (myUsername || '').replace(' 😎', '').trim();
    const isOwn = !isSystem && (data.senderId === socket.id || (cleanMyName && cleanDataName === cleanMyName));
    const senderKey = isSystem ? '__system__' : (isOwn ? 'own_user' : (data.senderId || data.name || ''));

    // Grouping: check if same sender as last message
    const isGrouped = lastChatSenderId === senderKey && !isSystem;
    lastChatSenderId = senderKey;

    const isMediaOnly = Boolean(data.gifUrl || data.type === 'image' || data.type === 'video' || data.fileUrl);

    // Build classes
    let msgClass = 'chat-message';
    if (isSystem) msgClass += ' system-msg';
    if (isAdminMsg) msgClass += ' admin-msg';
    if (isOwn) msgClass += ' own-msg';
    if (isMediaOnly) msgClass += ' media-only-msg';
    if (data.replyTo) msgClass += ' has-reply';
    if (isGrouped) msgClass += ' grouped';
    if (!isGrouped) msgClass += ' group-first';

    // Update previous sibling's grouping for rounded corners and avatar
    const prevMsg = chatBox.querySelector(':scope > .chat-message:last-of-type') || chatBox.lastElementChild;
    if (prevMsg && isGrouped) {
        prevMsg.classList.remove('group-last');
    }
    // Mark this message as potentially the last in its group
    msgClass += ' group-last';

    // Actions menu
    let actionsHtml = '';
    if (!isSystem) {
        const safeName = (data.name || '').replace(/'/g, "\\'").replace(/"/g, "&quot;");
        const safeText = (data.type === 'voice' ? '🎤 [Tin nhắn thoại]' : (data.text || '')).replace(/'/g, "\\'").replace(/"/g, "&quot;");
        let adminBtns = '';
        if (myRole === 'admin') {
            adminBtns = `
                        <button class="action-menu-item" onclick="pinMessage('${safeName}', '${safeText}'); closeChatActionsMenu()"><span class="material-symbols-outlined" style="font-size:16px;">push_pin</span> Ghim</button>
                        <button class="action-menu-item" style="color: #ff6b6b;" onclick="deleteMessage('${data.id}'); closeChatActionsMenu()"><span class="material-symbols-outlined" style="font-size:16px;">delete</span> Xóa</button>
                    `;
        }
        actionsHtml = `<div class="chat-actions">
                    <button class="chat-actions-btn" onclick="toggleChatActionsMenu(event)"><span class="material-symbols-outlined" style="font-size:16px;">more_vert</span></button>
                    <div class="chat-actions-menu">
                        <button class="action-menu-item" onclick="setReply('${data.id}', '${safeName}', '${safeText}'); closeChatActionsMenu()"><span class="material-symbols-outlined" style="font-size:16px;">reply</span> Trả lời</button>
                        ${adminBtns}
                    </div>
                </div>`;
    }

    const isScrolledToBottom = chatBox.scrollHeight - chatBox.clientHeight <= chatBox.scrollTop + 150;
    const shouldScroll = isScrolledToBottom || isOwn;

    // Content
    let contentHtml = '';
    if (data.type === 'image' || (data.fileUrl && data.type !== 'video')) {
        contentHtml = `<img class="chat-media-img" src="${escapeHtml(data.fileUrl || data.gifUrl)}" alt="Hình ảnh" loading="lazy" style="max-width:260px; max-height:300px; border-radius:14px; margin-top:4px; display:block; cursor:pointer; object-fit:cover;" onclick="openImageLightbox(this.src)" onload="if(${shouldScroll}) { const cb = document.getElementById('chat-box-ui'); cb.scrollTop = cb.scrollHeight; }">`;
    } else if (data.type === 'video' || (data.fileUrl && data.type === 'video')) {
        contentHtml = `<video class="chat-media-video" src="${escapeHtml(data.fileUrl)}" controls style="max-width:260px; max-height:300px; border-radius:14px; margin-top:4px; display:block;" onloadeddata="if(${shouldScroll}) { const cb = document.getElementById('chat-box-ui'); cb.scrollTop = cb.scrollHeight; }"></video>`;
    } else if (data.gifUrl) {
        contentHtml = `<img class="chat-gif" src="${escapeHtml(data.gifUrl)}" alt="GIF" loading="lazy" style="cursor:pointer;" onclick="openImageLightbox(this.src)" onload="if(${shouldScroll}) { const cb = document.getElementById('chat-box-ui'); cb.scrollTop = cb.scrollHeight; }">`;
    } else if (data.type === 'voice' || data.audioUrl) {
        const durationSec = data.duration || 0;
        const formattedDur = formatVoiceDuration(durationSec);
        const safeAudioUrl = escapeHtml(data.audioUrl);
        contentHtml = `
            <div class="messenger-voice-player" id="voice-player-${data.id}" data-src="${safeAudioUrl}">
                <button class="messenger-play-btn" id="voice-play-btn-${data.id}" onclick="togglePlayVoice('${data.id}', '${safeAudioUrl}', ${durationSec}, event)" title="Phát/Tạm dừng">
                    <span class="material-symbols-outlined" style="font-size:18px;">play_arrow</span>
                </button>
                <div class="messenger-voice-waveform" onclick="seekVoiceAudio('${data.id}', event)" title="Bấm để chuyển thời gian">
                    <div class="messenger-voice-bars" id="voice-bars-${data.id}">
                        <span style="height: 40%;"></span>
                        <span style="height: 70%;"></span>
                        <span style="height: 45%;"></span>
                        <span style="height: 90%;"></span>
                        <span style="height: 100%;"></span>
                        <span style="height: 60%;"></span>
                        <span style="height: 80%;"></span>
                        <span style="height: 50%;"></span>
                        <span style="height: 95%;"></span>
                        <span style="height: 70%;"></span>
                        <span style="height: 40%;"></span>
                        <span style="height: 65%;"></span>
                    </div>
                </div>
                <span class="messenger-voice-time" id="voice-duration-${data.id}">${formattedDur}</span>
            </div>
        `;
    } else {
        let safeText = escapeHtml(data.text || '');
        if (isSystem) {
            safeText = safeText
                .replace(/✅/g, '<span class="material-symbols-outlined" style="font-size:15px; vertical-align:text-bottom; margin-right:2px;">check_circle</span>')
                .replace(/⏭️/g, '<span class="material-symbols-outlined" style="font-size:15px; vertical-align:text-bottom; margin-right:2px;">skip_next</span>')
                .replace(/🔁/g, '<span class="material-symbols-outlined" style="font-size:15px; vertical-align:text-bottom; margin-right:2px;">repeat</span>')
                .replace(/🔄/g, '<span class="material-symbols-outlined" style="font-size:15px; vertical-align:text-bottom; margin-right:2px;">sync_alt</span>')
                .replace(/🗑️/g, '<span class="material-symbols-outlined" style="font-size:15px; vertical-align:text-bottom; margin-right:2px;">delete</span>')
                .replace(/❌/g, '<span class="material-symbols-outlined" style="font-size:15px; vertical-align:text-bottom; margin-right:2px;">error</span>');
            safeText = safeText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        }
        contentHtml = `<span class="chat-text">${safeText}</span>`;
    }

    // Author name & color
    let authorStyle = '';
    let finalName = data.name || '';
    if (isSystem) {
        finalName = finalName.replace(/🎵/g, '<span class="material-symbols-outlined" style="font-size:14px; vertical-align:text-bottom;">smart_toy</span>');
    }
    if (!isSystem && data.nameColor) {
        authorStyle = `style="color: ${escapeHtml(data.nameColor)}"`;
    }

    const verifiedBadge = isAdminMsg ? getTikTokVerifiedBadgeHtml() : '';
    const cleanDisplayName = escapeHtml((data.name || '').replace(' 😎', '').trim());

    // Reply quote & Author label text
    let replyHtml = '';
    let authorTextHtml = isSystem ? finalName : `${cleanDisplayName}${verifiedBadge}`;

    if (data.replyTo) {
        const cleanSender = (data.name || 'Ẩn danh').replace(' 😎', '').trim();
        const cleanTarget = (data.replyTo.name || 'Ẩn danh').replace(' 😎', '').trim();
        const cleanMyName = (myUsername || '').replace(' 😎', '').trim();

        const isSenderMe = isOwn || (cleanMyName && cleanSender.toLowerCase() === cleanMyName.toLowerCase());
        const isTargetMe = cleanMyName && cleanTarget.toLowerCase() === cleanMyName.toLowerCase();
        const isSamePerson = cleanSender.toLowerCase() === cleanTarget.toLowerCase();

        const senderBadge = isUserAdmin(data) ? getTikTokVerifiedBadgeHtml() : '';
        const targetBadge = isUserAdmin(data.replyTo) ? getTikTokVerifiedBadgeHtml() : '';

        const safeSenderDisplay = isSenderMe ? 'Bạn' : escapeHtml(cleanSender);
        const safeTargetDisplay = isTargetMe ? 'bạn' : escapeHtml(cleanTarget);
        const safeReplyText = escapeHtml(data.replyTo.text || '');

        if (!isSystem) {
            if (isSamePerson) {
                authorTextHtml = `<strong>${safeSenderDisplay}</strong>${senderBadge} đã phản hồi chính mình`;
            } else if (isTargetMe) {
                authorTextHtml = `<strong>${safeSenderDisplay}</strong>${senderBadge} đã phản hồi <strong>bạn</strong>`;
            } else {
                authorTextHtml = `<strong>${safeSenderDisplay}</strong>${senderBadge} đã phản hồi <strong>${safeTargetDisplay}</strong>${targetBadge}`;
            }
        }

        replyHtml = `<div class="chat-reply-quote" onclick="document.getElementById('msg-${data.replyTo.id}')?.scrollIntoView({behavior: 'smooth', block: 'center'})">
                    ${safeReplyText}
                </div>`;
    }

    // Avatar (only for other people, image if available, otherwise first letter of name)
    const avatarInitial = (data.name || '?').charAt(0).toUpperCase();
    const avatarColor = data.nameColor || stringToColor(data.name || '');
    const avatarHtml = isSystem ? '' : (
        data.avatarUrl
            ? `<img class="chat-avatar chat-avatar-img" src="${escapeHtml(data.avatarUrl)}" alt="${avatarInitial}" onerror="this.outerHTML='<div class=\\'chat-avatar\\' style=\\'background:${escapeHtml(avatarColor)}\\'>${avatarInitial}</div>'">`
            : `<div class="chat-avatar" style="background:${escapeHtml(avatarColor)}">${avatarInitial}</div>`
    );

    // Author label (above bubble / reply quote)
    const authorHtml = isSystem ? '' : `<span class="chat-author" ${authorStyle}>${authorTextHtml}</span>`;

    // Build the full message — reply quote sits ABOVE the bubble (Messenger style)
    const msgHtml = `<div class="${msgClass}" id="msg-${data.id}">
                ${avatarHtml}
                <div class="chat-bubble-wrap">
                    ${authorHtml}
                    ${replyHtml}
                    <div class="chat-bubble">
                        ${contentHtml}
                    </div>
                </div>
                ${actionsHtml}
            </div>`;

    chatBox.insertAdjacentHTML('beforeend', msgHtml);

    if (shouldScroll) {
        chatBox.scrollTop = chatBox.scrollHeight;
        setTimeout(() => {
            chatBox.scrollTop = chatBox.scrollHeight;
        }, 100);
    }

    if (!isOwn && !isSystem && !data.isHistory && !isLoadingChatHistory) {
        playChatSound();
        if (!chatBubbleOpen && window.innerWidth < 900) {
            unreadCount++;
            updateChatBadge();
        }
    }
});

function toggleChatActionsMenu(e) {
    e.stopPropagation();
    const btn = e.currentTarget;
    const actionsWrap = btn.closest('.chat-actions');
    const menu = btn.parentElement.querySelector('.chat-actions-menu');
    const wasOpen = menu && menu.classList.contains('open');

    // Close all open menus first
    closeChatActionsMenu();

    if (!wasOpen && menu) {
        menu.classList.add('open');
        if (actionsWrap) actionsWrap.classList.add('active');

        // Position using fixed coords from button
        const rect = btn.getBoundingClientRect();
        const isOwn = btn.closest('.chat-message')?.classList.contains('own-msg');
        const menuHeight = 120; // approximate

        // Vertical: below button, or above if near bottom
        if (rect.bottom + menuHeight > window.innerHeight) {
            menu.style.top = (rect.top - menuHeight) + 'px';
        } else {
            menu.style.top = (rect.bottom + 4) + 'px';
        }

        // Horizontal: align to button edge
        if (isOwn) {
            menu.style.right = (window.innerWidth - rect.right) + 'px';
            menu.style.left = 'auto';
        } else {
            menu.style.left = rect.left + 'px';
            menu.style.right = 'auto';
        }
    }
}

function closeChatActionsMenu() {
    document.querySelectorAll('.chat-actions-menu.open').forEach(m => {
        m.classList.remove('open');
        m.style.top = '';
        m.style.left = '';
        m.style.right = '';
    });
    document.querySelectorAll('.chat-actions.active').forEach(a => {
        a.classList.remove('active');
    });
}

// Close menu when clicking anywhere outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.chat-actions-menu') && !e.target.closest('.chat-actions-btn')) {
        closeChatActionsMenu();
    }
});

function pinMessage(name, text) { socket.emit('adminPinMessage', { name, text }); }
function unpinMessage() { socket.emit('adminUnpinMessage'); }
function deleteMessage(id) { socket.emit('adminDeleteMessage', id); }
function removeSong(index) { socket.emit('adminRemoveSong', index); }


function extractVideoID(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
}

function onYouTubeIframeAPIReady() {
    isYoutubeApiLoaded = true;
    createPlayer();
}

function createPlayer() {
    if (window.YT && window.YT.Player) isYoutubeApiLoaded = true;
    if (player || !isYoutubeApiLoaded || myRole === '') return;

    player = new YT.Player('youtube-player', {
        height: '100%', width: '100%', videoId: initialVideoId || '4jjOH2FR6-E',
        playerVars: { 'controls': 1, 'disablekb': 1, 'origin': window.location.origin, 'rel': 0 },
        events: {
            'onReady': () => {
                isPlayerReady = true;
                try { if (typeof player.setVolume === 'function') player.setVolume(50); } catch (e) { }
                document.getElementById('status').innerText = "Trạng thái: Đang phát trực tiếp 🟢";
                if (pendingVideoId) {
                    if (typeof player.loadVideoById === 'function') player.loadVideoById(pendingVideoId);
                    pendingVideoId = null;
                    setTimeout(() => socket.emit('requestSync'), 1000);
                } else if (initialVideoId) {
                    setTimeout(() => socket.emit('requestSync'), 1000);
                }
            },
            'onStateChange': (e) => {
                if (e.data == YT.PlayerState.PLAYING) {
                    try {
                        const videoData = player.getVideoData();
                        if (videoData && videoData.title) {
                            if (document.title !== videoData.title) {
                                document.title = videoData.title;
                                document.getElementById('welcome-title').innerText = videoData.title;
                            }
                        }
                    } catch (err) { }
                }
                if (myRole === 'admin') {
                    if (window.ignoreNextStateChange && (Date.now() - window.lastSyncTime < 1500)) {
                        return;
                    }
                    if (e.data == YT.PlayerState.PLAYING) socket.emit('adminPlay', player.getCurrentTime());
                    if (e.data == YT.PlayerState.PAUSED) socket.emit('adminPause');
                    if (e.data == YT.PlayerState.ENDED) socket.emit('videoEnded', window.currentVideoId);
                }
            }
        }
    });
}

function changeVolume(val) {
    if (player && player.setVolume) player.setVolume(val);
    const icon = document.getElementById('volume-icon');
    if (icon) {
        if (val == 0) icon.innerText = 'volume_off';
        else if (val < 50) icon.innerText = 'volume_down';
        else icon.innerText = 'volume_up';
    }
    if (val > 0) isVideoMuted = false;
}

let isVideoMuted = false;
let lastVolume = 50;
function toggleVideoMute() {
    const slider = document.getElementById('volume-slider');
    if (isVideoMuted) {
        isVideoMuted = false;
        slider.value = lastVolume || 50;
        changeVolume(slider.value);
    } else {
        lastVolume = slider.value > 0 ? slider.value : 50;
        isVideoMuted = true;
        slider.value = 0;
        changeVolume(0);
    }
}
function addSong() {
    const input = document.getElementById('song-input');
    const btn = document.querySelector('.btn-add-search') || document.querySelector('.btn-add');
    const suggestionsDropdown = document.getElementById('search-suggestions');
    if (suggestionsDropdown) suggestionsDropdown.classList.add('hidden');

    if (input && input.value) {
        let originalHtml = '';
        if (btn) {
            originalHtml = btn.innerHTML;
            btn.innerHTML = '<span class="material-symbols-outlined" style="font-size:18px; animation: spin 1s linear infinite;">sync</span>';
            btn.disabled = true;
        }
        input.disabled = true;

        socket.emit('addSong', extractVideoID(input.value), (res) => {
            if (btn) {
                btn.innerHTML = originalHtml;
                btn.disabled = false;
            }
            input.disabled = false;
            if (res && res.success) {
                input.value = '';
            } else {
                showToastNotification('⚠️ ' + (res && res.message ? res.message : "Không tìm thấy bài hát hoặc có lỗi xảy ra!"));
            }
        });
    }
}

function performSearchTrigger() {
    const input = document.getElementById('song-input');
    const suggestionsDropdown = document.getElementById('search-suggestions');
    const btn = document.querySelector('.btn-add-search') || document.querySelector('.btn-add');
    if (!input) return;

    const query = input.value.trim();
    if (!query) {
        input.focus();
        return;
    }

    // If input is a direct YouTube video URL, add directly
    if (/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(query)) {
        addSong();
        return;
    }

    // Immediately fetch & display search suggestions on button click/Enter
    clearTimeout(searchDebounceTimer);
    let originalHtml = '';
    if (btn) {
        originalHtml = btn.innerHTML;
        btn.innerHTML = '<span class="material-symbols-outlined" style="font-size:18px; animation: spin 1s linear infinite;">sync</span>';
        btn.disabled = true;
    }

    const requestId = ++latestSearchRequestId;
    isHoveringSuggestions = false;

    socket.emit('searchSuggestions', query, (videos) => {
        if (btn) {
            btn.innerHTML = originalHtml;
            btn.disabled = false;
        }

        if (requestId !== latestSearchRequestId) return;

        if (!videos || !videos.length) {
            showToastNotification(`⚠️ Không tìm thấy gợi ý nào cho "${query}"`);
            if (suggestionsDropdown) {
                suggestionsDropdown.innerHTML = '';
                suggestionsDropdown.classList.add('hidden');
            }
            return;
        }

        if (suggestionsDropdown) {
            suggestionsDropdown.innerHTML = videos.map(v => `
                <div class="search-suggestion-item" onclick="addSuggestedSong('${v.id}')">
                    <img src="${escapeHtml(v.thumbnail)}" class="search-suggestion-thumb" alt="thumbnail" onerror="this.onerror=null; this.src='/assets/images/music-placeholder.png';">
                    <div class="search-suggestion-info">
                        <div class="search-suggestion-title" title="${escapeHtml(v.title)}">${escapeHtml(v.title)}</div>
                        <div class="search-suggestion-meta">${escapeHtml(v.author)} ${v.timestamp ? '• ' + escapeHtml(v.timestamp) : ''}</div>
                    </div>
                    <button class="search-suggestion-add-btn" onclick="event.stopPropagation(); addSuggestedSong('${v.id}')">
                        <span class="material-symbols-outlined" style="font-size:14px;">add</span> Thêm
                    </button>
                </div>
            `).join('');

            suggestionsDropdown.classList.remove('hidden');
        }
    });
}

function openMobileSearch() {
    const overlay = document.getElementById('mobile-search-overlay');
    const input = document.getElementById('mobile-song-input');
    if (overlay) {
        overlay.classList.remove('hidden');
        if (input) {
            setTimeout(() => input.focus(), 50);
            if (input.value.trim().length >= 2) {
                performMobileSearchTrigger();
            }
        }
    }
}

function closeMobileSearch() {
    const overlay = document.getElementById('mobile-search-overlay');
    const suggestions = document.getElementById('mobile-search-suggestions');
    if (overlay) overlay.classList.add('hidden');
    if (suggestions) suggestions.classList.add('hidden');
}

function performMobileSearchTrigger() {
    const input = document.getElementById('mobile-song-input');
    const suggestionsDropdown = document.getElementById('mobile-search-suggestions');
    if (!input) return;

    const query = input.value.trim();
    if (!query) {
        input.focus();
        return;
    }

    if (/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(query)) {
        socket.emit('addSong', extractVideoID(query), (res) => {
            if (res && res.success) {
                input.value = '';
                showToastNotification('✅ Đã thêm bài hát vào hàng đợi!');
                closeMobileSearch();
            } else {
                showToastNotification('⚠️ ' + (res && res.message ? res.message : "Không tìm thấy bài hát!"));
            }
        });
        return;
    }

    clearTimeout(searchDebounceTimer);
    const requestId = ++latestSearchRequestId;

    socket.emit('searchSuggestions', query, (videos) => {
        if (requestId !== latestSearchRequestId) return;

        if (!videos || !videos.length) {
            showToastNotification(`⚠️ Không tìm thấy gợi ý nào cho "${query}"`);
            if (suggestionsDropdown) {
                suggestionsDropdown.innerHTML = '';
                suggestionsDropdown.classList.add('hidden');
            }
            return;
        }

        if (suggestionsDropdown) {
            suggestionsDropdown.innerHTML = videos.map(v => `
                <div class="search-suggestion-item" onclick="addSuggestedSong('${v.id}')">
                    <img src="${escapeHtml(v.thumbnail)}" class="search-suggestion-thumb" alt="thumbnail" onerror="this.onerror=null; this.src='/assets/images/music-placeholder.png';">
                    <div class="search-suggestion-info">
                        <div class="search-suggestion-title" title="${escapeHtml(v.title)}">${escapeHtml(v.title)}</div>
                        <div class="search-suggestion-meta">${escapeHtml(v.author)} ${v.timestamp ? '• ' + escapeHtml(v.timestamp) : ''}</div>
                    </div>
                    <button class="search-suggestion-add-btn" onclick="event.stopPropagation(); addSuggestedSong('${v.id}')">
                        <span class="material-symbols-outlined" style="font-size:14px;">add</span> Thêm
                    </button>
                </div>
            `).join('');

            suggestionsDropdown.classList.remove('hidden');
        }
    });
}

// --- LIVE YOUTUBE SEARCH SUGGESTIONS ---
let searchDebounceTimer = null;
let latestSearchRequestId = 0;
let isHoveringSuggestions = false;

function setupSearchSuggestions() {
    const songInput = document.getElementById('song-input');
    const suggestionsDropdown = document.getElementById('search-suggestions');
    const mobileInput = document.getElementById('mobile-song-input');
    const mobileDropdown = document.getElementById('mobile-search-suggestions');

    if (suggestionsDropdown) {
        suggestionsDropdown.addEventListener('mouseenter', () => { isHoveringSuggestions = true; });
        suggestionsDropdown.addEventListener('mouseleave', () => { isHoveringSuggestions = false; });
    }

    if (songInput && suggestionsDropdown) {
        songInput.addEventListener('input', () => {
            const query = songInput.value.trim();
            clearTimeout(searchDebounceTimer);

            if (query.length < 2) {
                latestSearchRequestId++;
                suggestionsDropdown.innerHTML = '';
                suggestionsDropdown.classList.add('hidden');
                return;
            }

            const requestId = ++latestSearchRequestId;

            searchDebounceTimer = setTimeout(() => {
                socket.emit('searchSuggestions', query, (videos) => {
                    // Drop stale out-of-order responses or updates while mouse is hovering dropdown
                    if (requestId !== latestSearchRequestId) return;
                    if (songInput.value.trim() !== query) return;
                    if (isHoveringSuggestions) return;

                    if (!videos || !videos.length) {
                        suggestionsDropdown.innerHTML = '';
                        suggestionsDropdown.classList.add('hidden');
                        return;
                    }

                    suggestionsDropdown.innerHTML = videos.map(v => `
                        <div class="search-suggestion-item" onclick="addSuggestedSong('${v.id}')">
                            <img src="${escapeHtml(v.thumbnail)}" class="search-suggestion-thumb" alt="thumbnail" onerror="this.onerror=null; this.src='/assets/images/music-placeholder.png';">
                            <div class="search-suggestion-info">
                                <div class="search-suggestion-title" title="${escapeHtml(v.title)}">${escapeHtml(v.title)}</div>
                                <div class="search-suggestion-meta">${escapeHtml(v.author)} ${v.timestamp ? '• ' + escapeHtml(v.timestamp) : ''}</div>
                            </div>
                            <button class="search-suggestion-add-btn" onclick="event.stopPropagation(); addSuggestedSong('${v.id}')">
                                <span class="material-symbols-outlined" style="font-size:14px;">add</span> Thêm
                            </button>
                        </div>
                    `).join('');

                    suggestionsDropdown.classList.remove('hidden');
                });
            }, 300);
        });

        songInput.addEventListener('focus', () => {
            if (suggestionsDropdown.children.length > 0 && songInput.value.trim().length >= 2) {
                suggestionsDropdown.classList.remove('hidden');
            }
        });
    }

    if (mobileInput && mobileDropdown) {
        mobileInput.addEventListener('input', () => {
            const query = mobileInput.value.trim();
            clearTimeout(searchDebounceTimer);

            if (query.length < 2) {
                latestSearchRequestId++;
                mobileDropdown.innerHTML = '';
                mobileDropdown.classList.add('hidden');
                return;
            }

            const requestId = ++latestSearchRequestId;

            searchDebounceTimer = setTimeout(() => {
                socket.emit('searchSuggestions', query, (videos) => {
                    if (requestId !== latestSearchRequestId) return;
                    if (mobileInput.value.trim() !== query) return;

                    if (!videos || !videos.length) {
                        mobileDropdown.innerHTML = '';
                        mobileDropdown.classList.add('hidden');
                        return;
                    }

                    mobileDropdown.innerHTML = videos.map(v => `
                        <div class="search-suggestion-item" onclick="addSuggestedSong('${v.id}')">
                            <img src="${escapeHtml(v.thumbnail)}" class="search-suggestion-thumb" alt="thumbnail" onerror="this.onerror=null; this.src='/assets/images/music-placeholder.png';">
                            <div class="search-suggestion-info">
                                <div class="search-suggestion-title" title="${escapeHtml(v.title)}">${escapeHtml(v.title)}</div>
                                <div class="search-suggestion-meta">${escapeHtml(v.author)} ${v.timestamp ? '• ' + escapeHtml(v.timestamp) : ''}</div>
                            </div>
                            <button class="search-suggestion-add-btn" onclick="event.stopPropagation(); addSuggestedSong('${v.id}')">
                                <span class="material-symbols-outlined" style="font-size:14px;">add</span> Thêm
                            </button>
                        </div>
                    `).join('');

                    mobileDropdown.classList.remove('hidden');
                });
            }, 300);
        });
    }

    document.addEventListener('click', (e) => {
        const searchWrapper = document.getElementById('navbar-search');
        if (searchWrapper && !searchWrapper.contains(e.target)) {
            if (suggestionsDropdown) suggestionsDropdown.classList.add('hidden');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (suggestionsDropdown) suggestionsDropdown.classList.add('hidden');
            closeMobileSearch();
        }
    });
}

function addSuggestedSong(videoId) {
    const suggestionsDropdown = document.getElementById('search-suggestions');
    const mobileDropdown = document.getElementById('mobile-search-suggestions');
    const songInput = document.getElementById('song-input');
    const mobileInput = document.getElementById('mobile-song-input');

    if (suggestionsDropdown) suggestionsDropdown.classList.add('hidden');
    if (mobileDropdown) mobileDropdown.classList.add('hidden');
    if (songInput) songInput.value = '';
    if (mobileInput) mobileInput.value = '';
    closeMobileSearch();

    socket.emit('addSong', videoId, (res) => {
        if (res && res.success) {
            showToastNotification('✅ Đã thêm bài hát vào hàng đợi!');
        } else {
            showToastNotification('⚠️ ' + (res && res.message ? res.message : "Bài hát đã có trong hàng đợi hoặc có lỗi!"));
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setupSearchSuggestions();
});
if (document.readyState !== 'loading') {
    setupSearchSuggestions();
}

function nextSong() { socket.emit('adminNextSong'); }

socket.on('updatePlaylist', (list) => { updatePlaylistUI(list); });
socket.on('changeVideo', (data) => {
    const vidId = data.id || data;
    const vidTitle = data.title || 'Trạm Nhạc Live';

    if (vidTitle && vidTitle !== 'Trạm Nhạc Live') {
        showToastNotification(`Đang phát: ${vidTitle}`);
    }

    if (player) {
        if (typeof player.loadVideoById === 'function') {
            if (window.currentVideoId === vidId && typeof player.seekTo === 'function') {
                player.seekTo(0);
                if (typeof player.playVideo === 'function') player.playVideo();
            } else {
                player.loadVideoById(vidId);
            }
        } else {
            pendingVideoId = vidId;
        }
    }
    window.currentVideoId = vidId;
    initialVideoId = vidId;
    document.title = vidTitle;
    document.getElementById('welcome-title').innerText = vidTitle;
    fetchLyrics(vidTitle);
});
socket.on('stopVideo', () => {
    if (player && typeof player.stopVideo === 'function') {
        player.stopVideo();
    } else {
        pendingVideoId = null;
    }
    initialVideoId = '';
    window.currentVideoId = '';
    document.title = 'Trạm Nhạc Live';
    document.getElementById('welcome-title').innerText = 'Chưa có bài hát nào';
    document.getElementById('lyric-content').innerHTML = '<div class="lyric-loading">Chưa có bài hát nào</div>';
    stopLyricSync();
});
socket.on('loopModeUpdate', (mode) => {
    isLoopMode = mode;
    updateLoopUI();
});

function toggleLoop() {
    socket.emit('adminToggleLoop');
}

function updateLoopUI() {
    const btn = document.getElementById('btn-loop');
    if (btn) {
        btn.classList.toggle('active', isLoopMode);
        btn.title = isLoopMode ? 'Chế độ lặp: BẬT 🔁' : 'Chế độ lặp: TẮT';
    }
}

function updatePlaylistUI(list) {
    const ui = document.getElementById('playlist-ui');
    if (list.length === 0) {
        ui.innerHTML = '<div>Chưa có bài nào chờ.</div>';
    } else {
        ui.innerHTML = list.map((song, i) => `
                    <div data-id="${i}" class="playlist-item" style="display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid var(--border-color); ${myRole === 'admin' ? 'cursor: grab;' : ''}">
                        <span class="song-idx" style="color: var(--text-muted); font-size: 12px; width: 20px;">${myRole === 'admin' ? '☰' : (i + 1)}</span>
                        <img src="${song.thumbnail}" alt="thumb" style="width: 80px; height: 45px; object-fit: cover; border-radius: 4px;">
                        <div class="song-info" style="flex: 1; display: flex; flex-direction: column; overflow: hidden;">
                            <span class="song-title" title="${escapeHtml(song.title)}" style="font-size: 13px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(song.title)}</span>
                            <span class="song-id-text" style="font-size: 11px; color: var(--text-muted);">
                                Thêm bởi: <strong style="color: ${escapeHtml(song.addedByColor || '#aaaaaa')}">${escapeHtml(song.addedBy || 'Ẩn danh')}</strong>
                            </span>
                        </div>
                        ${myRole === 'admin' ? `<button style="background: none; color: red; border: none; border-radius: 4px; cursor: pointer; padding: 4px 8px; font-size: 12px; display: flex; align-items: center; justify-content: center;" onclick="removeSong(${i})"><span class="material-symbols-outlined" style="font-size: 16px;">delete</span></button>` : ''}
                    </div>
                `).join('');
    }

    if (myRole === 'admin' && typeof Sortable !== 'undefined' && list.length > 1) {
        if (window.playlistSortable) {
            window.playlistSortable.destroy();
        }
        window.playlistSortable = new Sortable(ui, {
            animation: 150,
            handle: '.playlist-item',
            onEnd: function (evt) {
                const newPlaylist = [];
                const items = ui.querySelectorAll('.playlist-item');
                items.forEach(item => {
                    const oldIndex = parseInt(item.getAttribute('data-id'));
                    newPlaylist.push(list[oldIndex]);
                });
                socket.emit('adminReorderPlaylist', newPlaylist);
            }
        });
    }
}

function forceSync() {
    if (player && player.playVideo) {
        player.playVideo();
        socket.emit('requestSync');
        const btn = document.getElementById('sync-btn');
        btn.innerHTML = '<span class="material-symbols-outlined" style="font-size:18px;vertical-align:text-bottom;margin-right:4px;">sync</span>';
        btn.classList.remove('active');
    }
}

socket.on('memberRequestSync', () => {
    if (myRole === 'admin' && player) {
        const state = typeof player.getPlayerState === 'function' ? player.getPlayerState() : -1;
        if (state === YT.PlayerState.PLAYING || state === YT.PlayerState.BUFFERING || state === YT.PlayerState.UNSTARTED) {
            socket.emit('adminPlay', player.getCurrentTime());
        } else if (state === YT.PlayerState.PAUSED) {
            socket.emit('adminPause');
        }
    }
});

socket.on('memberPlay', (time) => {
    if (player) {
        let isLive = false;
        try {
            const duration = typeof player.getDuration === 'function' ? player.getDuration() : 0;
            isLive = duration === 0 || (player.getVideoData && player.getVideoData().isLive);
        } catch (e) { }

        let state = -1;
        try {
            state = typeof player.getPlayerState === 'function' ? player.getPlayerState() : -1;
        } catch (e) { }

        let diff = 0;
        try {
            diff = Math.abs(player.getCurrentTime() - time);
        } catch (e) { }

        if (diff > 1.5 && !isLive) {
            window.ignoreNextStateChange = true;
            window.lastSyncTime = Date.now();
            if (typeof player.seekTo === 'function') player.seekTo(time);
        }

        if (state !== YT.PlayerState.PLAYING) {
            window.ignoreNextStateChange = true;
            window.lastSyncTime = Date.now();
            player.playVideo();
        }
    }
});

socket.on('memberPause', () => {
    if (player) {
        const state = typeof player.getPlayerState === 'function' ? player.getPlayerState() : -1;
        if (state !== YT.PlayerState.PAUSED) {
            window.ignoreNextStateChange = true;
            window.lastSyncTime = Date.now();
            player.pauseVideo();
        }
    }
});


function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

const EMOJI_DATA = {
    'Mặt cười': ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🫢', '🫣', '🤫', '🤔', '🫡'],
    'Cảm xúc': ['😐', '😑', '😶', '🫥', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '🥸', '😎', '🤓', '🧐'],
    'Cử chỉ': ['👋', '🤚', '🖐', '✋', '🖖', '🫱', '🫲', '🫳', '🫴', '👌', '🤌', '🤏', '✌️', '🤞', '🫰', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '🫵', '👍', '👎', '✊', '👊', '🤛'],
    'Trái tim': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❤️‍🔥', '❤️‍🩹', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟'],
    'Thú vật': ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐻‍❄️', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🙈', '🙉', '🙊', '🐔', '🐧', '🐦', '🦅', '🦆', '🦉'],
    'Đồ ăn': ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🥑', '🍕', '🍔', '🍟', '🌭', '🍿', '🧁', '🍰'],
    'Hoạt động': ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🏓', '🎮', '🎯', '🎪', '🎭', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🥁', '🎷', '🎺', '🎸'],
    'Biểu tượng': ['💯', '🔥', '✨', '🌟', '💫', '⭐', '🎉', '🎊', '🏆', '🥇', '🏅', '🎖', '🎗', '🎁', '💰', '💎', '🔔', '📢', '💬', '💭', '🗯', '♥️', '♠️', '♣️', '♦️']
};

let pickerVisible = false;
let currentPickerTab = 'emoji';
let gifSearchTimeout = null;

function populateEmojiGrid() {
    const grid = document.getElementById('emoji-panel');
    let html = '';
    for (const [category, emojis] of Object.entries(EMOJI_DATA)) {
        html += `<div class="emoji-category-label">${category}</div>`;
        for (const emoji of emojis) {
            html += `<div class="emoji-item" onclick="insertEmoji('${emoji}')">${emoji}</div>`;
        }
    }
    grid.innerHTML = html;
}

function insertEmoji(emoji) {
    const input = document.getElementById('chat-input');
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const text = input.value;
    input.value = text.substring(0, start) + emoji + text.substring(end);
    input.focus();
    input.selectionStart = input.selectionEnd = start + emoji.length;
}

function togglePicker() {
    const popup = document.getElementById('picker-popup');
    const btn = document.getElementById('emoji-toggle-btn');
    pickerVisible = !pickerVisible;
    popup.classList.toggle('hidden', !pickerVisible);
    btn.classList.toggle('active', pickerVisible);
    if (pickerVisible && currentPickerTab === 'gif') {
        loadTrendingGifs();
    }
}

function switchPickerTab(tab) {
    currentPickerTab = tab;
    document.getElementById('tab-emoji').classList.toggle('active', tab === 'emoji');
    document.getElementById('tab-gif').classList.toggle('active', tab === 'gif');
    document.getElementById('emoji-panel').classList.toggle('hidden', tab !== 'emoji');
    document.getElementById('gif-panel').classList.toggle('hidden', tab !== 'gif');
    if (tab === 'gif') {
        loadTrendingGifs();
        document.getElementById('gif-search-input').focus();
    }
}

document.addEventListener('click', (e) => {
    const popup = document.getElementById('picker-popup');
    const toggleBtn = document.getElementById('emoji-toggle-btn');
    if (pickerVisible && !popup.contains(e.target) && e.target !== toggleBtn) {
        pickerVisible = false;
        popup.classList.add('hidden');
        toggleBtn.classList.remove('active');
    }
});


const KLIPY_API_KEY = '0Y7PJdRTbgPWV1aGkzA6FwklXAW5osXemiX4dFr4aJrgtxO4QF4E40Pc6WdEDzRS';
let trendingLoaded = false;

function loadTrendingGifs() {
    if (trendingLoaded) return;
    const results = document.getElementById('gif-results');
    results.innerHTML = '<div class="gif-results-loading">🔄 Đang tải GIF xu hướng...</div>';
    fetch(`https://api.klipy.com/v2/featured?key=${KLIPY_API_KEY}&limit=20&media_filter=tinygif,gif`)
        .then(r => r.json())
        .then(data => {
            trendingLoaded = true;
            renderGifResults(data.results || []);
        })
        .catch(() => {
            results.innerHTML = '<div class="gif-results-loading">Không thể tải GIF. Hãy thử tìm kiếm!</div>';
        });
}

function debouncedGifSearch() {
    clearTimeout(gifSearchTimeout);
    gifSearchTimeout = setTimeout(searchGifs, 400);
}

function searchGifs() {
    const query = document.getElementById('gif-search-input').value.trim();
    const results = document.getElementById('gif-results');
    if (!query) {
        trendingLoaded = false;
        loadTrendingGifs();
        return;
    }
    results.innerHTML = '<div class="gif-results-loading">🔍 Đang tìm kiếm...</div>';
    fetch(`https://api.klipy.com/v2/search?key=${KLIPY_API_KEY}&q=${encodeURIComponent(query)}&limit=20&media_filter=tinygif,gif`)
        .then(r => r.json())
        .then(data => renderGifResults(data.results || []))
        .catch(() => {
            results.innerHTML = '<div class="gif-results-loading">Lỗi tìm kiếm GIF ❌</div>';
        });
}

function renderGifResults(gifs) {
    const results = document.getElementById('gif-results');
    if (gifs.length === 0) {
        results.innerHTML = '<div class="gif-results-loading">Không tìm thấy GIF nào 😢</div>';
        return;
    }
    results.innerHTML = gifs.map(gif => {
        const tinyUrl = gif.media_formats?.tinygif?.url || gif.media_formats?.gif?.url || '';
        const fullUrl = gif.media_formats?.gif?.url || tinyUrl;
        return `<div class="gif-result-item" onclick="sendGif('${escapeHtml(fullUrl)}')">
                    <img src="${escapeHtml(tinyUrl)}" alt="GIF" loading="lazy">
                </div>`;
    }).join('');
}

function sendGif(gifUrl) {
    socket.emit('sendMessage', { type: 'gif', gifUrl: gifUrl });
    pickerVisible = false;
    document.getElementById('picker-popup').classList.add('hidden');
    document.getElementById('emoji-toggle-btn').classList.remove('active');
}

populateEmojiGrid();


let inlineSuggestTimeout = null;
let lastSuggestQuery = '';

function onChatInputChange() {
    notifyTyping();

    const input = document.getElementById('chat-input');
    const text = input.value.trim();

    if (pickerVisible) return;

    if (!text || text.length < 2) {
        hideGifSuggestions();
        lastSuggestQuery = '';
        return;
    }

    const words = text.split(/\s+/);
    const query = words[words.length - 1];

    if (query.length < 2 || query === lastSuggestQuery) return;
    lastSuggestQuery = query;

    clearTimeout(inlineSuggestTimeout);
    inlineSuggestTimeout = setTimeout(() => fetchInlineGifs(query), 350);
}

function fetchInlineGifs(query) {
    fetch(`https://api.klipy.com/v2/search?key=${KLIPY_API_KEY}&q=${encodeURIComponent(query)}&limit=10&media_filter=tinygif,gif`)
        .then(r => r.json())
        .then(data => {
            const gifs = data.results || [];
            if (gifs.length > 0) {
                showGifSuggestions(gifs);
            } else {
                hideGifSuggestions();
            }
        })
        .catch(() => hideGifSuggestions());
}

function showGifSuggestions(gifs) {
    const strip = document.getElementById('gif-suggest-strip');
    strip.innerHTML = '<div class="gif-suggest-label"></div>' +
        gifs.map(gif => {
            const tinyUrl = gif.media_formats?.tinygif?.url || gif.media_formats?.gif?.url || '';
            const fullUrl = gif.media_formats?.gif?.url || tinyUrl;
            return `<div class="gif-suggest-item" onclick="sendInlineGif('${escapeHtml(fullUrl)}')">
                        <img src="${escapeHtml(tinyUrl)}" alt="GIF" loading="lazy">
                    </div>`;
        }).join('');
    strip.classList.add('active');
    strip.scrollLeft = 0;
}

function hideGifSuggestions() {
    const strip = document.getElementById('gif-suggest-strip');
    strip.classList.remove('active');
    strip.innerHTML = '';
    lastSuggestQuery = '';
}

function sendInlineGif(gifUrl) {
    socket.emit('sendMessage', { type: 'gif', gifUrl: gifUrl });
    document.getElementById('chat-input').value = '';
    hideGifSuggestions();
}


let chatBubbleOpen = false;
let unreadCount = 0;

function switchRightTab(tabName) {
    const tabChat = document.getElementById('tab-chat');
    const tabLyric = document.getElementById('tab-lyric');
    const chatArea = document.getElementById('chat-area-container');
    const lyricArea = document.getElementById('lyric-area-container');
    const chatFab = document.getElementById('chat-bubble-btn');
    const lyricFab = document.getElementById('lyric-bubble-btn');

    if (tabName === 'chat') {
        tabChat.style.fontWeight = '600';
        tabChat.style.color = 'var(--accent)';
        tabLyric.style.fontWeight = '500';
        tabLyric.style.color = 'var(--text-muted)';
        chatArea.classList.remove('hidden');
        lyricArea.classList.add('hidden');
        if (chatFab) chatFab.classList.add('active-tab');
        if (lyricFab) lyricFab.classList.remove('active-tab');
    } else {
        tabLyric.style.fontWeight = '600';
        tabLyric.style.color = 'var(--accent)';
        tabChat.style.fontWeight = '500';
        tabChat.style.color = 'var(--text-muted)';
        lyricArea.classList.remove('hidden');
        chatArea.classList.add('hidden');
        if (chatFab) chatFab.classList.remove('active-tab');
        if (lyricFab) lyricFab.classList.add('active-tab');
    }
}

function toggleLyricBubble() {
    const chatPanel = document.querySelector('.right-column');
    if (chatBubbleOpen && document.getElementById('lyric-area-container').classList.contains('hidden')) {
        // Chat is open, but looking at chat -> switch to lyric
        switchRightTab('lyric');
    } else if (chatBubbleOpen) {
        // Lyric is open -> close entirely
        toggleChatBubble();
    } else {
        // Closed -> open and switch to lyric
        toggleChatBubble();
        switchRightTab('lyric');
    }
}


let fabExpanded = false;

function toggleFabMenu() {
    if (chatBubbleOpen) {
        toggleChatBubble();
        return;
    }

    fabExpanded = !fabExpanded;
    const container = document.getElementById('mobile-fab-menu');
    const toggleIcon = document.getElementById('fab-toggle-icon');
    const toggleBtn = document.getElementById('main-fab-toggle');

    if (fabExpanded) {
        container.classList.add('expanded');
        toggleIcon.style.transform = 'rotate(90deg)';
        toggleBtn.style.background = 'rgba(255, 255, 255, 0.2)';
    } else {
        container.classList.remove('expanded');
        toggleIcon.style.transform = 'rotate(0deg)';
        toggleBtn.style.background = 'var(--accent)';
    }
}

function toggleChatBubble() {
    chatBubbleOpen = !chatBubbleOpen;
    const chatPanel = document.querySelector('.right-column');
    const bubbleBtn = document.getElementById('chat-bubble-btn');
    const lyricBtn = document.getElementById('lyric-bubble-btn');

    const fabContainer = document.getElementById('mobile-fab-menu');
    const toggleBtn = document.getElementById('main-fab-toggle');
    const toggleIcon = document.getElementById('fab-toggle-icon');

    if (chatBubbleOpen) {
        chatPanel.classList.add('chat-open');
        if (bubbleBtn) bubbleBtn.classList.add('chat-is-open');

        // Collapse menu if open
        fabExpanded = false;
        if (fabContainer) fabContainer.classList.remove('expanded');
        // Change main FAB to Close icon
        if (toggleIcon) {
            toggleIcon.textContent = 'close';
            toggleIcon.style.transform = 'rotate(90deg)';
        }
        if (toggleBtn) toggleBtn.style.background = 'rgba(255, 255, 255, 0.2)';

        unreadCount = 0;
        updateChatBadge();
        const chatBox = document.getElementById('chat-box-ui');
        setTimeout(() => { chatBox.scrollTop = chatBox.scrollHeight; }, 100);
        setTimeout(() => { document.getElementById('chat-input').focus(); }, 200);

        // Add mobile-mini to trigger mini player on mobile
        document.getElementById('left-column').classList.add('mobile-mini');
    } else {
        chatPanel.classList.remove('chat-open');
        if (bubbleBtn) bubbleBtn.classList.remove('chat-is-open');
        if (bubbleBtn) bubbleBtn.classList.remove('active-tab');
        if (lyricBtn) lyricBtn.classList.remove('active-tab');

        // Revert main FAB to Menu icon
        if (toggleIcon) {
            toggleIcon.textContent = 'menu';
            toggleIcon.style.transform = 'rotate(0deg)';
        }
        if (toggleBtn) toggleBtn.style.background = 'var(--accent)';

        // Remove mobile-mini
        document.getElementById('left-column').classList.remove('mobile-mini');
    }
}

function updateChatBadge() {
    const badge = document.getElementById('chat-badge');
    if (unreadCount > 0) {
        badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
        badge.classList.remove('hidden-badge');
    } else {
        badge.classList.add('hidden-badge');
    }
}

const DRAW_COLORS = [
    '#000000', '#495057', '#ced4da', '#ffffff',
    '#ff4757', '#ff7f50', '#ffa502', '#2ed573',
    '#1e90ff', '#3742fa', '#70a1ff', '#ffb8b8',
    '#ffdd59', '#7d5fff', '#18dcff', '#8b4513'
];
let drawColor = '#000000', drawSize = 7, isEraser = false, isDrawing = false;
let drawLastX = 0, drawLastY = 0;
let amIDrawer = false;
let drawGameActive = false;
let drawGuessedCorrectly = false;
let canvasGridEnabled = true;


(function initDrawColors() {
    const container = document.getElementById('draw-colors');
    if (!container) return;
    container.innerHTML = DRAW_COLORS.map((c, i) =>
        `<button class="draw-color-btn${i === 0 ? ' active' : ''}" style="background:${c}${c.toLowerCase() === '#ffffff' ? ';border:1px solid #ddd' : ''}" onclick="setDrawColor('${c}',this)" title="Màu ${c}"></button>`
    ).join('');
})();

function setDrawColor(c, btn) {
    drawColor = c; isEraser = false;
    const eraserBtn = document.getElementById('eraser-btn');
    if (eraserBtn) eraserBtn.classList.remove('active');
    document.querySelectorAll('.draw-color-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
}

function setCustomDrawColor(val) {
    if (!val) return;
    drawColor = val; isEraser = false;
    const eraserBtn = document.getElementById('eraser-btn');
    if (eraserBtn) eraserBtn.classList.remove('active');
    document.querySelectorAll('.draw-color-btn').forEach(b => b.classList.remove('active'));
}

function setDrawSize(s, btn) {
    drawSize = Number(s);
    document.querySelectorAll('#draw-sizes-bar .draw-size-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
}

function toggleEraser() {
    isEraser = !isEraser;
    const eraserBtn = document.getElementById('eraser-btn');
    if (eraserBtn) eraserBtn.classList.toggle('active', isEraser);
}

function toggleCanvasGrid() {
    canvasGridEnabled = !canvasGridEnabled;
    const wrap = document.getElementById('draw-canvas-wrap');
    const gridBtn = document.getElementById('grid-toggle-btn');
    if (wrap) wrap.classList.toggle('grid-bg', canvasGridEnabled);
    if (gridBtn) gridBtn.classList.toggle('active', canvasGridEnabled);
}

function getDrawCanvas() { return document.getElementById('draw-canvas'); }

function getDrawCtx() {
    const c = getDrawCanvas();
    if (!c) return null;
    const ctx = c.getContext('2d');
    if (c.width !== c.offsetWidth || c.height !== c.offsetHeight) {
        const imgData = ctx.getImageData(0, 0, c.width, c.height);
        c.width = c.offsetWidth; c.height = c.offsetHeight;
        ctx.putImageData(imgData, 0, 0);
    }
    return ctx;
}

function resizeDrawCanvas() {
    const c = getDrawCanvas();
    if (!c) return;
    c.width = c.offsetWidth; c.height = c.offsetHeight;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, c.width, c.height);
}

function drawLine(x0, y0, x1, y1, color, size) {
    const ctx = getDrawCtx();
    if (!ctx) return;
    const c = getDrawCanvas();
    ctx.beginPath();
    ctx.moveTo(x0 * c.width, y0 * c.height);
    ctx.lineTo(x1 * c.width, y1 * c.height);

    if (color === 'eraser' || color === '#ffffff' || color === '#fff') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = 'rgba(0,0,0,1)';
    } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = color;
    }

    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';
}

function getCanvasPos(e) {
    const c = getDrawCanvas(); const r = c.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: (clientX - r.left) / r.width, y: (clientY - r.top) / r.height };
}

function onDrawStart(e) {
    if (!amIDrawer) return;
    e.preventDefault(); isDrawing = true;
    const pos = getCanvasPos(e); drawLastX = pos.x; drawLastY = pos.y;
}

function onDrawMove(e) {
    if (!amIDrawer || !isDrawing) return;
    e.preventDefault();
    const pos = getCanvasPos(e);
    const c = isEraser ? '#ffffff' : drawColor;
    const s = isEraser ? drawSize * 3 : drawSize;
    drawLine(drawLastX, drawLastY, pos.x, pos.y, c, s);
    socket.emit('drawStroke', { x0: drawLastX, y0: drawLastY, x1: pos.x, y1: pos.y, color: c, size: s });
    drawLastX = pos.x; drawLastY = pos.y;
}

function onDrawEnd(e) { isDrawing = false; }

const dc = getDrawCanvas();
if (dc) {
    dc.addEventListener('mousedown', onDrawStart);
    dc.addEventListener('mousemove', onDrawMove);
    dc.addEventListener('mouseup', onDrawEnd);
    dc.addEventListener('mouseleave', onDrawEnd);
    dc.addEventListener('touchstart', onDrawStart, { passive: false });
    dc.addEventListener('touchmove', onDrawMove, { passive: false });
    dc.addEventListener('touchend', onDrawEnd);
}

function clearDrawCanvas() {
    resizeDrawCanvas();
    socket.emit('drawClear');
}

function startDrawGame() {
    document.getElementById('draw-game-overlay').classList.remove('hidden');
    if (myRole === 'admin') socket.emit('adminStartDrawGame');
}
function endDrawGame() { socket.emit('adminEndDrawGame'); }
function skipDrawWord() { socket.emit('skipWord'); }
function pickDrawer(id) { socket.emit('adminPickDrawer', id); }
function randomPickDrawer() { socket.emit('adminRandomPickDrawer'); }

function formatWordHintHtml(hint) {
    if (!hint) return '';
    const words = hint.split('   ');
    return '<div class="draw-word-display">' + words.map(w => {
        const letters = w.split(' ');
        return letters.map(l => {
            if (l === '_') return '<span class="draw-word-tile blank">_</span>';
            return `<span class="draw-word-tile revealed">${escapeHtml(l)}</span>`;
        }).join('');
    }).join('<span class="draw-word-space"></span>') + '</div>';
}

function renderDrawScores(scores) {
    const el = document.getElementById('draw-scores');
    if (!el) return;
    const arr = Object.values(scores).sort((a, b) => b.score - a.score);
    if (arr.length === 0) {
        el.innerHTML = '<span style="color:var(--text-muted);font-size:12px;">Chưa có lượt tính điểm nào</span>';
        return;
    }
    el.innerHTML = arr.map((s, idx) => {
        const medal = idx === 0 ? '🥇 ' : (idx === 1 ? '🥈 ' : (idx === 2 ? '🥉 ' : ''));
        const isTop1 = idx === 0 ? ' top-1' : '';
        return `<div class="draw-score-item${isTop1}">
            <span>${medal}</span>
            <span style="color:${escapeHtml(s.nameColor || '#fff')};font-weight:600;">${escapeHtml(s.name)}</span>
            <span class="draw-score-pts">${s.score}đ</span>
        </div>`;
    }).join('');
}

function renderDrawUserList(users) {
    const el = document.getElementById('draw-user-list');
    if (!el) return;
    if (myRole !== 'admin') {
        el.innerHTML = '<div style="color:var(--text-muted);font-size:14px;padding:12px;text-align:center;">Vui lòng chờ Admin chọn artist tiếp theo...</div>';
        return;
    }
    el.innerHTML = users.map(u => `
        <button class="draw-user-btn" style="color:${escapeHtml(u.nameColor || '#ffffff')}" onclick="pickDrawer('${u.id}')">
            <span class="material-symbols-outlined" style="font-size:16px;">brush</span>
            <span>${escapeHtml(u.name)}</span>
        </button>
    `).join('');
}

function showDrawPanel(panel) {
    document.getElementById('draw-waiting-panel').classList.toggle('hidden', panel !== 'waiting');
    document.getElementById('draw-canvas-panel').classList.toggle('hidden', panel !== 'canvas');
    document.getElementById('draw-round-result').classList.toggle('hidden', panel !== 'result');
    document.getElementById('draw-random-panel').classList.toggle('hidden', panel !== 'random');

    if (panel === 'waiting') {
        document.getElementById('draw-random-btn-container').classList.toggle('hidden', myRole !== 'admin');
    }
}

socket.on('drawGameStarted', (data) => {
    drawGameActive = true; amIDrawer = false; drawGuessedCorrectly = false;
    document.getElementById('draw-game-overlay').classList.remove('hidden');
    if (myRole === 'admin') document.getElementById('draw-admin-tools-header').classList.remove('hidden');
    document.getElementById('draw-drawer-tools').classList.add('hidden');
    document.getElementById('draw-guess-area').classList.add('hidden');
    showDrawPanel('waiting');
    renderDrawUserList(data.users);
    renderDrawScores(data.scores || {});
    document.getElementById('draw-info').innerHTML = '<div style="color:var(--text-muted);">👆 Chọn artist để bắt đầu lượt mới</div>';
    document.getElementById('draw-timer').textContent = '--';
    const timerBadge = document.querySelector('.draw-timer-badge');
    if (timerBadge) timerBadge.classList.remove('urgent');
});

socket.on('drawRoundStart', (data) => {
    amIDrawer = (data.drawerId === socket.id);
    drawGuessedCorrectly = false;
    showDrawPanel('canvas');
    resizeDrawCanvas();
    const wrap = document.getElementById('draw-canvas-wrap');
    if (wrap && canvasGridEnabled) wrap.classList.add('grid-bg');

    document.getElementById('draw-tools-bar').classList.toggle('hidden', !amIDrawer);
    document.getElementById('draw-timer').textContent = data.timeLeft + 's';
    const timerBadge = document.querySelector('.draw-timer-badge');
    if (timerBadge) timerBadge.classList.remove('urgent');

    document.getElementById('draw-drawer-tools').classList.toggle('hidden', !amIDrawer);

    const guessArea = document.getElementById('draw-guess-area');
    guessArea.classList.toggle('hidden', amIDrawer);
    document.getElementById('draw-guess-input').value = '';
    document.getElementById('draw-guess-input').disabled = false;
    document.getElementById('draw-guess-input').placeholder = 'Gõ câu trả lời của bạn ở đây...';
    document.getElementById('draw-guess-feedback').textContent = '';
    document.getElementById('draw-guess-feedback').className = 'draw-guess-feedback';

    if (amIDrawer) {
        document.getElementById('draw-info').innerHTML = `
            <div style="font-weight:600;">Bạn đang vẽ! 
                <span class="draw-word-secret">
                    <span class="material-symbols-outlined" style="font-size:16px;">lock</span> 
                    Đang chờ nhận từ khóa...
                </span>
            </div>`;
    } else {
        document.getElementById('draw-info').innerHTML = `
            <div style="font-size:14px;">
                <span style="color:var(--text-muted);">Artist </span>
                <strong style="color:${escapeHtml(data.drawerNameColor || '#3ea6ff')};">${escapeHtml(data.drawerName)}</strong> 
                <span style="color:var(--text-muted);">đang vẽ</span>
            </div>
            ${formatWordHintHtml(data.hint)}`;
        setTimeout(() => document.getElementById('draw-guess-input').focus(), 300);
    }
});

socket.on('drawYourWord', (word) => {
    document.getElementById('draw-info').innerHTML = `
        <div style="font-weight:600;">Từ khóa của bạn: 
            <span class="draw-word-secret">
                <span class="material-symbols-outlined" style="font-size:18px;">palette</span> 
                ${escapeHtml(word).toUpperCase()}
            </span>
        </div>`;
});

socket.on('drawTimerUpdate', (t) => {
    const el = document.getElementById('draw-timer');
    if (el) el.textContent = t + 's';
    const badge = document.querySelector('.draw-timer-badge');
    if (badge) badge.classList.toggle('urgent', t <= 15);
});

socket.on('drawStroke', (data) => { drawLine(data.x0, data.y0, data.x1, data.y1, data.color, data.size); });
socket.on('drawClear', () => { resizeDrawCanvas(); });

socket.on('drawNewWord', (data) => {
    resizeDrawCanvas();
    if (!amIDrawer) {
        const info = document.getElementById('draw-info');
        info.innerHTML = `
            <div style="font-size:14px;">
                <span style="color:var(--text-muted);">Artist đang vẽ</span>
            </div>
            ${formatWordHintHtml(data.hint)}`;
    }
    document.getElementById('draw-timer').textContent = data.timeLeft + 's';
    const badge = document.querySelector('.draw-timer-badge');
    if (badge) badge.classList.remove('urgent');
});

socket.on('drawScoreUpdate', (scores) => { renderDrawScores(scores); });

socket.on('drawRoundEnd', (data) => {
    amIDrawer = false;
    showDrawPanel('result');
    document.getElementById('draw-drawer-tools').classList.add('hidden');
    document.getElementById('draw-tools-bar').classList.add('hidden');
    document.getElementById('draw-guess-area').classList.add('hidden');
    document.getElementById('draw-round-result').innerHTML = `
        <h3><span class="material-symbols-outlined" style="font-size:24px;color:#ffd43b;vertical-align:text-bottom;">timer</span> Hết giờ lượt vẽ!</h3>
        <div class="reveal-word">Từ khóa: ${escapeHtml(data.word).toUpperCase()}</div>
    `;
    document.getElementById('draw-info').innerHTML = '<div style="color:var(--text-muted);">Đang chuẩn bị lượt tiếp theo...</div>';
    renderDrawScores(data.scores);
});

socket.on('drawWaitingForDrawer', (data) => {
    showDrawPanel('waiting');
    document.getElementById('draw-guess-area').classList.add('hidden');
    renderDrawUserList(data.users);
    renderDrawScores(data.scores);
    document.getElementById('draw-info').innerHTML = '<div style="color:var(--text-muted);">👆 Chọn artist cho lượt tiếp theo!</div>';
    document.getElementById('draw-timer').textContent = '--';
    const badge = document.querySelector('.draw-timer-badge');
    if (badge) badge.classList.remove('urgent');
});


socket.on('drawRandomPickAnimation', (data) => {
    showDrawPanel('random');
    document.getElementById('draw-info').innerHTML = '<div>Đang tìm kiếm người may mắn...</div>';
    const nameEl = document.getElementById('draw-random-name');
    const users = data.users;
    const winner = users.find(u => u.id === data.winnerId);

    let i = 0;
    const interval = setInterval(() => {
        const u = users[i % users.length];
        nameEl.textContent = u.name;
        nameEl.style.color = u.nameColor || 'var(--text-main)';

        nameEl.classList.remove('draw-random-name');
        void nameEl.offsetWidth;
        nameEl.classList.add('draw-random-name');
        i++;
    }, 100);

    setTimeout(() => {
        clearInterval(interval);
        if (winner) {
            nameEl.textContent = winner.name;
            nameEl.style.color = winner.nameColor || 'var(--accent)';
        }
    }, 2500);
});


socket.on('drawUsersUpdate', (users) => {
    if (drawGameActive && document.getElementById('draw-waiting-panel') && !document.getElementById('draw-waiting-panel').classList.contains('hidden')) {
        renderDrawUserList(users);
    }
});


socket.on('drawGameEnded', () => {
    drawGameActive = false; amIDrawer = false;
    document.getElementById('draw-game-overlay').classList.add('hidden');
    document.getElementById('draw-admin-tools-header').classList.add('hidden');
    document.getElementById('draw-drawer-tools').classList.add('hidden');
});


socket.on('drawCanvasHistory', (history) => {
    resizeDrawCanvas();
    history.forEach(s => drawLine(s.x0, s.y0, s.x1, s.y1, s.color, s.size));
});


function sendDrawGuess() {
    if (drawGuessedCorrectly) return;
    const input = document.getElementById('draw-guess-input');
    const guess = input.value.trim();
    if (!guess) return;
    socket.emit('sendMessage', guess);
    input.value = '';
    input.focus();
}


(function () {
    const origHandler = socket.listeners('newMessage').find(f => true);
    socket.on('newMessage', (data) => {
        if (drawGameActive && data.role === 'system' && data.name === 'Trò chơi 🎨' && data.text.includes(myUsername) && data.text.includes('đoán đúng')) {
            drawGuessedCorrectly = true;
            const fb = document.getElementById('draw-guess-feedback');
            fb.textContent = '✅ Bạn đã đoán đúng!';
            fb.className = 'draw-guess-feedback correct';
            document.getElementById('draw-guess-input').disabled = true;
            document.getElementById('draw-guess-input').placeholder = 'Đã đoán đúng! 🎉';
        }
    });
})();

let myChessSide = null;
let currentChessGame = null;
let localChess = new Chess();
let chessSelectedSquare = null;

const pieceUnicode = {
    'p': '♟', 'n': '♞', 'b': '♝', 'r': '♜', 'q': '♛', 'k': '♚'
};

function openChessGame() { document.getElementById('chess-game-overlay').classList.remove('hidden'); }
function closeChessGame() { document.getElementById('chess-game-overlay').classList.add('hidden'); }

function sendChessChallenge() {
    const targetId = document.getElementById('chess-challenge-target').value;
    if (!targetId) { alert('Vui lòng chọn một đối thủ để thách đấu!'); return; }
    socket.emit('chessChallenge', targetId);
}
function leaveChess() { socket.emit('chessLeave'); }

let currentChallengerId = null;
socket.on('chessChallengeReceived', ({ challengerId, challengerName }) => {
    currentChallengerId = challengerId;
    document.getElementById('chess-challenger-name').innerText = challengerName;
    document.getElementById('chess-challenge-modal').classList.remove('hidden');
});

function respondChessChallenge(accept) {
    document.getElementById('chess-challenge-modal').classList.add('hidden');
    if (currentChallengerId) {
        socket.emit('chessChallengeRespond', { challengerId: currentChallengerId, accept });
        if (accept) openChessGame();
        currentChallengerId = null;
    }
}

socket.on('activeUsersList', (users) => {
    ['chess-challenge-target', 'caro-challenge-target', 'xiangqi-challenge-target'].forEach(id => {
        const select = document.getElementById(id);
        if (select) {
            const prevVal = select.value;
            select.innerHTML = '<option value="">-- Chọn đối thủ --</option>';
            users.forEach(u => {
                if (u.id !== socket.id) {
                    const opt = document.createElement('option');
                    opt.value = u.id;
                    opt.innerText = u.name;
                    select.appendChild(opt);
                }
            });
            if (Array.from(select.options).some(o => o.value === prevVal)) {
                select.value = prevVal;
            }
        }
    });
});

function onChessSquareClick(square) {
    if (!currentChessGame || currentChessGame.winner) return;
    if (myChessSide !== (localChess.turn() === 'w' ? 'W' : 'B')) return;

    const piece = localChess.get(square);

    if (chessSelectedSquare) {

        const move = localChess.move({
            from: chessSelectedSquare,
            to: square,
            promotion: 'q'
        });

        if (move) {

            chessSelectedSquare = null;
            let winner = null;
            if (localChess.in_checkmate()) winner = localChess.turn() === 'w' ? 'b' : 'w';
            else if (localChess.in_draw() || localChess.in_stalemate()) winner = 'd';

            socket.emit('chessMove', { fen: localChess.fen(), winner });
            renderChessBoard();
        } else {

            if (piece && piece.color === localChess.turn()) {
                chessSelectedSquare = square;
                renderChessBoard();
            } else {
                chessSelectedSquare = null;
                renderChessBoard();
            }
        }
    } else {
        if (piece && piece.color === localChess.turn()) {
            chessSelectedSquare = square;
            renderChessBoard();
        }
    }
}

function renderChessBoard() {
    const boardEl = document.getElementById('chess-board');
    boardEl.innerHTML = '';


    const ranks = myChessSide === 'B' ? ['1', '2', '3', '4', '5', '6', '7', '8'] : ['8', '7', '6', '5', '4', '3', '2', '1'];
    const files = myChessSide === 'B' ? ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'] : ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];


    let validMoves = [];
    if (chessSelectedSquare) {
        validMoves = localChess.moves({ square: chessSelectedSquare, verbose: true }).map(m => m.to);
    }

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const square = files[c] + ranks[r];
            const cell = document.createElement('div');
            cell.className = 'chess-square ' + ((r + c) % 2 === 0 ? 'light' : 'dark');
            if (square === chessSelectedSquare) cell.classList.add('selected');
            if (validMoves.includes(square)) cell.classList.add('highlight');

            const piece = localChess.get(square);
            if (piece) {
                cell.innerText = pieceUnicode[piece.type];
                if (piece.color === 'w') {
                    cell.style.color = '#ffffff';
                    cell.style.textShadow = '0 1px 4px rgba(0,0,0,0.8), 0 0 2px rgba(0,0,0,0.8)';
                } else {
                    cell.style.color = '#000000';
                    cell.style.textShadow = '0 1px 2px rgba(255,255,255,0.4)';
                }
            }

            cell.onclick = () => onChessSquareClick(square);
            boardEl.appendChild(cell);
        }
    }
}

socket.on('chessUpdate', (game) => {
    currentChessGame = game;
    myChessSide = (game.playerW === socket.id) ? 'W' : (game.playerB === socket.id ? 'B' : null);
    localChess.load(game.fen);
    chessSelectedSquare = null;

    const isPlaying = game.playerW || game.playerB;

    document.getElementById('chess-challenge-target').classList.toggle('hidden', isPlaying || myChessSide !== null);
    document.getElementById('btn-send-challenge').classList.toggle('hidden', isPlaying || myChessSide !== null);
    document.getElementById('btn-leave-chess').classList.toggle('hidden', myChessSide === null && myRole !== 'admin');

    document.getElementById('chess-board-wrapper').classList.toggle('hidden', !isPlaying);

    let status = '';
    if (game.winner) {
        if (game.winner === 'd') status = `🤝 TRẬN HÒA!`;
        else status = `🎉 <span style="color: ${game.winner === 'w' ? '#fff' : '#aaa'};">${game.winner === 'w' ? game.playerWName : game.playerBName} (${game.winner === 'w' ? 'Trắng' : 'Đen'})</span> ĐÃ CHIẾN THẮNG!`;
    } else if (!game.playerW || !game.playerB) {
        status = `Chọn một đối thủ trong phòng để Thách đấu Cờ Vua<br><span style="font-size: 13px; color: var(--text-muted); font-weight: 400; display: inline-block; margin-top: 8px;">Khán giả có thể theo dõi trực tiếp trận đấu</span>`;
    } else {
        const turnStr = localChess.turn() === 'w' ? 'W' : 'B';
        const isMyTurn = myChessSide === turnStr;
        status = `Lượt của: <span style="color: ${turnStr === 'W' ? '#fff' : '#aaa'};">${turnStr === 'W' ? game.playerWName : game.playerBName} (${turnStr === 'W' ? 'Trắng' : 'Đen'})</span> ${isMyTurn ? '(Đến lượt bạn!)' : ''}`;
    }
    document.getElementById('chess-status').innerHTML = status;

    renderChessBoard();
});


let currentLyricData = null;
let lyricInterval = null;
let parsedLyrics = [];
let lrcSearchResults = [];
let currentLrcIndex = 0;

async function fetchLyrics(title) {
    document.getElementById('lyric-box').classList.remove('hidden');
    document.getElementById('lyric-content').innerHTML = '<div class="lyric-loading">Đang tìm lời bài hát...</div>';
    const reportBtn = document.getElementById('lyric-report-btn');
    if (reportBtn) reportBtn.classList.add('hidden');

    try {
        let cleanTitle = title.replace(/\(.*?\)|\[.*?\]|\{.*?\}/g, ' ')
            .replace(/\b(official|music video|lyric|lyrics|audio|mv|vietsub|4k|hd|studio version)\b/gi, ' ')
            .replace(/[-|~"']/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        if (cleanTitle.length < 2) cleanTitle = title.split('-')[0].trim();

        console.log("--- LYRIC SEARCH DEBUG ---");
        console.log("Original Title:", title);
        console.log("Clean Title for Search:", cleanTitle);
        const searchUrl = `https://lrclib.net/api/search?q=${encodeURIComponent(cleanTitle)}`;
        console.log("API URL:", searchUrl);

        let res = await fetch(searchUrl);
        let data = await res.json();

        console.log("Results found:", data ? data.length : 0);

        if ((!data || data.length === 0) && cleanTitle.match(/\b(ft|feat)\b/i)) {
            let noFeatTitle = cleanTitle.replace(/\b(ft\.?|feat\.?)\b.*/gi, '').trim();
            console.log("Retry without 'feat':", noFeatTitle);
            res = await fetch(`https://lrclib.net/api/search?q=${encodeURIComponent(noFeatTitle)}`);
            data = await res.json();
            console.log("Retry Results found:", data ? data.length : 0);
        }

        if (data && data.length > 0) {
            lrcSearchResults = data.filter(item => item.syncedLyrics || item.plainLyrics);

            let videoDuration = 0;
            for (let i = 0; i < 10; i++) {
                if (player && typeof player.getDuration === 'function') {
                    videoDuration = player.getDuration();
                    if (videoDuration > 0) break;
                }
                await new Promise(r => setTimeout(r, 150));
            }

            console.log("YouTube Video Duration:", videoDuration, "seconds");

            let found = null;
            if (videoDuration > 0) {
                let minDiff = Infinity;
                for (let item of lrcSearchResults) {
                    if (item.syncedLyrics && item.duration) {
                        let diff = Math.abs(item.duration - videoDuration);
                        if (diff < minDiff) {
                            minDiff = diff;
                            found = item;
                        }
                    }
                }
            }

            if (!found) found = lrcSearchResults.find(item => item.syncedLyrics);
            if (!found && lrcSearchResults.length > 0) found = lrcSearchResults[0];

            if (found) {
                currentLrcIndex = lrcSearchResults.indexOf(found);
                if (currentLrcIndex === -1) currentLrcIndex = 0;
                applyLyricItem(found);
            } else {
                document.getElementById('lyric-content').innerHTML = '<div class="lyric-loading">Không tìm thấy lời bài hát</div>';
                stopLyricSync();
            }
        } else {
            lrcSearchResults = [];
            document.getElementById('lyric-content').innerHTML = '<div class="lyric-loading">Không tìm thấy lời bài hát</div>';
            stopLyricSync();
        }
    } catch (e) {
        console.error("Lỗi khi tải lyric", e);
        lrcSearchResults = [];
        document.getElementById('lyric-content').innerHTML = '<div class="lyric-loading">Lỗi khi tải lời bài hát</div>';
        stopLyricSync();
    }
}

function applyLyricItem(item) {
    const reportBtn = document.getElementById('lyric-report-btn');
    if (reportBtn) {
        reportBtn.classList.remove('hidden');
    }

    if (item.syncedLyrics) {
        parseLyrics(item.syncedLyrics);
        startLyricSync();
    } else if (item.plainLyrics) {
        document.getElementById('lyric-content').innerHTML = `<div style="white-space: pre-line; color: rgba(255,255,255,0.7); font-size: 16px; padding: 20px 0; line-height: 1.6;">${item.plainLyrics}</div>`;
        stopLyricSync();
    } else {
        document.getElementById('lyric-content').innerHTML = '<div class="lyric-loading">Không có dữ liệu lời bài hát</div>';
        stopLyricSync();
    }
}

async function switchToNextLyric() {
    const currentTitle = document.getElementById('music-title')?.textContent || 'Bài hát';

    if (lrcSearchResults && lrcSearchResults.length > 1) {
        currentLrcIndex = (currentLrcIndex + 1) % lrcSearchResults.length;
        const item = lrcSearchResults[currentLrcIndex];
        applyLyricItem(item);

        const trackInfo = (item.trackName || '') + (item.artistName ? ' - ' + item.artistName : '');
        const syncStatus = item.syncedLyrics ? 'Có đồng bộ' : 'Lời chay';
        showToastNotification(`🔄 Đã đổi bản lyric (${currentLrcIndex + 1}/${lrcSearchResults.length}): ${trackInfo} [${syncStatus}]`);
    } else {
        showToastNotification(`⚠️ Đã gửi báo cáo lệch lyric bài "${currentTitle}"! Cảm ơn bạn.`);
        try {
            const supabaseClient = supabase.createClient(SUPABASE_FEEDBACK_URL, SUPABASE_FEEDBACK_KEY);
            await supabaseClient.from('web_feedback').insert([{
                username: myUsername || 'Ẩn danh',
                type: 'bao_loi',
                content: `[TỰ ĐỘNG BÁO LỆCH LYRIC] Bài hát: "${currentTitle}" bị lệch hoặc thiếu lời.`,
                created_at: new Date().toISOString()
            }]);
            setTimeout(() => loadFeedbackHistory(), 500);
        } catch (e) {
            console.error('Auto report lyric error:', e);
        }
    }
}

function parseLyrics(lrc) {
    const lines = lrc.split('\n');
    parsedLyrics = [];
    let html = '';

    lines.forEach((line, index) => {
        const match = line.match(/\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/);
        if (match) {
            const min = parseInt(match[1]);
            const sec = parseInt(match[2]);
            const ms = parseInt(match[3].padEnd(3, '0'));
            const time = min * 60 + sec + ms / 1000;
            const text = match[4].trim();
            if (text) {
                parsedLyrics.push({ time, text, index: parsedLyrics.length });
                html += `<div class="lyric-line" id="lyric-line-${parsedLyrics.length - 1}" onclick="seekLyric(${time})">${text}</div>`;
            }
        }
    });

    if (parsedLyrics.length === 0) {
        document.getElementById('lyric-content').innerHTML = '<div class="lyric-loading">Không thể đồng bộ lời bài hát</div>';
    } else {
        document.getElementById('lyric-content').innerHTML = html;
    }
}

function seekLyric(time) {
    if (myRole === 'admin' && player && typeof player.seekTo === 'function') {
        player.seekTo(time, true);
        socket.emit('adminPlay', time);
    }
}

function startLyricSync() {
    stopLyricSync();
    let lastScrolledIndex = -1;
    lyricInterval = setInterval(() => {
        if (!player || typeof player.getCurrentTime !== 'function') return;
        const currentTime = player.getCurrentTime();

        let activeIndex = -1;
        for (let i = 0; i < parsedLyrics.length; i++) {
            if (currentTime >= parsedLyrics[i].time) {
                activeIndex = i;
            } else {
                break;
            }
        }

        if (activeIndex !== -1 && activeIndex !== lastScrolledIndex) {
            lastScrolledIndex = activeIndex;

            const allLines = document.querySelectorAll('.lyric-line');
            allLines.forEach((el, idx) => {
                el.classList.remove('active');
                if (idx < activeIndex) {
                    el.classList.add('passed');
                } else {
                    el.classList.remove('passed');
                }
            });

            const target = document.getElementById(`lyric-line-${activeIndex}`);

            if (target) {
                target.classList.add('active');
                target.classList.remove('passed');
                const box = document.getElementById('lyric-box');
                if (box) {
                    const boxHeight = box.clientHeight;
                    const targetTop = target.offsetTop;
                    const targetHeight = target.offsetHeight;
                    const scrollTo = targetTop - (boxHeight / 2) + (targetHeight / 2);
                    box.scrollTo({
                        top: Math.max(0, scrollTo),
                        behavior: 'smooth'
                    });
                }
            }
        }
    }, 150);
}

function stopLyricSync() {
    if (lyricInterval) {
        clearInterval(lyricInterval);
        lyricInterval = null;
    }
}

let myCaroSide = null;
let currentCaroGame = null;

function initCaroBoard() {
    const boardEl = document.getElementById('caro-board');
    boardEl.innerHTML = '';
    for (let r = 0; r < 15; r++) {
        for (let c = 0; c < 15; c++) {
            const cell = document.createElement('div');
            cell.className = 'caro-cell';
            cell.style.display = 'flex';
            cell.style.alignItems = 'center';
            cell.style.justifyContent = 'center';
            cell.style.fontSize = '22px';
            cell.style.cursor = 'pointer';
            cell.style.userSelect = 'none';
            cell.id = `caro-cell-${r}-${c}`;
            cell.onclick = () => caroMove(r, c);
            boardEl.appendChild(cell);
        }
    }
}

function openCaroGame() { document.getElementById('caro-game-overlay').classList.remove('hidden'); }
function closeCaroGame() { document.getElementById('caro-game-overlay').classList.add('hidden'); }

function sendCaroChallenge() {
    const targetId = document.getElementById('caro-challenge-target').value;
    if (!targetId) { alert('Vui lòng chọn một đối thủ để thách đấu!'); return; }
    socket.emit('caroChallenge', targetId);
}
function leaveCaro() { socket.emit('caroLeave'); }

let currentCaroChallengerId = null;
socket.on('caroChallengeReceived', ({ challengerId, challengerName }) => {
    currentCaroChallengerId = challengerId;
    document.getElementById('caro-challenger-name').innerText = challengerName;
    document.getElementById('caro-challenge-modal').classList.remove('hidden');
});

function respondCaroChallenge(accept) {
    document.getElementById('caro-challenge-modal').classList.add('hidden');
    if (currentCaroChallengerId) {
        socket.emit('caroChallengeRespond', { challengerId: currentCaroChallengerId, accept });
        if (accept) openCaroGame();
        currentCaroChallengerId = null;
    }
}

function caroMove(r, c) {
    if (!currentCaroGame || currentCaroGame.winner) return;
    if (myCaroSide !== currentCaroGame.turn) return;
    if (currentCaroGame.board[r][c] !== null) return;
    socket.emit('caroMove', { row: r, col: c });
}

function updateCaroUI(game) {
    currentCaroGame = game;
    myCaroSide = (game.playerX === socket.id) ? 'X' : (game.playerO === socket.id ? 'O' : null);

    const isPlaying = game.playerX || game.playerO;

    document.getElementById('caro-challenge-target').classList.toggle('hidden', isPlaying || myCaroSide !== null);
    document.getElementById('btn-send-caro-challenge').classList.toggle('hidden', isPlaying || myCaroSide !== null);
    document.getElementById('btn-leave-caro').classList.toggle('hidden', myCaroSide === null && myRole !== 'admin');

    document.getElementById('caro-board-wrapper').classList.toggle('hidden', !isPlaying);

    let status = '';
    if (game.winner) {
        status = `🎉 <span style="color: ${game.winner === 'X' ? '#ff4757' : '#1e90ff'};">${game.winner === 'X' ? game.playerXName : game.playerOName} (${game.winner})</span> ĐÃ CHIẾN THẮNG!`;
    } else if (!game.playerX || !game.playerO) {
        status = `Chọn một đối thủ trong phòng để Thách đấu Cờ Caro<br><span style="font-size: 13px; color: var(--text-muted); font-weight: 400; display: inline-block; margin-top: 8px;">Khán giả có thể theo dõi trực tiếp trận đấu</span>`;
    } else {
        const isMyTurn = myCaroSide === game.turn;
        status = `Lượt của: <span style="color: ${game.turn === 'X' ? '#ff4757' : '#1e90ff'};">${game.turn === 'X' ? game.playerXName : game.playerOName} (${game.turn})</span> ${isMyTurn ? '(Đến lượt bạn!)' : ''}`;
    }
    document.getElementById('caro-status').innerHTML = status;

    for (let r = 0; r < 15; r++) {
        for (let c = 0; c < 15; c++) {
            const cell = document.getElementById(`caro-cell-${r}-${c}`);
            if (cell) {
                const val = game.board[r][c];
                cell.innerText = val === 'X' ? '✕' : (val === 'O' ? '〇' : '');
                cell.className = 'caro-cell' + (val === 'X' ? ' x-cell' : (val === 'O' ? ' o-cell' : ''));
            }
        }
    }
}
socket.on('caroUpdate', updateCaroUI);

initCaroBoard();

// --- XIANGQI GAME (Cờ Tướng) ---
let myXiangqiSide = null;
let currentXiangqiGame = null;
let xiangqiSelected = null;

function renderXiangqiBoard(game) {
    const boardEl = document.getElementById('xiangqi-board');
    boardEl.innerHTML = '';

    for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 9; c++) {
            const cell = document.createElement('div');
            cell.style.width = '40px'; cell.style.height = '40px';
            cell.style.border = '1px solid #c9a67f';
            cell.style.position = 'relative'; cell.style.display = 'flex';
            cell.style.alignItems = 'center'; cell.style.justifyContent = 'center';
            cell.onclick = () => onXiangqiClick(r, c);

            const piece = game.board[r][c];
            if (piece) {
                const isRed = piece.startsWith('r_');
                const type = piece.split('_')[1];
                const pieceEl = document.createElement('div');
                pieceEl.style.width = '34px'; pieceEl.style.height = '34px';
                pieceEl.style.borderRadius = '50%'; pieceEl.style.background = '#e3c498';
                pieceEl.style.border = `2px solid ${isRed ? '#d32f2f' : '#333'}`;
                pieceEl.style.color = isRed ? '#d32f2f' : '#333';
                pieceEl.style.fontWeight = 'bold'; pieceEl.style.display = 'flex';
                pieceEl.style.alignItems = 'center'; pieceEl.style.justifyContent = 'center';
                pieceEl.style.fontSize = '18px'; pieceEl.style.boxShadow = '2px 2px 4px rgba(0,0,0,0.3)';
                pieceEl.style.cursor = 'pointer';

                const labels = { 'r': isRed ? '俥' : '車', 'h': isRed ? '傌' : '馬', 'e': isRed ? '相' : '象', 'a': isRed ? '仕' : '士', 'k': isRed ? '帥' : '將', 'c': isRed ? '炮' : '砲', 'p': isRed ? '兵' : '卒' };
                pieceEl.innerText = labels[type];

                if (xiangqiSelected && xiangqiSelected.r === r && xiangqiSelected.c === c) {
                    pieceEl.style.background = '#a67c52'; pieceEl.style.color = '#fff';
                }
                cell.appendChild(pieceEl);
            }
            if (xiangqiSelected && !piece && (myXiangqiSide === game.turn)) {
                // simple dot for possible move
                const dot = document.createElement('div');
                dot.style.width = '10px'; dot.style.height = '10px'; dot.style.borderRadius = '50%'; dot.style.background = 'rgba(0,0,0,0.2)';
                cell.appendChild(dot);
            }
            boardEl.appendChild(cell);
        }
    }
}
function onXiangqiClick(r, c) {
    if (!currentXiangqiGame || currentXiangqiGame.winner || myXiangqiSide !== currentXiangqiGame.turn) return;
    const piece = currentXiangqiGame.board[r][c];

    if (xiangqiSelected) {
        if (piece && piece.startsWith(myXiangqiSide.toLowerCase() + '_')) {
            xiangqiSelected = { r, c };
            renderXiangqiBoard(currentXiangqiGame);
        } else {
            socket.emit('xiangqiMove', { from: xiangqiSelected, to: { r, c } });
            xiangqiSelected = null;
        }
    } else {
        if (piece && piece.startsWith(myXiangqiSide.toLowerCase() + '_')) {
            xiangqiSelected = { r, c };
            renderXiangqiBoard(currentXiangqiGame);
        }
    }
}

socket.on('xiangqiUpdate', (game) => {
    currentXiangqiGame = game;
    myXiangqiSide = (game.playerR === socket.id) ? 'R' : (game.playerB === socket.id ? 'B' : null);
    const isPlaying = game.playerR || game.playerB;

    document.getElementById('xiangqi-challenge-target').classList.toggle('hidden', isPlaying || myXiangqiSide !== null);
    document.getElementById('btn-send-xiangqi-challenge').classList.toggle('hidden', isPlaying || myXiangqiSide !== null);
    document.getElementById('btn-leave-xiangqi').classList.toggle('hidden', myXiangqiSide === null && myRole !== 'admin');
    document.getElementById('xiangqi-board-wrapper').classList.toggle('hidden', !isPlaying);

    let status = '';
    if (game.winner) status = `🎉 <span style="color: ${game.winner === 'R' ? '#d32f2f' : '#333'};">${game.winner === 'R' ? game.playerRName : game.playerBName}</span> ĐÃ CHIẾN THẮNG!`;
    else if (!game.playerR || !game.playerB) status = 'Chọn người thách đấu Cờ Tướng';
    else status = `Lượt của: <span style="color: ${game.turn === 'R' ? '#d32f2f' : '#333'};">${game.turn === 'R' ? game.playerRName : game.playerBName}</span> ${myXiangqiSide === game.turn ? '(Tới bạn!)' : ''}`;

    document.getElementById('xiangqi-status').innerHTML = status;
    if (isPlaying) renderXiangqiBoard(game);
});

function openXiangqiGame() {
    document.getElementById('xiangqi-game-overlay').classList.remove('hidden');
}
function closeXiangqiGame() {
    document.getElementById('xiangqi-game-overlay').classList.add('hidden');
}
function sendXiangqiChallenge() {
    const target = document.getElementById('xiangqi-challenge-target').value;
    if (!target) return alert('Chọn một người để thách đấu!');
    socket.emit('xiangqiChallenge', target);
    document.getElementById('btn-send-xiangqi-challenge').classList.add('hidden');
    document.getElementById('btn-leave-xiangqi').classList.remove('hidden');
}
function respondXiangqiChallenge(accept) {
    document.getElementById('xiangqi-challenge-modal').classList.add('hidden');
    socket.emit('xiangqiChallengeRespond', { challengerId: window.currentXiangqiChallenger, accept });
    if (accept) openXiangqiGame();
}
function leaveXiangqi() {
    socket.emit('xiangqiLeave');
    document.getElementById('btn-leave-xiangqi').classList.add('hidden');
    document.getElementById('btn-send-xiangqi-challenge').classList.remove('hidden');
}

socket.on('xiangqiChallengeReceived', (data) => {
    window.currentXiangqiChallenger = data.challengerId;
    document.getElementById('xiangqi-challenger-name').innerText = data.challengerName;
    document.getElementById('xiangqi-challenge-modal').classList.remove('hidden');
});

// --- UNO GAME ---
let currentUnoState = null;
socket.on('unoUpdate', (state) => {
    currentUnoState = state;
    document.getElementById('uno-players-list').innerText = state.players.map(p => `${p.name} (${p.handCount} lá)`).join(' - ');
    if (state.active || state.winner) {
        document.getElementById('uno-lobby').classList.add('hidden');
        document.getElementById('uno-board').classList.remove('hidden');

        const topCard = state.topDiscard;
        const discardEl = document.getElementById('uno-discard');
        if (topCard) {
            discardEl.style.background = topCard.color === 'black' ? '#222' : topCard.color;
            discardEl.innerText = topCard.value === 'skip' ? '⊘' : (topCard.value === 'reverse' ? '⇄' : topCard.value);
            discardEl.style.border = `4px solid ${state.currentColor === 'black' ? 'white' : state.currentColor}`;
        }

        let status = '';
        if (state.winner) status = `🎉 ${state.winner} ĐÃ THẮNG UNO!`;
        else {
            const p = state.players[state.turnIndex];
            status = `Lượt của: ${p.name}`;
            if (p.id === socket.id) status += ' (Tới bạn!)';
        }
        document.getElementById('uno-status').innerText = status;
    } else {
        document.getElementById('uno-lobby').classList.remove('hidden');
        document.getElementById('uno-board').classList.add('hidden');
    }
});

socket.on('unoHand', (hand) => {
    const handEl = document.getElementById('uno-hand');
    handEl.innerHTML = '';
    hand.forEach((card, idx) => {
        const c = document.createElement('div');
        c.style.width = '60px'; c.style.height = '90px';
        c.style.background = card.color === 'black' ? '#222' : card.color;
        c.style.border = '2px solid white'; c.style.borderRadius = '6px';
        c.style.display = 'flex'; c.style.alignItems = 'center'; c.style.justifyContent = 'center';
        c.style.color = 'white'; c.style.fontWeight = 'bold'; c.style.fontSize = '20px';
        c.style.cursor = 'pointer';
        c.innerText = card.value === 'skip' ? '⊘' : (card.value === 'reverse' ? '⇄' : card.value);
        c.onclick = () => socket.emit('unoPlayCard', idx);
        handEl.appendChild(c);
    });
});

function openUnoGame() {
    document.getElementById('uno-game-overlay').classList.remove('hidden');
}
function closeUnoGame() {
    document.getElementById('uno-game-overlay').classList.add('hidden');
}
function joinUnoGame() {
    socket.emit('unoJoin');
    document.getElementById('uno-players-list').innerText = "Đang tham gia...";
}
function startUnoGame() {
    socket.emit('unoStart');
}
function drawUnoCard() {
    socket.emit('unoDraw');
}

function passUnoTurn() {
    socket.emit('unoPass');
}

// --- MINI PLAYER DRAG LOGIC ---
const miniPlayer = document.getElementById('player-container');
const dragHandle = document.createElement('div');
dragHandle.style.position = 'absolute';
dragHandle.style.top = '0';
dragHandle.style.left = '0';
dragHandle.style.width = '100%';
dragHandle.style.height = '32px';
dragHandle.style.cursor = 'move';
dragHandle.style.zIndex = '50';
dragHandle.style.background = 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)';
dragHandle.style.display = 'none';
dragHandle.style.userSelect = 'none';
dragHandle.style.webkitUserSelect = 'none';
dragHandle.innerHTML = '<div style="width: 40px; height: 4px; background: rgba(255,255,255,0.5); border-radius: 2px; margin: 6px auto; pointer-events: none;"></div>';
dragHandle.addEventListener('dragstart', (e) => e.preventDefault());
miniPlayer.appendChild(dragHandle);

let isDraggingMini = false;
let miniDragX = 0;
let miniDragY = 0;
let initialMiniX = 0;
let initialMiniY = 0;
let dragStartX = 0;
let dragStartY = 0;
let untranslatedLeft = 0;
let untranslatedTop = 0;
let playerWidth = 0;
let playerHeight = 0;

// Load saved position from localStorage
try {
    const savedPos = localStorage.getItem('mini_player_pos');
    if (savedPos) {
        const parsed = JSON.parse(savedPos);
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
            miniDragX = parsed.x;
            miniDragY = parsed.y;
        }
    }
} catch (err) { }

function applyMiniPlayerSavedPos() {
    if (document.getElementById('left-column').classList.contains('not-home') || document.getElementById('left-column').classList.contains('mobile-mini')) {
        if (miniDragX || miniDragY) {
            miniPlayer.style.transform = `translate(${miniDragX}px, ${miniDragY}px)`;
            clampMiniPlayerPosition();
        }
    }
}

// Show handle & restore position in mini mode
const observer = new MutationObserver((mutations) => {
    mutations.forEach((m) => {
        if (m.attributeName === 'class') {
            if (document.getElementById('left-column').classList.contains('not-home') || document.getElementById('left-column').classList.contains('mobile-mini')) {
                dragHandle.style.display = 'block';
                applyMiniPlayerSavedPos();
            } else {
                dragHandle.style.display = 'none';
                miniPlayer.style.transform = '';
            }
        }
    });
});
observer.observe(document.getElementById('left-column'), { attributes: true });

function resetMiniPlayerDrag() {
    miniDragX = 0;
    miniDragY = 0;
    miniPlayer.style.transform = '';
    try {
        localStorage.removeItem('mini_player_pos');
    } catch (e) { }
}

function clampMiniPlayerPosition() {
    if (!document.getElementById('left-column').classList.contains('not-home') && !document.getElementById('left-column').classList.contains('mobile-mini')) {
        return;
    }
    const rect = miniPlayer.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const currentUnX = rect.left - miniDragX;
    const currentUnY = rect.top - miniDragY;
    const margin = 4;

    const minX = -currentUnX + margin;
    const maxX = window.innerWidth - currentUnX - rect.width - margin;
    const minY = -currentUnY + margin;
    const maxY = window.innerHeight - currentUnY - rect.height - margin;

    miniDragX = Math.min(Math.max(miniDragX, minX), Math.max(minX, maxX));
    miniDragY = Math.min(Math.max(miniDragY, minY), Math.max(minY, maxY));

    miniPlayer.style.transform = `translate(${miniDragX}px, ${miniDragY}px)`;
}
window.addEventListener('resize', clampMiniPlayerPosition);

dragHandle.addEventListener('mousedown', startMiniDrag);
dragHandle.addEventListener('touchstart', startMiniDrag, { passive: false });

function startMiniDrag(e) {
    if (e.type === 'mousedown' && e.button !== 0) return;
    if (e.cancelable) e.preventDefault();
    isDraggingMini = true;
    dragHandle.style.height = '100%'; // cover full player to not lose mouse

    // Disable text selection globally while dragging
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    if (window.getSelection) {
        window.getSelection().removeAllRanges();
    }

    const rect = miniPlayer.getBoundingClientRect();
    playerWidth = rect.width;
    playerHeight = rect.height;
    untranslatedLeft = rect.left - miniDragX;
    untranslatedTop = rect.top - miniDragY;

    const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

    initialMiniX = miniDragX;
    initialMiniY = miniDragY;
    dragStartX = clientX;
    dragStartY = clientY;

    document.addEventListener('mousemove', onMiniDrag);
    document.addEventListener('mouseup', endMiniDrag);
    document.addEventListener('touchmove', onMiniDrag, { passive: false });
    document.addEventListener('touchend', endMiniDrag);
}

function onMiniDrag(e) {
    if (!isDraggingMini) return;
    if (e.cancelable) e.preventDefault();

    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

    const dx = clientX - dragStartX;
    const dy = clientY - dragStartY;

    const targetX = initialMiniX + dx;
    const targetY = initialMiniY + dy;

    // Clamp within viewport boundaries with 4px margin
    const margin = 4;
    const minX = -untranslatedLeft + margin;
    const maxX = window.innerWidth - untranslatedLeft - playerWidth - margin;
    const minY = -untranslatedTop + margin;
    const maxY = window.innerHeight - untranslatedTop - playerHeight - margin;

    miniDragX = Math.min(Math.max(targetX, minX), Math.max(minX, maxX));
    miniDragY = Math.min(Math.max(targetY, minY), Math.max(minY, maxY));

    miniPlayer.style.transform = `translate(${miniDragX}px, ${miniDragY}px)`;
}

function endMiniDrag() {
    isDraggingMini = false;
    dragHandle.style.height = '32px';

    // Restore text selection
    document.body.style.userSelect = '';
    document.body.style.webkitUserSelect = '';

    document.removeEventListener('mousemove', onMiniDrag);
    document.removeEventListener('mouseup', endMiniDrag);
    document.removeEventListener('touchmove', onMiniDrag);
    document.removeEventListener('touchend', endMiniDrag);

    // Save position to localStorage
    try {
        localStorage.setItem('mini_player_pos', JSON.stringify({ x: miniDragX, y: miniDragY }));
    } catch (e) { }
}

/* ==========================================================================
   USER BACKGROUND & INTERFACE SETTINGS SYSTEM
   ========================================================================== */

const DEFAULT_WEB_BG = '/assets/images/many-bunnies-bg.png';
const DEFAULT_CHAT_BG = '/assets/images/background-chat.jpeg';
const DEFAULT_LYRIC_BG = '/assets/images/background-chat.jpeg';

let userBgState = {
    web_bg: '',
    chat_bg: '',
    lyric_bg: '',
    top_tab_type: 'default',
    top_tab_url: ''
};

let pendingWebBg = '';
let pendingChatBg = '';
let pendingLyricBg = '';
let pendingTopTabType = 'default';
let pendingTopTabUrl = '';
let pendingWebBgFile = null;
let pendingChatBgFile = null;
let pendingLyricBgFile = null;

function applyUserBackgrounds(bgObj) {
    if (bgObj) {
        userBgState = {
            web_bg: bgObj.web_bg || '',
            chat_bg: bgObj.chat_bg || '',
            lyric_bg: bgObj.lyric_bg || '',
            top_tab_type: bgObj.top_tab_type || 'default',
            top_tab_url: bgObj.top_tab_url || ''
        };
    }

    const webBgUrl = userBgState.web_bg || DEFAULT_WEB_BG;
    const chatBgUrl = userBgState.chat_bg || DEFAULT_CHAT_BG;
    const lyricBgUrl = userBgState.lyric_bg || DEFAULT_LYRIC_BG;

    // Web background
    document.body.style.backgroundImage = `linear-gradient(rgba(28, 24, 34, 0.4), rgba(28, 24, 34, 0.4)), url('${webBgUrl}')`;

    // Chat background
    const chatBox = document.getElementById('chat-box-ui');
    if (chatBox) {
        chatBox.style.backgroundImage = `linear-gradient(rgba(12, 10, 16, 0.6), rgba(12, 10, 16, 0.6)), url('${chatBgUrl}')`;
    }

    // Lyric background
    const lyricBox = document.getElementById('lyric-box');
    if (lyricBox) {
        lyricBox.style.backgroundImage = `linear-gradient(rgba(15, 13, 11, 0.65), rgba(15, 13, 11, 0.65)), url('${lyricBgUrl}')`;
    }

    // Update Top Tab label & header according to top_tab_type
    updateTopTabNameInUI();

    // If top tab is active, refresh top view
    const topCol = document.getElementById('top-column');
    if (topCol && !topCol.classList.contains('hidden')) {
        loadTopNhac(true);
    }
}

async function loadUserBackgrounds(username) {
    if (!username) return;
    const cleanName = username.replace(' 😎', '').trim();

    // 1. LocalStorage cached version
    const cached = localStorage.getItem(`musiclive_bg_${cleanName}`);
    if (cached) {
        try {
            const bgData = JSON.parse(cached);
            applyUserBackgrounds(bgData);
        } catch (e) { }
    }

    // 2. Fetch via Socket
    if (socket && socket.connected) {
        socket.emit('getUserBackgrounds', { username: cleanName }, (res) => {
            if (res) {
                const bgData = {
                    web_bg: res.web_bg || '',
                    chat_bg: res.chat_bg || '',
                    lyric_bg: res.lyric_bg || '',
                    top_tab_type: res.top_tab_type || 'default',
                    top_tab_url: res.top_tab_url || ''
                };
                localStorage.setItem(`musiclive_bg_${cleanName}`, JSON.stringify(bgData));
                applyUserBackgrounds(bgData);
            }
        });
    }

    // 3. Fetch via Supabase Client fallback
    if (typeof supabase !== 'undefined' && supabase.createClient) {
        try {
            const supabaseClient = supabase.createClient('https://wnioetdrphkdylkoybsu.supabase.co', 'sb_publishable_p0VSduH3epzQVUdvAf2kPQ_aoWk_l1T');
            const { data, error } = await supabaseClient
                .from('user_backgrounds')
                .select('*')
                .eq('username', cleanName)
                .maybeSingle();

            if (data && !error) {
                const bgData = {
                    web_bg: data.web_bg || '',
                    chat_bg: data.chat_bg || '',
                    lyric_bg: data.lyric_bg || '',
                    top_tab_type: data.top_tab_type || 'default',
                    top_tab_url: data.top_tab_url || ''
                };
                localStorage.setItem(`musiclive_bg_${cleanName}`, JSON.stringify(bgData));
                applyUserBackgrounds(bgData);
            }
        } catch (err) {
            console.warn('Supabase fetch backgrounds error:', err);
        }
    }
}

function openSettingsModal() {
    const modal = document.getElementById('settings-modal');
    if (!modal) return;

    pendingWebBg = userBgState.web_bg || '';
    pendingChatBg = userBgState.chat_bg || '';
    pendingLyricBg = userBgState.lyric_bg || '';
    pendingTopTabType = userBgState.top_tab_type || 'default';
    pendingTopTabUrl = userBgState.top_tab_url || '';

    pendingWebBgFile = null;
    pendingChatBgFile = null;
    pendingLyricBgFile = null;

    document.getElementById('setting-web-bg-url').value = pendingWebBg;
    document.getElementById('setting-chat-bg-url').value = pendingChatBg;
    document.getElementById('setting-lyric-bg-url').value = pendingLyricBg;

    document.getElementById('setting-web-bg-file').value = '';
    document.getElementById('setting-chat-bg-file').value = '';
    document.getElementById('setting-lyric-bg-file').value = '';

    updateWebBgPreview(pendingWebBg);
    updateChatBgPreview(pendingChatBg);
    updateLyricBgPreview(pendingLyricBg);

    selectTopTabPreset(pendingTopTabType, false);
    const topUrlInput = document.getElementById('setting-top-tab-url');
    if (topUrlInput) topUrlInput.value = pendingTopTabUrl;

    modal.classList.remove('hidden');
}

function closeSettingsModal() {
    const modal = document.getElementById('settings-modal');
    if (modal) modal.classList.add('hidden');
}

function selectTopTabPreset(preset, updateUrlInput = true) {
    pendingTopTabType = preset;
    document.querySelectorAll('.top-tab-preset-btn').forEach(btn => {
        if (btn.getAttribute('data-preset') === preset) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    const urlInput = document.getElementById('setting-top-tab-url');

    if (preset === 'spotify') {
        pendingTopTabUrl = 'https://open.spotify.com';
    } else if (preset === 'nct') {
        pendingTopTabUrl = 'https://www.nhaccuatui.com/';
    } else if (preset === 'default') {
        pendingTopTabUrl = '';
    } else if (preset === 'custom') {
        if (updateUrlInput && (!pendingTopTabUrl || PRESET_TOP_TAB_URLS.includes(pendingTopTabUrl))) {
            pendingTopTabUrl = '';
        }
    }

    if (updateUrlInput && urlInput) {
        urlInput.value = pendingTopTabUrl;
    }
}

function updateTopTabCustomUrl(url) {
    pendingTopTabUrl = (url || '').trim();
    if (pendingTopTabType !== 'custom') {
        pendingTopTabType = 'custom';
        document.querySelectorAll('.top-tab-preset-btn').forEach(btn => {
            if (btn.getAttribute('data-preset') === 'custom') {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
}

function updateWebBgPreview(url) {
    pendingWebBg = (url || '').trim();
    const box = document.getElementById('preview-web-bg');
    if (box) {
        box.style.backgroundImage = `url('${pendingWebBg || DEFAULT_WEB_BG}')`;
    }
}

function handleWebBgFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    pendingWebBgFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
        const box = document.getElementById('preview-web-bg');
        if (box) box.style.backgroundImage = `url('${e.target.result}')`;
    };
    reader.readAsDataURL(file);
}

function resetWebBgToDefault() {
    pendingWebBg = '';
    pendingWebBgFile = null;
    document.getElementById('setting-web-bg-url').value = '';
    document.getElementById('setting-web-bg-file').value = '';
    updateWebBgPreview('');
}

function updateChatBgPreview(url) {
    pendingChatBg = (url || '').trim();
    const box = document.getElementById('preview-chat-bg');
    if (box) {
        box.style.backgroundImage = `linear-gradient(rgba(12, 10, 16, 0.6), rgba(12, 10, 16, 0.6)), url('${pendingChatBg || DEFAULT_CHAT_BG}')`;
    }
}

function handleChatBgFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    pendingChatBgFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
        const box = document.getElementById('preview-chat-bg');
        if (box) box.style.backgroundImage = `linear-gradient(rgba(12, 10, 16, 0.6), rgba(12, 10, 16, 0.6)), url('${e.target.result}')`;
    };
    reader.readAsDataURL(file);
}

function resetChatBgToDefault() {
    pendingChatBg = '';
    pendingChatBgFile = null;
    document.getElementById('setting-chat-bg-url').value = '';
    document.getElementById('setting-chat-bg-file').value = '';
    updateChatBgPreview('');
}

function updateLyricBgPreview(url) {
    pendingLyricBg = (url || '').trim();
    const box = document.getElementById('preview-lyric-bg');
    if (box) {
        box.style.backgroundImage = `url('${pendingLyricBg || DEFAULT_LYRIC_BG}')`;
    }
}

function handleLyricBgFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    pendingLyricBgFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
        const box = document.getElementById('preview-lyric-bg');
        if (box) box.style.backgroundImage = `url('${e.target.result}')`;
    };
    reader.readAsDataURL(file);
}

function resetLyricBgToDefault() {
    pendingLyricBg = '';
    pendingLyricBgFile = null;
    document.getElementById('setting-lyric-bg-url').value = '';
    document.getElementById('setting-lyric-bg-file').value = '';
    updateLyricBgPreview('');
}

function resetAllBgsToDefault() {
    resetWebBgToDefault();
    resetChatBgToDefault();
    resetLyricBgToDefault();
    selectTopTabPreset('default');
}

async function uploadBgFileToSupabase(file) {
    if (!file) return '';
    try {
        const compressed = await compressImage(file, 1920, 1080, 0.85);
        const fileExt = compressed.name.split('.').pop() || 'jpg';
        const fileName = `bg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

        if (typeof supabase !== 'undefined' && supabase.createClient) {
            const supabaseStorage = supabase.createClient('https://wnioetdrphkdylkoybsu.supabase.co', 'sb_publishable_p0VSduH3epzQVUdvAf2kPQ_aoWk_l1T');
            const { data, error } = await supabaseStorage.storage.from('chat_media').upload(fileName, compressed, {
                cacheControl: '3600',
                upsert: false
            });
            if (!error && data) {
                const { data: urlData } = supabaseStorage.storage.from('chat_media').getPublicUrl(fileName);
                if (urlData && urlData.publicUrl) return urlData.publicUrl;
            }
        }
    } catch (err) {
        console.warn('Upload background to Supabase Storage failed:', err);
    }

    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => resolve('');
        reader.readAsDataURL(file);
    });
}

async function saveUserSettings() {
    const saveBtn = document.getElementById('save-settings-btn');
    const originalBtnText = saveBtn ? saveBtn.innerHTML : '';
    if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<span class="material-symbols-outlined spin" style="font-size:18px;">sync</span> Đang lưu...';
    }

    try {
        let finalWebBg = pendingWebBg;
        let finalChatBg = pendingChatBg;
        let finalLyricBg = pendingLyricBg;

        if (pendingWebBgFile) {
            finalWebBg = await uploadBgFileToSupabase(pendingWebBgFile);
        }
        if (pendingChatBgFile) {
            finalChatBg = await uploadBgFileToSupabase(pendingChatBgFile);
        }
        if (pendingLyricBgFile) {
            finalLyricBg = await uploadBgFileToSupabase(pendingLyricBgFile);
        }

        const newBgState = {
            web_bg: finalWebBg,
            chat_bg: finalChatBg,
            lyric_bg: finalLyricBg,
            top_tab_type: pendingTopTabType,
            top_tab_url: pendingTopTabUrl
        };

        const cleanName = (myUsername || '').replace(' 😎', '').trim();

        if (cleanName) {
            localStorage.setItem(`musiclive_bg_${cleanName}`, JSON.stringify(newBgState));
        }

        if (socket && socket.connected) {
            socket.emit('saveUserBackgrounds', {
                username: cleanName,
                ...newBgState
            });
        }

        if (cleanName && typeof supabase !== 'undefined' && supabase.createClient) {
            try {
                const supabaseClient = supabase.createClient('https://wnioetdrphkdylkoybsu.supabase.co', 'sb_publishable_p0VSduH3epzQVUdvAf2kPQ_aoWk_l1T');
                await supabaseClient
                    .from('user_backgrounds')
                    .upsert({
                        username: cleanName,
                        web_bg: finalWebBg || null,
                        chat_bg: finalChatBg || null,
                        lyric_bg: finalLyricBg || null,
                        top_tab_type: pendingTopTabType || 'default',
                        top_tab_url: pendingTopTabUrl || null,
                        updated_at: new Date().toISOString()
                    }, { onConflict: 'username' });
            } catch (spErr) {
                console.warn('Supabase direct upsert error:', spErr);
            }
        }

        applyUserBackgrounds(newBgState);
        closeSettingsModal();

        if (typeof showToastNotification === 'function') {
            showToastNotification('✨ Đã lưu cài đặt giao diện thành công!');
        } else {
            alert('✨ Đã lưu cài đặt giao diện thành công!');
        }

    } catch (err) {
        console.error('Lỗi khi lưu cài đặt giao diện:', err);
        alert('Không thể lưu cài đặt giao diện. Vui lòng thử lại!');
    } finally {
        if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.innerHTML = originalBtnText;
        }
    }
}

function resetBackgroundsToDefault() {
    userBgState = { web_bg: '', chat_bg: '', lyric_bg: '', top_tab_type: 'default', top_tab_url: '' };
    applyUserBackgrounds(userBgState);
}

/* ==========================================================================
   GAME ĐOÁN TỪ THEO HÌNH (PICTURE QUIZ SYSTEM)
   ========================================================================== */

let currentQuizPacks = [];
let quizActiveSession = null;
let adminQuizPacksWorkingCopy = [];
let activeAdminPackId = null;

// Socket events for Quiz
socket.on('quizPacksUpdated', (packs) => {
    currentQuizPacks = packs || [];
    renderQuizPacksLobby();
    const adminCol = document.getElementById('quiz-admin-column');
    if (adminCol && !adminCol.classList.contains('hidden')) {
        openQuizAdminTab();
    }
});

socket.on('quizPacksResult', (packs) => {
    currentQuizPacks = packs || [];
    renderQuizPacksLobby();
});

function isQuizPackCompleteClient(pack) {
    if (!pack || !Array.isArray(pack.items)) return false;
    const validItems = pack.items.filter(item => item && item.name && item.name.trim() !== '' && item.imageUrl && item.imageUrl.trim() !== '');
    return validItems.length >= 4;
}

let currentQuizState = null;
let currentQuizSessionId = null;
let mySelectedOptionIndex = null;
let lastRenderedQuestionIndex = -1;
let myLastAnswerResult = null;
let userManuallyClosedQuiz = false;
let myQuizHostToken = localStorage.getItem('my_quiz_host_token') || null;

socket.on('quizRoomUpdate', (state) => {
    currentQuizState = state;
    renderMultiplayerQuizState(state);
});

socket.on('quizRoomTimerTick', ({ timeLeft, answeredCount, totalPlayersCount }) => {
    const timeSec = document.getElementById('quiz-time-sec');
    if (timeSec) timeSec.innerText = `${timeLeft}s`;

    const textBadge = document.getElementById('quiz-answered-count-text');
    if (textBadge) textBadge.innerText = `${answeredCount}/${totalPlayersCount} đã chọn`;

    if (currentQuizState) {
        currentQuizState.timeLeft = timeLeft;
        const fill = document.getElementById('quiz-progress-fill');
        if (fill && currentQuizState.timerSeconds) {
            const pct = Math.round((timeLeft / currentQuizState.timerSeconds) * 100);
            fill.style.width = `${pct}%`;
        }
    }
});

socket.on('quizAnswerProgress', ({ answeredCount, totalPlayersCount }) => {
    const textBadge = document.getElementById('quiz-answered-count-text');
    if (textBadge) textBadge.innerText = `${answeredCount}/${totalPlayersCount} đã chọn`;
});

function openPictureQuizGame() {
    userManuallyClosedQuiz = false;
    socket.emit('getQuizPacks', (packs) => {
        if (Array.isArray(packs)) currentQuizPacks = packs;
        renderQuizPacksLobby();
    });

    socket.emit('getQuizState', (state) => {
        currentQuizState = state;
        document.getElementById('picture-quiz-overlay').classList.remove('hidden');
        renderMultiplayerQuizState(state);
    });
}

function closePictureQuizGame() {
    userManuallyClosedQuiz = true;
    document.getElementById('picture-quiz-overlay').classList.add('hidden');

    if (currentQuizState && currentQuizState.active) {
        socket.emit('endMultiplayerQuiz', { hostToken: myQuizHostToken }, (res) => {
            if (res && res.success) {
                myQuizHostToken = null;
                localStorage.removeItem('my_quiz_host_token');
            }
        });
    }
}

function returnToQuizLobby() {
    userManuallyClosedQuiz = false;
    currentQuizSessionId = null;
    lastRenderedQuestionIndex = -1;
    mySelectedOptionIndex = null;
    myLastAnswerResult = null;
    if (currentQuizState && currentQuizState.active) {
        socket.emit('endMultiplayerQuiz', { hostToken: myQuizHostToken }, (res) => {
            if (res && res.success) {
                myQuizHostToken = null;
                localStorage.removeItem('my_quiz_host_token');
            }
        });
    }
    document.getElementById('quiz-lobby-view').classList.remove('hidden');
    document.getElementById('quiz-game-view').classList.add('hidden');
    document.getElementById('quiz-result-view').classList.add('hidden');
    renderQuizPacksLobby();
}

function confirmEndQuizGame() {
    if (confirm("Bạn có chắc chắn muốn kết thúc trò chơi đoán hình ngay lập tức?")) {
        socket.emit('endMultiplayerQuiz', { hostToken: myQuizHostToken }, (res) => {
            if (res && res.success) {
                myQuizHostToken = null;
                localStorage.removeItem('my_quiz_host_token');
            } else if (res && !res.success) {
                alert(res.message || 'Không thể kết thúc trò chơi!');
            }
        });
    }
}

function renderQuizPacksLobby() {
    const grid = document.getElementById('quiz-packs-grid');
    if (!grid) return;
    grid.innerHTML = '';

    if (!currentQuizPacks || currentQuizPacks.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 30px;">Chưa có bộ câu hỏi nào. ${myRole === 'admin' ? 'Vào sidebar chọn "Kho Đoán Hình" để tạo!' : ''}</div>`;
        return;
    }

    currentQuizPacks.forEach((pack) => {
        const validItems = (pack.items || []).filter(it => it && it.name && it.name.trim() && it.imageUrl && it.imageUrl.trim());
        const isComplete = validItems.length >= 4;

        const card = document.createElement('div');
        card.className = 'quiz-pack-card';

        let thumbsHtml = '';
        if (validItems.length > 0) {
            thumbsHtml = `<div class="quiz-pack-thumbs-strip">` +
                validItems.slice(0, 4).map(it => `<img src="${it.imageUrl}" class="quiz-pack-thumb-item" alt="${it.name}" onerror="this.src='/assets/images/background-chat.jpeg'">`).join('') +
                `</div>`;
        }

        const badgeHtml = isComplete
            ? `<span class="quiz-pack-badge ready">✅ ${validItems.length} câu (Sẵn sàng)</span>`
            : `<span class="quiz-pack-badge not-ready">⚠️ ${validItems.length}/4 câu (Chưa đủ)</span>`;

        const playBtnHtml = isComplete
            ? `<button class="caro-btn" style="width: 100%; background: linear-gradient(135deg, #ff75a0, #ff4757); color: #fff; font-weight: 800; border: none; margin-top: 6px;" onclick="startQuizGame('${pack.id}')">🚀 Bắt Đầu Trận Đấu (Multiplayer)</button>`
            : `<button class="caro-btn" style="width: 100%; background: rgba(255,255,255,0.05); color: var(--text-muted); border: 1px solid rgba(255,255,255,0.1); cursor: not-allowed; margin-top: 6px;" disabled>⚠️ Cần tối thiểu 4 câu để chơi</button>`;

        card.innerHTML = `
            <div class="quiz-pack-card-header">
                <div class="quiz-pack-card-title">${pack.name}</div>
                ${badgeHtml}
            </div>
            <div class="quiz-pack-card-desc">${pack.description || 'Bộ câu hỏi trắc nghiệm 4 đáp án.'}</div>
            ${thumbsHtml}
            ${playBtnHtml}
        `;

        grid.appendChild(card);
    });
}

function startQuizGame(packId) {
    userManuallyClosedQuiz = false;
    socket.emit('startMultiplayerQuiz', { packId, starterName: myUsername || '' }, (res) => {
        if (res && res.success) {
            if (res.hostToken) {
                myQuizHostToken = res.hostToken;
                localStorage.setItem('my_quiz_host_token', res.hostToken);
            }
        } else {
            alert((res && res.message) || 'Không thể bắt đầu trận đấu!');
        }
    });
}

function submitKahootOption(optionIndex) {
    if (mySelectedOptionIndex !== null) return;
    mySelectedOptionIndex = optionIndex;
    myLastAnswerResult = null;

    const btns = document.querySelectorAll('#quiz-options-grid .quiz-kahoot-opt');
    btns.forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === optionIndex) {
            btn.classList.add('selected');
        } else {
            btn.style.opacity = '0.4';
        }
    });

    const banner = document.getElementById('quiz-feedback-banner');
    if (banner) {
        banner.innerHTML = `⏳ ĐÃ CHỐT ĐÁP ÁN! ĐANG CHỜ CÁC NGƯỜI CHƠI KHÁC...`;
        banner.style.background = 'rgba(255, 212, 59, 0.2)';
        banner.style.color = '#ffd43b';
        banner.style.border = '1px solid rgba(255, 212, 59, 0.4)';
        banner.classList.remove('hidden');
    }

    socket.emit('submitQuizAnswer', { optionIndex }, (res) => {
        if (res && res.success) {
            myLastAnswerResult = res;
            const myScoreEl = document.getElementById('quiz-my-score-text');
            if (myScoreEl && typeof res.totalScore === 'number') {
                myScoreEl.innerText = `Điểm: ${res.totalScore}đ`;
            }
            if (banner && mySelectedOptionIndex !== null) {
                if (res.isCorrect) {
                    banner.innerHTML = `🎉 ĐÃ CHỐT ĐÁP ÁN! ĐÚNG RỒI (+${res.scoreAdded} điểm)`;
                    banner.style.background = 'rgba(81, 207, 102, 0.25)';
                    banner.style.color = '#51cf66';
                    banner.style.border = '1px solid rgba(81, 207, 102, 0.5)';
                } else {
                    banner.innerHTML = `❌ ĐÃ CHỐT ĐÁP ÁN! (CHƯA CHÍNH XÁC)`;
                    banner.style.background = 'rgba(255, 71, 87, 0.25)';
                    banner.style.color = '#ff4757';
                    banner.style.border = '1px solid rgba(255, 71, 87, 0.5)';
                }
            }
        }
    });
}

function renderMultiplayerQuizState(state) {
    if (!state || !state.active) {
        currentQuizSessionId = null;
        lastRenderedQuestionIndex = -1;
        mySelectedOptionIndex = null;
        myLastAnswerResult = null;
        userManuallyClosedQuiz = false;
        document.getElementById('quiz-lobby-view').classList.remove('hidden');
        document.getElementById('quiz-game-view').classList.add('hidden');
        document.getElementById('quiz-result-view').classList.add('hidden');
        renderQuizPacksLobby();
        return;
    }

    const loginSection = document.getElementById('login-section');
    if (loginSection && !loginSection.classList.contains('hidden')) {
        return;
    }

    const overlay = document.getElementById('picture-quiz-overlay');

    // Reset state when a brand new game session starts
    const isNewSession = (currentQuizSessionId !== state.gameSessionId);
    if (isNewSession) {
        currentQuizSessionId = state.gameSessionId;
        userManuallyClosedQuiz = false;
        lastRenderedQuestionIndex = -1;
        mySelectedOptionIndex = null;
        myLastAnswerResult = null;
    }

    if (userManuallyClosedQuiz) {
        overlay.classList.add('hidden');
    } else {
        if (overlay.classList.contains('hidden')) {
            overlay.classList.remove('hidden');
        }
    }

    if (state.state === 'question' || state.state === 'reveal') {
        document.getElementById('quiz-lobby-view').classList.add('hidden');
        document.getElementById('quiz-result-view').classList.add('hidden');
        document.getElementById('quiz-game-view').classList.remove('hidden');

        // Reset option choice on new question index
        if (lastRenderedQuestionIndex !== state.currentIndex) {
            lastRenderedQuestionIndex = state.currentIndex;
            mySelectedOptionIndex = null;
            myLastAnswerResult = null;
        }

        const totalQ = state.totalQuestions || 1;
        const curQIndex = (state.currentIndex || 0) + 1;
        document.getElementById('quiz-question-counter').innerText = `CÂU ${curQIndex} / ${totalQ}`;

        // End Game button visibility check for Host / Admin
        const endGameBtn = document.getElementById('quiz-end-game-btn');
        if (endGameBtn) {
            const cleanHostName = (state.hostName || '').replace(' 😎', '').trim().toLowerCase();
            const cleanMyName = (myUsername || '').replace(' 😎', '').trim().toLowerCase();
            const isHost = (state.hostId && state.hostId === socket.id) ||
                           (cleanHostName && cleanMyName && cleanHostName === cleanMyName);
            const isAdmin = (myRole === 'admin');
            if (isHost || isAdmin) {
                endGameBtn.classList.remove('hidden');
            } else {
                endGameBtn.classList.add('hidden');
            }
        }

        // Personal Live Score & Rank update
        let myScore = 0;
        let myRankStr = '';
        if (Array.isArray(state.leaderboard)) {
            const cleanMyName = (myUsername || '').replace(' 😎', '').trim().toLowerCase();
            const myIdx = state.leaderboard.findIndex(p => 
                (p.id && p.id === socket.id) || 
                (p.name && (p.name === myUsername || p.name.replace(' 😎', '').trim().toLowerCase() === cleanMyName))
            );
            if (myIdx !== -1) {
                myScore = state.leaderboard[myIdx].score || 0;
                myRankStr = ` (#${myIdx + 1})`;
            }
        }
        const myScoreEl = document.getElementById('quiz-my-score-text');
        if (myScoreEl) {
            myScoreEl.innerText = `Điểm: ${myScore}đ${myRankStr}`;
        }

        const fill = document.getElementById('quiz-progress-fill');
        if (fill && state.timerSeconds) {
            const pct = Math.round((state.timeLeft / state.timerSeconds) * 100);
            fill.style.width = `${pct}%`;
        }

        document.getElementById('quiz-answered-count-text').innerText = `${state.answeredCount || 0}/${state.totalPlayersCount || 1} đã chọn`;
        document.getElementById('quiz-time-sec').innerText = `${state.timeLeft || 0}s`;

        const imgEl = document.getElementById('quiz-current-image');
        if (state.question && state.question.imageUrl) {
            imgEl.src = state.question.imageUrl;
        }

        const icons = ['▲', '◆', '●', '■'];
        const optionsGrid = document.getElementById('quiz-options-grid');
        optionsGrid.innerHTML = '';

        if (state.question && Array.isArray(state.question.options)) {
            state.question.options.forEach((optText, idx) => {
                const btn = document.createElement('button');
                btn.className = `quiz-kahoot-opt quiz-kahoot-opt-${idx}`;
                btn.onclick = () => submitKahootOption(idx);

                if (mySelectedOptionIndex !== null) {
                    btn.disabled = true;
                    if (mySelectedOptionIndex === idx) btn.classList.add('selected');
                    else btn.style.opacity = '0.4';
                }

                if (state.state === 'reveal') {
                    btn.disabled = true;
                    if (idx === state.question.correctOptionIndex) {
                        btn.classList.add('correct-answer');
                        btn.style.opacity = '1';
                    } else {
                        btn.classList.add('wrong-answer');
                    }
                }

                btn.innerHTML = `
                    <div class="quiz-kahoot-opt-icon">${icons[idx]}</div>
                    <span>${optText}</span>
                `;
                optionsGrid.appendChild(btn);
            });
        }

        // Render Histogram during Reveal Phase
        const histView = document.getElementById('quiz-histogram-view');
        if (state.state === 'reveal') {
            histView.classList.remove('hidden');
            const counts = state.optionCounts || [0, 0, 0, 0];
            const maxVotes = Math.max(1, ...counts);
            counts.forEach((c, idx) => {
                const bar = document.getElementById(`hist-bar-${idx}`);
                const cnt = document.getElementById(`hist-count-${idx}`);
                if (bar) bar.style.height = `${Math.round((c / maxVotes) * 100)}%`;
                if (cnt) cnt.innerText = c;
            });
        } else {
            histView.classList.add('hidden');
        }

        // Render Feedback Banner
        const feedbackBanner = document.getElementById('quiz-feedback-banner');
        if (state.state === 'reveal') {
            const correctText = state.question ? state.question.correctAnswer : '';
            if (myLastAnswerResult) {
                if (myLastAnswerResult.isCorrect) {
                    feedbackBanner.innerHTML = `🎉 CHÍNH XÁC! Bạn nhận được <span style="color:#ffd43b; font-weight:bold;">+${myLastAnswerResult.scoreAdded} điểm</span>! (Tổng: ${myLastAnswerResult.totalScore}đ)`;
                    feedbackBanner.style.background = 'rgba(81, 207, 102, 0.25)';
                    feedbackBanner.style.color = '#51cf66';
                    feedbackBanner.style.border = '1px solid rgba(81, 207, 102, 0.5)';
                } else {
                    feedbackBanner.innerHTML = `❌ TIẾC QUÁ! Đáp án đúng là: <span style="color:#51cf66; font-weight:bold;">${correctText}</span>`;
                    feedbackBanner.style.background = 'rgba(255, 71, 87, 0.25)';
                    feedbackBanner.style.color = '#ff4757';
                    feedbackBanner.style.border = '1px solid rgba(255, 71, 87, 0.5)';
                }
            } else if (mySelectedOptionIndex !== null && mySelectedOptionIndex === state.question.correctOptionIndex) {
                feedbackBanner.innerHTML = `🎉 CHÍNH XÁC! TỐC ĐỘ XUẤT SẮC!`;
                feedbackBanner.style.background = 'rgba(81, 207, 102, 0.25)';
                feedbackBanner.style.color = '#51cf66';
                feedbackBanner.style.border = '1px solid rgba(81, 207, 102, 0.5)';
            } else if (mySelectedOptionIndex !== null) {
                feedbackBanner.innerHTML = `❌ TIẾC QUÁ! Đáp án đúng là: <span style="color:#51cf66; font-weight:bold;">${correctText}</span>`;
                feedbackBanner.style.background = 'rgba(255, 71, 87, 0.25)';
                feedbackBanner.style.color = '#ff4757';
                feedbackBanner.style.border = '1px solid rgba(255, 71, 87, 0.5)';
            } else {
                feedbackBanner.innerHTML = `⏰ HẾT GIỜ HOẶC VÀO TRỄ! Đáp án đúng là: <span style="color:#51cf66; font-weight:bold;">${correctText}</span>`;
                feedbackBanner.style.background = 'rgba(255, 212, 59, 0.2)';
                feedbackBanner.style.color = '#ffd43b';
                feedbackBanner.style.border = '1px solid rgba(255, 212, 59, 0.4)';
            }
            feedbackBanner.classList.remove('hidden');
        } else if (mySelectedOptionIndex === null) {
            feedbackBanner.classList.add('hidden');
        }

        // Render Live Leaderboard Ticker at bottom
        const ticker = document.getElementById('quiz-leaderboard-ticker');
        if (ticker && Array.isArray(state.leaderboard)) {
            const top3 = state.leaderboard.slice(0, 4);
            ticker.innerHTML = top3.map((p, rank) => {
                const medals = ['👑', '🥈', '🥉', '4️⃣'];
                return `<span style="color: ${p.color || '#fff'};">${medals[rank]} ${p.name}: <span style="color:#ffd43b;">${p.score}đ</span></span>`;
            }).join(' &nbsp;|&nbsp; ');
        }
    } else if (state.state === 'finished') {
        document.getElementById('quiz-lobby-view').classList.add('hidden');
        document.getElementById('quiz-game-view').classList.add('hidden');
        document.getElementById('quiz-result-view').classList.remove('hidden');

        document.getElementById('quiz-result-pack-title').innerText = `Bộ câu hỏi: ${state.packName || ''}`;

        const leaderboard = state.leaderboard || [];

        // 3D Podium Render
        const podiumContainer = document.getElementById('quiz-podium-container');
        if (podiumContainer) {
            const p1 = leaderboard[0];
            const p2 = leaderboard[1];
            const p3 = leaderboard[2];

            podiumContainer.innerHTML = `
                <div class="podium-step">
                    ${p2 ? `
                        <div class="podium-avatar-box">
                            <div class="podium-crown">🥈</div>
                            <div class="podium-name" style="color: ${p2.color || '#fff'}">${p2.name}</div>
                            <div class="podium-score">${p2.score}đ</div>
                        </div>
                        <div class="podium-block podium-2nd">2</div>
                    ` : ''}
                </div>
                <div class="podium-step">
                    ${p1 ? `
                        <div class="podium-avatar-box">
                            <div class="podium-crown">👑</div>
                            <div class="podium-name" style="color: ${p1.color || '#fff'}">${p1.name}</div>
                            <div class="podium-score">${p1.score}đ</div>
                        </div>
                        <div class="podium-block podium-1st">1</div>
                    ` : ''}
                </div>
                <div class="podium-step">
                    ${p3 ? `
                        <div class="podium-avatar-box">
                            <div class="podium-crown">🥉</div>
                            <div class="podium-name" style="color: ${p3.color || '#fff'}">${p3.name}</div>
                            <div class="podium-score">${p3.score}đ</div>
                        </div>
                        <div class="podium-block podium-3rd">3</div>
                    ` : ''}
                </div>
            `;
        }

        // Full Scoreboard Table
        const listEl = document.getElementById('quiz-final-leaderboard-list');
        if (listEl) {
            listEl.innerHTML = leaderboard.map((p, index) => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 14px; background: rgba(255,255,255,0.05); border-radius: 8px; font-size: 14px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-weight: 800; color: #ffd43b; width: 24px;">#${index + 1}</span>
                        <span style="font-weight: 700; color: ${p.color || '#fff'};">${p.name}</span>
                    </div>
                    <div style="display: flex; gap: 16px; font-weight: 700;">
                        <span style="color: #51cf66;">🎯 ${p.correctCount || 0} câu đúng</span>
                        <span style="color: #ffd43b;">🏆 ${p.score} điểm</span>
                    </div>
                </div>
            `).join('');
        }
    }
}

/* --- ADMIN KHO QUIZ MANAGEMENT SYSTEM --- */

function openQuizAdminTab() {
    if (myRole !== 'admin') return;

    socket.emit('getQuizPacks', (packs) => {
        if (Array.isArray(packs)) {
            currentQuizPacks = packs;
        }
        adminQuizPacksWorkingCopy = JSON.parse(JSON.stringify(currentQuizPacks || []));
        if (adminQuizPacksWorkingCopy.length > 0) {
            if (!activeAdminPackId || !adminQuizPacksWorkingCopy.find(p => p.id === activeAdminPackId)) {
                activeAdminPackId = adminQuizPacksWorkingCopy[0].id;
            }
        } else {
            activeAdminPackId = null;
        }

        renderAdminQuizPacksList();
        renderAdminPackEditor();
    });
}

function openQuizAdminModal() {
    showTab('quiz-admin');
}

function closeQuizAdminModal() {
    showTab('home');
}

function renderAdminQuizPacksList() {
    const listEl = document.getElementById('admin-quiz-pack-selector-list');
    if (!listEl) return;
    listEl.innerHTML = '';

    if (!adminQuizPacksWorkingCopy || adminQuizPacksWorkingCopy.length === 0) {
        listEl.innerHTML = `<div style="font-size: 13px; color: var(--text-muted); text-align: center; padding: 12px;">Chưa có bộ nào</div>`;
        return;
    }

    adminQuizPacksWorkingCopy.forEach(pack => {
        const validItems = (pack.items || []).filter(it => it && it.name && it.name.trim() && it.imageUrl && it.imageUrl.trim());
        const isComplete = validItems.length >= 4;
        const isActive = pack.id === activeAdminPackId;

        const itemBtn = document.createElement('button');
        itemBtn.type = 'button';
        itemBtn.className = `quiz-admin-pack-btn${isActive ? ' active' : ''}`;

        itemBtn.onclick = () => {
            activeAdminPackId = pack.id;
            renderAdminQuizPacksList();
            renderAdminPackEditor();
        };

        const statusDot = isComplete
            ? `<span style="color: #51cf66; font-size: 12px; font-weight: 800; background: rgba(81, 207, 102, 0.2); padding: 2px 8px; border-radius: 10px; border: 1px solid rgba(81, 207, 102, 0.4);">✅ ${validItems.length} câu</span>`
            : `<span style="color: #ff4757; font-size: 12px; font-weight: 800; background: rgba(255, 71, 87, 0.2); padding: 2px 8px; border-radius: 10px; border: 1px solid rgba(255, 71, 87, 0.4);">⚠️ ${validItems.length}/4</span>`;

        itemBtn.innerHTML = `
            <div style="font-size: 14px; font-weight: 700; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; max-width: 140px;">${pack.name}</div>
            ${statusDot}
        `;

        listEl.appendChild(itemBtn);
    });
}

function createEmptyQuizPack() {
    const newPack = {
        id: 'pack-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        name: 'Bộ câu hỏi mới ' + (adminQuizPacksWorkingCopy.length + 1),
        description: 'Mô tả bộ câu hỏi...',
        items: []
    };

    adminQuizPacksWorkingCopy.push(newPack);
    activeAdminPackId = newPack.id;

    renderAdminQuizPacksList();
    renderAdminPackEditor();
}

function deleteCurrentAdminPack() {
    if (!activeAdminPackId) return;
    if (!confirm('Bạn có chắc chắn muốn xóa bộ câu hỏi này khỏi kho?')) return;

    adminQuizPacksWorkingCopy = adminQuizPacksWorkingCopy.filter(p => p.id !== activeAdminPackId);
    if (adminQuizPacksWorkingCopy.length > 0) {
        activeAdminPackId = adminQuizPacksWorkingCopy[0].id;
    } else {
        activeAdminPackId = null;
    }

    renderAdminQuizPacksList();
    renderAdminPackEditor();
}

function renderAdminPackEditor() {
    const editorContent = document.getElementById('admin-pack-editor-content');
    const editorEmpty = document.getElementById('admin-pack-editor-empty');

    if (!activeAdminPackId) {
        editorContent.classList.add('hidden');
        editorEmpty.classList.remove('hidden');
        return;
    }

    const pack = adminQuizPacksWorkingCopy.find(p => p.id === activeAdminPackId);
    if (!pack) {
        editorContent.classList.add('hidden');
        editorEmpty.classList.remove('hidden');
        return;
    }

    editorContent.classList.remove('hidden');
    editorEmpty.classList.add('hidden');

    document.getElementById('admin-pack-name-input').value = pack.name || '';
    document.getElementById('admin-pack-desc-input').value = pack.description || '';

    updateAdminPackHeader();
}

function updateAdminPackHeader() {
    if (!activeAdminPackId) return;
    const pack = adminQuizPacksWorkingCopy.find(p => p.id === activeAdminPackId);
    if (!pack) return;

    const nameVal = document.getElementById('admin-pack-name-input').value;
    const descVal = document.getElementById('admin-pack-desc-input').value;

    pack.name = nameVal;
    pack.description = descVal;

    const validItems = (pack.items || []).filter(it => it && it.name && it.name.trim() && it.imageUrl && it.imageUrl.trim());
    const isComplete = validItems.length >= 4;

    const banner = document.getElementById('admin-pack-status-banner');
    if (isComplete) {
        banner.style.background = 'rgba(81, 207, 102, 0.2)';
        banner.style.color = '#51cf66';
        banner.style.border = '1px solid rgba(81, 207, 102, 0.4)';
        banner.innerHTML = `✅ BỘ CÂU HỎI ĐỦ ĐIỀU KIỆN! Có ${validItems.length} item hợp lệ (đầy đủ tên & ảnh). Có thể sử dụng làm game trắc nghiệm 4 đáp án.`;
    } else {
        banner.style.background = 'rgba(255, 71, 87, 0.2)';
        banner.style.color = '#ff4757';
        banner.style.border = '1px solid rgba(255, 71, 87, 0.4)';
        banner.innerHTML = `⚠️ CHƯA ĐỦ ĐIỀU KIỆN! Cần ít nhất 4 item có đầy đủ TÊN và ẢNH để có thể xếp thành bộ câu hỏi. (Hiện có: ${validItems.length}/4 item)`;
    }

    renderAdminQuizPacksList();
    renderAdminPackItemsContainer();
}

function renderAdminPackItemsContainer() {
    const container = document.getElementById('admin-pack-items-container');
    if (!container || !activeAdminPackId) return;
    const pack = adminQuizPacksWorkingCopy.find(p => p.id === activeAdminPackId);
    if (!pack) return;

    container.innerHTML = '';

    if (!pack.items || pack.items.length === 0) {
        container.innerHTML = `<div style="font-size: 14px; color: var(--text-muted); text-align: center; padding: 30px; font-weight: 600;">Bộ câu hỏi này chưa có câu hỏi nào. Bấm "+ Thêm Câu Hỏi" phía trên để thêm!</div>`;
        return;
    }

    pack.items.forEach((item) => {
        const itemCard = document.createElement('div');
        itemCard.className = 'quiz-item-card-input-box';
        itemCard.style.display = 'flex';
        itemCard.style.alignItems = 'center';
        itemCard.style.gap = '12px';

        const thumbSrc = item.imageUrl || '/assets/images/background-chat.jpeg';

        itemCard.innerHTML = `
            <img src="${thumbSrc}" id="thumb-preview-${item.id}" alt="Item image" style="width: 54px; height: 54px; object-fit: cover; border-radius: 12px; border: 1.5px solid rgba(255,180,210,0.3); background: #000;" onerror="this.src='/assets/images/background-chat.jpeg'">
            <div style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
                <input type="text" class="login-input" style="padding: 8px 12px; font-size: 13px; font-weight: 700; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,180,210,0.2); border-radius: 10px; color: #fff;" placeholder="Tên đáp án đúng (Ví dụ: Cờ Việt Nam)..." value="${item.name || ''}" oninput="updateAdminItemName('${item.id}', this.value)">
                
                <div style="display: flex; gap: 8px; align-items: center;">
                    <input type="text" class="login-input" style="padding: 6px 10px; font-size: 12px; flex: 1; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,180,210,0.15); border-radius: 8px; color: var(--text-muted);" placeholder="Link URL ảnh (https://...)..." value="${item.imageUrl || ''}" oninput="updateAdminItemImageUrl('${item.id}', this.value)">
                    <label class="action-btn" style="padding: 6px 12px; font-size: 12px; cursor: pointer; white-space: nowrap; background: rgba(255,117,160,0.2); border: 1px solid rgba(255,117,160,0.4); color: #ff75a0; font-weight: 700; border-radius: 8px;">
                        📷 Tải ảnh
                        <input type="file" accept="image/*" style="display: none;" onchange="handleAdminItemFileUpload(event, '${item.id}')">
                    </label>
                </div>
            </div>
            <button type="button" style="background: rgba(255,71,87,0.2); color: #ff4757; border: 1px solid rgba(255,71,87,0.4); border-radius: 10px; width: 36px; height: 36px; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.2s ease;" onclick="deleteAdminPackItem('${item.id}')" title="Xóa item này">
                <span class="material-symbols-outlined" style="font-size: 20px;">delete</span>
            </button>
        `;

        container.appendChild(itemCard);
    });
}

function addAdminPackItem() {
    if (!activeAdminPackId) return;
    const pack = adminQuizPacksWorkingCopy.find(p => p.id === activeAdminPackId);
    if (!pack) return;

    if (!pack.items) pack.items = [];
    const newItem = {
        id: 'item-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        name: '',
        imageUrl: ''
    };

    pack.items.push(newItem);
    updateAdminPackHeader();
}

function deleteAdminPackItem(itemId) {
    if (!activeAdminPackId) return;
    const pack = adminQuizPacksWorkingCopy.find(p => p.id === activeAdminPackId);
    if (!pack || !pack.items) return;

    pack.items = pack.items.filter(it => it.id !== itemId);
    updateAdminPackHeader();
}

function updateAdminItemName(itemId, val) {
    if (!activeAdminPackId) return;
    const pack = adminQuizPacksWorkingCopy.find(p => p.id === activeAdminPackId);
    if (!pack || !pack.items) return;

    const item = pack.items.find(it => it.id === itemId);
    if (item) {
        item.name = val;
        const validItems = pack.items.filter(it => it && it.name && it.name.trim() && it.imageUrl && it.imageUrl.trim());
        const isComplete = validItems.length >= 4;

        const banner = document.getElementById('admin-pack-status-banner');
        if (banner) {
            if (isComplete) {
                banner.style.background = 'rgba(81, 207, 102, 0.2)';
                banner.style.color = '#51cf66';
                banner.style.border = '1px solid rgba(81, 207, 102, 0.4)';
                banner.innerHTML = `✅ BỘ CÂU HỎI ĐỦ ĐIỀU KIỆN! Có ${validItems.length} item hợp lệ (đầy đủ tên & ảnh).`;
            } else {
                banner.style.background = 'rgba(255, 71, 87, 0.2)';
                banner.style.color = '#ff4757';
                banner.style.border = '1px solid rgba(255, 71, 87, 0.4)';
                banner.innerHTML = `⚠️ CHƯA ĐỦ ĐIỀU KIỆN! Cần ít nhất 4 item có đầy đủ TÊN và ẢNH để có thể xếp thành bộ câu hỏi. (Hiện có: ${validItems.length}/4 item)`;
            }
        }
        renderAdminQuizPacksList();
    }
}

function updateAdminItemImageUrl(itemId, val) {
    if (!activeAdminPackId) return;
    const pack = adminQuizPacksWorkingCopy.find(p => p.id === activeAdminPackId);
    if (!pack || !pack.items) return;

    const item = pack.items.find(it => it.id === itemId);
    if (item) {
        item.imageUrl = val.trim();
        const thumb = document.getElementById(`thumb-preview-${itemId}`);
        if (thumb) thumb.src = item.imageUrl || '/assets/images/background-chat.jpeg';

        const validItems = pack.items.filter(it => it && it.name && it.name.trim() && it.imageUrl && it.imageUrl.trim());
        const isComplete = validItems.length >= 4;

        const banner = document.getElementById('admin-pack-status-banner');
        if (banner) {
            if (isComplete) {
                banner.style.background = 'rgba(81, 207, 102, 0.2)';
                banner.style.color = '#51cf66';
                banner.style.border = '1px solid rgba(81, 207, 102, 0.4)';
                banner.innerHTML = `✅ BỘ CÂU HỎI ĐỦ ĐIỀU KIỆN! Có ${validItems.length} item hợp lệ (đầy đủ tên & ảnh).`;
            } else {
                banner.style.background = 'rgba(255, 71, 87, 0.2)';
                banner.style.color = '#ff4757';
                banner.style.border = '1px solid rgba(255, 71, 87, 0.4)';
                banner.innerHTML = `⚠️ CHƯA ĐỦ ĐIỀU KIỆN! Cần ít nhất 4 item có đầy đủ TÊN và ẢNH để có thể xếp thành bộ câu hỏi. (Hiện có: ${validItems.length}/4 item)`;
            }
        }
        renderAdminQuizPacksList();
    }
}

function handleAdminItemFileUpload(event, itemId) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        updateAdminItemImageUrl(itemId, e.target.result);
    };
    reader.readAsDataURL(file);
}

function saveQuizAdminPacks() {
    if (myRole !== 'admin') {
        return alert('Chỉ Admin mới có quyền thực hiện thao tác này!');
    }

    socket.emit('adminSaveQuizPacks', adminQuizPacksWorkingCopy, (response) => {
        if (response && response.success) {
            currentQuizPacks = response.packs;
            closeQuizAdminModal();
            renderQuizPacksLobby();
            if (typeof showToastNotification === 'function') {
                showToastNotification('🎉 Đã lưu thành công kho bộ câu hỏi!');
            } else {
                alert('🎉 Đã lưu thành công kho bộ câu hỏi!');
            }
        } else {
            alert((response && response.message) || 'Lỗi khi lưu kho bộ câu hỏi!');
        }
    });
}

// ========================================================
// --- MESSENGER & FRIEND SYSTEM (1-ON-1 CHAT) ---
// ========================================================

let messengerActiveFriend = null;
let messengerConversations = [];
let messengerFriends = [];
let messengerPendingRequests = [];
let messengerSentRequests = [];
let messengerOnlineUserIds = new Set();
let messengerCurrentSubTab = 'chats';
let messengerFilterQuery = '';
let messengerTypingTimeout = null;
let messengerIsTyping = false;
let messengerTotalUnread = 0;
let messengerSearchDebounce = null;
let messengerHistoryCache = new Map();

function initMessenger() {
    const uid = currentUserId || localStorage.getItem('musiclive_user_id');
    if (!uid) return;
    if (typeof socket !== 'undefined' && socket.connected) {
        socket.emit('messenger:init', { userId: uid });
    }
}

function openMessengerTab() {
    const uid = currentUserId || localStorage.getItem('musiclive_user_id');
    if (!uid) {
        const listEl = document.getElementById('messenger-list-container');
        if (listEl) {
            listEl.innerHTML = `
                <div style="text-align: center; color: var(--text-muted); padding: 40px 16px; font-size: 13.5px;">
                    <span class="material-symbols-outlined" style="font-size: 46px; color: var(--accent); display: block; margin-bottom: 10px;">lock</span>
                    <div style="color: #fff; font-size: 15px; font-weight: 700; margin-bottom: 6px;">Cần đăng nhập tài khoản</div>
                    <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 16px; line-height: 1.4;">Vui lòng đăng nhập để kết bạn và trò chuyện 1-1.</p>
                    <button type="button" class="messenger-primary-pill-btn" onclick="openLoginOverlayModal()">Đăng nhập ngay</button>
                </div>
            `;
        }
        return;
    }
    initMessenger();
}

function handleMessengerInitResult(data) {
    if (!data) return;
    messengerFriends = data.friends || [];
    messengerPendingRequests = data.pendingRequests || [];
    messengerSentRequests = data.sentRequests || [];
    messengerConversations = data.conversations || [];
    messengerOnlineUserIds = new Set((data.onlineUserIds || []).map(String));

    messengerFriends.forEach(f => {
        f.online = messengerOnlineUserIds.has(String(f.id));
    });
    messengerConversations.forEach(c => {
        if (c.friend) c.friend.online = messengerOnlineUserIds.has(String(c.friend.id));
    });

    updateMessengerBadges();
    renderMessengerList();

    if (messengerActiveFriend) {
        const updatedFriend = messengerFriends.find(f => String(f.id) === String(messengerActiveFriend.id)) ||
            (messengerConversations.find(c => c.friend && String(c.friend.id) === String(messengerActiveFriend.id))?.friend);
        if (updatedFriend) {
            messengerActiveFriend = updatedFriend;
            updateMessengerChatHeader();
        }
    }
}

function updateMessengerBadges() {
    messengerTotalUnread = messengerConversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
    const navBadge = document.getElementById('navbar-messenger-badge');
    const sideBadge = document.getElementById('sidebar-messenger-badge');
    const reqBadge = document.getElementById('messenger-requests-badge');
    const friendBadge = document.getElementById('messenger-friends-badge');

    if (navBadge) {
        if (messengerTotalUnread > 0) {
            navBadge.classList.remove('hidden');
            navBadge.textContent = messengerTotalUnread > 99 ? '99+' : messengerTotalUnread;
        } else {
            navBadge.classList.add('hidden');
        }
    }

    if (sideBadge) {
        if (messengerTotalUnread > 0) {
            sideBadge.classList.remove('hidden');
            sideBadge.textContent = messengerTotalUnread > 99 ? '99+' : messengerTotalUnread;
        } else {
            sideBadge.classList.add('hidden');
        }
    }

    if (reqBadge) {
        const count = messengerPendingRequests.length;
        if (count > 0) {
            reqBadge.classList.remove('hidden');
            reqBadge.textContent = count;
        } else {
            reqBadge.classList.add('hidden');
        }
    }

    if (friendBadge) {
        const fCount = messengerFriends.length;
        if (fCount > 0) {
            friendBadge.classList.remove('hidden');
            friendBadge.textContent = fCount;
        } else {
            friendBadge.classList.add('hidden');
        }
    }
}

function switchMessengerTab(subtab) {
    messengerCurrentSubTab = subtab;
    document.querySelectorAll('.messenger-tab-btn').forEach(btn => {
        if (btn.getAttribute('data-subtab') === subtab) btn.classList.add('active');
        else btn.classList.remove('active');
    });
    renderMessengerList();
}

function handleMessengerFilter(val) {
    messengerFilterQuery = (val || '').trim().toLowerCase();
    renderMessengerList();
}

function formatMessengerTime(isoString) {
    if (!isoString) return '';
    try {
        const d = new Date(isoString);
        const now = new Date();
        const diffMs = now - d;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays === 1) {
            return 'Hôm qua';
        } else if (diffDays < 7) {
            const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
            return days[d.getDay()];
        } else {
            return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
        }
    } catch (e) {
        return '';
    }
}

function formatMessengerDateDivider(isoString) {
    if (!isoString) return '';
    try {
        const d = new Date(isoString);
        const now = new Date();
        const diffMs = now - d;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Hôm nay';
        if (diffDays === 1) return 'Hôm qua';
        return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch (e) {
        return '';
    }
}

function renderMessengerList() {
    const listEl = document.getElementById('messenger-list-container');
    if (!listEl) return;

    const defaultAvatarSvg = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'><rect width='48' height='48' rx='24' fill='%232a2034'/><text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' fill='%23ff75a0' font-size='18' font-weight='bold'>👤</text></svg>";

    if (messengerCurrentSubTab === 'chats') {
        let list = messengerConversations;
        if (messengerFilterQuery) {
            list = list.filter(c => {
                const f = c.friend;
                if (!f) return false;
                const name = (f.displayName || f.username || '').toLowerCase();
                return name.includes(messengerFilterQuery);
            });
        }

        if (list.length === 0) {
            listEl.innerHTML = `
                <div style="text-align: center; color: var(--text-muted); padding: 40px 16px; font-size: 13.5px;">
                    <span class="material-symbols-outlined" style="font-size: 38px; color: rgba(255,255,255,0.2); display: block; margin-bottom: 8px;">forum</span>
                    ${messengerFilterQuery ? 'Không tìm thấy đoạn chat phù hợp' : 'Chưa có đoạn chat nào.<br>Hãy bấm "+ Thêm bạn" để kết nối trò chuyện!'}
                </div>
            `;
            return;
        }

        listEl.innerHTML = list.map(c => {
            const f = c.friend;
            if (!f) return '';
            const isActive = messengerActiveFriend && String(messengerActiveFriend.id) === String(f.id);
            const isOnline = messengerOnlineUserIds.has(String(f.id));
            const avatarSrc = f.avatarUrl || defaultAvatarSvg;
            const timeStr = formatMessengerTime(c.updatedAt);
            const isUnread = (c.unreadCount || 0) > 0;

            let snippetText = 'Đã kết nối bạn bè';
            if (c.lastMessage) {
                const myUid = currentUserId || localStorage.getItem('musiclive_user_id');
                const isMe = String(c.lastMessage.senderId) === String(myUid);
                const prefix = isMe ? 'Bạn: ' : '';
                if (c.lastMessage.mediaType === 'image') {
                    snippetText = prefix + '📷 [Hình ảnh]';
                } else if (c.lastMessage.mediaType === 'voice') {
                    snippetText = prefix + '🎤 [Tin nhắn thoại]';
                } else {
                    snippetText = prefix + (c.lastMessage.text || 'Đã gửi một tệp');
                }
            }

            const isAdm = isUserAdmin(f);
            const badgeHtml = isAdm ? getTikTokVerifiedBadgeHtml() : '';
            const cleanName = escapeHtml((f.displayName || f.username || '').replace(' 😎', '').trim());

            return `
                <div class="messenger-convo-item ${isActive ? 'active' : ''} ${isUnread ? 'unread' : ''}" onclick="selectMessengerConversation('${f.id}')">
                    <div class="messenger-avatar-wrap">
                        <img src="${avatarSrc}" alt="avatar" class="messenger-avatar-img" onerror="this.onerror=null; this.src='${defaultAvatarSvg}';">
                        <span class="messenger-online-dot ${isOnline ? 'online' : ''}"></span>
                    </div>
                    <div class="messenger-convo-info">
                        <div class="messenger-convo-name-row">
                            <div class="messenger-convo-name" style="color: ${f.nameColor || '#ffffff'};">${cleanName}${badgeHtml}</div>
                            <div class="messenger-convo-time">${timeStr}</div>
                        </div>
                        <div class="messenger-convo-msg-row">
                            <div class="messenger-convo-snippet">${escapeHtml(snippetText)}</div>
                            ${isUnread ? '<span class="messenger-unread-dot"></span>' : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

    } else if (messengerCurrentSubTab === 'friends') {
        let list = messengerFriends;
        if (messengerFilterQuery) {
            list = list.filter(f => {
                const name = (f.displayName || f.username || '').toLowerCase();
                return name.includes(messengerFilterQuery);
            });
        }

        if (list.length === 0) {
            listEl.innerHTML = `
                <div style="text-align: center; color: var(--text-muted); padding: 40px 16px; font-size: 13.5px;">
                    <span class="material-symbols-outlined" style="font-size: 38px; color: rgba(255,255,255,0.2); display: block; margin-bottom: 8px;">group</span>
                    ${messengerFilterQuery ? 'Không tìm thấy bạn bè phù hợp' : 'Bạn chưa có người bạn nào.<br>Bấm nút "+ Thêm bạn" phía trên để tìm kiếm!'}
                </div>
            `;
            return;
        }

        listEl.innerHTML = list.map(f => {
            const isOnline = messengerOnlineUserIds.has(String(f.id));
            const avatarSrc = f.avatarUrl || defaultAvatarSvg;
            const isAdm = isUserAdmin(f);
            const badgeHtml = isAdm ? getTikTokVerifiedBadgeHtml() : '';
            const cleanName = escapeHtml((f.displayName || f.username || '').replace(' 😎', '').trim());

            return `
                <div class="messenger-friend-item" onclick="selectMessengerConversation('${f.id}')">
                    <div class="messenger-avatar-wrap">
                        <img src="${avatarSrc}" alt="avatar" class="messenger-avatar-img" onerror="this.onerror=null; this.src='${defaultAvatarSvg}';">
                        <span class="messenger-online-dot ${isOnline ? 'online' : ''}"></span>
                    </div>
                    <div class="messenger-convo-info">
                        <div class="messenger-convo-name" style="color: ${f.nameColor || '#ffffff'};">${cleanName}${badgeHtml}</div>
                        <div class="messenger-convo-snippet" style="color: ${isOnline ? '#2ed573' : 'var(--text-muted)'}; font-weight: ${isOnline ? '600' : '400'};">
                            ${isOnline ? '● Đang hoạt động' : 'Ngoại tuyến'}
                        </div>
                    </div>
                    <div class="messenger-req-actions">
                        <button type="button" class="messenger-action-icon-btn" onclick="event.stopPropagation(); selectMessengerConversation('${f.id}')" title="Nhắn tin">
                            <span class="material-symbols-outlined" style="font-size: 18px; color: #0084ff;">chat</span>
                        </button>
                        <button type="button" class="messenger-action-icon-btn" onclick="event.stopPropagation(); confirmUnfriend('${f.id}', '${escapeHtml(f.displayName || f.username)}')" title="Hủy kết bạn">
                            <span class="material-symbols-outlined" style="font-size: 18px; color: #ff6b6b;">person_remove</span>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

    } else if (messengerCurrentSubTab === 'requests') {
        const list = messengerPendingRequests;
        if (list.length === 0) {
            listEl.innerHTML = `
                <div style="text-align: center; color: var(--text-muted); padding: 40px 16px; font-size: 13.5px;">
                    <span class="material-symbols-outlined" style="font-size: 38px; color: rgba(255,255,255,0.2); display: block; margin-bottom: 8px;">person_add</span>
                    Không có lời mời kết bạn nào.
                </div>
            `;
            return;
        }

        listEl.innerHTML = list.map(req => {
            const sender = req.sender || {};
            const avatarSrc = sender.avatarUrl || defaultAvatarSvg;
            const timeStr = formatMessengerTime(req.createdAt);
            const isAdm = isUserAdmin(sender);
            const badgeHtml = isAdm ? getTikTokVerifiedBadgeHtml() : '';
            const cleanName = escapeHtml((sender.displayName || sender.username || 'Người dùng').replace(' 😎', '').trim());

            return `
                <div class="messenger-request-item">
                    <div class="messenger-avatar-wrap">
                        <img src="${avatarSrc}" alt="avatar" class="messenger-avatar-img" onerror="this.onerror=null; this.src='${defaultAvatarSvg}';">
                    </div>
                    <div class="messenger-convo-info">
                        <div class="messenger-convo-name">${cleanName}${badgeHtml}</div>
                        <div class="messenger-convo-snippet">Đã gửi lời mời • ${timeStr}</div>
                    </div>
                    <div class="messenger-req-actions">
                        <button type="button" class="messenger-req-btn-accept" onclick="respondFriendRequest('${req.friendshipId}', 'accept')">
                            <span class="material-symbols-outlined" style="font-size: 15px;">check</span> Chấp nhận
                        </button>
                        <button type="button" class="messenger-req-btn-decline" onclick="respondFriendRequest('${req.friendshipId}', 'decline')">
                            Từ chối
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }
}

function selectMessengerConversation(friendId, fallbackUser = null) {
    let friend = (typeof friendId === 'object' && friendId !== null) ? friendId : null;
    const fIdStr = friend ? String(friend.id) : String(friendId);

    if (!friend) {
        friend = messengerFriends.find(f => String(f.id) === fIdStr);
    }
    if (!friend) {
        const convo = messengerConversations.find(c => c.friend && String(c.friend.id) === fIdStr);
        if (convo) friend = convo.friend;
    }
    if (!friend && fallbackUser) {
        friend = fallbackUser;
    }
    if (!friend && typeof messengerSearchUserCache !== 'undefined' && messengerSearchUserCache.has(fIdStr)) {
        friend = messengerSearchUserCache.get(fIdStr);
    }

    if (!friend) return;

    // Ensure friend is present in messengerFriends so UI list has it
    if (!messengerFriends.some(f => String(f.id) === String(friend.id))) {
        messengerFriends.unshift(friend);
    }
    // Ensure an entry in messengerConversations so chat list shows this conversation
    if (!messengerConversations.some(c => c.friend && String(c.friend.id) === String(friend.id))) {
        messengerConversations.unshift({
            friend: friend,
            unreadCount: 0,
            updatedAt: new Date().toISOString(),
            lastMessage: null
        });
    }

    messengerActiveFriend = friend;

    const container = document.querySelector('.messenger-container');
    if (container) container.classList.add('chat-active');

    const emptyState = document.getElementById('messenger-empty-state');
    const chatBox = document.getElementById('messenger-chat-box');
    if (emptyState) emptyState.classList.add('hidden');
    if (chatBox) chatBox.classList.remove('hidden');

    updateMessengerChatHeader();

    const convo = messengerConversations.find(c => c.friend && String(c.friend.id) === String(friendId));
    if (convo) {
        convo.unreadCount = 0;
        updateMessengerBadges();
    }
    renderMessengerList();

    const uid = currentUserId || localStorage.getItem('musiclive_user_id');
    if (uid && socket) {
        socket.emit('messenger:markRead', { userId: uid, friendId: friend.id });
    }

    loadMessengerChatHistory(friend.id);

    setTimeout(() => {
        const inp = document.getElementById('messenger-text-input');
        if (inp) inp.focus();
    }, 100);
}

function updateMessengerChatHeader() {
    if (!messengerActiveFriend) return;
    const defaultAvatarSvg = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'><rect width='48' height='48' rx='24' fill='%232a2034'/><text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' fill='%23ff75a0' font-size='18' font-weight='bold'>👤</text></svg>";
    const isOnline = messengerOnlineUserIds.has(String(messengerActiveFriend.id));

    const avatarEl = document.getElementById('messenger-header-avatar');
    const dotEl = document.getElementById('messenger-header-online-dot');
    const nameEl = document.getElementById('messenger-header-name');
    const statusEl = document.getElementById('messenger-header-status');

    if (avatarEl) {
        avatarEl.src = messengerActiveFriend.avatarUrl || defaultAvatarSvg;
        avatarEl.onerror = () => { avatarEl.src = defaultAvatarSvg; };
    }
    if (dotEl) {
        if (isOnline) dotEl.classList.add('online');
        else dotEl.classList.remove('online');
    }
    if (nameEl) {
        const isAdm = isUserAdmin(messengerActiveFriend);
        const badge = isAdm ? getTikTokVerifiedBadgeHtml('badge-header') : '';
        const rawName = messengerActiveFriend.displayName || messengerActiveFriend.username || 'Người dùng';
        const cleanName = escapeHtml(rawName.replace(' 😎', '').trim());
        nameEl.innerHTML = `${cleanName}${badge}`;
        nameEl.style.color = messengerActiveFriend.nameColor || '#ffffff';
    }
    if (statusEl) {
        if (isOnline) {
            statusEl.textContent = '● Đang hoạt động';
            statusEl.classList.add('online');
        } else {
            statusEl.textContent = 'Ngoại tuyến';
            statusEl.classList.remove('online');
        }
    }
}

function closeMessengerMobileChat() {
    const container = document.querySelector('.messenger-container');
    if (container) container.classList.remove('chat-active');
}

function loadMessengerChatHistory(friendId) {
    const messagesArea = document.getElementById('messenger-messages-area');
    if (!messagesArea) return;

    const fIdStr = String(friendId);
    if (messengerHistoryCache.has(fIdStr) && messengerHistoryCache.get(fIdStr).length > 0) {
        renderMessengerMessages(messengerHistoryCache.get(fIdStr));
    } else {
        messagesArea.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 30px; font-size: 13px;">Đang tải tin nhắn...</div>';
    }

    const uid = currentUserId || localStorage.getItem('musiclive_user_id');
    if (!uid || !socket) return;

    socket.emit('messenger:getHistory', { userId: uid, friendId }, (res) => {
        if (res && Array.isArray(res.messages)) {
            const existing = messengerHistoryCache.get(fIdStr) || [];
            const map = new Map();
            for (const m of existing) {
                if (m && m.id) map.set(String(m.id), m);
            }
            for (const m of res.messages) {
                if (m && m.id) map.set(String(m.id), m);
            }
            const merged = Array.from(map.values());
            merged.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

            messengerHistoryCache.set(fIdStr, merged);
            if (messengerActiveFriend && String(messengerActiveFriend.id) === fIdStr) {
                renderMessengerMessages(merged);
            }
        }
    });
}

function renderMessengerMessages(messages) {
    const messagesArea = document.getElementById('messenger-messages-area');
    if (!messagesArea) return;

    if (!messages || messages.length === 0) {
        const defaultAvatarSvg = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'><rect width='48' height='48' rx='24' fill='%232a2034'/><text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' fill='%23ff75a0' font-size='18' font-weight='bold'>👤</text></svg>";
        const isAdm = messengerActiveFriend ? isUserAdmin(messengerActiveFriend) : false;
        const badge = isAdm ? getTikTokVerifiedBadgeHtml() : '';
        const rawFriendName = messengerActiveFriend ? (messengerActiveFriend.displayName || messengerActiveFriend.username) : 'người bạn';
        const cleanFriendName = escapeHtml(rawFriendName.replace(' 😎', '').trim());
        const friendAvatar = messengerActiveFriend?.avatarUrl || defaultAvatarSvg;

        messagesArea.innerHTML = `
            <div style="text-align: center; margin: auto; padding: 40px 16px;">
                <div style="width: 72px; height: 72px; margin: 0 auto 14px auto; border-radius: 50%; overflow: hidden; border: 2px solid rgba(255,180,210,0.3);">
                    <img src="${friendAvatar}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.onerror=null; this.src='${defaultAvatarSvg}';">
                </div>
                <h4 style="margin: 0 0 6px 0; font-size: 17px; color: #fff; display: inline-flex; align-items: center; justify-content: center; gap: 4px;">${cleanFriendName}${badge}</h4>
                <p style="margin: 0; font-size: 13px; color: var(--text-muted);">Các bạn đã kết nối trên Messenger. Hãy gửi lời chào đầu tiên! 👋</p>
            </div>
        `;
        return;
    }

    const defaultAvatarSvg = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'><rect width='48' height='48' rx='24' fill='%232a2034'/><text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' fill='%23ff75a0' font-size='18' font-weight='bold'>👤</text></svg>";
    const uid = currentUserId || localStorage.getItem('musiclive_user_id');
    let html = '';
    let lastDateStr = '';

    for (let i = 0; i < messages.length; i++) {
        const m = messages[i];
        const isMe = String(m.senderId) === String(uid);
        const dateStr = formatMessengerDateDivider(m.createdAt);

        if (dateStr && dateStr !== lastDateStr) {
            html += `<div class="messenger-date-divider">${dateStr}</div>`;
            lastDateStr = dateStr;
        }

        const isNextSameSender = (i < messages.length - 1) && (String(messages[i + 1].senderId) === String(m.senderId));
        const isPrevSameSender = (i > 0) && (String(messages[i - 1].senderId) === String(m.senderId)) && (formatMessengerDateDivider(messages[i - 1].createdAt) === dateStr);

        let clusterClass = '';
        if (isPrevSameSender && isNextSameSender) clusterClass = 'clustered-middle';
        else if (isPrevSameSender && !isNextSameSender) clusterClass = 'clustered-bottom';
        else if (!isPrevSameSender && isNextSameSender) clusterClass = 'clustered-top';

        const timeStr = formatMessengerTime(m.createdAt);
        const msgIdAttr = m.id ? `data-msg-id="${escapeHtml(String(m.id))}"` : '';
        const bubbleHtml = renderMessengerBubbleContent(m);

        if (isMe) {
            const isLastMsg = (i === messages.length - 1);
            const statusHtml = (isLastMsg && m.isRead) ? '<div class="messenger-read-status">Đã xem ✓✓</div>' : '';

            html += `
                <div class="messenger-msg-row me ${clusterClass}" ${msgIdAttr} title="${timeStr}">
                    ${bubbleHtml}
                    ${statusHtml}
                </div>
            `;
        } else {
            const showAvatar = !isNextSameSender;
            const friendAvatar = messengerActiveFriend?.avatarUrl || defaultAvatarSvg;

            html += `
                <div class="messenger-msg-row them ${clusterClass}" ${msgIdAttr} title="${timeStr}">
                    <div class="messenger-bubble-wrapper">
                        ${showAvatar 
                            ? `<img src="${friendAvatar}" alt="avatar" class="messenger-bubble-avatar" onerror="this.onerror=null; this.src='${defaultAvatarSvg}';">` 
                            : '<div class="messenger-bubble-avatar-spacer"></div>'}
                        ${bubbleHtml}
                    </div>
                </div>
            `;
        }
    }

    messagesArea.innerHTML = html;
    messagesArea.scrollTop = messagesArea.scrollHeight;
}

function renderMessengerBubbleContent(m) {
    const isThumbUp = (m.text === '👍' && !m.mediaUrl);
    if (m.mediaType === 'image' || (m.mediaUrl && m.mediaType !== 'voice')) {
        const captionHtml = m.text ? `<div class="messenger-media-caption">${escapeHtml(m.text)}</div>` : '';
        return `
            <div class="messenger-bubble media-bubble">
                <img src="${escapeHtml(m.mediaUrl)}" alt="Hình ảnh" class="messenger-media-img" loading="lazy" onclick="openImageLightbox(this.src)" onload="const ma = document.getElementById('messenger-messages-area'); if(ma) ma.scrollTop = ma.scrollHeight;">
                ${captionHtml}
            </div>
        `;
    } else if (m.mediaType === 'voice') {
        const safeAudioUrl = escapeHtml(m.mediaUrl || '');
        const durationSec = m.duration || 0;
        const durStr = durationSec > 0 ? formatVoiceDuration(durationSec) : '00:00';
        return `
            <div class="messenger-bubble voice-bubble">
                <div class="messenger-voice-player" id="voice-player-${m.id}" data-src="${safeAudioUrl}">
                    <button class="messenger-play-btn" id="voice-play-btn-${m.id}" onclick="togglePlayVoice('${m.id}', '${safeAudioUrl}', ${durationSec}, event)" title="Phát/Tạm dừng">
                        <span class="material-symbols-outlined" style="font-size:18px;">play_arrow</span>
                    </button>
                    <div class="messenger-voice-waveform" onclick="seekVoiceAudio('${m.id}', event)" title="Bấm để chuyển thời gian">
                        <div class="messenger-voice-bars" id="voice-bars-${m.id}">
                            <span style="height: 40%;"></span>
                            <span style="height: 70%;"></span>
                            <span style="height: 45%;"></span>
                            <span style="height: 90%;"></span>
                            <span style="height: 100%;"></span>
                            <span style="height: 60%;"></span>
                            <span style="height: 80%;"></span>
                            <span style="height: 50%;"></span>
                            <span style="height: 95%;"></span>
                            <span style="height: 70%;"></span>
                            <span style="height: 40%;"></span>
                            <span style="height: 65%;"></span>
                        </div>
                    </div>
                    <span class="messenger-voice-time" id="voice-duration-${m.id}">${durStr}</span>
                </div>
            </div>
        `;
    } else {
        return `
            <div class="messenger-bubble ${isThumbUp ? 'thumb-up' : ''}">
                ${isThumbUp ? '👍' : escapeHtml(m.text || '')}
            </div>
        `;
    }
}

function appendMessengerMessage(msg) {
    const messagesArea = document.getElementById('messenger-messages-area');
    if (!messagesArea || !messengerActiveFriend || !msg) return;

    if (msg.id && messagesArea.querySelector(`[data-msg-id="${msg.id}"]`)) {
        return;
    }

    const emptyNotice = messagesArea.querySelector('h4, p');
    if (emptyNotice && !messagesArea.querySelector('.messenger-msg-row')) {
        messagesArea.innerHTML = '';
    }

    // Remove any existing "Đã xem" indicator so only the very latest message can show it
    const existingStatuses = messagesArea.querySelectorAll('.messenger-read-status');
    existingStatuses.forEach(el => el.remove());

    const uid = currentUserId || localStorage.getItem('musiclive_user_id');
    const isMe = String(msg.senderId) === String(uid);
    const defaultAvatarSvg = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'><rect width='48' height='48' rx='24' fill='%232a2034'/><text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' fill='%23ff75a0' font-size='18' font-weight='bold'>👤</text></svg>";
    const timeStr = formatMessengerTime(msg.createdAt);

    const fIdStr = String(messengerActiveFriend.id);
    if (messengerHistoryCache.has(fIdStr)) {
        const arr = messengerHistoryCache.get(fIdStr);
        if (!arr.some(m => String(m.id) === String(msg.id))) {
            arr.push(msg);
        }
    } else {
        messengerHistoryCache.set(fIdStr, [msg]);
    }

    let msgRow = document.createElement('div');
    if (msg.id) {
        msgRow.setAttribute('data-msg-id', String(msg.id));
    }
    const bubbleHtml = renderMessengerBubbleContent(msg);

    if (isMe) {
        msgRow.className = 'messenger-msg-row me';
        msgRow.title = timeStr;
        msgRow.innerHTML = bubbleHtml;
    } else {
        msgRow.className = 'messenger-msg-row them';
        msgRow.title = timeStr;
        const friendAvatar = messengerActiveFriend.avatarUrl || defaultAvatarSvg;
        msgRow.innerHTML = `
            <div class="messenger-bubble-wrapper">
                <img src="${friendAvatar}" alt="avatar" class="messenger-bubble-avatar" onerror="this.onerror=null; this.src='${defaultAvatarSvg}';">
                ${bubbleHtml}
            </div>
        `;
    }

    messagesArea.appendChild(msgRow);
    messagesArea.scrollTop = messagesArea.scrollHeight;
}

function sendMessengerMessage() {
    const uid = currentUserId || localStorage.getItem('musiclive_user_id');
    if (!uid || !messengerActiveFriend || !socket) return;

    const input = document.getElementById('messenger-text-input');
    if (!input) return;

    let text = input.value.trim();
    if (!text) {
        text = '👍';
    }

    input.value = '';
    input.style.height = 'auto';
    const sendIcon = document.getElementById('messenger-send-icon');
    if (sendIcon) sendIcon.innerText = 'thumb_up';

    if (messengerIsTyping) {
        messengerIsTyping = false;
        socket.emit('messenger:typing', { senderId: uid, receiverId: messengerActiveFriend.id, isTyping: false });
    }

    socket.emit('messenger:sendMessage', {
        senderId: uid,
        receiverId: messengerActiveFriend.id,
        text: text
    }, (res) => {
        if (res && res.success && res.message) {
            appendMessengerMessage(res.message);
            updateConversationLatestMessage(messengerActiveFriend.id, res.message);
        }
    });
}

function updateConversationLatestMessage(friendId, message) {
    let convo = messengerConversations.find(c => c.friend && String(c.friend.id) === String(friendId));
    if (!convo) {
        const friend = messengerFriends.find(f => String(f.id) === String(friendId)) || messengerActiveFriend;
        if (friend) {
            convo = {
                friend: friend,
                lastMessage: message,
                unreadCount: 0,
                updatedAt: message.createdAt
            };
            messengerConversations.unshift(convo);
        }
    } else {
        convo.lastMessage = message;
        convo.updatedAt = message.createdAt;
        messengerConversations = messengerConversations.filter(c => c !== convo);
        messengerConversations.unshift(convo);
    }
    renderMessengerList();
}

function handleMessengerInputTyping(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 100) + 'px';

    const text = textarea.value.trim();
    const sendIcon = document.getElementById('messenger-send-icon');
    if (sendIcon) {
        sendIcon.innerText = text.length > 0 ? 'send' : 'thumb_up';
    }

    const uid = currentUserId || localStorage.getItem('musiclive_user_id');
    if (!uid || !messengerActiveFriend || !socket) return;

    if (!messengerIsTyping && text.length > 0) {
        messengerIsTyping = true;
        socket.emit('messenger:typing', { senderId: uid, receiverId: messengerActiveFriend.id, isTyping: true });
    }

    clearTimeout(messengerTypingTimeout);
    messengerTypingTimeout = setTimeout(() => {
        messengerIsTyping = false;
        if (messengerActiveFriend && socket) {
            socket.emit('messenger:typing', { senderId: uid, receiverId: messengerActiveFriend.id, isTyping: false });
        }
    }, 2500);
}

function handleMessengerInputKey(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessengerMessage();
    }
}

const MESSENGER_EMOJI_CATEGORIES = {
    smileys: {
        name: 'Mặt cười & Cảm xúc',
        emojis: [
            '😀','😃','😄','😁','😆','😅','🤣','😂','🙂','🙃','😉','😊','😇','🥰','😍','🤩',
            '😘','😗','😚','😙','😋','😛','😜','🤪','😝','🤑','🤗','🤭','🤫','🤔','🤐','🤨',
            '😐','😑','😶','😏','😒','🙄','😬','🤥','😌','😔','😪','🤤','😴','😷','🤒','🤕',
            '🤢','🤮','🤧','🥵','🥶','🥴','😵','🤯','🤠','🥳','😎','🤓','🧐','😕','😟','🙁',
            '😮','😯','😲','😳','🥺','😦','😧','😨','😰','😥','😢','😭','😱','😖','😣','😞',
            '😓','😩','😫','🥱','😤','😡','😠','🤬','😈','👿','💀','☠️','💩','🤡','👻','👽','🤖'
        ]
    },
    gestures: {
        name: 'Bàn tay & Cử chỉ',
        emojis: [
            '👍','👎','👊','✊','🤛','🤜','👏','🙌','👐','🤲','🤝','🙏','✌️','🤞','🤟','🤘',
            '🤙','👈','👉','👆','👇','☝️','✋','🤚','🖐️','🖖','👋','💅','🤳','💪','🦵',
            '🦶','👂','👃','👀','👁️','👅','👄','💋'
        ]
    },
    hearts: {
        name: 'Trái tim & Tình cảm',
        emojis: [
            '❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❣️','💕','💞','💓','💗','💖',
            '💘','💝','💟','💌','🫀','💑','💐','🌹','🥀','🌺','🌷','🌸','🌼','🌻','✨','🌟',
            '💫','⭐'
        ]
    },
    party: {
        name: 'Tiệc tùng & Giải trí',
        emojis: [
            '🎉','🎊','🎈','🎂','🎁','🎇','🎆','🧨','💥','💯','🔥','🏆','🥇','🥈','🥉','👑',
            '🎯','🎮','🎲','🎵','🎶','🎤','🎧','🎸','🎹','🎬','🎨','⚽','🏀','🏈','⚾','🎾','🎱'
        ]
    },
    animals: {
        name: 'Động vật & Thiên nhiên',
        emojis: [
            '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🐔',
            '🐧','🐦','🐤','🦆','🦅','🦉','🦇','🐺','🦄','🐝','🐛','🦋','🐌','🐞','🌞','🌙',
            '⛅','🌈','⚡','❄️','⛄'
        ]
    },
    food: {
        name: 'Đồ ăn & Thức uống',
        emojis: [
            '🍏','🍎','🍐','🍊','🍋','🍌','🍉','🍇','🍓','🫐','🍒','🍑','🥭','🍍','🥥','🥑',
            '🍕','🍔','🍟','🌭','🍿','🥓','🍳','🥞','🧇','🧀','🥗','🍜','🍣','🍦','🍧','🍨',
            '🍩','🍪','🎂','🍰','🍫','☕','🧋','🍵','🍺','🍻','🥂','🍷','🍾'
        ]
    }
};

function initMessengerEmojiPicker() {
    const bodyEl = document.getElementById('messenger-emoji-body');
    if (!bodyEl || bodyEl.dataset.initialized === 'true') return;

    let html = '';
    for (const [catKey, catData] of Object.entries(MESSENGER_EMOJI_CATEGORIES)) {
        html += `<div class="messenger-emoji-category-title" id="emoji-cat-${catKey}">${catData.name}</div>`;
        html += '<div class="messenger-emoji-grid">';
        for (const emoji of catData.emojis) {
            html += `<span onclick="insertMessengerEmoji('${emoji}')" title="${emoji}">${emoji}</span>`;
        }
        html += '</div>';
    }
    bodyEl.innerHTML = html;
    bodyEl.dataset.initialized = 'true';
}

function switchMessengerEmojiCategory(catKey) {
    initMessengerEmojiPicker();
    document.querySelectorAll('.messenger-emoji-tab').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.cat === catKey);
    });
    const target = document.getElementById('emoji-cat-' + catKey);
    if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function toggleMessengerEmojiPicker(event) {
    if (event) event.stopPropagation();
    const picker = document.getElementById('messenger-emoji-picker');
    if (!picker) return;
    const isOpening = picker.classList.contains('hidden');
    if (isOpening) {
        initMessengerEmojiPicker();
        picker.classList.remove('hidden');
    } else {
        picker.classList.add('hidden');
    }
}

function insertMessengerEmoji(emoji) {
    const input = document.getElementById('messenger-text-input');
    if (!input) return;

    const start = input.selectionStart;
    const end = input.selectionEnd;
    const val = input.value;
    if (typeof start === 'number' && typeof end === 'number') {
        input.value = val.substring(0, start) + emoji + val.substring(end);
        input.selectionStart = input.selectionEnd = start + emoji.length;
    } else {
        input.value += emoji;
    }

    input.focus();
    handleMessengerInputTyping(input);
}

function triggerMessengerImageSelect() {
    const input = document.getElementById('messenger-image-file-input');
    if (input) input.click();
}

async function handleMessengerImageSelect(event) {
    const originalFile = event.target.files && event.target.files[0];
    if (!originalFile) return;
    event.target.value = '';

    const uid = currentUserId || localStorage.getItem('musiclive_user_id');
    if (!uid || !messengerActiveFriend || !socket) return;

    if (!originalFile.type.startsWith('image/')) {
        alert('Vui lòng chọn tệp hình ảnh!');
        return;
    }

    const imgBtn = document.getElementById('btn-messenger-image');
    const originalBtnHtml = imgBtn ? imgBtn.innerHTML : '';
    if (imgBtn) {
        imgBtn.innerHTML = '<span class="material-symbols-outlined spin" style="font-size:20px;">sync</span>';
        imgBtn.disabled = true;
    }

    try {
        const file = await compressImage(originalFile);
        const fileExt = file.name ? file.name.split('.').pop() : 'jpg';
        const fileName = `img_dm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        let publicUrl = '';

        if (typeof supabase !== 'undefined' && supabase.createClient) {
            try {
                const supabaseStorage = supabase.createClient('https://wnioetdrphkdylkoybsu.supabase.co', 'sb_publishable_p0VSduH3epzQVUdvAf2kPQ_aoWk_l1T');
                const { data, error } = await supabaseStorage.storage.from('chat_media').upload(fileName, file, {
                    contentType: file.type,
                    upsert: false
                });
                if (!error && data) {
                    const { data: urlData } = supabaseStorage.storage.from('chat_media').getPublicUrl(fileName);
                    publicUrl = urlData ? urlData.publicUrl : '';
                }
            } catch (e) { }
        }

        if (!publicUrl) {
            publicUrl = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        }

        socket.emit('messenger:sendMessage', {
            senderId: uid,
            receiverId: messengerActiveFriend.id,
            text: '',
            mediaUrl: publicUrl,
            mediaType: 'image'
        }, (res) => {
            if (res && res.success && res.message) {
                appendMessengerMessage(res.message);
                updateConversationLatestMessage(messengerActiveFriend.id, res.message);
            }
        });
    } catch (err) {
        console.error('Lỗi khi gửi ảnh qua Messenger:', err);
        alert('Không thể gửi ảnh! Vui lòng thử lại.');
    } finally {
        if (imgBtn) {
            imgBtn.innerHTML = originalBtnHtml;
            imgBtn.disabled = false;
        }
    }
}

let messengerMediaRecorder = null;
let messengerAudioChunks = [];
let messengerVoiceStream = null;
let messengerVoiceTimerInterval = null;
let messengerVoiceSeconds = 0;

async function startMessengerVoiceRecording() {
    const uid = currentUserId || localStorage.getItem('musiclive_user_id');
    if (!uid || !messengerActiveFriend || !socket) return;

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        messengerVoiceStream = stream;
        messengerAudioChunks = [];

        let options = { audioBitsPerSecond: 128000 };
        if (typeof MediaRecorder !== 'undefined') {
            if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
                options.mimeType = 'audio/webm;codecs=opus';
            } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
                options.mimeType = 'audio/ogg;codecs=opus';
            } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
                options.mimeType = 'audio/mp4';
            }
        }

        messengerMediaRecorder = new MediaRecorder(stream, options);
        messengerMediaRecorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) {
                messengerAudioChunks.push(e.data);
            }
        };

        messengerMediaRecorder.start(100);
        messengerVoiceSeconds = 0;

        const inputWrap = document.getElementById('messenger-input-wrap');
        const voiceBar = document.getElementById('messenger-voice-bar');
        const sendBtn = document.getElementById('btn-messenger-send');
        const timerEl = document.getElementById('messenger-voice-timer');

        if (inputWrap) inputWrap.classList.add('hidden');
        if (voiceBar) voiceBar.classList.remove('hidden');
        if (sendBtn) sendBtn.classList.add('hidden');
        if (timerEl) timerEl.innerText = '00:00';

        if (messengerVoiceTimerInterval) clearInterval(messengerVoiceTimerInterval);
        messengerVoiceTimerInterval = setInterval(() => {
            messengerVoiceSeconds++;
            if (timerEl) timerEl.innerText = formatVoiceDuration(messengerVoiceSeconds);
            if (messengerVoiceSeconds >= 120) {
                finishMessengerVoiceRecording();
            }
        }, 1000);

    } catch (err) {
        console.error('Lỗi micro Messenger:', err);
        alert('Không thể mở micro! Vui lòng cho phép quyền sử dụng micro trên trình duyệt.');
        cleanupMessengerVoiceState();
    }
}

function cleanupMessengerVoiceState() {
    if (messengerVoiceTimerInterval) {
        clearInterval(messengerVoiceTimerInterval);
        messengerVoiceTimerInterval = null;
    }
    if (messengerMediaRecorder && messengerMediaRecorder.state !== 'inactive') {
        try { messengerMediaRecorder.stop(); } catch (e) { }
    }
    if (messengerVoiceStream) {
        messengerVoiceStream.getTracks().forEach(t => t.stop());
        messengerVoiceStream = null;
    }
    messengerMediaRecorder = null;
    messengerAudioChunks = [];
    messengerVoiceSeconds = 0;

    const inputWrap = document.getElementById('messenger-input-wrap');
    const voiceBar = document.getElementById('messenger-voice-bar');
    const sendBtn = document.getElementById('btn-messenger-send');

    if (inputWrap) inputWrap.classList.remove('hidden');
    if (voiceBar) voiceBar.classList.add('hidden');
    if (sendBtn) sendBtn.classList.remove('hidden');
}

function cancelMessengerVoiceRecording() {
    cleanupMessengerVoiceState();
}

async function finishMessengerVoiceRecording() {
    if (!messengerMediaRecorder || messengerMediaRecorder.state === 'inactive') {
        cleanupMessengerVoiceState();
        return;
    }

    const duration = messengerVoiceSeconds;
    if (duration < 1) {
        cleanupMessengerVoiceState();
        return;
    }

    messengerMediaRecorder.onstop = async () => {
        const mimeType = messengerMediaRecorder.mimeType || 'audio/webm';
        const audioBlob = new Blob(messengerAudioChunks, { type: mimeType });
        cleanupMessengerVoiceState();
        await sendMessengerVoiceBlob(audioBlob, duration);
    };

    try {
        messengerMediaRecorder.stop();
    } catch (e) {
        cleanupMessengerVoiceState();
    }
}

async function sendMessengerVoiceBlob(audioBlob, duration) {
    const uid = currentUserId || localStorage.getItem('musiclive_user_id');
    if (!uid || !messengerActiveFriend || !socket) return;

    let publicUrl = '';
    const fileExt = audioBlob.type.includes('mp4') ? 'mp4' : (audioBlob.type.includes('ogg') ? 'ogg' : 'webm');
    const fileName = `voice_dm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

    if (typeof supabase !== 'undefined' && supabase.createClient) {
        try {
            const supabaseStorage = supabase.createClient('https://wnioetdrphkdylkoybsu.supabase.co', 'sb_publishable_p0VSduH3epzQVUdvAf2kPQ_aoWk_l1T');
            const { data, error } = await supabaseStorage.storage.from('chat_media').upload(fileName, audioBlob, {
                contentType: audioBlob.type,
                upsert: false
            });
            if (!error && data) {
                const { data: urlData } = supabaseStorage.storage.from('chat_media').getPublicUrl(fileName);
                publicUrl = urlData ? urlData.publicUrl : '';
            }
        } catch (e) { }
    }

    if (!publicUrl) {
        publicUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(audioBlob);
        });
    }

    socket.emit('messenger:sendMessage', {
        senderId: uid,
        receiverId: messengerActiveFriend.id,
        text: '',
        mediaUrl: publicUrl,
        mediaType: 'voice',
        duration: duration
    }, (res) => {
        if (res && res.success && res.message) {
            appendMessengerMessage(res.message);
            updateConversationLatestMessage(messengerActiveFriend.id, res.message);
        }
    });
}

function toggleMessengerFriendMenu() {
    const menu = document.getElementById('messenger-friend-menu');
    if (menu) menu.classList.toggle('hidden');
}

document.addEventListener('click', (e) => {
    const menu = document.getElementById('messenger-friend-menu');
    const btn = document.getElementById('btn-friend-menu');
    if (menu && !menu.classList.contains('hidden')) {
        if (btn && !btn.contains(e.target) && !menu.contains(e.target)) {
            menu.classList.add('hidden');
        }
    }
    const emojiPicker = document.getElementById('messenger-emoji-picker');
    const emojiBtn = document.getElementById('btn-messenger-emoji');
    if (emojiPicker && !emojiPicker.classList.contains('hidden')) {
        if (!emojiPicker.contains(e.target) && (!emojiBtn || !emojiBtn.contains(e.target))) {
            emojiPicker.classList.add('hidden');
        }
    }
});

function handleUnfriendActiveFriend() {
    if (!messengerActiveFriend) return;
    toggleMessengerFriendMenu();
    confirmUnfriend(messengerActiveFriend.id, messengerActiveFriend.displayName || messengerActiveFriend.username);
}

function confirmUnfriend(friendId, friendName) {
    if (!confirm(`Bạn có chắc chắn muốn hủy kết bạn với [${friendName}] không?`)) return;

    const uid = currentUserId || localStorage.getItem('musiclive_user_id');
    if (!uid || !socket) return;

    socket.emit('messenger:unfriend', { userId: uid, friendId }, (res) => {
        if (res && res.success) {
            messengerFriends = messengerFriends.filter(f => String(f.id) !== String(friendId));
            messengerConversations = messengerConversations.filter(c => c.friend && String(c.friend.id) !== String(friendId));
            if (messengerActiveFriend && String(messengerActiveFriend.id) === String(friendId)) {
                messengerActiveFriend = null;
                const emptyState = document.getElementById('messenger-empty-state');
                const chatBox = document.getElementById('messenger-chat-box');
                if (emptyState) emptyState.classList.remove('hidden');
                if (chatBox) chatBox.classList.add('hidden');
                closeMessengerMobileChat();
            }
            updateMessengerBadges();
            renderMessengerList();
            if (typeof showToastNotification === 'function') {
                showToastNotification(`Đã hủy kết bạn với ${friendName}`);
            }
        }
    });
}

function playMessengerPopSound() {
    if (typeof soundEnabled !== 'undefined' && !soundEnabled) return;
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const now = ctx.currentTime;

        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(587.33, now);
        gain1.gain.setValueAtTime(0.12, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.12);

        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(880, now + 0.08);
        gain2.gain.setValueAtTime(0.15, now + 0.08);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.08);
        osc2.stop(now + 0.25);
    } catch (e) { }
}

let messengerSearchUserCache = new Map();
let messengerLastSearchQuery = '';

function openAddFriendModal() {
    const modal = document.getElementById('add-friend-modal');
    if (!modal) return;
    modal.classList.remove('hidden');
    messengerLastSearchQuery = '';
    const input = document.getElementById('add-friend-search-input');
    if (input) {
        input.value = '';
        input.focus();
    }
    const resultsList = document.getElementById('add-friend-results-list');
    if (resultsList) {
        resultsList.innerHTML = `
            <div style="text-align: center; color: var(--text-muted); padding: 40px 16px; font-size: 13.5px;">
                <span class="material-symbols-outlined" style="font-size: 40px; color: rgba(255,255,255,0.2); display: block; margin-bottom: 8px;">person_search</span>
                Nhập tên hoặc email người dùng để tìm kiếm và kết bạn
            </div>
        `;
    }
}

function closeAddFriendModal() {
    const modal = document.getElementById('add-friend-modal');
    if (modal) modal.classList.add('hidden');
}

function handleSearchUsersToAddFriend(query) {
    const q = (query || '').trim();
    if (q === messengerLastSearchQuery && q !== '') return;
    clearTimeout(messengerSearchDebounce);

    const resultsList = document.getElementById('add-friend-results-list');
    if (!resultsList) return;

    if (!q) {
        messengerLastSearchQuery = '';
        resultsList.innerHTML = `
            <div style="text-align: center; color: var(--text-muted); padding: 40px 16px; font-size: 13.5px;">
                <span class="material-symbols-outlined" style="font-size: 40px; color: rgba(255,255,255,0.2); display: block; margin-bottom: 8px;">person_search</span>
                Nhập tên hoặc email người dùng để tìm kiếm và kết bạn
            </div>
        `;
        return;
    }

    // Keep existing results visible while typing to prevent click target destruction
    if (!resultsList.querySelector('.messenger-friend-item')) {
        resultsList.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 30px; font-size: 13px;"><span class="material-symbols-outlined" style="font-size: 20px; animation: spin 1s linear infinite; vertical-align: middle; margin-right: 6px;">sync</span>Đang tìm kiếm...</div>';
    }

    messengerSearchDebounce = setTimeout(() => {
        messengerLastSearchQuery = q;
        const uid = currentUserId || localStorage.getItem('musiclive_user_id');
        if (!socket) return;
        socket.emit('messenger:searchUsers', { query: q, currentUserId: uid }, (res) => {
            renderSearchUsersResults(res?.results || []);
        });
    }, 300);
}

function openDirectChatFromSearch(targetUserId) {
    const userObj = messengerSearchUserCache.get(String(targetUserId));
    closeAddFriendModal();
    showTab('messenger');
    selectMessengerConversation(targetUserId, userObj);
}

function renderSearchUsersResults(users) {
    const resultsList = document.getElementById('add-friend-results-list');
    if (!resultsList) return;

    if (!users || users.length === 0) {
        resultsList.innerHTML = `
            <div style="text-align: center; color: var(--text-muted); padding: 40px 16px; font-size: 13.5px;">
                <span class="material-symbols-outlined" style="font-size: 38px; color: rgba(255,255,255,0.2); display: block; margin-bottom: 8px;">search_off</span>
                Không tìm thấy người dùng nào phù hợp.
            </div>
        `;
        return;
    }

    const defaultAvatarSvg = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'><rect width='48' height='48' rx='24' fill='%232a2034'/><text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' fill='%23ff75a0' font-size='18' font-weight='bold'>👤</text></svg>";

    users.forEach(u => messengerSearchUserCache.set(String(u.id), u));

    resultsList.innerHTML = users.map(u => {
        const avatarSrc = u.avatarUrl || defaultAvatarSvg;
        let actionBtn = '';
        const isFriend = u.relationship === 'friends';

        if (isFriend) {
            actionBtn = `
                <button type="button" class="messenger-action-icon-btn" style="color: #2ed573; border-color: rgba(46,213,115,0.4);" title="Nhắn tin" onclick="event.stopPropagation(); openDirectChatFromSearch('${u.id}')">
                    <span class="material-symbols-outlined" style="font-size: 18px;">chat</span>
                </button>
            `;
        } else if (u.relationship === 'pending_sent') {
            actionBtn = `
                <button type="button" class="settings-btn-secondary" style="font-size: 12px; padding: 6px 10px; opacity: 0.7; cursor: default;" disabled>
                    <span class="material-symbols-outlined" style="font-size: 14px;">hourglass_empty</span> Đã gửi lời mời
                </button>
            `;
        } else if (u.relationship === 'pending_received') {
            actionBtn = `
                <button type="button" class="messenger-req-btn-accept" onclick="event.stopPropagation(); respondFriendRequest('${u.friendshipId}', 'accept'); closeAddFriendModal();">
                    <span class="material-symbols-outlined" style="font-size: 14px;">check</span> Chấp nhận
                </button>
            `;
        } else {
            actionBtn = `
                <button type="button" class="messenger-primary-pill-btn" style="padding: 6px 14px; font-size: 12.5px;" onclick="event.stopPropagation(); sendFriendRequest('${u.id}', this)">
                    <span class="material-symbols-outlined" style="font-size: 16px;">person_add</span> Kết bạn
                </button>
            `;
        }

        const isAdm = isUserAdmin(u);
        const badgeHtml = isAdm ? getTikTokVerifiedBadgeHtml() : '';
        const rawName = u.displayName || u.username || 'Người dùng';
        const cleanName = escapeHtml(rawName.replace(' 😎', '').trim());

        return `
            <div class="messenger-friend-item" ${rowClickAttr}>
                <div class="messenger-avatar-wrap">
                    <img src="${avatarSrc}" alt="avatar" class="messenger-avatar-img" onerror="this.onerror=null; this.src='${defaultAvatarSvg}';">
                    <span class="messenger-online-dot ${u.online ? 'online' : ''}"></span>
                </div>
                <div class="messenger-convo-info">
                    <div class="messenger-convo-name" style="color: ${u.nameColor || '#ffffff'};">${cleanName}${badgeHtml}</div>
                    <div class="messenger-convo-snippet">@${escapeHtml(u.username || 'user')}</div>
                </div>
                <div>${actionBtn}</div>
            </div>
        `;
    }).join('');
}

function sendFriendRequest(targetUserId, btnEl) {
    const uid = currentUserId || localStorage.getItem('musiclive_user_id');
    if (!uid || !socket) return;

    if (btnEl) {
        btnEl.disabled = true;
        btnEl.innerHTML = '<span class="material-symbols-outlined" style="font-size: 14px;">hourglass_empty</span> Đang gửi...';
    }

    socket.emit('messenger:sendFriendRequest', { senderId: uid, targetUserId }, (res) => {
        if (res && res.success) {
            if (btnEl) {
                btnEl.outerHTML = `
                    <button type="button" class="settings-btn-secondary" style="font-size: 12px; padding: 6px 10px; opacity: 0.7; cursor: default;" disabled>
                        <span class="material-symbols-outlined" style="font-size: 14px;">hourglass_empty</span> Đã gửi lời mời
                    </button>
                `;
            }
            if (res.action === 'accept') {
                if (typeof showToastNotification === 'function') {
                    showToastNotification('🎉 Hai bạn đã chính thức trở thành bạn bè!');
                }
            } else {
                if (typeof showToastNotification === 'function') {
                    showToastNotification('Đã gửi lời mời kết bạn thành công!');
                }
            }
            initMessenger();
        } else {
            alert(res?.error || 'Không thể gửi lời mời kết bạn');
            if (btnEl) btnEl.disabled = false;
        }
    });
}

function respondFriendRequest(friendshipId, action) {
    const uid = currentUserId || localStorage.getItem('musiclive_user_id');
    if (!uid || !socket) return;

    socket.emit('messenger:respondFriendRequest', { friendshipId, action, userId: uid }, (res) => {
        if (res && res.success) {
            if (action === 'accept') {
                if (typeof showToastNotification === 'function') {
                    showToastNotification('🎉 Đã chấp nhận lời mời kết bạn!');
                }
            } else {
                if (typeof showToastNotification === 'function') {
                    showToastNotification('Đã từ chối lời mời kết bạn');
                }
            }
            initMessenger();
        }
    });
}

function registerMessengerSocketListeners() {
    if (!socket) return;

    socket.on('messenger:initResult', handleMessengerInitResult);

    socket.on('messenger:receiveMessage', (msg) => {
        const uid = currentUserId || localStorage.getItem('musiclive_user_id');
        if (!uid) return;

        playMessengerPopSound();

        if (messengerActiveFriend && String(messengerActiveFriend.id) === String(msg.senderId)) {
            appendMessengerMessage(msg);
            socket.emit('messenger:markRead', { userId: uid, friendId: msg.senderId });
            updateConversationLatestMessage(msg.senderId, msg);
        } else {
            let convo = messengerConversations.find(c => c.friend && String(c.friend.id) === String(msg.senderId));
            if (convo) {
                convo.unreadCount = (convo.unreadCount || 0) + 1;
                convo.lastMessage = msg;
                convo.updatedAt = msg.createdAt;
                messengerConversations = messengerConversations.filter(c => c !== convo);
                messengerConversations.unshift(convo);
            } else {
                initMessenger();
            }
            updateMessengerBadges();
            renderMessengerList();
        }
    });

    socket.on('messenger:messageSent', (msg) => {
        const uid = currentUserId || localStorage.getItem('musiclive_user_id');
        if (!uid) return;

        if (messengerActiveFriend && String(messengerActiveFriend.id) === String(msg.receiverId)) {
            appendMessengerMessage(msg);
        }
        updateConversationLatestMessage(msg.receiverId, msg);
    });

    socket.on('messenger:historyResult', (data) => {
        const { friendId, messages } = data || {};
        if (friendId && Array.isArray(messages)) {
            const fIdStr = String(friendId);
            const existing = messengerHistoryCache.get(fIdStr) || [];
            const map = new Map();
            for (const m of existing) {
                if (m && m.id) map.set(String(m.id), m);
            }
            for (const m of messages) {
                if (m && m.id) map.set(String(m.id), m);
            }
            const merged = Array.from(map.values());
            merged.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

            messengerHistoryCache.set(fIdStr, merged);
            if (messengerActiveFriend && String(messengerActiveFriend.id) === fIdStr) {
                renderMessengerMessages(merged);
            }
        }
    });

    socket.on('messenger:messagesRead', (data) => {
        const { readerId } = data || {};
        if (messengerActiveFriend && String(messengerActiveFriend.id) === String(readerId)) {
            const fIdStr = String(messengerActiveFriend.id);
            if (messengerHistoryCache.has(fIdStr)) {
                const arr = messengerHistoryCache.get(fIdStr);
                arr.forEach(m => {
                    if (String(m.receiverId) === fIdStr) m.isRead = true;
                });
            }

            const messagesArea = document.getElementById('messenger-messages-area');
            if (!messagesArea) return;

            // Remove any and all existing "Đã xem" indicators to ensure strictly at most 1
            const existingStatuses = messagesArea.querySelectorAll('.messenger-read-status');
            existingStatuses.forEach(el => el.remove());

            // Only add "Đã xem" if the very last message in the chat is sent by me
            const lastRow = messagesArea.querySelector('.messenger-msg-row:last-child');
            if (lastRow && lastRow.classList.contains('me')) {
                const statusDiv = document.createElement('div');
                statusDiv.className = 'messenger-read-status';
                statusDiv.textContent = 'Đã xem ✓✓';
                lastRow.appendChild(statusDiv);
                messagesArea.scrollTop = messagesArea.scrollHeight;
            }
        }
    });

    socket.on('messenger:userTyping', (data) => {
        const { senderId, isTyping } = data || {};
        if (messengerActiveFriend && String(messengerActiveFriend.id) === String(senderId)) {
            const typingEl = document.getElementById('messenger-typing-indicator');
            const avatarEl = document.getElementById('messenger-typing-avatar');
            if (typingEl) {
                if (isTyping) {
                    if (avatarEl) avatarEl.src = messengerActiveFriend.avatarUrl || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><circle cx='12' cy='12' r='12' fill='%232a2034'/></svg>";
                    typingEl.classList.remove('hidden');
                    const messagesArea = document.getElementById('messenger-messages-area');
                    if (messagesArea) messagesArea.scrollTop = messagesArea.scrollHeight;
                } else {
                    typingEl.classList.add('hidden');
                }
            }
        }
    });

    socket.on('messenger:userOnline', (data) => {
        const { userId, online } = data || {};
        if (!userId) return;
        const sId = String(userId);
        if (online) {
            messengerOnlineUserIds.add(sId);
        } else {
            messengerOnlineUserIds.delete(sId);
        }

        messengerFriends.forEach(f => {
            if (String(f.id) === sId) f.online = online;
        });
        messengerConversations.forEach(c => {
            if (c.friend && String(c.friend.id) === sId) c.friend.online = online;
        });

        if (messengerActiveFriend && String(messengerActiveFriend.id) === sId) {
            messengerActiveFriend.online = online;
            updateMessengerChatHeader();
        }

        renderMessengerList();
    });

    socket.on('messenger:friendRequestReceived', (data) => {
        messengerPendingRequests.unshift(data);
        updateMessengerBadges();
        renderMessengerList();
        playMessengerPopSound();
        if (typeof showToastNotification === 'function') {
            const senderName = data.sender?.displayName || data.sender?.username || 'Người dùng';
            showToastNotification(`🔔 [${senderName}] đã gửi cho bạn một lời mời kết bạn!`);
        }
    });

    socket.on('messenger:friendRequestAccepted', (data) => {
        initMessenger();
        playMessengerPopSound();
        if (typeof showToastNotification === 'function') {
            const fName = data.friend?.displayName || data.friend?.username || 'Bạn bè';
            showToastNotification(`🎉 [${fName}] đã chấp nhận lời mời kết bạn!`);
        }
    });

    socket.on('messenger:friendRequestDeclined', (data) => {
        initMessenger();
    });

    socket.on('messenger:unfriended', (data) => {
        initMessenger();
    });
}

// Automatically register listeners when script loads
if (typeof socket !== 'undefined') {
    registerMessengerSocketListeners();
}