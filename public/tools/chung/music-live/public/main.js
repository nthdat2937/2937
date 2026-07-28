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
socket.on('connect', () => {
    const savedName = localStorage.getItem('musiclive_username');
    if (myRole || savedName) {
        joinRoom();
    }
});
let player;
let isPlayerReady = false;
let isYoutubeApiLoaded = false;
let pendingVideoId = null;
let myRole = '';
let initialVideoId = '';
let myUsername = '';


function toggleSidebar() {
    const sb = document.getElementById('sidebar');
    if (sb) sb.classList.toggle('mini');
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

    if (tab === 'home') {
        // Just home
        miniPlayer.style.transform = '';
    } else {
        document.getElementById('left-column').classList.add('not-home');
        applyMiniPlayerSavedPos();
        if (tab === 'history') {
            document.getElementById('history-column').classList.remove('hidden');
            loadHistory();
        } else if (tab === 'top') {
            document.getElementById('top-column').classList.remove('hidden');
            loadTopNhac();
        } else if (tab === 'feedback') {
            if (fbCol) fbCol.classList.remove('hidden');
            loadFeedbackHistory();
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

async function loadTopNhac() {
    const list = document.getElementById('top-list');
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

let myNameColor = '#3ea6ff';
let isLoopMode = false;

let selectedAdminType = null;

(function restoreSavedUser() {
    const savedName = localStorage.getItem('musiclive_username');
    const savedColor = localStorage.getItem('musiclive_namecolor');
    const savedAdminType = localStorage.getItem('musiclive_admin_type');
    const savedPassword = localStorage.getItem('musiclive_password');

    if (savedName) {
        document.getElementById('username-input').value = savedName;
    }
    if (savedColor) {
        document.getElementById('name-color-input').value = savedColor;
    }

    if (savedAdminType) {
        selectAdmin(savedName);
        if (savedPassword) {
            document.getElementById('password-input').value = savedPassword;
        }
        setTimeout(() => joinRoom(), 300);
    } else if (savedName) {
        setTimeout(() => joinRoom(), 300);
    }
})();


function selectRole(role) {
    document.getElementById('role-buttons-wrapper').classList.add('hidden');
    if (role === 'user') {
        document.getElementById('login-prompt').innerText = 'Nhập thông tin của bạn';
        document.getElementById('user-details-wrapper').classList.remove('hidden');
        document.getElementById('join-btn').classList.remove('hidden');
        document.getElementById('username-input').readOnly = false;
        selectedAdminType = null;
    } else if (role === 'admin') {
        document.getElementById('login-prompt').innerText = 'Xác thực Quản trị viên';
        document.getElementById('admin-list-wrapper').classList.remove('hidden');
    }
}

function selectAdmin(name) {
    document.getElementById('user-details-wrapper').classList.remove('hidden');
    document.getElementById('username-input').value = name;
    document.getElementById('username-input').readOnly = true;

    const pwdInput = document.getElementById('password-input');
    document.getElementById('password-wrapper').classList.remove('hidden');
    document.getElementById('join-btn').classList.remove('hidden');

    if (name === 'nthdat') {
        selectedAdminType = 'main';
        pwdInput.placeholder = 'Nhập mật khẩu admin...';
    } else {
        selectedAdminType = 'sub';
        pwdInput.placeholder = 'Nhập ngày sinh (vd: 01012001)...';
    }
    pwdInput.focus();
}

function checkAdminName(name) {

}

function joinRoom() {
    const name = document.getElementById('username-input').value;
    const password = document.getElementById('password-input').value;
    const nameColor = document.getElementById('name-color-input').value;
    const isAdmin = selectedAdminType !== null;

    if (!name.trim()) {
        alert("Vui lòng nhập tên hiển thị!");
        return;
    }

    myUsername = name.trim();
    myNameColor = nameColor;

    localStorage.setItem('musiclive_username', myUsername);
    localStorage.setItem('musiclive_namecolor', myNameColor);

    if (player && typeof player.playVideo === 'function') {
        player.playVideo();
    }

    socket.emit('joinRoom', { name, isAdmin, password, nameColor });
}

socket.on('authResult', (res) => {
    if (res.success) {
        myRole = res.role;

        if (myRole === 'admin') {
            localStorage.setItem('musiclive_admin_type', selectedAdminType || 'main');
            localStorage.setItem('musiclive_password', document.getElementById('password-input').value);
        } else {
            localStorage.removeItem('musiclive_admin_type');
            localStorage.removeItem('musiclive_password');
        }

        document.getElementById('login-section').classList.add('hidden');
        document.getElementById('main-room').classList.remove('hidden');

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


function logout() {

    localStorage.removeItem('musiclive_username');
    localStorage.removeItem('musiclive_namecolor');
    localStorage.removeItem('musiclive_admin_type');
    localStorage.removeItem('musiclive_password');


    myRole = '';
    myUsername = '';
    myNameColor = '#3ea6ff';

    resetBackgroundsToDefault();


    document.getElementById('main-room').classList.add('hidden');
    document.getElementById('login-section').classList.remove('hidden');
    document.getElementById('navbar-right').classList.add('hidden');
    document.getElementById('navbar-search').classList.add('hidden');
    document.getElementById('menu-btn').classList.add('hidden');


    document.body.classList.remove('admin-mode');
    document.getElementById('btn-next-song').classList.add('hidden');
    document.getElementById('sync-btn').classList.add('hidden');


    document.getElementById('username-input').value = '';
    document.getElementById('name-color-input').value = '#3ea6ff';
    document.getElementById('password-input').value = '';
    document.getElementById('password-wrapper').classList.add('hidden');


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

function updatePinnedMessageUI(msg) {
    const container = document.getElementById('pinned-message-container');
    if (msg) {
        container.classList.remove('hidden');
        document.getElementById('pin-author').innerText = msg.name;
        document.getElementById('pin-text').innerText = msg.text;
        if (myRole === 'admin') document.getElementById('unpin-btn').classList.remove('hidden');
    } else {
        container.classList.add('hidden');
    }
}

socket.on('updatePinnedMessage', updatePinnedMessageUI);

socket.on('messageDeleted', (msgId) => {
    const el = document.getElementById('msg-' + msgId);
    if (el) el.remove();
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
        } catch (e) {}
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
    const isAdminMsg = data.role === 'admin';
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

    // Update previous sibling's grouping for rounded corners
    const prevMsg = chatBox.lastElementChild;
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

    // Reply quote & Author label text
    let replyHtml = '';
    let authorTextHtml = finalName;

    if (data.replyTo) {
        const cleanSender = (data.name || 'Ẩn danh').replace(' 😎', '').trim();
        const cleanTarget = (data.replyTo.name || 'Ẩn danh').replace(' 😎', '').trim();
        const cleanMyName = (myUsername || '').replace(' 😎', '').trim();

        const isSenderMe = isOwn || (cleanMyName && cleanSender.toLowerCase() === cleanMyName.toLowerCase());
        const isTargetMe = cleanMyName && cleanTarget.toLowerCase() === cleanMyName.toLowerCase();
        const isSamePerson = cleanSender.toLowerCase() === cleanTarget.toLowerCase();

        const safeSenderDisplay = isSenderMe ? 'Bạn' : escapeHtml(cleanSender);
        const safeTargetDisplay = isTargetMe ? 'bạn' : escapeHtml(cleanTarget);
        const safeReplyText = escapeHtml(data.replyTo.text || '');

        if (!isSystem) {
            if (isSamePerson) {
                authorTextHtml = `<strong>${safeSenderDisplay}</strong> đã phản hồi chính mình`;
            } else if (isTargetMe) {
                authorTextHtml = `<strong>${safeSenderDisplay}</strong> đã phản hồi <strong>bạn</strong>`;
            } else {
                authorTextHtml = `<strong>${safeSenderDisplay}</strong> đã phản hồi <strong>${safeTargetDisplay}</strong>`;
            }
        }

        replyHtml = `<div class="chat-reply-quote" onclick="document.getElementById('msg-${data.replyTo.id}')?.scrollIntoView({behavior: 'smooth', block: 'center'})">
                    ${safeReplyText}
                </div>`;
    }

    // Avatar (only for other people, first letter of name)
    const avatarInitial = (data.name || '?').charAt(0).toUpperCase();
    const avatarColor = data.nameColor || stringToColor(data.name || '');
    const avatarHtml = isSystem ? '' : `<div class="chat-avatar" style="background:${escapeHtml(avatarColor)}">${avatarInitial}</div>`;

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
        height: '100%', width: '100%', videoId: initialVideoId || 'M7lc1UVf-VE',
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
} catch (err) {}

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
    } catch (e) {}
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
    } catch (e) {}
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
    lyric_bg: ''
};

let pendingWebBg = '';
let pendingChatBg = '';
let pendingLyricBg = '';
let pendingWebBgFile = null;
let pendingChatBgFile = null;
let pendingLyricBgFile = null;

function applyUserBackgrounds(bgObj) {
    if (bgObj) {
        userBgState = {
            web_bg: bgObj.web_bg || '',
            chat_bg: bgObj.chat_bg || '',
            lyric_bg: bgObj.lyric_bg || ''
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
        chatBox.style.backgroundImage = `linear-gradient(rgba(15, 13, 11, 0.45), rgba(15, 13, 11, 0.45)), url('${chatBgUrl}')`;
    }

    // Lyric background
    const lyricBox = document.getElementById('lyric-box');
    if (lyricBox) {
        lyricBox.style.backgroundImage = `linear-gradient(rgba(15, 13, 11, 0.65), rgba(15, 13, 11, 0.65)), url('${lyricBgUrl}')`;
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
        } catch(e) {}
    }

    // 2. Fetch via Socket
    if (socket && socket.connected) {
        socket.emit('getUserBackgrounds', { username: cleanName }, (res) => {
            if (res) {
                const bgData = {
                    web_bg: res.web_bg || '',
                    chat_bg: res.chat_bg || '',
                    lyric_bg: res.lyric_bg || ''
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
                    lyric_bg: data.lyric_bg || ''
                };
                localStorage.setItem(`musiclive_bg_${cleanName}`, JSON.stringify(bgData));
                applyUserBackgrounds(bgData);
            }
        } catch(err) {
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

    modal.classList.remove('hidden');
}

function closeSettingsModal() {
    const modal = document.getElementById('settings-modal');
    if (modal) modal.classList.add('hidden');
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
        box.style.backgroundImage = `url('${pendingChatBg || DEFAULT_CHAT_BG}')`;
    }
}

function handleChatBgFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    pendingChatBgFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
        const box = document.getElementById('preview-chat-bg');
        if (box) box.style.backgroundImage = `url('${e.target.result}')`;
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
    } catch(err) {
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
            lyric_bg: finalLyricBg
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
                        updated_at: new Date().toISOString()
                    }, { onConflict: 'username' });
            } catch(spErr) {
                console.warn('Supabase direct upsert error:', spErr);
            }
        }

        applyUserBackgrounds(newBgState);
        closeSettingsModal();
        
        if (typeof showToastNotification === 'function') {
            showToastNotification('✨ Đã lưu cài đặt hình nền thành công!');
        } else {
            alert('✨ Đã lưu cài đặt hình nền thành công!');
        }

    } catch (err) {
        console.error('Lỗi khi lưu cài đặt hình nền:', err);
        alert('Không thể lưu cài đặt hình nền. Vui lòng thử lại!');
    } finally {
        if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.innerHTML = originalBtnText;
        }
    }
}

function resetBackgroundsToDefault() {
    userBgState = { web_bg: '', chat_bg: '', lyric_bg: '' };
    applyUserBackgrounds(userBgState);
}