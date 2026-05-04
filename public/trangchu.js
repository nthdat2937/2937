const sb = {
            url: "https://ktqdzlhvdkerjajffgfi.supabase.co",
            key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0cWR6bGh2ZGtlcmphamZmZ2ZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2OTgxNTMsImV4cCI6MjA4MzI3NDE1M30.6xz0SVuj6x72VcLZyJpVtNMMWSmyOEtGhmKiVMu46xI"
        };
        const sp = supabase.createClient(sb.url, sb.key);
        let words = [], currentUser = null, isAdmin = false, pendingEntry = null, sTimer = null;

        /* Auth */
        async function checkSession() {
            sp.auth.getSession().then(({ data: { session } }) => updateUser(session?.user || null));
        }
        sp.auth.onAuthStateChange((_event, session) => {
            if (_event === 'INITIAL_SESSION') return;
            updateUser(session?.user || null);
            sp.from('korean_vocab').select('*').order('created_at', { ascending: false }).then(({ data, error }) => {
                if (!error) { words = data || []; refresh(); }
            });
        });

        async function updateUser(user) {
            currentUser = user;
            isAdmin = false;
            let profileData = null;
            if (user) {
                await new Promise(resolve => {
                    // Đã sửa lại đúng tên cột: Streak và "Ngày cuối" (có dấu cách phải bọc ngoặc kép)
                    sp.from('profiles').select('role, display_name, avatar, Streak, "Ngày cuối"').eq('id', user.id).single().then(({ data }) => {
                        isAdmin = data?.role?.toLowerCase() === 'admin';
                        profileData = data;
                        
                        // ── XỬ LÝ LOGIC STREAK (CHUỖI NGÀY HỌC) ──
                        let currentStreak = data?.Streak || 0;
                        let lastDate = data?.['Ngày cuối']; // Dùng ngoặc vuông để gọi tên biến có dấu cách
                        
                        // Lấy ngày chuẩn YYYY-MM-DD
                        const now = new Date();
                        const todayStr = now.toLocaleDateString('en-CA'); 
                        
                        const yesterday = new Date(now);
                        yesterday.setDate(yesterday.getDate() - 1);
                        const yesterdayStr = yesterday.toLocaleDateString('en-CA');
                        
                        // Nếu user đăng nhập vào một ngày mới
                        if (lastDate !== todayStr) {
                            if (lastDate === yesterdayStr) {
                                currentStreak++; // Hôm qua có học -> Cộng dồn chuỗi
                            } else {
                                currentStreak = 1; // Cách quá 1 ngày -> Đứt chuỗi, cày lại
                            }
                            // Bắn bản cập nhật lên Supabase đúng tên cột
                            sp.from('profiles').update({ 'Streak': currentStreak, 'Ngày cuối': todayStr }).eq('id', user.id).then();
                        }
                        
                        // Cập nhật con số lên ngọn lửa trên Topbar
                        const streakValEl = document.getElementById('topbarStreakVal');
                        if (streakValEl) streakValEl.textContent = currentStreak;
                        
                        resolve();
                    }).catch(() => resolve());
                });
            } else {
                // Khách chưa đăng nhập -> Ngọn lửa về 0
                const streakValEl = document.getElementById('topbarStreakVal');
                if (streakValEl) streakValEl.textContent = '0';
            }

            // Phần giao diện user cũ giữ nguyên
            document.body.classList.toggle('is-admin', isAdmin);
            const authSec = document.getElementById('authSection');
            if (user) {
                const displayName = profileData?.display_name || user.user_metadata?.full_name || user.email;
                authSec.innerHTML = `<div class="user-info">
                    <span>${esc(displayName)}</span>
                    ${isAdmin ? '<span class="btn btn-ghost" style="color:var(--txt);background:var(--bg3);padding:8px 18px;border-radius:4px;font-size:13px;border-radius:8px">Admin</span>' : ''}
                    <button class="btn btn-ghost" onclick="handleLogout()" style="padding:8px 18px;font-size:13px">Đăng xuất</button>
                </div>`;
                // Sync sidebar
                if (typeof syncSidebarUser === 'function') syncSidebarUser(displayName, profileData?.avatar || null);
            } else {
                authSec.innerHTML = `<button class="btn btn-ghost" onclick="openLogin()">Đăng nhập</button>`;
                if (typeof syncSidebarUser === 'function') syncSidebarUser(null, null);
            }
            refresh();
        }

        function openLogin() { closeAuthModals(); document.getElementById('loginModal').classList.add('show'); }
        function openSignup() { closeAuthModals(); document.getElementById('signupModal').classList.add('show'); }
        function closeAuthModals() {
            document.getElementById('loginModal').classList.remove('show');
            document.getElementById('signupModal').classList.remove('show');
        }

        async function handleLogin() {
            const email = document.getElementById('lEmail').value;
            const password = document.getElementById('lPass').value;
            const { error } = await sp.auth.signInWithPassword({ email, password });
            if (error) toast('Lỗi đăng nhập: ' + error.message);
            else { toast('Chào mừng trở lại!'); closeAuthModals(); }
        }

        async function handleSignup() {
            const name = document.getElementById('sName').value;
            const email = document.getElementById('sEmail').value;
            const password = document.getElementById('sPass').value;
            if (!name || !email || password.length < 6) { toast('Vui lòng điền đủ thông tin'); return; }
            const { error } = await sp.auth.signUp({
                email, password,
                options: { data: { full_name: name, role: 'user' } }
            });
            if (error) toast('Lỗi đăng ký: ' + error.message);
            else { toast('Đăng ký thành công! Hãy đăng nhập.'); openLogin(); }
        }

        async function handleLogout() {
            await sp.auth.signOut();
            toast('Đã đăng xuất');
        }

        /* Data */
        function loadWords() {
            sp.auth.getSession().then(async ({ data: { session } }) => {
                await updateUser(session?.user || null);
                sp.from('korean_vocab').select('*').order('created_at', { ascending: false }).then(({ data, error }) => {
                    if (error) { console.error(error); loadLocal(); return; }
                    words = data || [];
                    refresh();
                }).catch(e => { console.error(e); loadLocal(); });
            });
        }

        function loadLocal() { try { words = JSON.parse(localStorage.getItem('kv') || '[]'); } catch { words = []; } refresh(); }
        function saveLocal() { try { localStorage.setItem('kv', JSON.stringify(words)); } catch { } }
        function refresh() { renderTable(); updateTopics(); if (document.getElementById('pane-flash').classList.contains('active')) buildFlash(); if (document.getElementById('pane-write').classList.contains('active')) buildWrite(); if (document.getElementById('pane-type').classList.contains('active')) buildType(); if (document.getElementById('pane-speed').classList.contains('active')) buildSpeed(); if (document.getElementById('pane-listen').classList.contains('active')) buildListen(); }

        /* Tabs */
        function updateSoanHeight() {
            const shell = document.querySelector('.shell');
            const topbar = document.querySelector('.topbar');
            const tabs = document.querySelector('.tabs');
            if (!shell || !topbar || !tabs) return;
            const shellStyle = getComputedStyle(shell);
            const shellPt = parseFloat(shellStyle.paddingTop) || 0;
            const topbarH = topbar.getBoundingClientRect().height;
            const tabsH = tabs.getBoundingClientRect().height;
            document.documentElement.style.setProperty('--topbar-h', (topbarH) + 'px');
            document.documentElement.style.setProperty('--tabs-h', (tabsH) + 'px');
            document.documentElement.style.setProperty('--shell-pt', shellPt + 'px');
        }

        let quizInProgress = false; // lock flag khi đang làm bài

        function switchTab(n) {
    if (quizInProgress && n !== 'quiz') {
        toast('⚠️ Đang làm bài kiểm tra! Hãy nộp hoặc bỏ cuộc trước.');
        return;
    }
    
    // 1. Cập nhật trạng thái Active cho các nút tab
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    const tabNames = ['home', 'calendar', 'list', 'flash', 'write', 'type', 'speed', 'listen', 'mc', 'quiz', 'topik', 'chat', 'soan', 'admin', 'music', 'terminal'];
    document.querySelectorAll('.tab').forEach((t, i) => { 
        if (tabNames[i] === n) t.classList.add('active'); 
    });

    // 2. Ẩn tất cả các pane và hiện pane được chọn
    document.querySelectorAll('.pane').forEach(p => p.classList.remove('active'));
    const targetPane = document.getElementById('pane-' + n);
    if (targetPane) targetPane.classList.add('active');
    
    // 3. Logic riêng cho tab Soạn bài
    document.body.classList.toggle('soan-active', n === 'soan');

    // 4. LOGIC TERMINAL (Sửa lỗi hiển thị Admin ngay lập tức)
    if (n === 'terminal') {
        const promptPrefix = document.getElementById('terminalPromptPrefix');
        if (promptPrefix) {
            const userType = isAdmin ? 'admin' : 'user';
            const symbol = isAdmin ? '#' : '$';
            promptPrefix.textContent = userType + '@hanvocab:~' + symbol + ' ';
        }
        setTimeout(() => {
            const input = document.getElementById('terminalInput');
            if (input) input.focus();
        }, 100);
    }

    // 5. Khởi tạo lại các tính năng khác
    if (n === 'flash') buildFlash();
    if (n === 'write') buildWrite();
    if (n === 'type') buildType();
    if (n === 'speed') buildSpeed();
    if (n === 'listen') buildListen();
    if (n === 'mc') { buildMC(); requestAnimationFrame(() => { const w = document.getElementById('mcWrap'); if (w) w.focus(); }); }
    if (n === 'quiz') buildQuiz();
    if (n === 'topik') topikInit();
    if (n === 'admin') buildAdmin();
    if (n === 'soan') { soanInit(); }
    if (n === 'calendar') renderCalendar();
}


        function updateTopics() {
            const topics = [...new Set(words.map(w => w.topic).filter(Boolean))];
            // Filter dropdown
            const sel = document.getElementById('fTopic'), cur = sel.value;
            sel.innerHTML = '<option value="">Tất cả chủ đề</option>' + topics.map(t => `<option value="${esc(t)}" ${t === cur ? 'selected' : ''}>${esc(t)}</option>`).join('');
            // Datalist for topic inputs
            document.getElementById('topicList').innerHTML = topics.map(t => `<option value="${esc(t)}"></option>`).join('');
            // Write pane topic selector
            const ws = document.getElementById('wpTopic');
            if (ws) { const wc = ws.value; ws.innerHTML = '<option value="">Tất cả chủ đề</option>' + topics.map(t => `<option value="${esc(t)}" ${t === wc ? 'selected' : ''}>${esc(t)}</option>`).join(''); }
            // Type pane topic selector
            const ts = document.getElementById('tpTopic');
            if (ts) { const tc = ts.value; ts.innerHTML = '<option value="">Tất cả chủ đề</option>' + topics.map(t => `<option value="${esc(t)}" ${t === tc ? 'selected' : ''}>${esc(t)}</option>`).join(''); }
            // Listen pane topic selector
            const ls = document.getElementById('lpTopic');
            if (ls) { const lc = ls.value; ls.innerHTML = '<option value="">Tất cả chủ đề</option>' + topics.map(t => `<option value="${esc(t)}" ${t === lc ? 'selected' : ''}>${esc(t)}</option>`).join(''); }
        }

        /* ── Writing practice ── */
        function buildWrite() {
            const wrap = document.getElementById('wpWrap');
            if (!words.length) { wrap.innerHTML = '<div class="empty-state">Chưa có từ vựng.</div>'; return; }
            const topics = [...new Set(words.map(w => w.topic).filter(Boolean))];
            wrap.innerHTML = `
            <div class="wp-toolbar">
                <select id="wpMode" onchange="wpRestart()">
                    <option value="viet-kor">Tiếng Việt → viết tiếng Hàn</option>
                    <option value="kor-kor">Tiếng Hàn → viết lại tiếng Hàn</option>
                    <option value="kor-viet">Tiếng Hàn → viết tiếng Việt</option>
                </select>
                <select id="wpType" onchange="if(this.value){document.getElementById('wpTopic').value='';}wpRestart()">
                    <option value="">Tất cả từ loại</option>
                    <option value="명사">명사</option>
                    <option value="동사">동사</option>
                    <option value="형용사">형용사</option>
                    <option value="부사">부사</option>
                    <option value="감탄사">감탄사</option>
                    <option value="기타">기타</option>
                </select>
                <select id="wpTopic" onchange="if(this.value){document.getElementById('wpType').value='';}wpRestart()">
                    <option value="">Tất cả chủ đề</option>
                    ${topics.map(t => `<option value="${esc(t)}">${esc(t)}</option>`).join('')}
                </select>
            </div>
            <div class="wp-card" id="wpCard">
                
                <div class="wp-prompt" id="wpPrompt"></div>
                <div class="wp-prompt-sub" id="wpPromptSub"></div>
                <div class="wp-canvas-row">
                    <div class="wp-btns">
                        <button class="wp-icon-btn" onclick="wpUndoStroke()" title="Xóa nét vừa vẽ">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>
                        </button>
                        <button class="wp-icon-btn" onclick="wpClear()" title="Xóa tất cả">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
                        </button>
                        <button class="wp-icon-btn" onclick="wpSkip()" title="Bỏ qua từ này">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        </button>
                    </div>
                    <div class="wp-canvas-wrap">
                        <canvas id="wpCanvas"></canvas>
                        <div class="wp-canvas-hint" id="wpHint">Vẽ từ ở đây...</div>
                        <div class="wp-preview" id="wpPreview"></div>
                    </div>
                    <div class="wp-btns">
                        <button class="wp-icon-btn wp-icon-btn--primary" onclick="wpRecognize()" title="Nhận diện & Kiểm tra">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                        </button>
                        <button class="wp-icon-btn" onclick="wpReveal()" title="Hiện đáp án">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                        <button class="wp-icon-btn wp-icon-btn--next" id="wpNextBtn" onclick="wpNext()" title="Từ tiếp theo" style="display:none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 5l7 7-7 7"/><path d="M5 5l7 7-7 7"/></svg>
                        </button>
                    </div>
                </div>
                <div class="wp-result hidden" id="wpResult"></div>
                <div class="wp-answer hidden" id="wpAns"></div>
                <div class="wp-answer-sub hidden" id="wpAnsSub"></div>
                <div class="wp-prog" id="wpProg"></div>
            </div>`;

            let pool = [], idx = 0;

            function getPool() {
                const mode = document.getElementById('wpMode').value;
                const type = document.getElementById('wpType').value;
                const topic = document.getElementById('wpTopic').value;
                return [...words]
                    .filter(w => (!type || w.type === type) && (!topic || w.topic === topic))
                    .sort(() => Math.random() - .5);
            }

            let answered = false; // track if current word answered correctly

            function setNextVisible(visible, skipped = false) {
                const btn = document.getElementById('wpNextBtn');
                if (!btn) return;
                btn.style.display = visible ? '' : 'none';
                btn.classList.toggle('wp-icon-btn--skip', skipped);
                btn.classList.toggle('wp-icon-btn--next', !skipped);
            }

            function setLeftBtnsVisible(visible) {
                const row = document.getElementById('wpCard')?.querySelector('.wp-canvas-row');
                if (!row) return;
                const leftBtns = row.querySelector('.wp-btns');
                if (leftBtns) leftBtns.style.visibility = visible ? '' : 'hidden';
            }

            function render() {
                const card = document.getElementById('wpCard');
                if (!pool.length) {
                    document.getElementById('wpPrompt').textContent = 'Không có từ phù hợp.';
                    document.getElementById('wpProg').textContent = '';
                    // Hide canvas + buttons when no words
                    card.querySelector('.wp-canvas-row').style.display = 'none';
                    document.getElementById('wpResult').className = 'wp-result hidden';
                    document.getElementById('wpAns').classList.add('hidden');
                    document.getElementById('wpAnsSub').classList.add('hidden');
                    return;
                }
                // Show canvas + buttons
                card.querySelector('.wp-canvas-row').style.display = '';

                answered = false;
                setNextVisible(false);
                setLeftBtnsVisible(true);

                const w = pool[idx];
                const mode = document.getElementById('wpMode').value;
                const label = document.getElementById('wpLabel');
                const prompt = document.getElementById('wpPrompt');
                const sub = document.getElementById('wpPromptSub');
                const ans = document.getElementById('wpAns');
                const ansSub = document.getElementById('wpAnsSub');

                if (mode === 'viet-kor') {
                    prompt.textContent = w.meaning;
                    sub.textContent = w.type ? `[${w.type}]${w.topic ? ' • ' + w.topic : ''}` : '';
                    ans.textContent = w.korean;
                    ansSub.textContent = w.romanize ? `[${w.romanize}]` : '';
                } else if (mode === 'kor-kor') {
                    prompt.textContent = w.korean;
                    sub.textContent = w.type ? `[${w.type}]${w.topic ? ' • ' + w.topic : ''}` : '';
                    ans.textContent = w.korean;
                    ansSub.textContent = w.romanize ? `[${w.romanize}] ${w.meaning}` : w.meaning;
                } else {
                    prompt.textContent = w.korean;
                    sub.textContent = w.romanize ? `[${w.romanize}]${w.topic ? ' • ' + w.topic : ''}` : '';
                    ans.textContent = w.meaning;
                    ansSub.textContent = '';
                }
                ans.classList.add('hidden');
                ansSub.classList.add('hidden');
                document.getElementById('wpResult').className = 'wp-result hidden';
                document.getElementById('wpProg').textContent = `${idx + 1} / ${pool.length}`;
                wpClear();
            }

            // Canvas drawing — must be set up BEFORE first render()
            const canvas = document.getElementById('wpCanvas');
            const hint = document.getElementById('wpHint');
            function resizeCanvas() {
                const rect = canvas.getBoundingClientRect();
                canvas.width = rect.width * devicePixelRatio;
                canvas.height = rect.height * devicePixelRatio;
            }
            resizeCanvas();

            window.wpClear = () => {
                clearTimeout(autoRecognizeTimer);
                const p = document.getElementById('wpPreview'); if (p) p.textContent = '';
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                hint.style.opacity = '1';
                strokes = []; currentStroke = [];
                const r = document.getElementById('wpResult');
                if (r) r.className = 'wp-result hidden';
            };

            window.wpUndoStroke = () => {
                clearTimeout(autoRecognizeTimer);
                if (!strokes.length) return;
                strokes.pop();
                // Redraw all remaining strokes
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                ctx.strokeStyle = isDark ? '#f0efe9' : '#1a1a18';
                ctx.lineWidth = 3 * devicePixelRatio;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                for (const stroke of strokes) {
                    if (stroke.length < 2) continue;
                    ctx.beginPath();
                    ctx.moveTo(stroke[0].x, stroke[0].y);
                    for (let i = 1; i < stroke.length; i++) ctx.lineTo(stroke[i].x, stroke[i].y);
                    ctx.stroke();
                }
                if (!strokes.length) hint.style.opacity = '1';
                const r = document.getElementById('wpResult');
                if (r) r.className = 'wp-result hidden';
                const p = document.getElementById('wpPreview'); if (p) p.textContent = '';
                if (strokes.length) { clearTimeout(autoRecognizeTimer); autoRecognizeTimer = setTimeout(() => wpPreview(), 10); } //2937
            };

            window.wpRestart = () => { pool = getPool(); idx = 0; render(); };
            window.wpNext = () => { if (!answered) return; idx = (idx + 1) % pool.length; render(); };
            window.wpSkip = () => {
                const resultEl = document.getElementById('wpResult');
                document.getElementById('wpAns').classList.remove('hidden');
                document.getElementById('wpAnsSub').classList.remove('hidden');
                resultEl.innerHTML = `⏭ Đã bỏ qua — đáp án: <strong>${esc(document.getElementById('wpAns').textContent)}</strong>`;
                resultEl.className = 'wp-result info';
                answered = true;
                setNextVisible(true, true);
                setLeftBtnsVisible(false);
            };
            window.wpReveal = () => {
                document.getElementById('wpAns').classList.remove('hidden');
                document.getElementById('wpAnsSub').classList.remove('hidden');
            };
            window.wpPreview = async () => {
                if (!strokes.length || answered) return;
                const previewEl = document.getElementById('wpPreview');
                if (!previewEl) return;

                // 1. Browser Handwriting API
                if (navigator.createHandwritingRecognizer) {
                    try {
                        const mode = document.getElementById('wpMode').value;
                        const lang = mode === 'kor-viet' ? 'vi' : 'ko';
                        const recognizer = await navigator.createHandwritingRecognizer({ languages: [lang] });
                        const dr = recognizer.startDrawing({});
                        for (const sData of strokes) {
                            const s = new HandwritingStroke();
                            for (const pt of sData) s.addPoint({ x: pt.x / devicePixelRatio, y: pt.y / devicePixelRatio, t: pt.t });
                            dr.addStroke(s);
                        }
                        const results = await dr.getPrediction();
                        recognizer.finish();
                        if (results?.length) { previewEl.textContent = results[0].text.trim(); return; }
                    } catch (e) {}
                }

                // 2. Google Input Tools
                try {
                    const mode = document.getElementById('wpMode').value;
                    const itc = mode === 'kor-viet' ? 'vi-t-i0-handwrit' : 'ko-t-i0-handwrit';
                    const startTime = strokes[0][0].t;
                    const ink = strokes.map(s => [
                        s.map(p => Math.round(p.x / devicePixelRatio)),
                        s.map(p => Math.round(p.y / devicePixelRatio)),
                        s.map(p => p.t - startTime)
                    ]);
                    const box = canvas.getBoundingClientRect();
                    const url = `https://inputtools.google.com/request?itc=${itc}&num=5&cp=0&cs=1&ie=utf-8&oe=utf-8&app=test`;
                    const r = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ app: 'test', itc, requests: [{ writing_guide: { writing_area_width: Math.round(box.width), writing_area_height: Math.round(box.height) }, ink }] })
                    });
                    const data = await r.json();
                    if (data[0] === 'SUCCESS' && data[1]?.[0]?.[1]?.length) {
                        previewEl.textContent = data[1][0][1][0].trim();
                    }
                } catch (e) {}
            };
            window.wpRecognize = async () => {
                const resultEl = document.getElementById('wpResult');
                if (!strokes.length) {
                    resultEl.textContent = 'Hãy vẽ từ trước!';
                    resultEl.className = 'wp-result info';
                    return;
                }

                resultEl.textContent = 'Đang nhận diện...';
                resultEl.className = 'wp-result info';

                const expected = document.getElementById('wpAns').textContent.trim();
                const norm = s => s.toLowerCase().replace(/\(.*?\)/g, '').replace(/\[.*?\]/g, '').replace(/\s+/g, ' ').trim();

                async function checkResult(recognized) {
                    const normRecognized = norm(recognized);
                    const expectedParts = expected.split(',').map(s => norm(s));
                    const ok = expectedParts.includes(normRecognized);

                    document.getElementById('wpAns').classList.remove('hidden');
                    document.getElementById('wpAnsSub').classList.remove('hidden');
                    if (ok) {
                        resultEl.innerHTML = `✅ Đúng! «${esc(recognized)}»`;
                        resultEl.className = 'wp-result correct';
                        answered = true;
                        setNextVisible(true, false);
                        setLeftBtnsVisible(false);
                    } else {
                        resultEl.innerHTML = `❌ Nhận diện: <strong>${esc(recognized)}</strong> — Đáp án: <strong>${esc(expected)}</strong>`;
                        resultEl.className = 'wp-result wrong';
                    }
                }

                // 1. Try Browser API first (if available and reliable)
                if (navigator.createHandwritingRecognizer) {
                    try {
                        const mode = document.getElementById('wpMode').value;
                        const lang = mode === 'kor-viet' ? 'vi' : 'ko';
                        const recognizer = await navigator.createHandwritingRecognizer({ languages: [lang] });
                        const drawing = recognizer.startDrawing({});
                        for (const sData of strokes) {
                            const s = new HandwritingStroke();
                            for (const pt of sData) s.addPoint({ x: pt.x / devicePixelRatio, y: pt.y / devicePixelRatio, t: pt.t });
                            drawing.addStroke(s);
                        }
                        const browserResults = await drawing.getPrediction();
                        recognizer.finish();
                        if (browserResults && browserResults.length) {
                            checkResult(browserResults[0].text.trim());
                            return;
                        }
                    } catch (e) { console.warn('Browser Recognition failed, trying Google API...', e); }
                }

                // 2. Try Google Input Tools API
                try {
                    const mode = document.getElementById('wpMode').value;
                    const itc = mode === 'kor-viet' ? 'vi-t-i0-handwrit' : 'ko-t-i0-handwrit';

                    const startTime = strokes[0][0].t;
                    const ink = strokes.map(stroke => [
                        stroke.map(p => Math.round(p.x / devicePixelRatio)),
                        stroke.map(p => Math.round(p.y / devicePixelRatio)),
                        stroke.map(p => p.t - startTime) // Use relative time
                    ]);

                    const box = canvas.getBoundingClientRect();
                    const url = `https://inputtools.google.com/request?itc=${itc}&num=10&cp=0&cs=1&ie=utf-8&oe=utf-8&app=test`;
                    const body = {
                        app: "test",
                        itc: itc,
                        requests: [{
                            writing_guide: { writing_area_width: Math.round(box.width), writing_area_height: Math.round(box.height) },
                            ink: ink
                        }]
                    };

                    const r = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(body)
                    });

                    if (!r.ok) throw new Error('API Error: ' + r.status);
                    const data = await r.json();
                    // console.log('Handwriting API Data:', data);

                    if (data[0] !== 'SUCCESS') throw new Error(`Google recognition failed (${data[0]})`);

                    const candidates = data[1][0][1];
                    if (!candidates || !candidates.length) {
                        resultEl.textContent = 'Không nhận diện được — thử vẽ rõ hơn nhé.';
                        resultEl.className = 'wp-result info';
                        return;
                    }

                    checkResult(candidates[0].trim());
                } catch (err) {
                    console.error('Recognition error:', err);
                    resultEl.textContent = 'Lỗi nhận diện: ' + (err.message || 'Không thể kết nối');
                    resultEl.className = 'wp-result info';
                }
            };

            let drawing = false, lastX = 0, lastY = 0;
            let strokes = [], currentStroke = [];

            function getXY(e) {
                const r = canvas.getBoundingClientRect();
                const src = e.touches ? e.touches[0] : e;
                return [(src.clientX - r.left) * devicePixelRatio, (src.clientY - r.top) * devicePixelRatio];
            }
            function startDraw(e) {
                e.preventDefault();
                clearTimeout(autoRecognizeTimer);
                drawing = true;
                hint.style.opacity = '0';
                [lastX, lastY] = getXY(e);
                currentStroke = [{ x: lastX, y: lastY, t: Date.now() }];
            }
            function moveDraw(e) {
                if (!drawing) return;
                e.preventDefault();
                const [x, y] = getXY(e);
                const ctx = canvas.getContext('2d');
                const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                ctx.strokeStyle = isDark ? '#f0efe9' : '#1a1a18';
                ctx.lineWidth = 3 * devicePixelRatio;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.beginPath();
                ctx.moveTo(lastX, lastY);
                ctx.lineTo(x, y);
                ctx.stroke();
                [lastX, lastY] = [x, y];
                currentStroke.push({ x, y, t: Date.now() });
            }
            let autoRecognizeTimer = null;
            function stopDraw() {
                if (drawing && currentStroke.length) strokes.push([...currentStroke]);
                drawing = false;
                currentStroke = [];
                if (strokes.length && !answered) {
                    clearTimeout(autoRecognizeTimer);
                    autoRecognizeTimer = setTimeout(() => wpPreview(), 10); //2937
                }
            }

            canvas.addEventListener('pointerdown', startDraw);
            canvas.addEventListener('pointermove', moveDraw);
            canvas.addEventListener('pointerup', stopDraw);
            canvas.addEventListener('pointerleave', stopDraw);

            // Now safe to render
            pool = getPool();
            render();
        }

        /* ── Typing practice ── */
        function buildType() {
            const wrap = document.getElementById('tpWrap');
            if (!words.length) { wrap.innerHTML = '<div class="empty-state">Chưa có từ vựng.</div>'; return; }
            const topics = [...new Set(words.map(w => w.topic).filter(Boolean))];

            // QWERTY → Jamo mapping (same as search)
            const q2j = {
                'q':'ㅂ','w':'ㅈ','e':'ㄷ','r':'ㄱ','t':'ㅅ','y':'ㅛ','u':'ㅕ','i':'ㅑ','o':'ㅐ','p':'ㅔ',
                'a':'ㅁ','s':'ㄴ','d':'ㅇ','f':'ㄹ','g':'ㅎ','h':'ㅗ','j':'ㅓ','k':'ㅏ','l':'ㅣ',
                'z':'ㅋ','x':'ㅌ','c':'ㅊ','v':'ㅍ','b':'ㅠ','n':'ㅜ','m':'ㅡ',
                'Q':'ㅃ','W':'ㅉ','E':'ㄸ','R':'ㄲ','T':'ㅆ','O':'ㅒ','P':'ㅖ'
            };

            wrap.innerHTML = `
            <div class="wp-toolbar">
                <select id="tpMode" onchange="tpRestart()">
                    <option value="viet-kor">Tiếng Việt → gõ tiếng Hàn</option>
                    <option value="kor-kor">Tiếng Hàn → gõ lại tiếng Hàn</option>
                    <option value="kor-viet">Tiếng Hàn → gõ tiếng Việt</option>
                </select>
                <select id="tpType" onchange="if(this.value){document.getElementById('tpTopic').value='';}tpRestart()">
                    <option value="">Tất cả từ loại</option>
                    <option value="명사">명사</option>
                    <option value="동사">동사</option>
                    <option value="형용사">형용사</option>
                    <option value="부사">부사</option>
                    <option value="감탄사">감탄사</option>
                    <option value="기타">기타</option>
                </select>
                <select id="tpTopic" onchange="if(this.value){document.getElementById('tpType').value='';}tpRestart()">
                    <option value="">Tất cả chủ đề</option>
                    ${topics.map(t => `<option value="${esc(t)}">${esc(t)}</option>`).join('')}
                </select>
            </div>
            <div class="wp-card" id="tpCard">
                <div class="wp-prompt-label" id="tpLabel"></div>
                <div class="wp-prompt" id="tpPrompt"></div>
                <div class="wp-prompt-sub" id="tpPromptSub"></div>

                <div class="tp-input-wrap">
                    <div class="tp-hint-row" id="tpHintRow"></div>
                    <input class="tp-input" id="tpInput" type="text" autocomplete="off" autocorrect="off" spellcheck="false" placeholder="Gõ câu trả lời..." />
                    <div class="tp-keyboard-hint" id="tpKeyboardHint"></div>
                    <div class="tp-btns-row">
                        <button class="btn btn-ghost" onclick="tpReveal()" id="tpRevealBtn">👁 Hiện đáp án</button>
                        <button class="btn btn-ghost" onclick="tpSkip()" id="tpSkipBtn">⏭ Bỏ qua</button>
                        <button class="wp-icon-btn wp-icon-btn--next" id="tpNextBtn" onclick="tpNext()" title="Từ tiếp theo" style="display:none;width:auto;padding:0 16px;gap:6px;font-size:13px;font-weight:500">
                            Tiếp theo
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 5l7 7-7 7"/><path d="M5 5l7 7-7 7"/></svg>
                        </button>
                    </div>
                </div>

                <div class="wp-result hidden" id="tpResult"></div>
                <div class="wp-answer hidden" id="tpAns"></div>
                <div class="wp-answer-sub hidden" id="tpAnsSub"></div>
                <div class="wp-prog" id="tpProg"></div>
            </div>`;

            let pool = [], idx = 0, answered = false;

            function getPool() {
                const type = document.getElementById('tpType').value;
                const topic = document.getElementById('tpTopic').value;
                return [...words]
                    .filter(w => (!type || w.type === type) && (!topic || w.topic === topic))
                    .sort(() => Math.random() - .5);
            }

            function isKoreanMode() {
                const m = document.getElementById('tpMode').value;
                return m === 'viet-kor' || m === 'kor-kor';
            }

            function updateHintRow(typed) {
                if (!isKoreanMode()) { document.getElementById('tpHintRow').innerHTML = ''; return; }
                const expected = document.getElementById('tpAns').textContent.trim();
                if (!expected) return;
                const chars = [...expected];
                const typedChars = typed ? [...typed] : [];
                document.getElementById('tpHintRow').innerHTML = chars.map((ch, i) => {
                    let cls = '';
                    if (i < typedChars.length) cls = typedChars[i] === ch ? 'hit' : 'miss';
                    return `<span class="tp-char ${cls}">${i < typedChars.length ? esc(typedChars[i]) : '?'}</span>`;
                }).join('');
            }

            function render() {
                if (!pool.length) {
                    document.getElementById('tpPrompt').textContent = 'Không có từ phù hợp.';
                    document.getElementById('tpProg').textContent = '';
                    document.getElementById('tpCard').querySelector('.tp-input-wrap').style.display = 'none';
                    return;
                }
                document.getElementById('tpCard').querySelector('.tp-input-wrap').style.display = '';
                answered = false;

                const w = pool[idx];
                const mode = document.getElementById('tpMode').value;
                const prompt = document.getElementById('tpPrompt');
                const sub = document.getElementById('tpPromptSub');
                const ans = document.getElementById('tpAns');
                const ansSub = document.getElementById('tpAnsSub');
                const input = document.getElementById('tpInput');
                const keyHint = document.getElementById('tpKeyboardHint');

                if (mode === 'viet-kor') {
                    prompt.textContent = w.meaning;
                    sub.textContent = w.type ? `[${w.type}]${w.topic ? ' • ' + w.topic : ''}` : '';
                    ans.textContent = w.korean;
                    ansSub.textContent = w.romanize ? `[${w.romanize}]` : '';
                    keyHint.textContent = '💡 Gõ QWERTY rồi nhấn Tab để chuyển sang tiếng Hàn';
                } else if (mode === 'kor-kor') {
                    prompt.textContent = w.korean;
                    sub.textContent = w.type ? `[${w.type}]${w.topic ? ' • ' + w.topic : ''}` : '';
                    ans.textContent = w.korean;
                    ansSub.textContent = w.romanize ? `[${w.romanize}] ${w.meaning}` : w.meaning;
                    keyHint.textContent = '💡 Gõ QWERTY rồi nhấn Tab để chuyển sang tiếng Hàn';
                } else {
                    prompt.textContent = w.korean;
                    sub.textContent = w.romanize ? `[${w.romanize}]${w.topic ? ' • ' + w.topic : ''}` : '';
                    ans.textContent = w.meaning;
                    ansSub.textContent = '';
                    keyHint.textContent = '';
                }

                ans.classList.add('hidden');
                ansSub.classList.add('hidden');
                document.getElementById('tpResult').className = 'wp-result hidden';
                document.getElementById('tpNextBtn').style.display = 'none';
                document.getElementById('tpRevealBtn').style.display = '';
                document.getElementById('tpSkipBtn').style.display = '';
                document.getElementById('tpProg').textContent = `${idx + 1} / ${pool.length}`;
                input.value = '';
                input.className = 'tp-input';
                input.disabled = false;
                input.placeholder = isKoreanMode() ? '한국어로 입력하세요...' : 'Gõ câu trả lời...';
                updateHintRow(''); // hiện ô gợi ý ngay với dấu ?
                setTimeout(() => input.focus(), 50);
            }

            // Live input handling
            const tpInput = document.getElementById('tpInput');

            tpInput.addEventListener('input', () => {
                // cập nhật gợi ý chuyển Hangul live
                if (isKoreanMode()) {
                    const raw = tpInput.value;
                    const keyHint = document.getElementById('tpKeyboardHint');
                    if (window.Hangul && /[a-zA-Z]/.test(raw)) {
                        let converted = '';
                        for (const ch of raw) converted += q2j[ch] || ch;
                        const sug = Hangul.a(converted.split(''));
                        if (sug !== raw) {
                            keyHint.innerHTML = `💡 Nhấn <strong>Tab</strong> để đổi thành: <b style="font-size:15px;color:var(--txt)">${esc(sug)}</b>`;
                        } else {
                            keyHint.textContent = '💡 Gõ QWERTY rồi nhấn Tab để chuyển sang tiếng Hàn';
                        }
                    } else {
                        keyHint.textContent = raw ? '' : '💡 Gõ QWERTY rồi nhấn Tab để chuyển sang tiếng Hàn';
                    }
                }
            });

            tpInput.addEventListener('keydown', e => {
                if (e.key === 'Tab' && isKoreanMode()) {
                    e.preventDefault();
                    const raw = tpInput.value;
                    if (window.Hangul && /[a-zA-Z]/.test(raw)) {
                        let converted = '';
                        for (const ch of raw) converted += q2j[ch] || ch;
                        tpInput.value = Hangul.a(converted.split(''));
                        updateHintRow(tpInput.value);
                    }
                } else if (e.key === 'Enter') {
                    if (answered) { tpNext(); return; }
                    tpCheck();
                }
            });

            function tpCheck() {
                if (answered) return;
                const typed = tpInput.value.trim();
                if (!typed) return;
                const expected = document.getElementById('tpAns').textContent.trim();
                const norm = s => s.toLowerCase().replace(/\(.*?\)/g, '').replace(/\[.*?\]/g, '').replace(/\s+/g, ' ').trim();
                const expectedParts = expected.split(',').map(s => norm(s));
                const ok = expectedParts.includes(norm(typed));

                document.getElementById('tpAns').classList.remove('hidden');
                document.getElementById('tpAnsSub').classList.remove('hidden');

                const resultEl = document.getElementById('tpResult');
                if (ok) {
                    tpInput.className = 'tp-input correct';
                    resultEl.innerHTML = `✅ Đúng! «${esc(typed)}»`;
                    resultEl.className = 'wp-result correct';
                    answered = true;
                    document.getElementById('tpNextBtn').style.display = '';
                    document.getElementById('tpRevealBtn').style.display = 'none';
                    document.getElementById('tpSkipBtn').style.display = 'none';
                    updateHintRow(typed);
                } else {
                    tpInput.className = 'tp-input wrong';
                    resultEl.innerHTML = `❌ Bạn gõ: <strong>${esc(typed)}</strong> — Đáp án: <strong>${esc(expected)}</strong>`;
                    resultEl.className = 'wp-result wrong';
                    updateHintRow(typed);
                    setTimeout(() => {
                        tpInput.className = 'tp-input';
                        tpInput.value = '';
                        updateHintRow('');
                    }, 1200);
                }
            }

            window.tpNext = () => {
                if (!answered) return;
                idx = (idx + 1) % pool.length;
                render();
            };
            window.tpSkip = () => {
                document.getElementById('tpAns').classList.remove('hidden');
                document.getElementById('tpAnsSub').classList.remove('hidden');
                const expected = document.getElementById('tpAns').textContent.trim();
                const resultEl = document.getElementById('tpResult');
                resultEl.innerHTML = `⏭ Đã bỏ qua — đáp án: <strong>${esc(expected)}</strong>`;
                resultEl.className = 'wp-result info';
                answered = true;
                document.getElementById('tpNextBtn').style.display = '';
                document.getElementById('tpRevealBtn').style.display = 'none';
                document.getElementById('tpSkipBtn').style.display = 'none';
                tpInput.disabled = true;
            };
            window.tpReveal = () => {
                document.getElementById('tpAns').classList.remove('hidden');
                document.getElementById('tpAnsSub').classList.remove('hidden');
            };
            window.tpRestart = () => { pool = getPool(); idx = 0; render(); };

            pool = getPool();
            render();
        }

        /* ── Speed Typing practice ── */
        function buildSpeed() {
            const wrap = document.getElementById('speedWrap');
            if (!words.length) { wrap.innerHTML = '<div class="empty-state">Chưa có từ vựng.</div>'; return; }

            // QWERTY → Jamo mapping
            const q2j = {
                'q':'ㅂ','w':'ㅈ','e':'ㄷ','r':'ㄱ','t':'ㅅ','y':'ㅛ','u':'ㅕ','i':'ㅑ','o':'ㅐ','p':'ㅔ',
                'a':'ㅁ','s':'ㄴ','d':'ㅇ','f':'ㄹ','g':'ㅎ','h':'ㅗ','j':'ㅓ','k':'ㅏ','l':'ㅣ',
                'z':'ㅋ','x':'ㅌ','c':'ㅊ','v':'ㅍ','b':'ㅠ','n':'ㅜ','m':'ㅡ',
                'Q':'ㅃ','W':'ㅉ','E':'ㄸ','R':'ㄲ','T':'ㅆ','O':'ㅒ','P':'ㅖ'
            };

            const topics = [...new Set(words.map(w => w.topic).filter(Boolean))];

            wrap.innerHTML = `
            <div class="speed-toolbar">
                <div class="speed-mode-toggle" id="speedModeToggle">
                    <button class="speed-mode-btn active" data-mode="korean" onclick="speedSetMode('korean', this)">🇰🇷 한국어</button>
                    <button class="speed-mode-btn" data-mode="viet" onclick="speedSetMode('viet', this)">🇻🇳 Tiếng Việt</button>
                </div>
                <select class="speed-select" id="speedTopic" onchange="speedRestart()">
                    <option value="">Tất cả chủ đề</option>
                    ${topics.map(t => `<option value="${esc(t)}">${esc(t)}</option>`).join('')}
                </select>
                <select class="speed-select" id="speedGameMode" onchange="speedRestart()" style="color: #c0392b; font-weight: 700;">
                    <option value="normal">⏱ Đếm ngược 60s</option>
                    <option value="survival">🔥 Sinh Tồn (15s)</option>
                </select>
                <button class="speed-restart-btn" id="speedRestartBtn" onclick="speedRestart()" title="Làm lại (Tab)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                    Làm lại
                </button>
            </div>

            <div class="speed-metrics" id="speedMetrics">
                <div class="speed-metric-item">
                    <span class="speed-metric-label">Tốc độ</span>
                    <span class="speed-metric-value accent" id="sWpm">0</span>
                    <span class="speed-metric-unit">cpm</span>
                </div>
                <div class="speed-metric-sep"></div>
                <div class="speed-metric-item">
                    <span class="speed-metric-label">Độ chính xác</span>
                    <span class="speed-metric-value" id="sAcc">100%</span>
                </div>
                <div class="speed-metric-sep"></div>
                <div class="speed-metric-item">
                    <span class="speed-metric-label">Thời gian</span>
                    <span class="speed-metric-value" id="sTimer">60</span>
                    <span class="speed-metric-unit">s</span>
                </div>
                <div class="speed-metric-sep"></div>
                <div class="speed-metric-item">
                    <span class="speed-metric-label">Điểm</span>
                    <span class="speed-metric-value" id="sScore">0</span>
                </div>
            </div>

            <div class="speed-hint-bar" id="speedHintBar"></div>

            <div class="speed-arena" id="speedArena">
                <div class="speed-text-area" id="speedTextArea"></div>
                <input class="speed-input" id="speedInput" type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Click vào đây rồi bắt đầu gõ..." />
            </div>

            <div class="speed-result" id="speedResult" style="display:none">
                <div class="speed-result-title">🎉 Kết quả</div>
                <div class="speed-result-grid">
                    <div class="speed-result-item">
                        <div class="speed-result-val" id="rWpm">-</div>
                        <div class="speed-result-lbl">CPM</div>
                    </div>
                    <div class="speed-result-item">
                        <div class="speed-result-val" id="rAcc">-</div>
                        <div class="speed-result-lbl">Độ chính xác</div>
                    </div>
                    <div class="speed-result-item">
                        <div class="speed-result-val" id="rWords">-</div>
                        <div class="speed-result-lbl">Từ hoàn thành</div>
                    </div>
                    <div class="speed-result-item">
                        <div class="speed-result-val" id="rScore">-</div>
                        <div class="speed-result-lbl">Điểm</div>
                    </div>
                </div>
                <button class="btn btn-dark" style="margin-top:24px;" onclick="speedRestart()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                    Thử lại
                </button>
            </div>`;

            let pool = [], wordIdx = 0, charIdx = 0;
            let started = false, finished = false;
            let correctChars = 0, totalTyped = 0, wordsCompleted = 0;
            let timerLeft = 60, timerInterval = null;
            let currentMode = 'korean'; // 'korean' | 'viet'
            let liveInput = ''; // raw QWERTY buffer for Korean mode

            // --- THÊM VÀO KHU VỰC KHAI BÁO BIẾN ---
            let isSurvivalMode = false;
            let elapsedSeconds = 0; // Đếm thời gian trôi qua thực tế để tính CPM cho chuẩn

            // Hàm tạo hiệu ứng +2s / -1s bay lơ lửng
            function showFloatingTime(text, type) {
                const timerWrap = document.getElementById('sTimer').parentNode;
                timerWrap.style.position = 'relative';
                const floatEl = document.createElement('div');
                floatEl.textContent = text;
                floatEl.style.position = 'absolute';
                floatEl.style.top = '-15px';
                floatEl.style.right = '0';
                floatEl.style.color = type === 'correct' ? '#1D9E75' : '#c0392b';
                floatEl.style.fontWeight = '800';
                floatEl.style.fontSize = '16px';
                floatEl.style.pointerEvents = 'none';
                floatEl.style.transition = 'all 0.6s ease-out';
                floatEl.style.opacity = '1';
                floatEl.style.transform = 'translateY(0) scale(1)';
                timerWrap.appendChild(floatEl);
                
                // Kích hoạt bay lên
                setTimeout(() => {
                    floatEl.style.opacity = '0';
                    floatEl.style.transform = 'translateY(-25px) scale(1.2)';
                }, 20);
                setTimeout(() => floatEl.remove(), 600);
            }

            // ==== Extract single word/syllable ====
            function extractWord(w) {
                // Hàm dọn dẹp ký tự đặc biệt: thay thế ngoặc, chấm, phẩy... bằng khoảng trắng
                const cleanText = (text) => (text || '').replace(/[()\[\]{}.,!?;:"'“”‘’~]/g, ' ').trim();

                if (currentMode === 'korean') {
                    // Korean word: làm sạch trước rồi mới tách theo khoảng trắng
                    const parts = cleanText(w.korean).split(/\s+/).filter(Boolean);
                    if (!parts.length) return null;
                    return parts[Math.floor(Math.random() * parts.length)];
                } else {
                    // Vietnamese meaning: tách theo dấu phẩy trước để lấy cụm nghĩa
                    const meaning = (w.meaning || '').trim();
                    const commaParts = meaning.split(',').filter(Boolean);
                    
                    // Chọn ngẫu nhiên 1 cụm nghĩa, sau đó làm sạch ký tự đặc biệt
                    const chosenRaw = commaParts[Math.floor(Math.random() * commaParts.length)] || meaning;
                    const chosenClean = cleanText(chosenRaw);
                    
                    // Tách cụm nghĩa thành các từ đơn và chọn 1 từ
                    const spaceParts = chosenClean.split(/\s+/).filter(Boolean);
                    if (spaceParts.length > 1) return spaceParts[Math.floor(Math.random() * spaceParts.length)];
                    return chosenClean;
                }
            }

            function buildPool() {
                const topicFilter = document.getElementById('speedTopic').value;
                const src = [...words].filter(w => !topicFilter || w.topic === topicFilter).sort(() => Math.random() - .5);
                const result = [];
                for (const w of src) {
                    const word = extractWord(w);
                    if (word && word.length >= 1) result.push(word);
                    if (result.length >= 50) break;
                }
                // ensure minimum 10
                if (result.length < 5) return null;
                return result;
            }

            function renderTextArea() {
                const area = document.getElementById('speedTextArea');
                if (!area) return;
                const poolToShow = pool.slice(0, Math.min(pool.length, wordIdx + 30));
                area.innerHTML = poolToShow.map((word, wi) => {
                    const chars = [...word];
                    let html = '';
                    if (wi < wordIdx) {
                        // completed word
                        html = chars.map(ch => `<span class="s-ch done">${esc(ch)}</span>`).join('');
                    } else if (wi === wordIdx) {
                        // current word
                        const typedChars = [...liveInput];
                        html = chars.map((ch, ci) => {
                            if (ci < typedChars.length) {
                                const cls = typedChars[ci] === ch ? 'correct' : 'wrong';
                                return `<span class="s-ch ${cls}">${esc(typedChars[ci])}</span>`;
                            } else if (ci === typedChars.length) {
                                return `<span class="s-ch cursor">${esc(ch)}</span>`;
                            } else {
                                return `<span class="s-ch">${esc(ch)}</span>`;
                            }
                        }).join('');
                        // if typed more than word length show excess in red
                        if (typedChars.length > chars.length) {
                            html += typedChars.slice(chars.length).map(ch => `<span class="s-ch wrong">${esc(ch)}</span>`).join('');
                        }
                    } else {
                        html = chars.map(ch => `<span class="s-ch">${esc(ch)}</span>`).join('');
                    }
                    return `<span class="s-word">${html}</span>`;
                }).join('<span class="s-dot">·</span>');

                // Scroll current word into view
                requestAnimationFrame(() => {
                    const cursor = area.querySelector('.cursor');
                    if (cursor) {
                        const areaRect = area.getBoundingClientRect();
                        const cursorRect = cursor.getBoundingClientRect();
                        if (cursorRect.top > areaRect.bottom - 60 || cursorRect.top < areaRect.top) {
                            cursor.scrollIntoView({ block: 'center', behavior: 'smooth' });
                        }
                    }
                });
            }

            // function updateMetrics() {
            //     const wpm = timerLeft < 60 ? Math.round((correctChars / 5) / ((60 - timerLeft) / 60)) : 0;
            //     const acc = totalTyped > 0 ? Math.round((correctChars / totalTyped) * 100) : 100;
            //     const score = Math.round(wpm * (acc / 100));
            //     const wpmEl = document.getElementById('sWpm');
            //     const accEl = document.getElementById('sAcc');
            //     const scoreEl = document.getElementById('sScore');
            //     if (wpmEl) wpmEl.textContent = isFinite(wpm) ? wpm : 0;
            //     if (accEl) accEl.textContent = acc + '%';
            //     if (scoreEl) scoreEl.textContent = isFinite(score) ? score : 0;
            // }

            function updateHintBar() {
                const bar = document.getElementById('speedHintBar');
                if (!bar) return;
                if (currentMode === 'korean') {
                    if (window.Hangul && liveInput && /[a-zA-Z]/.test(liveInput)) {
                        let conv = '';
                        for (const ch of liveInput) conv += q2j[ch] || ch;
                        const sug = Hangul.a(conv.split(''));
                        bar.innerHTML = `💡 Nhấn <strong>Tab</strong> để chuyển thành: <b style="color:var(--txt);font-size:15px">${esc(sug)}</b>`;
                    } else if (!liveInput) {
                        bar.textContent = '💡 Gõ QWERTY rồi nhấn Tab để chuyển sang Hangul';
                    } else {
                        bar.textContent = '';
                    }
                } else {
                    bar.textContent = '';
                }
            }

            function startTimer() {
                if (timerInterval) return;
                timerInterval = setInterval(() => {
                    timerLeft--;
                    elapsedSeconds++; // Tăng thời gian thực tế
                    const timerEl = document.getElementById('sTimer');
                    if (timerEl) {
                        timerEl.textContent = timerLeft;
                        if (timerLeft <= 10) timerEl.classList.add('danger');
                        else timerEl.classList.remove('danger');
                    }
                    updateMetrics();
                    
                    if (timerLeft <= 0) {
                        // Kêu chuông "tạch" khi hết giờ nếu ông chủ thích
                        finishRound();
                    }
                }, 1000);
            }

            // function finishRound() {
            //     finished = true;
            //     clearInterval(timerInterval);
            //     timerInterval = null;

            //     const wpm = timerLeft < 60 ? Math.round((correctChars / 5) / ((60 - timerLeft + (timerLeft > 0 ? 0 : 0)) / 60)) : 0;
            //     const elapsed = Math.max(1, 60 - timerLeft);
            //     const finalWpm = Math.round((correctChars / 5) / (elapsed / 60));
            //     const acc = totalTyped > 0 ? Math.round((correctChars / totalTyped) * 100) : 100;
            //     const score = Math.round(finalWpm * (acc / 100));

            //     const arena = document.getElementById('speedArena');
            //     const metrics = document.getElementById('speedMetrics');
            //     const result = document.getElementById('speedResult');
            //     const inp = document.getElementById('speedInput');
            //     if (arena) arena.style.display = 'none';
            //     if (metrics) metrics.style.display = 'none';
            //     if (inp) inp.blur();

            //     document.getElementById('rWpm').textContent = isFinite(finalWpm) ? finalWpm : 0;
            //     document.getElementById('rAcc').textContent = acc + '%';
            //     document.getElementById('rWords').textContent = wordsCompleted;
            //     document.getElementById('rScore').textContent = isFinite(score) ? score : 0;

            //     if (result) result.style.display = 'flex';
            // }

            // Thêm hàm rã chữ Hàn ra thành từng âm vị (Jamo) để đếm đúng số phím vật lý
            function getStrokeCount(str) {
                if (!str) return 0;
                // Nếu là tiếng Hàn, tháo tung chữ ra (VD: "한" -> "ㅎ","ㅏ","ㄴ" -> 3 phím)
                if (currentMode === 'korean' && window.Hangul) {
                    return Hangul.d(str).length; 
                }
                return str.length; // Tiếng Việt thì đếm bình thường
            }

            // Ghi đè hàm updateMetrics để tính toán thời gian thực
            function updateMetrics() {
                // Tính luôn cả các chữ đang gõ dở dang trên ô input
                let liveCorrect = 0, liveTotal = 0;
                if (started && liveInput) {
                    const expected = pool[wordIdx] || '';
                    const typedArr = [...liveInput];
                    const expArr = [...expected];
                    const maxLen = Math.max(typedArr.length, expArr.length);
                    
                    for (let i = 0; i < maxLen; i++) {
                        const tChar = typedArr[i] || '';
                        const eChar = expArr[i] || '';
                        liveTotal += getStrokeCount(tChar);
                        if (tChar && tChar === eChar) {
                            liveCorrect += getStrokeCount(eChar);
                        }
                    }
                }

                const totalC = correctChars + liveCorrect;
                const totalT = totalTyped + liveTotal;

                // Tính CPM thay vì WPM (Bỏ chia 5)
                // Tính thời gian dựa trên giây thực tế đã trôi qua
                const elapsed = Math.max(1, elapsedSeconds);
                const cpm = Math.round(totalC / (elapsed / 60)); 
                const acc = totalT > 0 ? Math.round((totalC / totalT) * 100) : 100;
                
                // Tớ chia 5 lại ở phần tính Score để điểm của ông chủ không bị bơm lên gấp 5 lần so với cũ nha
                const score = Math.round((cpm / 5) * (acc / 100));

                const wpmEl = document.getElementById('sWpm');
                const accEl = document.getElementById('sAcc');
                const scoreEl = document.getElementById('sScore');
                if (wpmEl) wpmEl.textContent = isFinite(cpm) ? cpm : 0; // Vẫn chèn vào sWpm nhưng giá trị là cpm
                if (accEl) accEl.textContent = acc + '%';
                if (scoreEl) scoreEl.textContent = isFinite(score) ? score : 0;
            }

            // Ghi đè hàm kết thúc game để gom nốt mấy chữ gõ dở
            function finishRound() {
                finished = true;
                clearInterval(timerInterval);
                timerInterval = null;

                let liveCorrect = 0, liveTotal = 0;
                if (liveInput) {
                    const expected = pool[wordIdx] || '';
                    const typedArr = [...liveInput];
                    const expArr = [...expected];
                    const maxLen = Math.max(typedArr.length, expArr.length);
                    for (let i = 0; i < maxLen; i++) {
                        const tChar = typedArr[i] || '';
                        const eChar = expArr[i] || '';
                        liveTotal += getStrokeCount(tChar);
                        if (tChar && tChar === eChar) {
                            liveCorrect += getStrokeCount(eChar);
                        }
                    }
                }
                const finalCorrect = correctChars + liveCorrect;
                const finalTotal = totalTyped + liveTotal;

                // Tính CPM chung cuộc
                // Tính thời gian dựa trên giây thực tế đã trôi qua
                const elapsed = Math.max(1, elapsedSeconds);
                const finalCpm = Math.round(finalCorrect / (elapsed / 60));
                const acc = finalTotal > 0 ? Math.round((finalCorrect / finalTotal) * 100) : 100;
                const score = Math.round((finalCpm / 5) * (acc / 100));

                const arena = document.getElementById('speedArena');
                const metrics = document.getElementById('speedMetrics');
                const result = document.getElementById('speedResult');
                const inp = document.getElementById('speedInput');
                if (arena) arena.style.display = 'none';
                if (metrics) metrics.style.display = 'none';
                if (inp) inp.blur();

                document.getElementById('rWpm').textContent = isFinite(finalCpm) ? finalCpm : 0; // Trả về CPM
                document.getElementById('rAcc').textContent = acc + '%';
                document.getElementById('rWords').textContent = wordsCompleted;
                document.getElementById('rScore').textContent = isFinite(score) ? score : 0;

                if (result) result.style.display = 'flex';
            }

            window.speedSetMode = function(mode, btn) {
                currentMode = mode;
                document.querySelectorAll('.speed-mode-btn').forEach(b => b.classList.remove('active'));
                if (btn) btn.classList.add('active');
                speedRestart();
            };

            window.speedRestart = function() {
                clearInterval(timerInterval);
                timerInterval = null;
                started = false;
                finished = false;
                correctChars = 0;
                totalTyped = 0;
                wordsCompleted = 0;
                elapsedSeconds = 0;
                wordIdx = 0;
                charIdx = 0;
                liveInput = '';

                // Nhận diện chế độ chơi để cài thời gian gốc
                isSurvivalMode = document.getElementById('speedGameMode')?.value === 'survival';
                timerLeft = isSurvivalMode ? 15 : 60;

                const timerEl = document.getElementById('sTimer');
                if (timerEl) { 
                    timerEl.textContent = timerLeft; 
                    timerEl.classList.remove('danger'); 
                }

                const arena = document.getElementById('speedArena');
                const metrics = document.getElementById('speedMetrics');
                const result = document.getElementById('speedResult');
                if (arena) arena.style.display = '';
                if (metrics) metrics.style.display = '';
                if (result) result.style.display = 'none';

                const topicFilter = document.getElementById('speedTopic')?.value || '';
                pool = buildPool() || [];
                if (!pool.length) {
                    document.getElementById('speedTextArea').innerHTML = '<span style="color:var(--txt3)">Không có từ vựng phù hợp.</span>';
                    return;
                }

                updateMetrics();
                renderTextArea();
                updateHintBar();
                const inp = document.getElementById('speedInput');
                if (inp) { inp.value = ''; setTimeout(() => inp.focus(), 50); }
            };

            // Input handler
            const inp = document.getElementById('speedInput');

            inp.addEventListener('focus', () => {
                const hint = document.getElementById('speedHintBar');
                if (!started && hint && currentMode !== 'korean') {
                    hint.textContent = 'Bắt đầu gõ để khởi động đồng hồ!';
                }
            });

            inp.addEventListener('keydown', e => {
                if (finished) return;

                // Tab: convert QWERTY → Hangul
                if (e.key === 'Tab' && currentMode === 'korean') {
                    e.preventDefault();
                    if (window.Hangul && /[a-zA-Z]/.test(liveInput)) {
                        let conv = '';
                        for (const ch of liveInput) conv += q2j[ch] || ch;
                        liveInput = Hangul.a(conv.split(''));
                        inp.value = liveInput;
                        renderTextArea();
                        updateHintBar();
                        updateMetrics();
                    }
                    return;
                }

                // Restart shortcut
                if (e.key === 'Escape') { e.preventDefault(); speedRestart(); return; }
            });

            // Ghi đè hàm submitWord
            // Ghi đè hàm nộp chữ để cộng/trừ giờ
            function submitWord(typed) {
                if (!typed) return;
                if (!started) { started = true; startTimer(); }

                const expected = pool[wordIdx] || '';
                const typedArr = [...typed];
                const expArr = [...expected];
                const charsToCompare = Math.max(typedArr.length, expArr.length);
                
                for (let i = 0; i < charsToCompare; i++) {
                    const tChar = typedArr[i] || '';
                    const eChar = expArr[i] || '';
                    totalTyped += getStrokeCount(tChar);
                    if (tChar && tChar === eChar) {
                        correctChars += getStrokeCount(eChar);
                    }
                }

                // KIỂM TRA ĐÚNG/SAI VÀ PHẠT GIỜ ⏳
                if (typed === expected) {
                    wordsCompleted++;
                    if (isSurvivalMode) {
                        timerLeft += 2; // Gõ đúng +2s
                        showFloatingTime('+2s', 'correct');
                    }
                } else {
                    if (isSurvivalMode) {
                        timerLeft = Math.max(0, timerLeft - 1); // Gõ sai -1s
                        showFloatingTime('-1s', 'wrong');
                        if (timerLeft === 0) {
                            finishRound();
                            return;
                        }
                    }
                }

                wordIdx++;
                liveInput = '';
                inp.value = '';

                if (wordIdx >= pool.length) { finishRound(); return; }
                renderTextArea();
                updateMetrics();
                updateHintBar();
            }

            inp.addEventListener('input', e => {
                if (finished) return;
                const val = inp.value;

                // Space anywhere in value = word submission
                if (val.includes(' ')) {
                    const typed = val.replace(/\s+/g, '').trim();
                    inp.value = typed;
                    liveInput = typed;
                    submitWord(typed);
                    return;
                }

                if (!started && val.length > 0) { started = true; startTimer(); }
                liveInput = val;
                renderTextArea();
                updateHintBar();
                updateMetrics();
            });

            // Click arena to focus input
            document.getElementById('speedArena').addEventListener('click', () => {
                if (!finished) inp.focus();
            });

            // Keyboard shortcut Tab for restart when not focused on input
            document.getElementById('speedWrap').addEventListener('keydown', e => {
                if (e.key === 'Escape') speedRestart();
            });

            // Initial build
            pool = buildPool() || [];
            if (!pool.length) {
                document.getElementById('speedTextArea').innerHTML = '<span style="color:var(--txt3)">Không có từ vựng.</span>';
                return;
            }
            renderTextArea();
            updateMetrics();
            setTimeout(() => inp.focus(), 80);
        }

        /* ── Listening practice ── */
        function buildListen() {
            const wrap = document.getElementById('lpWrap');
            if (!words.length) { wrap.innerHTML = '<div class="empty-state">Chưa có từ vựng.</div>'; return; }

            const topics = [...new Set(words.map(w => w.topic).filter(Boolean))];
            let lpSpeed = 1.0; // playback rate

            wrap.innerHTML = `
            <div class="wp-toolbar">
                <select id="lpMode" onchange="lpRestart()">
                    <option value="kor-write-kor">Nghe tiếng Hàn → gõ tiếng Hàn</option>
                    <option value="kor-write-viet">Nghe tiếng Hàn → gõ tiếng Việt</option>
                </select>
                <select id="lpType" onchange="if(this.value){document.getElementById('lpTopic').value='';}lpRestart()">
                    <option value="">Tất cả từ loại</option>
                    <option value="명사">명사</option>
                    <option value="동사">동사</option>
                    <option value="형용사">형용사</option>
                    <option value="부사">부사</option>
                    <option value="감탄사">감탄사</option>
                    <option value="기타">기타</option>
                </select>
                <select id="lpTopic" onchange="if(this.value){document.getElementById('lpType').value='';}lpRestart()">
                    <option value="">Tất cả chủ đề</option>
                    ${topics.map(t => `<option value="${esc(t)}">${esc(t)}</option>`).join('')}
                </select>
            </div>
            <div class="wp-card" id="lpCard">
                <div class="wp-prompt-label">NGHE VÀ GÕ LẠI</div>

                <button class="lp-play-btn" id="lpPlayBtn" onclick="lpSpeak()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                    Nghe từ
                </button>

                <div class="lp-speed-row">
                    <span style="font-size:11px;color:var(--txt3);font-weight:600;letter-spacing:.05em">TỐC ĐỘ</span>
                    <button class="lp-speed-btn active" id="lpS1" onclick="lpSetSpeed(1.0, 'lpS1')">×1.0</button>
                    <button class="lp-speed-btn" id="lpS075" onclick="lpSetSpeed(0.75, 'lpS075')">×0.75</button>
                    <button class="lp-speed-btn" id="lpS05" onclick="lpSetSpeed(0.5, 'lpS05')">×0.5</button>
                </div>

                <div class="tp-input-wrap">
                    <div class="tp-hint-row" id="lpHintRow"></div>
                    <input class="tp-input" id="lpInput" type="text" autocomplete="off" autocorrect="off" spellcheck="false" placeholder="Gõ câu trả lời..." />
                    <div class="tp-keyboard-hint" id="lpKeyboardHint">💡 Tab: chuyển Hangul &nbsp;·&nbsp; Ctrl+L: nghe lại</div>
                    <div class="tp-btns-row">
                        <button class="btn btn-ghost" onclick="lpReveal()" id="lpRevealBtn">👁 Hiện đáp án</button>
                        <button class="btn btn-ghost" onclick="lpSkip()" id="lpSkipBtn">⏭ Bỏ qua</button>
                        <button class="wp-icon-btn wp-icon-btn--next" id="lpNextBtn" onclick="lpNext()" title="Từ tiếp theo" style="display:none;width:auto;padding:0 16px;gap:6px;font-size:13px;font-weight:500">
                            Tiếp theo
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 5l7 7-7 7"/><path d="M5 5l7 7-7 7"/></svg>
                        </button>
                    </div>
                </div>

                <div class="wp-result hidden" id="lpResult"></div>
                <div class="wp-answer hidden" id="lpAns"></div>
                <div class="wp-answer-sub hidden" id="lpAnsSub"></div>
                <div class="wp-prog" id="lpProg"></div>
            </div>`;

            const q2j = {
                'q':'ㅂ','w':'ㅈ','e':'ㄷ','r':'ㄱ','t':'ㅅ','y':'ㅛ','u':'ㅕ','i':'ㅑ','o':'ㅐ','p':'ㅔ',
                'a':'ㅁ','s':'ㄴ','d':'ㅇ','f':'ㄹ','g':'ㅎ','h':'ㅗ','j':'ㅓ','k':'ㅏ','l':'ㅣ',
                'z':'ㅋ','x':'ㅌ','c':'ㅊ','v':'ㅍ','b':'ㅠ','n':'ㅜ','m':'ㅡ',
                'Q':'ㅃ','W':'ㅉ','E':'ㄸ','R':'ㄲ','T':'ㅆ','O':'ㅒ','P':'ㅖ'
            };

            let pool = [], idx = 0, answered = false;

            function getPool() {
                const type = document.getElementById('lpType').value;
                const topic = document.getElementById('lpTopic').value;
                return [...words]
                    .filter(w => (!type || w.type === type) && (!topic || w.topic === topic))
                    .sort(() => Math.random() - .5);
            }

            function isKorAnswer() {
                return document.getElementById('lpMode').value === 'kor-write-kor';
            }

            function updateHintRow(typed) {
                if (!isKorAnswer()) { document.getElementById('lpHintRow').innerHTML = ''; return; }
                const expected = document.getElementById('lpAns').textContent.trim();
                if (!expected) return;
                const chars = [...expected];
                const typedChars = typed ? [...typed] : [];
                document.getElementById('lpHintRow').innerHTML = chars.map((ch, i) => {
                    let cls = '';
                    if (i < typedChars.length) cls = typedChars[i] === ch ? 'hit' : 'miss';
                    return `<span class="tp-char ${cls}">${i < typedChars.length ? esc(typedChars[i]) : '?'}</span>`;
                }).join('');
            }

            function render() {
                if (!pool.length) {
                    document.getElementById('lpPlayBtn').style.display = 'none';
                    document.getElementById('lpCard').querySelector('.tp-input-wrap').style.display = 'none';
                    document.getElementById('lpCard').querySelector('.lp-speed-row').style.display = 'none';
                    document.getElementById('lpProg').textContent = '';
                    return;
                }
                document.getElementById('lpPlayBtn').style.display = '';
                document.getElementById('lpCard').querySelector('.tp-input-wrap').style.display = '';
                document.getElementById('lpCard').querySelector('.lp-speed-row').style.display = '';
                answered = false;

                const w = pool[idx];
                const mode = document.getElementById('lpMode').value;
                const ans = document.getElementById('lpAns');
                const ansSub = document.getElementById('lpAnsSub');
                const input = document.getElementById('lpInput');
                const keyHint = document.getElementById('lpKeyboardHint');
                const playBtn = document.getElementById('lpPlayBtn');

                // Always speak Korean; answer depends on mode
                if (mode === 'kor-write-kor') {
                    ans.textContent = w.korean;
                    ansSub.textContent = (w.romanize ? `[${w.romanize}] ` : '') + (w.meaning || '');
                    input.placeholder = '한국어로 입력하세요...';
                    keyHint.textContent = '💡 Tab: chuyển Hangul · Ctrl+L: nghe lại';
                } else {
                    ans.textContent = w.meaning;
                    ansSub.textContent = w.korean + (w.romanize ? ` [${w.romanize}]` : '');
                    input.placeholder = 'Gõ nghĩa tiếng Việt...';
                    keyHint.textContent = '💡 Ctrl+L: nghe lại';
                }

                ans.classList.add('hidden');
                ansSub.classList.add('hidden');
                document.getElementById('lpResult').className = 'wp-result hidden';
                document.getElementById('lpNextBtn').style.display = 'none';
                document.getElementById('lpRevealBtn').style.display = '';
                document.getElementById('lpSkipBtn').style.display = '';
                document.getElementById('lpProg').textContent = `${idx + 1} / ${pool.length}`;
                input.value = '';
                input.className = 'tp-input';
                input.disabled = false;
                playBtn.className = 'lp-play-btn';
                playBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg> Nghe từ`;
                updateHintRow('');
                // auto-play khi sang từ mới
                setTimeout(() => { lpSpeak(); input.focus(); }, 300);
            }

            window.lpSpeak = () => {
                const w = pool[idx];
                if (!w) return;
                window.speechSynthesis.cancel();
                const utt = new SpeechSynthesisUtterance(w.korean);
                utt.lang = 'ko-KR';
                utt.rate = lpSpeed;
                const playBtn = document.getElementById('lpPlayBtn');
                playBtn.className = 'lp-play-btn playing';
                playBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Đang phát...`;
                utt.onend = () => {
                    if (playBtn) {
                        playBtn.className = 'lp-play-btn';
                        playBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg> Nghe lại`;
                    }
                };
                window.speechSynthesis.speak(utt);
            };

            window.lpSetSpeed = (rate, btnId) => {
                lpSpeed = rate;
                document.querySelectorAll('.lp-speed-btn').forEach(b => b.classList.remove('active'));
                document.getElementById(btnId).classList.add('active');
            };

            const lpInput = document.getElementById('lpInput');

            lpInput.addEventListener('input', () => {
                if (!isKorAnswer()) return;
                const raw = lpInput.value;
                const keyHint = document.getElementById('lpKeyboardHint');
                if (window.Hangul && /[a-zA-Z]/.test(raw)) {
                    let converted = '';
                    for (const ch of raw) converted += q2j[ch] || ch;
                    const sug = Hangul.a(converted.split(''));
                    if (sug !== raw) {
                        keyHint.innerHTML = `💡 Nhấn <strong>Tab</strong> để đổi thành: <b style="font-size:15px;color:var(--txt)">${esc(sug)}</b>`;
                    } else {
                        keyHint.textContent = raw ? '' : '💡 Gõ QWERTY rồi nhấn Tab để chuyển sang tiếng Hàn';
                    }
                } else {
                    keyHint.textContent = raw ? '' : '💡 Gõ QWERTY rồi nhấn Tab để chuyển sang tiếng Hàn';
                }
            });

            lpInput.addEventListener('keydown', e => {
                if (e.key === 'Tab' && isKorAnswer()) {
                    e.preventDefault();
                    const raw = lpInput.value;
                    if (window.Hangul && /[a-zA-Z]/.test(raw)) {
                        let converted = '';
                        for (const ch of raw) converted += q2j[ch] || ch;
                        lpInput.value = Hangul.a(converted.split(''));
                        updateHintRow(lpInput.value);
                        document.getElementById('lpKeyboardHint').textContent = '';
                    }
                } else if ((e.key === 'l' || e.key === 'L') && e.ctrlKey) {
                    e.preventDefault();
                    lpSpeak();
                } else if (e.key === 'Enter') {
                    if (answered) { lpNext(); return; }
                    lpCheck();
                }
            });

            function lpCheck() {
                if (answered) return;
                const typed = lpInput.value.trim();
                if (!typed) { lpSpeak(); return; } // Nếu chưa gõ gì, phát lại âm thanh
                const expected = document.getElementById('lpAns').textContent.trim();
                const norm = s => s.toLowerCase().replace(/\(.*?\)/g, '').replace(/\[.*?\]/g, '').replace(/\s+/g, ' ').trim();
                const expectedParts = expected.split(',').map(s => norm(s));
                const ok = expectedParts.includes(norm(typed));

                document.getElementById('lpAns').classList.remove('hidden');
                document.getElementById('lpAnsSub').classList.remove('hidden');
                const resultEl = document.getElementById('lpResult');

                if (ok) {
                    lpInput.className = 'tp-input correct';
                    resultEl.innerHTML = `✅ Đúng! «${esc(typed)}»`;
                    resultEl.className = 'wp-result correct';
                    answered = true;
                    document.getElementById('lpNextBtn').style.display = '';
                    document.getElementById('lpRevealBtn').style.display = 'none';
                    document.getElementById('lpSkipBtn').style.display = 'none';
                    updateHintRow(typed);
                } else {
                    lpInput.className = 'tp-input wrong';
                    resultEl.innerHTML = `❌ Bạn gõ: <strong>${esc(typed)}</strong> — Đáp án: <strong>${esc(expected)}</strong>`;
                    resultEl.className = 'wp-result wrong';
                    updateHintRow(typed);
                    setTimeout(() => {
                        lpInput.className = 'tp-input';
                        lpInput.value = '';
                        updateHintRow('');
                        document.getElementById('lpKeyboardHint').textContent = isKorAnswer() ? '💡 Gõ QWERTY rồi nhấn Tab để chuyển sang tiếng Hàn' : '';
                    }, 1200);
                }
            }

            window.lpNext = () => { if (!answered) return; idx = (idx + 1) % pool.length; render(); };
            window.lpSkip = () => {
                document.getElementById('lpAns').classList.remove('hidden');
                document.getElementById('lpAnsSub').classList.remove('hidden');
                const expected = document.getElementById('lpAns').textContent.trim();
                const resultEl = document.getElementById('lpResult');
                resultEl.innerHTML = `⏭ Đã bỏ qua — đáp án: <strong>${esc(expected)}</strong>`;
                resultEl.className = 'wp-result info';
                answered = true;
                document.getElementById('lpNextBtn').style.display = '';
                document.getElementById('lpRevealBtn').style.display = 'none';
                document.getElementById('lpSkipBtn').style.display = 'none';
                lpInput.disabled = true;
                window.speechSynthesis.cancel();
            };
            window.lpReveal = () => {
                document.getElementById('lpAns').classList.remove('hidden');
                document.getElementById('lpAnsSub').classList.remove('hidden');
            };
            window.lpRestart = () => { window.speechSynthesis.cancel(); pool = getPool(); idx = 0; render(); };

            pool = getPool();
            render();
        }
        const qwertyToJamo = {
            'q': 'ㅂ', 'w': 'ㅈ', 'e': 'ㄷ', 'r': 'ㄱ', 't': 'ㅅ', 'y': 'ㅛ', 'u': 'ㅕ', 'i': 'ㅑ', 'o': 'ㅐ', 'p': 'ㅔ',
            'a': 'ㅁ', 's': 'ㄴ', 'd': 'ㅇ', 'f': 'ㄹ', 'g': 'ㅎ', 'h': 'ㅗ', 'j': 'ㅓ', 'k': 'ㅏ', 'l': 'ㅣ',
            'z': 'ㅋ', 'x': 'ㅌ', 'c': 'ㅊ', 'v': 'ㅍ', 'b': 'ㅠ', 'n': 'ㅜ', 'm': 'ㅡ',
            'Q': 'ㅃ', 'W': 'ㅉ', 'E': 'ㄸ', 'R': 'ㄲ', 'T': 'ㅆ', 'O': 'ㅒ', 'P': 'ㅖ'
        };

        function getHangulSuggestion(text) {
            if (!window.Hangul || !/[a-zA-Z]/.test(text)) return null;
            let disassembled = Hangul.d(text);
            let mapped = disassembled.map(c => qwertyToJamo[c] || c);
            const sug = Hangul.a(mapped);
            return sug !== text ? sug : null;
        }

        function onKorKeydown(e) {
            if (e.key === 'Tab') {
                const sug = getHangulSuggestion(e.target.value);
                if (sug) {
                    e.preventDefault();
                    e.target.value = sug;
                    onSearch();
                }
            } else if (e.key === 'Enter') {
                e.preventDefault();
                addWord();
            }
        }

        function onFocus() { onSearch(); }

        function onSearch() {
            const kor = document.getElementById('searchKor').value.trim();
            const mean = document.getElementById('iMean').value.trim();
            const hasVal = !!(kor || mean);
            document.getElementById('sClear').classList.toggle('show', hasVal);
            clearTimeout(sTimer);
            if (!hasVal) { closeDrop(); closeForm(); renderTable(); return; }
            sTimer = setTimeout(() => updateDrop(), 100);
            renderTable(); // bảng lọc theo search real-time
        }

        function updateDrop() {
            const korRaw = document.getElementById('searchKor').value;
            const kor = korRaw.trim();
            const mean = document.getElementById('iMean').value.trim();
            const type = document.getElementById('iType').value;
            const drop = document.getElementById('drop');
            const hint = document.getElementById('dropHint');

            const sug = getHangulSuggestion(korRaw);
            const sugHtml = sug ? `<div class="drop-item" style="background:#E6F1FB; color:#0C447C; grid-template-columns:1fr; text-align:center; padding:12px;" onmousedown="document.getElementById('searchKor').value='${escA(sug)}'; onSearch();"><span style="font-size:13px; font-weight:500;">💡 Nhấn <strong>Tab</strong> để đổi thành: <b style="font-size:16px;">${esc(sug)}</b></span></div>` : '';

            const matches = words.filter(w =>
                (!kor || w.korean?.toLowerCase().includes(kor.toLowerCase()) || w.romanize?.toLowerCase().includes(kor.toLowerCase())) &&
                (!mean || w.meaning?.toLowerCase().includes(mean.toLowerCase())) &&
                (!type || w.type === type)
            );

            if (matches.length || sugHtml) {
                let listHtml = matches.slice(0, 10).map(w => `
      <div class="drop-item" onmousedown="pickWord('${escA(w.korean)}')">
        <span class="di-kor">${esc(w.korean)}</span>
        <span class="badge b-${esc(w.type || '기타')}">${esc(w.type || '기타')}</span>
        <span class="di-mean">${esc(w.meaning)}</span>
        <span class="di-rom">${esc(w.romanize || '')}</span>
      </div>`).join('');
                drop.innerHTML = sugHtml + listHtml;
                if (!matches.length && sugHtml) {
                    drop.innerHTML += `<div class="drop-empty" style="border-top:0.5px solid var(--bdr)">Không tìm thấy kết quả.</div>`;
                }
                drop.classList.add('show');
            } else {
                drop.innerHTML = `<div class="drop-empty">Không tìm thấy — từ mới! Điền thông tin bên dưới để thêm.</div>`;
                drop.classList.add('show');
            }

            const exact = kor && words.some(w => w.korean === kor);
            hint.textContent = exact
                ? `"${kor}" đã có trong danh sách — bạn có thể thêm nghĩa mới bên dưới.`
                : `Điền thông tin và nhấn Thêm để lưu vào danh sách.`;
            hint.classList.add('show');

            openForm(kor);
        }

        function pickWord(kor) {
            document.getElementById('searchKor').value = kor;
            document.getElementById('sClear').classList.add('show');
            closeDrop();
            openForm(kor);
            renderTable();
            setTimeout(() => document.getElementById('iMean').focus(), 50);
        }

        function closeDrop() {
            document.getElementById('drop').classList.remove('show');
            document.getElementById('dropHint').classList.remove('show');
        }

        function openForm(kor) {
            document.getElementById('addForm').classList.add('show');
            checkDup(kor);
        }

        function closeForm() {
            document.getElementById('addForm').classList.remove('show');
            document.getElementById('dupWarn').classList.remove('show');
            closeDrop();
        }

        function clearSearch() {
            document.getElementById('searchKor').value = '';
            document.getElementById('sClear').classList.remove('show');
            ['iMean', 'iEx', 'iExM', 'iTopic'].forEach(id => document.getElementById(id).value = '');
            document.getElementById('chkAdvanced').checked = false;
            document.getElementById('advancedFields').style.display = 'none';
            closeForm();
            renderTable();
        }

        document.addEventListener('click', e => {
            if (!e.target.closest('#searchPanel')) closeDrop();
        });

        /* Dup check */
        function checkDup(kor) {
            const w = document.getElementById('dupWarn');
            const ex = words.filter(x => x.korean === kor);
            if (!ex.length) { w.classList.remove('show'); return; }
            w.innerHTML = `<strong>Từ "${esc(kor)}" đã tồn tại</strong> với nghĩa:<br><div style="margin-top:3px;line-height:1.9">${ex.map(x => '• ' + esc(x.meaning)).join('<br>')}</div><div style="margin-top:6px;font-size:11px;color:#854F0B">Nhập nghĩa khác → hệ thống sẽ xác nhận trước khi lưu.</div>`;
            w.classList.add('show');
        }

        const CHO = ["g", "kk", "n", "d", "tt", "r", "m", "b", "pp", "s", "ss", "", "ch", "ch", "ch", "k", "t", "p", "h"];
        const JUNG = ["a", "ae", "ya", "yae", "eo", "e", "yeo", "ye", "o", "wa", "wae", "oe", "yo", "u", "wo", "we", "wi", "yu", "eu", "ui", "i"];
        const JONG = ["", "k", "kk", "ks", "n", "nj", "nh", "d", "l", "lg", "lm", "lb", "ls", "lt", "lp", "lh", "m", "b", "bs", "s", "ss", "ng", "ch", "ch", "k", "t", "p", "h"];

        function romanize(text) {
            let res = "";
            for (let i = 0; i < text.length; i++) {
                let code = text.charCodeAt(i);
                if (code >= 44032 && code <= 55203) {
                    code -= 44032;
                    let jong = code % 28;
                    let jung = ((code - jong) / 28) % 21;
                    let cho = (((code - jong) / 28) - jung) / 21;
                    res += CHO[cho] + JUNG[jung] + JONG[jong];
                } else res += text.charAt(i);
            }
            return res.toLowerCase().trim();
        }

        /* Add */
        async function addWord() {
            if (!isAdmin) { toast('Bạn cần quyền Admin để thêm từ'); return; }
            const kor = document.getElementById('searchKor').value.trim();
            const type = document.getElementById('iType').value || '기타';
            const mean = document.getElementById('iMean').value.trim();
            const rom = romanize(kor);
            const ex = document.getElementById('iEx').value.trim();
            const exm = document.getElementById('iExM').value.trim();
            const topic = document.getElementById('iTopic').value.trim();
            if (!kor || !mean) { toast('Vui lòng nhập từ tiếng Hàn và nghĩa'); return; }

            const existing = words.filter(w => w.korean === kor);
            if (existing.length) {
                const same = existing.some(w => norm(w.meaning) === norm(mean));
                if (same) {
                    showModal('Từ đã tồn tại', `Từ <strong>${esc(kor)}</strong> với nghĩa <strong>${esc(mean)}</strong> đã có trong danh sách.`, existing.map(w => w.meaning), [{ label: 'Đã hiểu', action: closeModal, ghost: true }]);
                    return;
                }
                pendingEntry = { kor, type, mean, rom, ex, exm, topic };
                showModal('Từ có nghĩa khác', `Từ <strong>${esc(kor)}</strong> đã tồn tại. Thêm nghĩa mới "<strong>${esc(mean)}</strong>"?`, existing.map(w => w.meaning),
                    [{ label: 'Thêm nghĩa mới', action: () => { closeModal(); doAdd(pendingEntry); }, ghost: false }, { label: 'Huỷ', action: closeModal, ghost: true }]);
                return;
            }
            await doAdd({ kor, type, mean, rom, ex, exm, topic });
        }

        function norm(s) { return String(s || '').trim().toLowerCase().replace(/\s+/g, ' '); }

        async function doAdd({ kor, type, mean, rom, ex, exm, topic }) {
            const entry = { korean: kor, type, meaning: mean, romanize: rom, example: ex, example_meaning: exm, topic };
            document.getElementById('btnAdd').disabled = true;
            if (sb) {
                try {
                    const { data, error } = await sp.from('korean_vocab').insert([entry]).select();
                    if (error) throw error;
                    if (data && data.length) words.unshift(data[0]);
                } catch (e) {
                    console.error('Lỗi khi thêm:', e);
                    toast('Lỗi Supabase: ' + (e.message || ''));
                    // We don't save to local array if it's a DB error, to reflect true state
                    document.getElementById('btnAdd').disabled = false;
                    return;
                }
            } else { entry.id = Date.now(); entry.created_at = new Date().toISOString(); words.unshift(entry); saveLocal(); }
            toast('Đã thêm: ' + kor);
            clearSearch();
            document.getElementById('btnAdd').disabled = false;
            refresh();
            document.getElementById('searchKor').focus();
        }

        async function deleteWord(id) {
            if (!isAdmin) { toast('Bạn cần quyền Admin để xóa từ'); return; }
            if (!confirm('Xóa từ này?')) return;
            if (sb) {
                try {
                    const { error } = await sp.from('korean_vocab').delete().eq('id', id);
                    if (error) throw error;
                } catch (e) {
                    console.error('Lỗi khi xóa:', e);
                    toast('Lỗi Supabase: ' + (e.message || ''));
                    return; // Ngừng tiếp tục nếu xóa lỗi trên CSDL
                }
            }
            words = words.filter(w => w.id !== id);
            if (!sb) saveLocal();
            refresh(); toast('Đã xóa');
        }

        /* Edit */
        function editWord(id) {
            const w = words.find(x => x.id === id);
            if (!w) return;
            document.getElementById('eId').value = id;
            document.getElementById('eKor').value = w.korean || '';
            document.getElementById('eType').value = w.type || '기타';
            document.getElementById('eMean').value = w.meaning || '';
            document.getElementById('eEx').value = w.example || '';
            document.getElementById('eExM').value = w.example_meaning || '';
            document.getElementById('eTopic').value = w.topic || '';
            document.getElementById('editModal').classList.add('show');
            setTimeout(() => document.getElementById('eMean').focus(), 100);
        }

        function closeEditModal() {
            document.getElementById('editModal').classList.remove('show');
        }

        document.getElementById('editModal').addEventListener('click', e => {
            if (e.target === document.getElementById('editModal')) closeEditModal();
        });

        async function doUpdate() {
            if (!isAdmin) { toast('Bạn cần quyền Admin để cập nhật'); return; }
            const id = document.getElementById('eId').value;
            const kor = document.getElementById('eKor').value.trim();
            const type = document.getElementById('eType').value || '기타';
            const mean = document.getElementById('eMean').value.trim();
            const ex = document.getElementById('eEx').value.trim();
            const exm = document.getElementById('eExM').value.trim();
            const topic = document.getElementById('eTopic').value.trim();
            if (!kor || !mean) { toast('Vui lòng nhập từ tiếng Hàn và nghĩa'); return; }
            const rom = romanize(kor);
            const patch = { korean: kor, type, meaning: mean, romanize: rom, example: ex, example_meaning: exm, topic };
            if (sb) {
                try {
                    const { data, error } = await sp.from('korean_vocab').update(patch).eq('id', id).select();
                    if (error) throw error;
                    if (data && data[0]) {
                        const idx = words.findIndex(w => String(w.id) === String(id));
                        if (idx !== -1) words[idx] = data[0];
                    }
                } catch (e) {
                    console.error('Lỗi cập nhật:', e);
                    toast('Lỗi Supabase: ' + (e.message || ''));
                    return; // Ngừng tiếp tục nếu lỗi CSDL
                }
            } else {
                const idx = words.findIndex(w => String(w.id) === String(id));
                if (idx !== -1) words[idx] = { ...words[idx], ...patch };
                saveLocal();
            }
            closeEditModal();
            toast('Đã cập nhật: ' + kor);
            refresh();
        }

        /* Table */
        function renderTable() {
            const kor = document.getElementById('searchKor').value.trim().toLowerCase();
            const mean = document.getElementById('iMean').value.trim().toLowerCase();
            const type = document.getElementById('iType').value;
            // const t = document.getElementById('fType').value;
            const tp = document.getElementById('fTopic').value;
            const sort = document.getElementById('fSort').value;
            let list = words.filter(w =>
                (!kor || w.korean?.toLowerCase().includes(kor) || w.romanize?.toLowerCase().includes(kor)) &&
                (!mean || w.meaning?.toLowerCase().includes(mean)) &&
                (!type || w.type === type)/* &&
                (!t || w.type === t)*/ && (!tp || w.topic === tp)
            );
            if (sort === 'kor_asc') list.sort((a, b) => (a.korean || '').localeCompare(b.korean || ''));
            else if (sort === 'kor_desc') list.sort((a, b) => (b.korean || '').localeCompare(a.korean || ''));
            else if (sort === 'mean_asc') list.sort((a, b) => (a.meaning || '').localeCompare(b.meaning || ''));
            else if (sort === 'mean_desc') list.sort((a, b) => (b.meaning || '').localeCompare(a.meaning || ''));
            else if (sort === 'type_asc') list.sort((a, b) => (a.type || '').localeCompare(b.type || ''));
            const tb = document.getElementById('tbody');
            if (!list.length) { tb.innerHTML = `<tr><td colspan="7"><div class="empty-state">Không tìm thấy từ nào.</div></td></tr>`; return; }
            tb.innerHTML = list.map(w => `
    <tr>
      <td><span class="kor">${esc(w.korean)}</span></td>
      <td><span class="badge b-${esc(w.type || '기타')}">${esc(w.type || '기타')}</span></td>
      <td>${esc(w.meaning)}</td>
      <td style="font-size:12px;color:var(--txt2)">${esc(w.romanize || '')}</td>
      <td style="font-size:12px;color:var(--txt2)">${esc(w.example || '')}${w.example_meaning ? `<div class="ex-viet">${esc(w.example_meaning)}</div>` : ''}</td> 
      <td style="font-size:12px;color:var(--txt3)">${esc(w.topic || '')}</td>
      <td class="admin-only" style="white-space:nowrap">
        <button class="btn-edit" onclick="editWord(${w.id})" title="Chỉnh sửa">✎</button>
        <button class="btn-del" onclick="deleteWord(${w.id})" title="Xóa">✕</button>
      </td>
    </tr>`).join('');
        }

        /* Flashcard */
        function buildFlash() {
            const wrap = document.getElementById('fcWrap');
            if (!words.length) { wrap.innerHTML = '<div class="empty-state">Chưa có từ vựng.</div>'; return; }

            // Collect unique topics
            const allTopics = [...new Set(words.map(w => w.topic).filter(Boolean))].sort();

            // Filter mode: 'type' or 'topic'
            let filterMode = 'type'; // 'type' = lọc theo từ loại, 'topic' = lọc theo chủ đề
            let selType = '';
            let selTopic = '';
            let pool = [...words].sort(() => Math.random() - .5);
            let idx = 0;

            function applyFilter() {
                if (filterMode === 'type') {
                    pool = [...words].filter(w => !selType || w.type === selType).sort(() => Math.random() - .5);
                } else {
                    pool = [...words].filter(w => !selTopic || w.topic === selTopic).sort(() => Math.random() - .5);
                }
                idx = 0;
            }

            function render() {
                if (!pool.length) {
                    wrap.innerHTML = '<div class="empty-state">Không có từ nào phù hợp.</div>';
                    return;
                }
                const w = pool[idx];

                const typeOptions = ['명사','동사','형용사','부사','감탄사','기타']
                    .map(t => `<option value="${t}" ${selType===t?'selected':''}>${t}</option>`).join('');

                const topicOptions = allTopics
                    .map(t => `<option value="${t}" ${selTopic===t?'selected':''}>${esc(t)}</option>`).join('');

                wrap.innerHTML = `
      <div class="fc-toolbar">
        <div class="fc-filter-toggle">
          <button class="fc-toggle-btn ${filterMode==='type'?'active':''}" onclick="fcSetMode('type')">Từ loại</button>
          <button class="fc-toggle-btn ${filterMode==='topic'?'active':''}" onclick="fcSetMode('topic')">Chủ đề</button>
        </div>
        ${filterMode === 'type' ? `
        <select id="fcType" onchange="fcTypeFilter()">
          <option value="">Tất cả từ loại</option>
          ${typeOptions}
        </select>` : `
        <select id="fcTopic" onchange="fcTopicFilter()">
          <option value="">Tất cả chủ đề</option>
          ${topicOptions}
        </select>`}
        <button class="btn btn-ghost" onclick="fcShuffle()">Xáo bài</button>
      </div>
      <div class="fc-prog">${idx + 1} / ${pool.length}</div>
      <div class="fc-card" id="fcard" onclick="this.classList.toggle('flipped')">
        <div class="fc-inner">
          <div class="fc-face fc-front">
            <span class="fc-kor">${esc(w.korean)}</span>
            <span class="badge b-${esc(w.type || '기타')}">${esc(w.type || '기타')}</span>
            ${w.topic ? `<span style="font-size:11px;color:var(--txt3);margin-top:-4px">${esc(w.topic)}</span>` : ''}
            <span class="fc-hint">Nhấn để xem nghĩa</span>
          </div>
          <div class="fc-face fc-back">
            <span class="fc-meaning">${esc(w.meaning)}</span>
            ${w.romanize ? `<span class="fc-sub">[${esc(w.romanize)}]</span>` : ''}
            ${w.example ? `<span class="fc-sub" style="font-size:12px;margin-top:4px">${esc(w.example)}</span>` : ''}
            ${w.example_meaning ? `<span class="fc-sub" style="font-size:11px;color:var(--txt3)">${esc(w.example_meaning)}</span>` : ''}
          </div>
        </div>
      </div>
      <div class="fc-btns">
        <button class="btn btn-ghost" onclick="fcGo(-1)" ${idx === 0 ? 'disabled' : ''}>← Trước</button>
        <button class="btn btn-ghost" onclick="fcGo(1)" ${idx === pool.length - 1 ? 'disabled' : ''}>Tiếp →</button>
      </div>`;

                window.fcGo = dir => { idx = Math.max(0, Math.min(pool.length - 1, idx + dir)); render(); };
                window.fcTypeFilter = () => { selType = document.getElementById('fcType').value; applyFilter(); render(); };
                window.fcTopicFilter = () => { selTopic = document.getElementById('fcTopic').value; applyFilter(); render(); };
                window.fcSetMode = mode => {
                    filterMode = mode;
                    // When switching mode, reset to "all" of the OTHER dimension
                    if (mode === 'type') { selTopic = ''; }
                    else { selType = ''; }
                    applyFilter();
                    render();
                };
                window.fcShuffle = () => { pool.sort(() => Math.random() - .5); idx = 0; render(); };
            }
            render();
        }

        /* Modal */
        function showModal(title, body, meanings, btns) {
            document.getElementById('mTitle').innerHTML = title;
            document.getElementById('mBody').innerHTML = body;
            const ml = document.getElementById('mList');
            if (meanings?.length) { ml.style.display = 'block'; ml.innerHTML = '<strong style="font-size:10px;color:var(--txt3);letter-spacing:.05em;text-transform:uppercase">Nghĩa hiện có</strong><br>' + meanings.map(m => '• ' + esc(m)).join('<br>'); }
            else ml.style.display = 'none';
            const bc = document.getElementById('mBtns'); bc.innerHTML = '';
            btns.forEach(b => { const btn = document.createElement('button'); btn.className = 'btn ' + (b.ghost ? 'btn-ghost' : 'btn-dark'); btn.textContent = b.label; btn.onclick = b.action; bc.appendChild(btn); });
            document.getElementById('modal').classList.add('show');
        }
        function closeModal() { document.getElementById('modal').classList.remove('show'); }
        document.getElementById('modal').addEventListener('click', e => { if (e.target === document.getElementById('modal')) closeModal(); });

        /* Export */
        function exportCSV() {
            if (!words.length) { toast('Chưa có dữ liệu'); return; }
            const h = ['Tiếng Hàn', 'Từ loại', 'Nghĩa tiếng Việt', 'Phiên âm', 'Câu ví dụ', 'Nghĩa câu ví dụ', 'Chủ đề'];
            const rows = words.map(w => [w.korean, w.type, w.meaning, w.romanize, w.example, w.example_meaning, w.topic].map(v => `"${(v || '').replace(/"/g, '""')}"`));
            const csv = [h.map(x => `"${x}"`).join(','), ...rows.map(r => r.join(','))].join('\n');
            const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' }));
            a.download = 'tu_vung_tieng_han.xlsx'; a.click(); toast('Đã xuất Excel');
        }

        /* Utils */
        function esc(s) { if (!s) return ''; return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
        function escA(s) { return esc(s).replace(/'/g, '&#39;'); }
        function toast(msg, ms = 2500) { const t = document.getElementById('toast'); t.textContent = msg; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), ms); }

        /* ═══════════════════════════════════
           TRẮC NGHIỆM 4 ĐÁP ÁN (Multiple Choice)
           ═══════════════════════════════════ */

        // Tất cả state MC là flat global — không closure, không object wrapper
        let MC_answered = false;
        let MC_choices  = [];
        let MC_correct  = null;
        let MC_idx      = 0;
        let MC_pool     = [];
        let MC_score    = 0;
        let MC_streak   = 0;
        let MC_maxStreak = 0;
        let MC_results  = [];
        let MC_mode     = 'kor-viet';

        window.addEventListener('keydown', function(e) {
            if (!document.getElementById('pane-mc')?.classList.contains('active')) return;
            if (['INPUT','TEXTAREA'].includes(e.target.tagName)) return;
            const ki = ['1','2','3','4'].indexOf(e.key);
            if (!MC_answered && ki !== -1 && ki < MC_choices.length) {
                e.preventDefault();
                mcPick(ki);
            } else if (MC_answered && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                mcNext();
            }
        }, true);

        function buildMC() {
            const wrap = document.getElementById('mcWrap');
            if (!words.length) { wrap.innerHTML = '<div class="empty-state">Chưa có từ vựng.</div>'; return; }
            if (words.length < 4) { wrap.innerHTML = '<div class="empty-state">Cần ít nhất 4 từ để bắt đầu trắc nghiệm.</div>'; return; }
            const topics = [...new Set(words.map(w => w.topic).filter(Boolean))];
            wrap.innerHTML = `
            <div class="mc-toolbar">
                <select id="mcMode">
                    <option value="kor-viet">Tiếng Hàn → chọn nghĩa tiếng Việt</option>
                    <option value="viet-kor">Tiếng Việt → chọn từ tiếng Hàn</option>
                    <option value="kor-rom">Tiếng Hàn → chọn phiên âm</option>
                </select>
                <select id="mcType" onchange="if(this.value){document.getElementById('mcTopic').value='';}">
                    <option value="">Tất cả từ loại</option>
                    <option value="명사">명사</option><option value="동사">동사</option>
                    <option value="형용사">형용사</option><option value="부사">부사</option>
                    <option value="감탄사">감탄사</option><option value="기타">기타</option>
                </select>
                <select id="mcTopic" onchange="if(this.value){document.getElementById('mcType').value='';}">
                    <option value="">Tất cả chủ đề</option>
                    ${topics.map(t => `<option value="${esc(t)}">${esc(t)}</option>`).join('')}
                </select>
                <button class="btn btn-dark" onclick="mcStart()">▶ Bắt đầu</button>
            </div>
            <div id="mcGameArea"></div>`;
            mcStart();
        }

        function mcGetLabel(w) {
            if (MC_mode === 'kor-viet') return w.meaning;
            if (MC_mode === 'viet-kor') return w.korean;
            return w.romanize;
        }

        function mcStart() {
            MC_mode    = document.getElementById('mcMode')?.value || 'kor-viet';
            const type  = document.getElementById('mcType')?.value || '';
            const topic = document.getElementById('mcTopic')?.value || '';
            let pool = [...words].filter(w => (!type || w.type === type) && (!topic || w.topic === topic));
            if (MC_mode === 'kor-rom') pool = pool.filter(w => w.romanize);
            if (pool.length < 4) {
                document.getElementById('mcGameArea').innerHTML = '<div class="empty-state" style="padding:30px 0">Không đủ từ (cần ≥ 4) cho bộ lọc này.</div>';
                return;
            }
            MC_pool      = pool.sort(() => Math.random() - .5);
            MC_idx       = 0;
            MC_score     = 0;
            MC_streak    = 0;
            MC_maxStreak = 0;
            MC_results   = [];
            mcRender();
        }

        function mcMakeChoices(correctWord) {
            const distractors = [...MC_pool]
                .filter(w => w !== correctWord && mcGetLabel(w))
                .sort(() => Math.random() - .5).slice(0, 3);
            return [correctWord, ...distractors]
                .sort(() => Math.random() - .5)
                .map(w => ({ word: w, label: mcGetLabel(w) }));
        }

        function mcRender() {
            const gameArea = document.getElementById('mcGameArea');
            if (!gameArea) return;
            if (MC_idx >= MC_pool.length) { mcShowSummary(); return; }

            MC_answered = false;
            const w = MC_pool[MC_idx];
            MC_correct  = w;
            MC_choices  = mcMakeChoices(w);

            const prompt = MC_mode === 'viet-kor' ? w.meaning : w.korean;
            const sub    = MC_mode === 'kor-viet' && w.romanize ? `[${w.romanize}]`
                         : MC_mode === 'viet-kor' && w.type     ? `[${w.type}]`
                         : MC_mode === 'kor-rom'  && w.type     ? `[${w.type}]` : '';
            const pct = (MC_idx / MC_pool.length * 100).toFixed(1);
            const FA  = ['<i class="fa-solid fa-1"></i>','<i class="fa-solid fa-2"></i>','<i class="fa-solid fa-3"></i>','<i class="fa-solid fa-4"></i>'];

            gameArea.innerHTML = `
            <div class="mc-card">
                <div class="mc-header">
                    <span class="mc-q-label">Câu ${MC_idx + 1}/${MC_pool.length}</span>
                    <div class="mc-prog-bar-wrap"><div class="mc-prog-bar-fill" style="width:${pct}%"></div></div>
                    <span class="mc-score-badge"><i class="fa-solid fa-check" style="color:#27500A;font-size:11px"></i> ${MC_score}</span>
                </div>
                <div class="mc-prompt">
                    <div class="mc-prompt-kor">${esc(prompt)}</div>
                    ${sub ? `<div class="mc-prompt-sub">${esc(sub)}</div>` : ''}
                </div>
                <div class="mc-choices">
                    ${MC_choices.map((c, i) => `
                    <button class="mc-choice" id="mc-opt-${i}" onclick="mcPick(${i})">
                        <span class="mc-key">${FA[i]}</span>${esc(c.label || '—')}
                    </button>`).join('')}
                </div>
                <div class="mc-feedback" id="mcFeedback"></div>
                <div class="mc-next-row">
                    <button class="btn btn-ghost" id="mcNextBtn" onclick="mcNext()" style="display:none">
                        ${MC_idx + 1 < MC_pool.length ? 'Câu tiếp <i class="fa-solid fa-arrow-right"></i>' : '<i class="fa-solid fa-flag-checkered"></i> Xem kết quả'}
                    </button>
                </div>
                ${MC_streak >= 3 ? `<div class="mc-streak">🔥 Chuỗi ${MC_streak} câu đúng!</div>` : ''}
            </div>`;
            // Focus vào mcWrap để phím 1-4 hoạt động ngay
            requestAnimationFrame(() => {
                const wrap = document.getElementById('mcWrap');
                if (wrap) wrap.focus();
            });
        }

        function mcPick(i) {
            if (MC_answered) return;
            MC_answered = true;
            const isRight = MC_choices[i].word === MC_correct;
            MC_results.push({ word: MC_correct, correct: isRight, chosen: MC_choices[i].label });
            if (isRight) { MC_score++; MC_streak++; if (MC_streak > MC_maxStreak) MC_maxStreak = MC_streak; }
            else MC_streak = 0;

            MC_choices.forEach((c, j) => {
                const btn = document.getElementById(`mc-opt-${j}`);
                if (!btn) return;
                btn.disabled = true;
                if (c.word === MC_correct) btn.classList.add(j === i ? 'correct' : 'reveal');
                else if (j === i) btn.classList.add('wrong');
            });

            const fb = document.getElementById('mcFeedback');
            if (isRight) {
                fb.className = 'mc-feedback correct';
                fb.innerHTML = MC_streak >= 3 ? `🔥 Đúng! Chuỗi ${MC_streak}!` : `<i class="fa-solid fa-check"></i> Chính xác!`;
            } else {
                fb.className = 'mc-feedback wrong';
                const cl = MC_choices.find(c => c.word === MC_correct)?.label || '';
                fb.innerHTML = `<i class="fa-solid fa-xmark"></i> Sai! Đáp án: ${esc(cl)}`;
            }
            document.getElementById('mcNextBtn').style.display = '';
            requestAnimationFrame(() => { const w = document.getElementById('mcWrap'); if (w) w.focus(); });
        }

        function mcNext() {
            MC_idx++;
            mcRender();
        }

        function mcShowSummary() {
            const pct = Math.round(MC_score / MC_pool.length * 100);
            const emoji = pct >= 90 ? '🏆' : pct >= 70 ? '🎉' : pct >= 50 ? '😊' : '📚';
            const wrongs = MC_results.filter(r => !r.correct);
            const gameArea = document.getElementById('mcGameArea');
            gameArea.innerHTML = `
            <div class="mc-summary">
                <div class="mc-summary-emoji">${emoji}</div>
                <div class="mc-summary-score">${pct}%</div>
                <div class="mc-summary-label">${MC_score} / ${MC_pool.length} câu đúng</div>
                <div class="mc-summary-stats">
                    <div class="mc-stat"><span class="mc-stat-num" style="color:#27500A">${MC_score}</span><span class="mc-stat-lbl green">ĐÚNG</span></div>
                    <div class="mc-stat"><span class="mc-stat-num" style="color:#A32D2D">${MC_pool.length - MC_score}</span><span class="mc-stat-lbl red">SAI</span></div>
                    <div class="mc-stat"><span class="mc-stat-num">${MC_maxStreak}</span><span class="mc-stat-lbl">🔥 MAX</span></div>
                </div>
                <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center">
                    <button class="btn btn-dark" onclick="mcStart()"><i class="fa-solid fa-rotate-right"></i> Làm lại</button>
                    <button class="btn btn-ghost" onclick="mcRetryWrongs()" ${!wrongs.length ? 'disabled' : ''}>
                        <i class="fa-solid fa-pen"></i> Ôn ${wrongs.length} câu sai
                    </button>
                </div>
                ${wrongs.length ? `
                <div class="mc-review-list">
                    <div style="font-size:11px;font-weight:600;color:var(--txt3);letter-spacing:.06em;text-transform:uppercase;margin-bottom:6px">Các câu sai</div>
                    ${wrongs.map(r => `
                    <div class="mc-review-item">
                        <span class="mc-review-icon"><i class="fa-solid fa-xmark" style="color:#A32D2D"></i></span>
                        <div>
                            <div><span class="mc-review-kor">${esc(r.word.korean)}</span> <span class="mc-review-mean">${esc(r.word.meaning)}</span></div>
                            <div class="mc-review-your">Bạn chọn: ${esc(r.chosen || '—')}</div>
                        </div>
                    </div>`).join('')}
                </div>` : ''}
            </div>`;
            gameArea._wrongWords = wrongs.map(r => r.word);
        }

        function mcRetryWrongs() {
            const gameArea = document.getElementById('mcGameArea');
            const wrongWords = gameArea._wrongWords || [];
            if (wrongWords.length < 2) { toast('Không đủ từ sai để ôn lại'); return; }
            const extra = [...MC_pool].filter(w => !wrongWords.includes(w)).sort(() => Math.random() - .5);
            MC_pool      = [...wrongWords, ...extra].slice(0, Math.max(wrongWords.length, 4)).sort(() => Math.random() - .5);
            MC_idx       = 0;
            MC_score     = 0;
            MC_streak    = 0;
            MC_maxStreak = 0;
            MC_results   = [];
            mcRender();
        }

        /* ═══════════════════════════════════
           QUIZ
           ═══════════════════════════════════ */
        let quizzes = [];

        async function loadQuizzes() {
            try {
                const { data, error } = await sp.from('quizzes').select('*').order('created_at', { ascending: false });
                if (error) throw error;
                quizzes = data || [];
            } catch(e) { quizzes = []; }
        }

        async function buildQuiz() {
            const wrap = document.getElementById('quizWrap');
            wrap.innerHTML = '<div class="empty-state">Đang tải...</div>';
            await loadQuizzes();
            if (!quizzes.length) {
                wrap.innerHTML = '<div class="empty-state">Chưa có bài kiểm tra nào. Admin hãy tạo bài!</div>';
                return;
            }
            // Load attempt counts for current user
            let attemptCounts = {}; // quizId -> count
            if (currentUser) {
                try {
                    const { data } = await sp.from('quiz_results')
                        .select('quiz_id')
                        .eq('user_id', currentUser.id);
                    (data || []).forEach(r => {
                        attemptCounts[r.quiz_id] = (attemptCounts[r.quiz_id] || 0) + 1;
                    });
                } catch(e) {}
            }
            renderQuizList(attemptCounts);
        }

        function quizModeLabel(mode) {
            const map = {
                'viet-kor': '✍️ Việt → viết Hàn',
                'kor-kor':  '✍️ Hàn → viết lại',
                'kor-viet': '✍️ Hàn → viết Việt',
                'type-viet-kor': '⌨️ Việt → gõ Hàn',
                'type-kor-kor':  '⌨️ Hàn → gõ lại',
                'type-kor-viet': '⌨️ Hàn → gõ Việt',
                'listen-kor':    '🔊 Nghe → gõ Hàn',
                'listen-viet':   '🔊 Nghe → gõ Việt',
            };
            return map[mode] || mode;
        }

        function renderQuizList(attemptCounts = {}) {
            const wrap = document.getElementById('quizWrap');
            wrap.innerHTML = `
                <div class="quiz-list">
                    ${quizzes.map(q => {
                        const max = q.max_attempts || 0;
                        const used = attemptCounts[q.id] || 0;
                        const exhausted = max > 0 && used >= max;
                        const remaining = max > 0 ? max - used : null;
                        const modeLabel = quizModeLabel(q.mode);
                        const attemptBadge = max > 0
                            ? exhausted
                                ? `<span class="quiz-attempt-badge exhausted">Hết lượt</span>`
                                : `<span class="quiz-attempt-badge">${remaining} lượt còn lại</span>`
                            : '';
                        return `
                        <div class="quiz-card ${exhausted ? 'exhausted' : ''}" ${!exhausted ? `onclick="startQuiz('${q.id}')"` : ''}>
                            <div class="quiz-card-info">
                                <div class="quiz-card-title">${esc(q.title)} ${attemptBadge}</div>
                                <div class="quiz-card-meta">${(q.word_ids || []).length} từ · ${modeLabel} · ${new Date(q.created_at).toLocaleDateString('vi-VN')}${max > 0 ? ` · Đã làm ${used}/${max} lượt` : ''}</div>
                            </div>
                            <button class="btn btn-ghost" style="font-size:11px;padding:4px 8px;flex-shrink:0;margin-right:4px" onclick="event.stopPropagation();shareQuiz('${q.id}','${esc(q.title)}')" title="Chia sẻ link">🔗</button>
                            <span class="quiz-card-arrow">${exhausted ? '🔒' : '›'}</span>
                        </div>`;
                    }).join('')}
                </div>`;
        }

        async function startQuiz(quizId) {
            const quiz = quizzes.find(q => q.id === quizId);
            if (!quiz) return;

            // Check attempt limit
            if (quiz.max_attempts > 0 && currentUser) {
                try {
                    const { count } = await sp.from('quiz_results')
                        .select('id', { count: 'exact', head: true })
                        .eq('quiz_id', quizId)
                        .eq('user_id', currentUser.id);
                    if (count >= quiz.max_attempts) {
                        toast(`Bạn đã dùng hết ${quiz.max_attempts} lượt làm bài này`);
                        return;
                    }
                } catch(e) {}
            } else if (quiz.max_attempts > 0 && !currentUser) {
                toast('Vui lòng đăng nhập để làm bài kiểm tra có giới hạn lượt');
                return;
            }

            const wordIds = quiz.word_ids || [];
            const pool = wordIds.map(id => words.find(w => String(w.id) === String(id))).filter(Boolean);
            if (!pool.length) { toast('Không tìm thấy từ vựng trong bài kiểm tra này'); return; }

            const wrap = document.getElementById('quizWrap');
            let idx = 0;
            const results = []; // {word, correct, recognized}
            let answered = false;
            let quizStrokes = [], quizCurrentStroke = [], quizDrawing = false;
            let quizAutoTimer = null;

            function getPromptAnswer(w) {
                switch(quiz.mode) {
                    case 'viet-kor':      return { prompt: w.meaning,  sub: w.type ? `[${w.type}]` : '', answer: w.korean,   answerSub: w.romanize ? `[${w.romanize}]` : '' };
                    case 'kor-kor':       return { prompt: w.korean,   sub: w.type ? `[${w.type}]` : '', answer: w.korean,   answerSub: w.romanize ? `[${w.romanize}] ${w.meaning}` : w.meaning };
                    case 'kor-viet':      return { prompt: w.korean,   sub: w.romanize ? `[${w.romanize}]` : '', answer: w.meaning, answerSub: '' };
                    case 'type-viet-kor': return { prompt: w.meaning,  sub: w.type ? `[${w.type}]` : '', answer: w.korean,   answerSub: w.romanize ? `[${w.romanize}]` : '' };
                    case 'type-kor-kor':  return { prompt: w.korean,   sub: w.type ? `[${w.type}]` : '', answer: w.korean,   answerSub: w.romanize ? `[${w.romanize}] ${w.meaning}` : w.meaning };
                    case 'type-kor-viet': return { prompt: w.korean,   sub: w.romanize ? `[${w.romanize}]` : '', answer: w.meaning, answerSub: '' };
                    case 'listen-kor':    return { prompt: w.korean,   sub: '', answer: w.korean,   answerSub: (w.romanize ? `[${w.romanize}] ` : '') + w.meaning };
                    case 'listen-viet':   return { prompt: w.korean,   sub: '', answer: w.meaning, answerSub: w.korean + (w.romanize ? ` [${w.romanize}]` : '') };
                    default:              return { prompt: w.korean,   sub: '', answer: w.meaning, answerSub: '' };
                }
            }

            const isTypeMode   = () => quiz.mode.startsWith('type-');
            const isListenMode = () => quiz.mode.startsWith('listen-');
            const isWriteMode  = () => !isTypeMode() && !isListenMode();
            const isKorAnswer  = () => ['viet-kor','kor-kor','type-viet-kor','type-kor-kor','listen-kor'].includes(quiz.mode);

            function renderQuizDoing() {
                const w = pool[idx];
                const { prompt, sub, answer, answerSub } = getPromptAnswer(w);
                answered = false;
                wrap.innerHTML = `
                <div class="quiz-doing">
                    <div class="quiz-q-label">Câu ${idx + 1} / ${pool.length}</div>
                    ${isListenMode() ? `
                        <button class="lp-play-btn" id="qzPlayBtn" onclick="qzSpeak()">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                            Nghe từ
                        </button>
                        <div class="lp-speed-row" style="margin-top:-4px">
                            <span style="font-size:11px;color:var(--txt3);font-weight:600;letter-spacing:.05em">TỐC ĐỘ</span>
                            <button class="lp-speed-btn active" id="qzS1" onclick="qzSetSpeed(1.0,'qzS1')">×1.0</button>
                            <button class="lp-speed-btn" id="qzS075" onclick="qzSetSpeed(0.75,'qzS075')">×0.75</button>
                            <button class="lp-speed-btn" id="qzS05" onclick="qzSetSpeed(0.5,'qzS05')">×0.5</button>
                        </div>
                    ` : `
                        <div class="quiz-prompt">${esc(prompt)}</div>
                        ${sub ? `<div class="quiz-prompt-sub">${esc(sub)}</div>` : ''}
                    `}
                    ${isWriteMode() ? `
                    <div class="wp-canvas-row" style="max-width:500px;width:100%">
                        <div class="wp-btns">
                            <button class="wp-icon-btn" onclick="qzUndo()" title="Xóa nét vừa vẽ">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>
                            </button>
                            <button class="wp-icon-btn" onclick="qzClear()" title="Xóa tất cả">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
                            </button>
                        </div>
                        <div class="wp-canvas-wrap" style="position:relative;flex:1;min-width:0">
                            <canvas id="qzCanvas" style="display:block;width:100%;aspect-ratio:4/3;border:0.5px solid var(--bdr2);border-radius:var(--r);background:var(--bg);cursor:crosshair;touch-action:none;max-height:40vh"></canvas>
                            <div id="qzHint" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:13px;color:var(--txt3);pointer-events:none">Vẽ đáp án ở đây...</div>
                            <div id="qzPreview" style="position:absolute;bottom:8px;right:10px;font-size:22px;font-weight:600;color:var(--txt3);pointer-events:none"></div>
                        </div>
                        <div class="wp-btns">
                            <button class="wp-icon-btn wp-icon-btn--primary" onclick="qzCheck()" title="Kiểm tra">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                            </button>
                            <button class="wp-icon-btn" id="qzRevealBtn" onclick="qzReveal()" title="Hiện đáp án">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                            </button>
                            <button class="wp-icon-btn wp-icon-btn--next" id="qzNextBtn" onclick="qzNext()" title="Câu tiếp theo" style="display:none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 5l7 7-7 7"/><path d="M5 5l7 7-7 7"/></svg>
                            </button>
                        </div>
                    </div>
                    ` : `
                    <div class="tp-input-wrap" style="max-width:500px;width:100%">
                        <div class="tp-hint-row" id="qzHintRow"></div>
                        <input class="tp-input" id="qzTypeInput" type="text" autocomplete="off" autocorrect="off" spellcheck="false"
                            placeholder="${isKorAnswer() ? '한국어로 입력하세요...' : 'Gõ nghĩa tiếng Việt...'}" />
                        <div class="tp-keyboard-hint" id="qzKeyboardHint">${isKorAnswer() ? '💡 Tab: chuyển Hangul' + (isListenMode() ? ' · Ctrl+L: nghe lại' : '') : (isListenMode() ? '💡 Ctrl+L: nghe lại' : '')}</div>
                        <div class="tp-btns-row">
                            <button class="btn btn-ghost" id="qzRevealBtn" onclick="qzReveal()">👁 Hiện đáp án</button>
                            <button class="wp-icon-btn wp-icon-btn--next" id="qzNextBtn" onclick="qzNext()" style="display:none;width:auto;padding:0 16px;gap:6px;font-size:13px;font-weight:500">
                                Tiếp theo
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 5l7 7-7 7"/><path d="M5 5l7 7-7 7"/></svg>
                            </button>
                        </div>
                    </div>
                    `}
                    <div id="qzAns" style="font-size:20px;font-weight:600;color:var(--txt);min-height:28px"></div>
                    <div id="qzAnsSub" style="font-size:13px;color:var(--txt2);min-height:18px"></div>
                    <div id="qzResult" class="quiz-result-banner" style="display:none;max-width:500px;width:100%"></div>
                    <div style="width:100%;max-width:500px">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:4px">
                            <button class="btn btn-ghost" onclick="renderQuizList()" style="font-size:12px;padding:6px 12px">← Quay lại</button>
                            <div style="display:flex;gap:6px">
                                <button class="btn btn-ghost" id="qzSkipBtn" onclick="qzSkip()" style="font-size:12px;padding:6px 12px">Bỏ qua →</button>
                                <button class="btn btn-ghost" onclick="qzForfeit()" style="font-size:12px;padding:6px 12px;color:var(--txt3)">🏳 Bỏ cuộc</button>
                            </div>
                        </div>
                    </div>
                </div>`;

                // Store answer
                wrap._answer = answer;
                wrap._answerSub = answerSub;

                if (isWriteMode()) {
                // ── Canvas setup ──
                const canvas = document.getElementById('qzCanvas');
                const hint = document.getElementById('qzHint');
                quizStrokes = []; quizCurrentStroke = []; quizDrawing = false;

                function resizeCanvas() { const r = canvas.getBoundingClientRect(); canvas.width = r.width * devicePixelRatio; canvas.height = r.height * devicePixelRatio; }
                resizeCanvas();

                function getXY(e) { const r = canvas.getBoundingClientRect(); const src = e.touches ? e.touches[0] : e; return [(src.clientX - r.left) * devicePixelRatio, (src.clientY - r.top) * devicePixelRatio]; }
                let lastX = 0, lastY = 0;
                function startDraw(e) { if (answered) return; e.preventDefault(); clearTimeout(quizAutoTimer); quizDrawing = true; hint.style.opacity = '0'; [lastX, lastY] = getXY(e); quizCurrentStroke = [{ x: lastX, y: lastY, t: Date.now() }]; }
                function moveDraw(e) {
                    if (!quizDrawing || answered) return; e.preventDefault();
                    const [x, y] = getXY(e);
                    const ctx = canvas.getContext('2d');
                    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    ctx.strokeStyle = isDark ? '#f0efe9' : '#1a1a18'; ctx.lineWidth = 3 * devicePixelRatio; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
                    ctx.beginPath(); ctx.moveTo(lastX, lastY); ctx.lineTo(x, y); ctx.stroke();
                    [lastX, lastY] = [x, y]; quizCurrentStroke.push({ x, y, t: Date.now() });
                }
                function stopDraw() {
                    if (quizDrawing && quizCurrentStroke.length) quizStrokes.push([...quizCurrentStroke]);
                    quizDrawing = false; quizCurrentStroke = [];
                    if (quizStrokes.length && !answered) { clearTimeout(quizAutoTimer); quizAutoTimer = setTimeout(() => qzPreview(), 10); }
                }
                canvas.addEventListener('pointerdown', startDraw);
                canvas.addEventListener('pointermove', moveDraw);
                canvas.addEventListener('pointerup', stopDraw);
                canvas.addEventListener('pointerleave', stopDraw);

                window.qzClear = () => {
                    if (answered) return;
                    clearTimeout(quizAutoTimer);
                    const p = document.getElementById('qzPreview'); if (p) p.textContent = '';
                    const ctx = canvas.getContext('2d'); ctx.clearRect(0, 0, canvas.width, canvas.height);
                    hint.style.opacity = '1'; quizStrokes = []; quizCurrentStroke = [];
                    const r = document.getElementById('qzResult'); if (r) r.style.display = 'none';
                };
                window.qzUndo = () => {
                    if (answered) return;
                    clearTimeout(quizAutoTimer);
                    if (!quizStrokes.length) return;
                    quizStrokes.pop();
                    const ctx = canvas.getContext('2d'); ctx.clearRect(0, 0, canvas.width, canvas.height);
                    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    ctx.strokeStyle = isDark ? '#f0efe9' : '#1a1a18'; ctx.lineWidth = 3 * devicePixelRatio; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
                    for (const s of quizStrokes) { if (s.length < 2) continue; ctx.beginPath(); ctx.moveTo(s[0].x, s[0].y); for (let i = 1; i < s.length; i++) ctx.lineTo(s[i].x, s[i].y); ctx.stroke(); }
                    if (!quizStrokes.length) hint.style.opacity = '1';
                    const p = document.getElementById('qzPreview'); if (p) p.textContent = '';
                    if (quizStrokes.length) { quizAutoTimer = setTimeout(() => qzPreview(), 10); }
                };

                } else {
                // ── Text input setup (type + listen) ──
                const q2j = {
                    'q':'ㅂ','w':'ㅈ','e':'ㄷ','r':'ㄱ','t':'ㅅ','y':'ㅛ','u':'ㅕ','i':'ㅑ','o':'ㅐ','p':'ㅔ',
                    'a':'ㅁ','s':'ㄴ','d':'ㅇ','f':'ㄹ','g':'ㅎ','h':'ㅗ','j':'ㅓ','k':'ㅏ','l':'ㅣ',
                    'z':'ㅋ','x':'ㅌ','c':'ㅊ','v':'ㅍ','b':'ㅠ','n':'ㅜ','m':'ㅡ',
                    'Q':'ㅃ','W':'ㅉ','E':'ㄸ','R':'ㄲ','T':'ㅆ','O':'ㅒ','P':'ㅖ'
                };
                let qzSpeed = 1.0;

                function qzUpdateHintRow(typed) {
                    if (!isKorAnswer()) { document.getElementById('qzHintRow').innerHTML = ''; return; }
                    const exp = wrap._answer; if (!exp) return;
                    const chars = [...exp], typedChars = typed ? [...typed] : [];
                    document.getElementById('qzHintRow').innerHTML = chars.map((ch, i) => {
                        let cls = i < typedChars.length ? (typedChars[i] === ch ? 'hit' : 'miss') : '';
                        return `<span class="tp-char ${cls}">${i < typedChars.length ? esc(typedChars[i]) : '?'}</span>`;
                    }).join('');
                }

                window.qzSpeak = () => {
                    const w = pool[idx]; if (!w) return;
                    window.speechSynthesis.cancel();
                    const utt = new SpeechSynthesisUtterance(w.korean);
                    utt.lang = 'ko-KR'; utt.rate = qzSpeed;
                    const btn = document.getElementById('qzPlayBtn');
                    if (btn) { btn.className = 'lp-play-btn playing'; btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Đang phát...`; }
                    utt.onend = () => { if (btn) { btn.className = 'lp-play-btn'; btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg> Nghe lại`; } };
                    window.speechSynthesis.speak(utt);
                };
                window.qzSetSpeed = (rate, btnId) => {
                    qzSpeed = rate;
                    document.querySelectorAll('.lp-speed-btn').forEach(b => b.classList.remove('active'));
                    document.getElementById(btnId).classList.add('active');
                };

                const inp = document.getElementById('qzTypeInput');
                qzUpdateHintRow('');

                inp.addEventListener('input', () => {
                    if (!isKorAnswer()) return;
                    const raw = inp.value;
                    const kh = document.getElementById('qzKeyboardHint');
                    if (window.Hangul && /[a-zA-Z]/.test(raw)) {
                        let cv = ''; for (const ch of raw) cv += q2j[ch] || ch;
                        const sug = Hangul.a(cv.split(''));
                        if (sug !== raw) kh.innerHTML = `💡 Nhấn <strong>Tab</strong> để đổi thành: <b style="font-size:15px;color:var(--txt)">${esc(sug)}</b>`;
                        else kh.textContent = isListenMode() ? '💡 Tab: chuyển Hangul · Ctrl+L: nghe lại' : '💡 Tab: chuyển Hangul';
                    } else {
                        kh.textContent = isListenMode() ? (inp.value ? '' : '💡 Ctrl+L: nghe lại') : '';
                    }
                });
                inp.addEventListener('keydown', e => {
                    if (e.key === 'Tab' && isKorAnswer()) {
                        e.preventDefault();
                        const raw = inp.value;
                        if (window.Hangul && /[a-zA-Z]/.test(raw)) {
                            let cv = ''; for (const ch of raw) cv += q2j[ch] || ch;
                            inp.value = Hangul.a(cv.split(''));
                            qzUpdateHintRow(inp.value);
                            document.getElementById('qzKeyboardHint').textContent = '';
                        }
                    } else if (e.key === 'Enter') {
                        if (answered) { qzNext(); return; }
                        qzTypeCheck();
                    } else if ((e.key === 'l' || e.key === 'L') && e.ctrlKey) {
                        e.preventDefault(); qzSpeak();
                    }
                });

                if (isListenMode()) setTimeout(() => qzSpeak(), 300);
                setTimeout(() => inp.focus(), 50);
                } // end else
                window.qzReveal = () => {
                    document.getElementById('qzAns').textContent = wrap._answer;
                    document.getElementById('qzAnsSub').textContent = wrap._answerSub;
                };
                window.qzPreview = async () => {
                    if (!quizStrokes.length || answered) return;
                    const previewEl = document.getElementById('qzPreview'); if (!previewEl) return;
                    if (navigator.createHandwritingRecognizer) {
                        try {
                            const lang = quiz.mode === 'kor-viet' ? 'vi' : 'ko';
                            const recognizer = await navigator.createHandwritingRecognizer({ languages: [lang] });
                            const dr = recognizer.startDrawing({});
                            for (const sData of quizStrokes) { const s = new HandwritingStroke(); for (const pt of sData) s.addPoint({ x: pt.x / devicePixelRatio, y: pt.y / devicePixelRatio, t: pt.t }); dr.addStroke(s); }
                            const res = await dr.getPrediction(); recognizer.finish();
                            if (res?.length) { previewEl.textContent = res[0].text.trim(); return; }
                        } catch(e) {}
                    }
                    try {
                        const itc = quiz.mode === 'kor-viet' ? 'vi-t-i0-handwrit' : 'ko-t-i0-handwrit';
                        const t0 = quizStrokes[0][0].t;
                        const ink = quizStrokes.map(s => [s.map(p => Math.round(p.x / devicePixelRatio)), s.map(p => Math.round(p.y / devicePixelRatio)), s.map(p => p.t - t0)]);
                        const qzCv = document.getElementById('qzCanvas');
                        const box = qzCv ? qzCv.getBoundingClientRect() : { width: 300, height: 200 };
                        const r = await fetch(`https://inputtools.google.com/request?itc=${itc}&num=5&cp=0&cs=1&ie=utf-8&oe=utf-8&app=test`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ app:'test', itc, requests:[{ writing_guide:{ writing_area_width: Math.round(box.width), writing_area_height: Math.round(box.height) }, ink }] }) });
                        const data = await r.json();
                        if (data[0] === 'SUCCESS' && data[1]?.[0]?.[1]?.length) previewEl.textContent = data[1][0][1][0].trim();
                    } catch(e) {}
                };
                window.qzCheck = async () => {
                    const resultEl = document.getElementById('qzResult');
                    if (!quizStrokes.length) { resultEl.textContent = 'Hãy vẽ đáp án trước!'; resultEl.className = 'quiz-result-banner info'; resultEl.style.display = 'block'; return; }
                    resultEl.textContent = 'Đang nhận diện...'; resultEl.className = 'quiz-result-banner info'; resultEl.style.display = 'block';

                    const expected = wrap._answer;
                    const normS = s => s.toLowerCase().replace(/\(.*?\)/g,'').replace(/\[.*?\]/g,'').replace(/\s+/g,' ').trim();
                    const expectedParts = expected.split(',').map(s => normS(s));

                    async function handleRecognized(recognized) {
                        const ok = expectedParts.includes(normS(recognized));
                        document.getElementById('qzAns').textContent = wrap._answer;
                        document.getElementById('qzAnsSub').textContent = wrap._answerSub;
                        answered = true;
                        results.push({ word: pool[idx], correct: ok, recognized });
                        if (ok) {
                            resultEl.innerHTML = `✅ Đúng! «${esc(recognized)}»`;
                            resultEl.className = 'quiz-result-banner correct';
                            document.getElementById('qzNextBtn').style.display = '';
                            document.getElementById('qzNextBtn').className = 'wp-icon-btn wp-icon-btn--next';
                        } else {
                            resultEl.innerHTML = `❌ Nhận diện: <strong>${esc(recognized)}</strong> — Đáp án: <strong>${esc(expected)}</strong>`;
                            resultEl.className = 'quiz-result-banner wrong';
                            document.getElementById('qzNextBtn').style.display = '';
                            document.getElementById('qzNextBtn').className = 'wp-icon-btn wp-icon-btn--skip';
                        }
                        // Hide left buttons
                        wrap.querySelector('.wp-btns').style.visibility = 'hidden';
                    }

                    // Try browser API
                    if (navigator.createHandwritingRecognizer) {
                        try {
                            const lang = quiz.mode === 'kor-viet' ? 'vi' : 'ko';
                            const recognizer = await navigator.createHandwritingRecognizer({ languages: [lang] });
                            const dr = recognizer.startDrawing({});
                            for (const sData of quizStrokes) { const s = new HandwritingStroke(); for (const pt of sData) s.addPoint({ x: pt.x / devicePixelRatio, y: pt.y / devicePixelRatio, t: pt.t }); dr.addStroke(s); }
                            const res = await dr.getPrediction(); recognizer.finish();
                            if (res?.length) { await handleRecognized(res[0].text.trim()); return; }
                        } catch(e) {}
                    }
                    // Try Google
                    try {
                        const itc = quiz.mode === 'kor-viet' ? 'vi-t-i0-handwrit' : 'ko-t-i0-handwrit';
                        const t0 = quizStrokes[0][0].t;
                        const ink = quizStrokes.map(s => [s.map(p => Math.round(p.x / devicePixelRatio)), s.map(p => Math.round(p.y / devicePixelRatio)), s.map(p => p.t - t0)]);
                        const qzCv = document.getElementById('qzCanvas');
                        const box = qzCv ? qzCv.getBoundingClientRect() : { width: 300, height: 200 };
                        const r = await fetch(`https://inputtools.google.com/request?itc=${itc}&num=10&cp=0&cs=1&ie=utf-8&oe=utf-8&app=test`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ app:'test', itc, requests:[{ writing_guide:{ writing_area_width: Math.round(box.width), writing_area_height: Math.round(box.height) }, ink }] }) });
                        const data = await r.json();
                        if (data[0] === 'SUCCESS' && data[1]?.[0]?.[1]?.length) { await handleRecognized(data[1][0][1][0].trim()); return; }
                    } catch(e) {}
                    resultEl.textContent = 'Không nhận diện được — thử vẽ rõ hơn nhé.';
                    resultEl.className = 'quiz-result-banner info';
                };
                window.qzNext = () => {
                    if (!answered) return;
                    if (isListenMode()) window.speechSynthesis.cancel();
                    idx++;
                    if (idx >= pool.length) { renderQuizSummary(); return; }
                    renderQuizDoing();
                };
                window.qzSkip = () => {
                    if (answered) return;
                    results.push({ word: pool[idx], correct: false, recognized: '(bỏ qua)' });
                    answered = true;
                    idx++;
                    if (idx >= pool.length) { renderQuizSummary(); return; }
                    renderQuizDoing();
                };
                window.qzForfeit = () => {
                    if (!confirm('Bỏ cuộc? Điểm sẽ là 0/'+pool.length+', kể cả câu đúng trước đó.')) return;
                    if (isListenMode()) window.speechSynthesis.cancel();
                    // Fill remaining questions not yet answered
                    for (let i = results.length; i < pool.length; i++) {
                        results.push({ word: pool[i], correct: false, recognized: '(bỏ cuộc)' });
                    }
                    // Zero out ALL results including previously correct ones
                    for (let i = 0; i < results.length; i++) results[i].correct = false;
                    renderQuizSummary();
                };

                // ── Type/Listen check ──
                window.qzTypeCheck = () => {
                    if (answered) return;
                    const inp = document.getElementById('qzTypeInput');
                    const typed = inp.value.trim();
                    if (!typed) { if (isListenMode()) qzSpeak(); return; }
                    const expected = wrap._answer;
                    const normS = s => s.toLowerCase().replace(/\(.*?\)/g,'').replace(/\[.*?\]/g,'').replace(/\s+/g,' ').trim();
                    const ok = expected.split(',').map(s => normS(s)).includes(normS(typed));
                    document.getElementById('qzAns').textContent = wrap._answer;
                    document.getElementById('qzAnsSub').textContent = wrap._answerSub;
                    const resultEl = document.getElementById('qzResult');
                    resultEl.style.display = 'block';
                    answered = true;
                    results.push({ word: pool[idx], correct: ok, recognized: typed });
                    if (ok) {
                        inp.className = 'tp-input correct';
                        resultEl.innerHTML = `✅ Đúng! «${esc(typed)}»`;
                        resultEl.className = 'quiz-result-banner correct';
                        document.getElementById('qzNextBtn').style.display = '';
                    } else {
                        inp.className = 'tp-input wrong';
                        resultEl.innerHTML = `❌ Bạn gõ: <strong>${esc(typed)}</strong> — Đáp án: <strong>${esc(expected)}</strong>`;
                        resultEl.className = 'quiz-result-banner wrong';
                        document.getElementById('qzNextBtn').style.display = '';
                    }
                    if (document.getElementById('qzHintRow')) {
                        const chars = [...expected], typedChars = [...typed];
                        document.getElementById('qzHintRow').innerHTML = chars.map((ch, i) => {
                            let cls = i < typedChars.length ? (typedChars[i] === ch ? 'hit' : 'miss') : '';
                            return `<span class="tp-char ${cls}">${i < typedChars.length ? esc(typedChars[i]) : '?'}</span>`;
                        }).join('');
                    }
                    document.getElementById('qzRevealBtn').style.display = 'none';
                };

            } // end renderQuizDoing

            async function renderQuizSummary() {
                quizInProgress = false;
                const score = results.filter(r => r.correct).length;
                const wrap = document.getElementById('quizWrap');
                wrap.innerHTML = `
                <div style="display:flex;flex-direction:column;align-items:center;gap:16px;padding:8px 0">
                    <div class="quiz-summary">
                        <div style="font-size:13px;color:var(--txt3);font-weight:600;text-transform:uppercase;letter-spacing:.06em">${esc(quiz.title)}</div>
                        <div class="quiz-score">${score}/${pool.length}</div>
                        <div class="quiz-score-label">${score === pool.length ? '🎉 Hoàn hảo!' : score >= pool.length * 0.7 ? '👍 Tốt lắm!' : '💪 Cố lên nhé!'}</div>
                        <div class="quiz-review">
                            ${results.map((r, i) => `
                            <div class="quiz-review-item">
                                <span>${r.correct ? '✅' : '❌'}</span>
                                <span style="font-weight:600">${esc(r.word.korean)}</span>
                                <span style="color:var(--txt2);font-size:12px">${esc(r.word.meaning)}</span>
                                ${!r.correct ? `<span style="color:var(--txt3);font-size:11px;margin-left:auto">Bạn viết: ${esc(r.recognized)}</span>` : ''}
                            </div>`).join('')}
                        </div>
                        <div style="display:flex;gap:8px;justify-content:center;margin-top:18px">
                            <button class="btn btn-ghost" onclick="buildQuiz()">← Danh sách</button>
                            <button class="btn btn-dark" onclick="startQuiz('${quiz.id}')">Làm lại</button>
                        </div>
                    </div>
                </div>`;
                // Save result to Supabase
                if (currentUser) {
                    try {
                        await sp.from('quiz_results').insert([{
                            quiz_id: quiz.id,
                            user_id: currentUser.id,
                            user_email: currentUser.email,
                            score,
                            total: pool.length,
                            detail: results.map(r => ({ korean: r.word.korean, meaning: r.word.meaning, correct: r.correct, recognized: r.recognized }))
                        }]);
                    } catch(e) { console.error('Lỗi lưu kết quả:', e); }
                }
            }

            renderQuizDoing();
            quizInProgress = true;
        }

        /* ═══════════════════════════════════
           ADMIN
           ═══════════════════════════════════ */
        async function buildAdmin() {
            if (!isAdmin) { document.getElementById('adminWrap').innerHTML = '<div class="empty-state">Bạn không có quyền truy cập.</div>'; return; }
            const wrap = document.getElementById('adminWrap');
            wrap.innerHTML = '<div class="empty-state">Đang tải...</div>';
            await loadQuizzes();
            // Load results
            let allResults = [];
            try {
                const { data } = await sp.from('quiz_results').select('*').order('created_at', { ascending: false }).limit(200);
                allResults = data || [];
            } catch(e) {}
            // Load student accounts (role = student)
            let students = [];
            try {
                const { data, error } = await sp.from('profiles').select('id, role, display_name');
                if (error) { console.error('profiles error:', error); }
                else {
                    const studentIds = new Set((data || []).filter(p => p.role?.toLowerCase() === 'student').map(p => p.id));
                    const displayMap = {};
                    (data || []).forEach(p => { if (p.display_name) displayMap[p.id] = p.display_name; });
                    const emailMap = {};
                    allResults.forEach(r => { if (r.user_id && r.user_email) emailMap[r.user_id] = r.user_email; });
                    students = [...studentIds].map(id => ({ id, email: emailMap[id] || id, display_name: displayMap[id] || '' }));
                    console.log('students:', students);
                }
            } catch(e) { console.error('profiles exception:', e); }
            renderAdmin(allResults, students);
        }

        function renderAdmin(allResults, students = []) {
            const wrap = document.getElementById('adminWrap');

            // Build completion map: quizId -> Set of user_ids that attempted
            const completionMap = {};
            allResults.forEach(r => {
                if (!completionMap[r.quiz_id]) completionMap[r.quiz_id] = {};
                if (!completionMap[r.quiz_id][r.user_id]) completionMap[r.quiz_id][r.user_id] = { count: 0, best: 0, email: r.user_email };
                completionMap[r.quiz_id][r.user_id].count++;
                const pct = r.total > 0 ? Math.round(r.score / r.total * 100) : 0;
                if (pct > completionMap[r.quiz_id][r.user_id].best) completionMap[r.quiz_id][r.user_id].best = pct;
            });

            wrap.innerHTML = `
            <div class="admin-section">
                <h2>Tạo bài kiểm tra mới</h2>
                <div style="display:flex;flex-direction:column;gap:10px">
                    <div class="fg">
                        <label>Tên bài kiểm tra</label>
                        <input type="text" id="qzTitle" placeholder="Ví dụ: Bài kiểm tra tuần 1" style="padding:8px 10px;border:0.5px solid var(--bdr2);border-radius:var(--r);background:var(--bg2);color:var(--txt);outline:none;font-family:inherit;font-size:13px;" />
                    </div>
                    <div class="fg">
                        <label>Chế độ</label>
                        <select id="qzMode" style="padding:8px 10px;border:0.5px solid var(--bdr2);border-radius:var(--r);background:var(--bg2);color:var(--txt);outline:none;font-family:inherit;font-size:13px;">
                            <optgroup label="✍️ Luyện viết (vẽ tay)">
                                <option value="viet-kor">Tiếng Việt → viết tiếng Hàn</option>
                                <option value="kor-kor">Tiếng Hàn → viết lại tiếng Hàn</option>
                                <option value="kor-viet">Tiếng Hàn → viết tiếng Việt</option>
                            </optgroup>
                            <optgroup label="⌨️ Luyện từ (gõ phím)">
                                <option value="type-viet-kor">Tiếng Việt → gõ tiếng Hàn</option>
                                <option value="type-kor-kor">Tiếng Hàn → gõ lại tiếng Hàn</option>
                                <option value="type-kor-viet">Tiếng Hàn → gõ tiếng Việt</option>
                            </optgroup>
                            <optgroup label="🔊 Luyện nghe (nghe + gõ)">
                                <option value="listen-kor">Nghe tiếng Hàn → gõ tiếng Hàn</option>
                                <option value="listen-viet">Nghe tiếng Hàn → gõ tiếng Việt</option>
                            </optgroup>
                        </select>
                    </div>
                    <div class="fg">
                        <label>Giới hạn số lượt làm / tài khoản</label>
                        <div style="display:flex;align-items:center;gap:10px">
                            <input type="number" id="qzMaxAttempts" min="0" value="0" style="width:80px;padding:8px 10px;border:0.5px solid var(--bdr2);border-radius:var(--r);background:var(--bg2);color:var(--txt);outline:none;font-family:inherit;font-size:13px;" />
                            <span style="font-size:12px;color:var(--txt3)">lượt &nbsp;(0 = không giới hạn)</span>
                        </div>
                    </div>
                    <div class="fg">
                        <label>Chọn từ <span id="pickerCount" class="picker-count">(0 từ đã chọn)</span></label>
                        <input type="text" id="pickerSearch" placeholder="Tìm từ..." oninput="renderPicker()" style="padding:8px 10px;border:0.5px solid var(--bdr2);border-radius:var(--r);background:var(--bg2);color:var(--txt);outline:none;font-family:inherit;font-size:13px;margin-bottom:6px;" />
                        <div class="word-picker" id="wordPicker"></div>
                    </div>
                    <button class="btn btn-dark" onclick="createQuiz()" style="align-self:flex-start">Tạo bài kiểm tra</button>
                </div>
            </div>

            <div class="admin-section">
                <h2>Bài kiểm tra hiện có (${quizzes.length})</h2>
                ${!quizzes.length ? '<div style="color:var(--txt3);font-size:13px">Chưa có bài nào.</div>' : `
                <div class="admin-quiz-list">
                    ${quizzes.map(q => `
                    <div class="admin-quiz-item">
                        <div class="admin-quiz-item-info">
                            <div class="admin-quiz-item-title">${esc(q.title)}</div>
                            <div class="admin-quiz-item-meta">${(q.word_ids||[]).length} từ · ${quizModeLabel(q.mode)} · ${q.max_attempts ? `${q.max_attempts} lượt` : '∞'} · ${new Date(q.created_at).toLocaleDateString('vi-VN')}</div>
                        </div>
                        <button class="btn-del" onclick="deleteQuiz('${q.id}')" title="Xóa" style="display:inline-flex!important;align-items:center;justify-content:center;flex-shrink:0;min-width:28px;min-height:28px;visibility:visible!important;opacity:1!important">✕</button>
                    </div>`).join('')}
                </div>`}
            </div>

            <div class="admin-section" id="completionSection">
                <h2>Theo dõi hoàn thành</h2>
                ${!quizzes.length ? '<div style="color:var(--txt3);font-size:13px">Chưa có bài nào.</div>' : `
                <div style="margin-bottom:14px;display:flex;align-items:center;gap:10px;flex-wrap:wrap">
                    <select id="completionQuizSel" onchange="renderCompletionTable()" style="padding:8px 12px;border:0.5px solid var(--bdr2);border-radius:var(--r);background:var(--bg2);color:var(--txt);outline:none;font-family:inherit;font-size:13px;flex:1;min-width:180px">
                        ${quizzes.map((q,i) => `<option value="${q.id}" ${i===0?'selected':''}>${esc(q.title)}</option>`).join('')}
                    </select>
                    <span id="completionSummaryBadge" style="font-size:12px;color:var(--txt3)"></span>
                </div>
                <div id="completionTableWrap"></div>`}
            </div>

            <div class="admin-section">
                <h2>Lịch sử kết quả gần đây</h2>
                ${!allResults.length ? '<div style="color:var(--txt3);font-size:13px">Chưa có kết quả nào.</div>' : `
                <div style="overflow-x:auto">
                <table class="results-table">
                    <thead><tr><th>Người dùng</th><th>Bài kiểm tra</th><th>Điểm</th><th>Thời gian</th></tr></thead>
                    <tbody>
                        ${allResults.map(r => {
                            const qz = quizzes.find(q => q.id === r.quiz_id);
                            return `<tr>
                                <td>${esc(r.user_email || '')}</td>
                                <td>${esc(qz?.title || r.quiz_id)}</td>
                                <td><strong>${r.score}/${r.total}</strong></td>
                                <td>${new Date(r.created_at).toLocaleString('vi-VN')}</td>
                            </tr>`;
                        }).join('')}
                    </tbody>
                </table></div>`}
            </div>`;

            renderPicker();

            // Store for use in renderCompletionTable
            window._adminStudents = students;
            window._adminCompletionMap = completionMap;
            window._adminAllResults = allResults;

            if (quizzes.length) renderCompletionTable();
        }

        window.renderCompletionTable = () => {
            const sel = document.getElementById('completionQuizSel');
            if (!sel) return;
            const quizId = sel.value;
            const quiz = quizzes.find(q => q.id === quizId);
            if (!quiz) return;

            const students = window._adminStudents || [];
            const completionMap = window._adminCompletionMap || {};
            const quizData = completionMap[quizId] || {};

            const studentSet = new Map(); // id -> student
            students.forEach(s => studentSet.set(s.id, s));

            const allStudents = [...studentSet.values()].sort((a,b) => (a.email || a.full_name || '').localeCompare(b.email || b.full_name || ''));

            const done = allStudents.filter(s => quizData[s.id]);
            const notDone = allStudents.filter(s => !quizData[s.id]);

            const badge = document.getElementById('completionSummaryBadge');
            if (badge) badge.innerHTML = `<span style="color:#27500A;background:#EAF3DE;padding:2px 8px;border-radius:20px;font-weight:600">${done.length} đã làm</span> &nbsp;<span style="color:#A32D2D;background:#FCEBEB;padding:2px 8px;border-radius:20px;font-weight:600">${notDone.length} chưa làm</span>`;

            const wrap = document.getElementById('completionTableWrap');
            if (!wrap) return;

            if (!allStudents.length) {
                wrap.innerHTML = '<div style="color:var(--txt3);font-size:13px;padding:8px 0">Không tìm thấy tài khoản nào có role Student.</div>';
                return;
            }

            wrap.innerHTML = `
            <table class="results-table completion-table">
                <thead>
                    <tr>
                        <th>Tài khoản</th>
                        <th>Số lượt</th>
                        <th>Điểm cao nhất</th>
                        <th>Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    ${allStudents.map(s => {
                        const info = quizData[s.id];
                        const done = !!info;
                        const name = s.display_name
                            ? `<div style="font-size:13px;font-weight:600">${esc(s.display_name)}</div>`
                            : s.email && s.email !== s.id
                                ? `<div style="font-size:13px">${esc(s.email)}</div>`
                                : `<div style="font-size:12px;color:var(--txt3);font-family:monospace">${s.id.slice(0,8)}…</div>`;
                        return `<tr class="${done ? '' : 'row-notdone'}">
                            <td>${name}</td>
                            <td style="font-size:13px">${done ? info.count + ' lượt' : '—'}</td>
                            <td style="font-size:13px">${done ? `<strong>${info.best}%</strong>` : '—'}</td>
                            <td>${done
                                ? '<span class="completion-badge done">Đã làm</span>'
                                : '<span class="completion-badge pending">Chưa làm</span>'
                            }</td>
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>`;
        };

        let pickerSelected = new Set();

        window.renderPicker = () => {
            const search = (document.getElementById('pickerSearch')?.value || '').toLowerCase();
            const container = document.getElementById('wordPicker');
            if (!container) return;
            const filtered = words.filter(w =>
                !search || w.korean?.toLowerCase().includes(search) || w.meaning?.toLowerCase().includes(search)
            ).slice(0, 80);
            container.innerHTML = filtered.map(w => `
                <div class="word-picker-item" onclick="togglePick(${w.id})">
                    <input type="checkbox" ${pickerSelected.has(w.id) ? 'checked' : ''} onclick="event.stopPropagation();togglePick(${w.id})" />
                    <span class="word-picker-kor">${esc(w.korean)}</span>
                    <span class="word-picker-mean">${esc(w.meaning)}</span>
                </div>`).join('');
            const cnt = document.getElementById('pickerCount');
            if (cnt) cnt.textContent = `(${pickerSelected.size} từ đã chọn)`;
        };

        window.togglePick = (id) => {
            if (pickerSelected.has(id)) pickerSelected.delete(id);
            else pickerSelected.add(id);
            renderPicker();
        };

        window.createQuiz = async () => {
            const title = document.getElementById('qzTitle')?.value.trim();
            const mode = document.getElementById('qzMode')?.value;
            const maxAttempts = parseInt(document.getElementById('qzMaxAttempts')?.value || '0') || 0;
            if (!title) { toast('Vui lòng nhập tên bài kiểm tra'); return; }
            if (pickerSelected.size < 1) { toast('Vui lòng chọn ít nhất 1 từ'); return; }
            try {
                const { data, error } = await sp.from('quizzes').insert([{
                    title, mode, word_ids: [...pickerSelected], max_attempts: maxAttempts
                }]).select();
                if (error) throw error;
                quizzes.unshift(data[0]);
                pickerSelected = new Set();
                toast('Đã tạo bài kiểm tra: ' + title);
                buildAdmin();
            } catch(e) { toast('Lỗi: ' + (e.message || '')); }
        };

        window.deleteQuiz = async (id) => {
            if (!confirm('Xóa bài kiểm tra này?')) return;
            try {
                const { error } = await sp.from('quizzes').delete().eq('id', id);
                if (error) throw error;
                quizzes = quizzes.filter(q => q.id !== id);
                toast('Đã xóa');
                buildAdmin();
            } catch(e) { toast('Lỗi: ' + (e.message || '')); }
        };

        loadWords();

        // ── Deep link & share ──
        window.shareQuiz = (id, title) => {
            const url = `${location.origin}${location.pathname}?kiemtra=${id}`;
            if (navigator.clipboard) {
                navigator.clipboard.writeText(url).then(() => toast(`📋 Đã copy link "${title}"`));
            } else {
                prompt('Copy link này:', url);
            }
        };

        // Handle URL params after data loads
        async function handleUrlParams() {
            const p = new URLSearchParams(location.search);
            const mode = p.get('mode');
            const kiemtra = p.get('kiemtra');

            const modeMap = {
                'home': 'home',
                'lich': 'calendar', 'calendar': 'calendar',
                'danhsach': 'list', 'flashcard': 'flash', 'flash': 'flash',
                'luyenviet': 'write', 'write': 'write',
                'luyentu': 'type', 'type': 'type',
                'tocdogo': 'speed', 'speed': 'speed', // <-- Bổ sung dòng này
                'luyennghe': 'listen', 'listen': 'listen',
                'tracnghiem': 'mc', 'mc': 'mc',
                'kiemtra': 'quiz', 'quiz': 'quiz',
                'topik': 'topik', // <-- Bổ sung dòng này
                'soan': 'soan', 'admin': 'admin',
                'chat': 'chat',
                'nhac': 'music',
            };

            if (kiemtra) {
                // Sync sidebar active state
                document.querySelectorAll('.sidebar-item').forEach(i => {
                    i.classList.toggle('active', i.dataset.label === 'Kiểm tra');
                });
                // Switch pane trực tiếp, KHÔNG gọi switchTab (tránh buildQuiz chạy và render đè)
                document.querySelectorAll('.pane').forEach(p => p.classList.remove('active'));
                document.getElementById('pane-quiz').classList.add('active');

                // Load quizzes và nhảy thẳng vô bài
                await loadQuizzes();
                const found = quizzes.find(q => q.id === kiemtra);
                if (!found) { toast('Không tìm thấy bài kiểm tra này'); buildQuiz(); return; }
                // Nếu cần đăng nhập
                if (found.max_attempts > 0 && !currentUser) {
                    toast('Vui lòng đăng nhập để làm bài kiểm tra này');
                    openLogin();
                    // Sau khi đăng nhập xong thì auto start
                    const unsub = sp.auth.onAuthStateChange((_e, session) => {
                        if (session?.user) { unsub.data?.subscription?.unsubscribe(); startQuiz(kiemtra); }
                    });
                    return;
                }
                startQuiz(kiemtra);
            } else if (mode && modeMap[mode]) {
                const tab = modeMap[mode];
                switchTab(tab);
                document.querySelectorAll('.sidebar-item').forEach(i => {
                    const labelMap = { home: 'Trang chủ', calendar: 'Lịch', list:'Danh sách', flash:'Flashcard', write:'Luyện viết', type:'Luyện từ', listen:'Luyện nghe', mc:'Trắc nghiệm', quiz:'Kiểm tra', soan:'Soạn bài', admin:'Admin' };
                    i.classList.toggle('active', i.dataset.label === (labelMap[tab] || ''));
                });
            }
        }

        // Chờ auth + words load xong rồi mới xử lý URL
        async function waitAndHandleUrl() {
            if (!new URLSearchParams(location.search).get('kiemtra') && !new URLSearchParams(location.search).get('mode')) return;
            // Chờ tối đa 3s cho words load
            for (let i = 0; i < 30; i++) {
                if (words.length > 0 || i > 10) break; // sau 1s thì cứ chạy dù words chưa có
                await new Promise(r => setTimeout(r, 100));
            }
            await handleUrlParams();
        }

        waitAndHandleUrl();

        // ═══════════════ SOẠN BÀI ═══════════════
        (function() {
            const SK = 'soanLessons_local';
            let sLessons = [], sActiveId = null, sSaveTimer = null;
            const tagMap = {
                korean: { label: '🇰🇷 Tiếng Hàn', cls: 'soan-tag-korean' },
                math:   { label: '📐 Toán', cls: 'soan-tag-math' },
                lit:    { label: '📖 Văn', cls: 'soan-tag-lit' },
                eng:    { label: '🇬🇧 Tiếng Anh', cls: 'soan-tag-eng' },
                other:  { label: '📝 Khác', cls: 'soan-tag-other' },
            };

            // ── Storage helpers: Supabase nếu đăng nhập, localStorage nếu không ──
            function sUseSupabase() { return !!(currentUser); }

            async function sLoadFromDB() {
                if (sUseSupabase()) {
                    const { data, error } = await sp.from('lessons')
                        .select('*')
                        .eq('user_id', currentUser.id)
                        .order('date', { ascending: false });
                    if (!error && data) { sLessons = data; return; }
                }
                // fallback localStorage
                try { sLessons = JSON.parse(localStorage.getItem(SK) || '[]'); } catch { sLessons = []; }
            }

            async function sInsertDB(lesson) {
                if (sUseSupabase()) {
                    const row = { ...lesson, user_id: currentUser.id };
                    const { data, error } = await sp.from('lessons').insert([row]).select().single();
                    if (!error && data) { lesson.id = data.id; return data; }
                }
                // localStorage fallback
                const local = JSON.parse(localStorage.getItem(SK) || '[]');
                local.unshift(lesson);
                localStorage.setItem(SK, JSON.stringify(local));
                return lesson;
            }

            async function sUpdateDB(id, fields) {
                if (sUseSupabase()) {
                    const { error } = await sp.from('lessons').update(fields).eq('id', id).eq('user_id', currentUser.id);
                    if (error) console.error('lessons update error', error);
                    return;
                }
                const local = JSON.parse(localStorage.getItem(SK) || '[]');
                const idx = local.findIndex(x => x.id === id);
                if (idx !== -1) { Object.assign(local[idx], fields); localStorage.setItem(SK, JSON.stringify(local)); }
            }

            // ── Init ──
            window.soanInit = async function() {
                await sLoadFromDB();
                sRenderList();
                sUpdateClock();
                // resizable right-panel divider
                const dh = document.getElementById('soanDividerH');
                if (dh && !dh._bound) {
                    dh._bound = true;
                    let dragging = false, startY = 0, startT = 0, startD = 0;
                    dh.addEventListener('mousedown', e => {
                        dragging = true; startY = e.clientY;
                        startT = document.getElementById('soanTransSection').getBoundingClientRect().height;
                        startD = document.getElementById('soanDictSection').getBoundingClientRect().height;
                        document.body.style.cursor = 'row-resize';
                        document.body.style.userSelect = 'none';
                    });
                    document.addEventListener('mousemove', e => {
                        if (!dragging) return;
                        const total = startT + startD;
                        const newT = Math.max(80, Math.min(total - 80, startT + (e.clientY - startY)));
                        document.getElementById('soanTransSection').style.flex = `0 0 ${newT}px`;
                        document.getElementById('soanDictSection').style.flex = `0 0 ${total - newT}px`;
                    });
                    document.addEventListener('mouseup', () => {
                        dragging = false;
                        document.body.style.cursor = '';
                        document.body.style.userSelect = '';
                    });
                }
            };

            // ── Modal ──
            window.soanOpenModal = function() {
                document.getElementById('soanNewDate').value = new Date().toISOString().split('T')[0];
                document.getElementById('soanNewName').value = '';
                document.getElementById('soanNewPeriod').value = '';
                document.getElementById('soanModal').classList.add('open');
                setTimeout(() => document.getElementById('soanNewName').focus(), 80);
            };
            window.soanCloseModal = function() { document.getElementById('soanModal').classList.remove('open'); };
            document.addEventListener('keydown', e => { if (e.key === 'Escape') window.soanCloseModal(); });

            // ── Add lesson ──
            window.soanAddLesson = async function() {
                const name = document.getElementById('soanNewName').value.trim();
                if (!name) { document.getElementById('soanNewName').focus(); return; }
                
                // Gom dữ liệu để lưu lên Supabase (chỉ truyền cột name, không truyền title)
                const lesson = {
                    name: name,
                    date: document.getElementById('soanNewDate').value || new Date().toISOString().split('T')[0],
                    period: document.getElementById('soanNewPeriod').value.trim() || '',
                    tag: document.getElementById('soanNewTag').value,
                    done: false,
                    content: ''
                };
                
                soanCloseModal();
                
                // Lưu vào DB
                const saved = await sInsertDB(lesson);
                lesson.id = saved.id;
                
                // Cập nhật giao diện
                sLessons.unshift(lesson);
                sRenderList();
                sOpenLesson(lesson.id);
            };

            // ── Toggle done ──
            window.soanToggleDone = async function(id) {
                const l = sLessons.find(x => x.id === id);
                if (!l) return;
                l.done = !l.done;
                await sUpdateDB(id, { done: l.done });
                sRenderList();
                if (id === sActiveId) document.getElementById('soanDoneBtn').classList.toggle('active', l.done);
            };

            window.soanToggleDoneActive = function() {
                if (sActiveId) soanToggleDone(sActiveId);
            };

            // ── Delete active lesson ──
            window.soanDeleteActiveLesson = async function() {
                if (!sActiveId) return;
                if (!confirm('Bạn có chắc chắn muốn xóa bài soạn này không?')) return;

                // Xóa trên Database (nếu đã đăng nhập) hoặc LocalStorage
                if (sUseSupabase()) {
                    try {
                        const { error } = await sp.from('lessons').delete().eq('id', sActiveId).eq('user_id', currentUser.id);
                        if (error) throw error;
                    } catch(e) {
                        console.error('Lỗi xóa bài:', e);
                        toast('Lỗi khi xóa bài');
                        return;
                    }
                } else {
                    let local = JSON.parse(localStorage.getItem(SK) || '[]');
                    local = local.filter(x => x.id !== sActiveId);
                    localStorage.setItem(SK, JSON.stringify(local));
                }

                // Xóa khỏi danh sách hiện tại
                sLessons = sLessons.filter(x => x.id !== sActiveId);
                sActiveId = null;

                // Trả UI về trạng thái trống (chưa chọn bài nào)
                document.getElementById('soanEmptyEditor').style.display = '';
                document.getElementById('soanEditor').innerHTML = '';
                document.getElementById('soanEditorTitle').value = '';
                document.getElementById('soanWordCount').textContent = '0 từ';
                document.getElementById('soanCharCount').textContent = '0 ký tự';
                
                sRenderList();
                toast('Đã xóa bài soạn!');
            };

            // ── Open lesson ──
            function sOpenLesson(id) {
                sActiveId = id;
                const l = sLessons.find(x => x.id === id);
                if (!l) return;
                document.getElementById('soanEmptyEditor').style.display = 'none';
                document.getElementById('soanEditorTitle').value = l.title || l.name;
                const editor = document.getElementById('soanEditor');
                editor.innerHTML = l.content || '';
                document.getElementById('soanDoneBtn').classList.toggle('active', !!l.done);
                sRenderList();
                soanCountWords();
                // Hiển thị từ vựng của bài
                soanRenderVocabPanel(l.title || l.name);
                editor.focus();
            }
            window.soanOpenLesson = sOpenLesson;

            // ── Auto-save content ──
            async function sSaveContent(id) {
                const l = sLessons.find(x => x.id === id);
                if (!l) return;
                const newTitle = document.getElementById('soanEditorTitle').value.trim() || l.name;
                const newContent = document.getElementById('soanEditor').innerHTML;
                l.title = newTitle;
                l.content = newContent;
                await sUpdateDB(id, { name: newTitle, content: newContent });
            }

            window.soanScheduleSave = function() {
                clearTimeout(sSaveTimer);
                if (sActiveId) sSaveTimer = setTimeout(async () => {
                    await sSaveContent(sActiveId);
                    const btn = document.getElementById('soanSaveBtn');
                    if (btn) {
                        btn.innerHTML = '<i class="fa-solid fa-check">';
                        btn.style.color = 'var(--txt3)';
                        setTimeout(() => { btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i>'; btn.style.color = ''; }, 1500);
                    }
                }, 1500);
            };

            // ── Word count & gutter ──
            window.soanCountWords = function() {
                const title = document.getElementById('soanEditorTitle').value;
                const body = document.getElementById('soanEditor').innerText || '';
                const words = (title + ' ' + body).trim().split(/\s+/).filter(Boolean).length;
                const chars = (title + body).length;
                document.getElementById('soanWordCount').textContent = words + ' từ';
                document.getElementById('soanCharCount').textContent = chars.toLocaleString('vi-VN') + ' ký tự';
                sUpdateGutter();
            };

document.getElementById('soanEditor').addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        e.preventDefault();
        document.execCommand('insertText', false, '    ');
        return;
    }

    if (e.key === 'Enter' && !e.shiftKey) {
        const sel = window.getSelection();
        if (!sel.rangeCount) return;
        const range = sel.getRangeAt(0);
        let node = range.startContainer;
        while (node && node.id !== 'soanEditor' && node.nodeName !== 'DIV') {
            node = node.parentNode;
        }
        const lineText = node ? node.innerText || node.textContent : "";

        // 1. Kiểm tra danh sách số (1., a., I.)
        const matchNum = lineText.match(/^((?:\s*(?:[0-9]+|[a-zA-Z]|[IVXLCDMivxlcdm]+)[\.\)]\s*)*\s*(?:[0-9]+|[a-zA-Z]|[IVXLCDMivxlcdm]+)[\.\)]\s+)/);
        
        // 2. Kiểm tra gạch đầu dòng (•, -, *)
        const matchBullet = lineText.match(/^(\s*[•\-\*]\s+)/);

        if (matchNum) {
            e.preventDefault();
            const lastPart = matchNum[1].match(/([\s\S]*?)(\b[0-9]+|\b[a-zA-Z]|\b[IVXLCDMivxlcdm]+)([\.\)])\s+$/);
            if (lastPart) {
                const next = sResolveNextPrefix(lastPart[2]);
                if (next) {
                    document.execCommand('insertText', false, '\n' + lastPart[1] + next + lastPart[3] + ' ');
                }
            }
            soanCountWords();
        } else if (matchBullet) {
            e.preventDefault();
            document.execCommand('insertText', false, '\n' + matchBullet[1]);
            soanCountWords();
        }
    }
});

            function sUpdateGutter() {
                const editor = document.getElementById('soanEditor');
                const gutter = document.getElementById('soanLineNumbers');
                if (!gutter || !editor) return;
                // Count block children — contenteditable wraps each line in a <div>.
                // Empty lines = <div><br></div>, so children.length is always accurate.
                const count = Math.max(1, editor.children.length);
                if (gutter._lastCount === count) return;
                gutter._lastCount = count;
                let html = '';
                for (let i = 0; i < count; i++) html += `<div>${i + 1}</div>`;
                gutter.innerHTML = html;
                document.getElementById('soanGutter').scrollTop = editor.scrollTop;
            }

            document.getElementById('soanEditor').addEventListener('scroll', function() {
                document.getElementById('soanGutter').scrollTop = this.scrollTop;
            });

            // ── Render list ──
            function sFormatDate(d) {
                const dt = new Date(d + 'T00:00:00'), today = new Date();
                today.setHours(0,0,0,0);
                const diff = Math.round((dt - today) / 86400000);
                const days = ['CN','Th2','Th3','Th4','Th5','Th6','Th7'];
                const dow = days[dt.getDay()];
                if (diff === 0) return `Hôm nay — ${dow} ${dt.getDate()}/${dt.getMonth()+1}`;
                if (diff === 1) return `Ngày mai — ${dow} ${dt.getDate()}/${dt.getMonth()+1}`;
                if (diff === -1) return `Hôm qua — ${dow} ${dt.getDate()}/${dt.getMonth()+1}`;
                return `${dow}, ${dt.getDate()}/${dt.getMonth()+1}/${dt.getFullYear()}`;
            }

            function sRenderList() {
                const list = document.getElementById('soanLessonList');
                if (!list) return;
                const done = sLessons.filter(l => l.done).length;
                const total = sLessons.length;
                document.getElementById('soanProgressText').textContent = `${done} / ${total}`;
                document.getElementById('soanProgressFill').style.width = total ? `${(done/total)*100}%` : '0%';
                if (!sLessons.length) {
                    list.innerHTML = '<div style="padding:20px 12px;font-size:12px;color:var(--txt3);text-align:center">Chưa có bài.<br>Nhấn + để thêm.</div>';
                    return;
                }
                const groups = {};
                sLessons.forEach(l => { if (!groups[l.date]) groups[l.date] = []; groups[l.date].push(l); });
                const dates = Object.keys(groups).sort().reverse();
                list.innerHTML = '';
                dates.forEach(date => {
                    const grp = document.createElement('div');
                    grp.className = 'soan-day-group';
                    const lbl = document.createElement('div');
                    lbl.className = 'soan-day-label';
                    lbl.textContent = sFormatDate(date);
                    grp.appendChild(lbl);
                    groups[date].forEach(l => {
                        const item = document.createElement('div');
                        item.className = 'soan-lesson-item' + (l.done ? ' done' : '') + (l.id === sActiveId ? ' active' : '');
                        item.onclick = () => sOpenLesson(l.id);
                        const tag = tagMap[l.tag] || tagMap.other;
                        item.innerHTML = `
                            <div class="soan-lesson-check" onclick="event.stopPropagation();soanToggleDone('${l.id}')">${l.done ? '<i class="fa-solid fa-check"></i>' : ''}</div>
                            <div class="soan-lesson-info">
                                <div class="soan-lesson-name">${l.title || l.name}</div>
                                <div class="soan-lesson-meta">
                                    <span class="soan-tag ${tag.cls}">${tag.label}</span>
                                    ${l.period ? `<span>${l.period}</span>` : ''}
                                </div>
                            </div>`;
                        grp.appendChild(item);
                    });
                    list.appendChild(grp);
                });
            }

            // Reload lessons khi auth thay đổi (đăng nhập / đăng xuất)
            sp.auth.onAuthStateChange(async (_event, session) => {
                if (document.getElementById('pane-soan').classList.contains('active')) {
                    sActiveId = null;
                    document.getElementById('soanEmptyEditor').style.display = '';
                    document.getElementById('soanEditor').innerHTML = '';
                    document.getElementById('soanEditorTitle').value = '';
                    await sLoadFromDB();
                    sRenderList();
                }
            });

            // ── Resize: update height ──
            window.addEventListener('resize', function() {
                // CSS flex handles height automatically
            });

            // ── Clock ──
            function sUpdateClock() {
                const el = document.getElementById('soanCurrentTime');
                if (el) el.textContent = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
            }
            setInterval(sUpdateClock, 30000);

            // ── Manual save ──
            window.soanManualSave = async function() {
                if (!sActiveId) return;
                await sSaveContent(sActiveId);
                const btn = document.getElementById('soanSaveBtn');
                btn.innerHTML = '<i class="fa-solid fa-check">';
                btn.style.color = '#27500A';
                setTimeout(() => { btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i>'; btn.style.color = ''; }, 1800);
            };

            // Ctrl+S to save
            document.addEventListener('keydown', function(e) {
                if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                    const pane = document.getElementById('pane-soan');
                    if (pane && pane.classList.contains('active')) {
                        e.preventDefault();
                        window.soanManualSave();
                    }
                }
            });

            // ── Gemini ──
            let geminiLastQuery = '';

            window.soanAskAI = function() {
                const panel = document.getElementById('soanAiPanel');
                panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
                if (panel.style.display === 'block') document.getElementById('soanAiInput').focus();
            };
            window.soanCloseAI = function() {
                document.getElementById('soanAiPanel').style.display = 'none';
            };
            window.soanSendAI = function() {
                const input = document.getElementById('soanAiInput').value.trim();
                if (!input) return;
                geminiLastQuery = input;
                const url = 'https://www.google.com/search?q=' + encodeURIComponent(input) + '&udm=50';
                document.getElementById('geminiIframe').src = url;
                document.getElementById('geminiPopupTitle').textContent = '✦ Gemini — ' + input;
                const bg = document.getElementById('geminiPopupBg');
                bg.style.display = 'flex';
                document.getElementById('geminiReopenBar').style.display = 'block';
                soanCloseAI();
            };
            window.soanReopenGemini = function() {
                if (!geminiLastQuery) return;
                const url = 'https://www.google.com/search?q=' + encodeURIComponent(geminiLastQuery) + '&udm=50';
                document.getElementById('geminiIframe').src = url;
                document.getElementById('geminiPopupBg').style.display = 'flex';
            };

            window.soanAddVocab = async function() {
                if (!isAdmin) { toast('Bạn cần quyền Admin để thêm từ'); return; }
                const kor  = document.getElementById('svKor').value.trim();
                const type = document.getElementById('svType').value;
                const mean = document.getElementById('svMean').value.trim();
                if (!kor || !mean) { toast('Vui lòng nhập từ tiếng Hàn và nghĩa'); return; }
                const topic = document.getElementById('soanEditorTitle').value.trim();
                const rom = romanize(kor);
                const btn = document.getElementById('svAddBtn');
                btn.disabled = true;
                const entry = { korean: kor, type, meaning: mean, romanize: rom, example: '', example_meaning: '', topic };
                try {
                    const { data, error } = await sp.from('korean_vocab').insert([entry]).select();
                    if (error) throw error;
                    if (data && data.length) words.unshift(data[0]);
                    toast('Đã thêm: ' + kor);
                    document.getElementById('svKor').value = '';
                    document.getElementById('svMean').value = '';
                    document.getElementById('svKor').focus();
                    refresh();
                    soanRenderVocabPanel(topic);
                } catch(e) {
                    toast('Lỗi: ' + (e.message || ''));
                }
                btn.disabled = false;
            };

            // ── Render vocab list vào cột trái ──
            window.soanRenderVocabPanel = function(topic) {
                const t = (topic || document.getElementById('soanEditorTitle').value || '').trim();
                const list = document.getElementById('soanVocabList');
                const countEl = document.getElementById('soanVocabCount');
                if (!list) return;
                const vocabList = t ? words.filter(w => w.topic && w.topic.trim() === t) : [];
                const badgeCls = { '명사':'b-명사','동사':'b-동사','형용사':'b-형용사','부사':'b-부사','감탄사':'b-감탄사','기타':'b-기타' };
                if (countEl) countEl.textContent = vocabList.length ? vocabList.length + ' từ' : '';
                list.innerHTML = vocabList.length
                    ? vocabList.map((w, i) => `
                        <div class="soan-left-vocab-item">
                            <span class="slv-num">${i+1}</span>
                            <div class="slv-main">
                                <div class="slv-kor">${esc(w.korean)}</div>
                                <div class="slv-mean">${esc(w.meaning)}</div>
                            </div>
                            <span class="slv-badge badge ${badgeCls[w.type]||'b-기타'}" style="font-size:9px">${esc(w.type)}</span>
                        </div>`).join('')
                    : '<div style="padding:14px 12px;font-size:12px;color:var(--txt3);text-align:center">Chưa có từ vựng.</div>';
            };

            // Left panel resizer (kéo dọc giữa lesson list và vocab)
            (function() {
                const div = document.getElementById('soanLeftDividerH');
                if (!div) return;
                let dragging = false, startY = 0, startH = 0;
                div.addEventListener('mousedown', e => {
                    dragging = true; startY = e.clientY;
                    startH = document.getElementById('soanLessonList').getBoundingClientRect().height;
                    document.body.style.cursor = 'row-resize';
                    document.body.style.userSelect = 'none';
                    e.preventDefault();
                });
                document.addEventListener('mousemove', e => {
                    if (!dragging) return;
                    const newH = Math.max(60, startH + (e.clientY - startY));
                    document.getElementById('soanLessonList').style.flex = 'none';
                    document.getElementById('soanLessonList').style.height = newH + 'px';
                });
                document.addEventListener('mouseup', () => {
                    dragging = false;
                    document.body.style.cursor = '';
                    document.body.style.userSelect = '';
                });
            })();

            window.soanWrap = function(cmd) {
                document.getElementById('soanEditor').focus();
                document.execCommand(cmd, false, null);
                soanUpdateToolbar();
                soanCountWords();
                soanScheduleSave();
            };

            function soanUpdateToolbar() {
                document.getElementById('soanBtnBold')?.classList.toggle('active', document.queryCommandState('bold'));
                document.getElementById('soanBtnItalic')?.classList.toggle('active', document.queryCommandState('italic'));
                document.getElementById('soanBtnUnderline')?.classList.toggle('active', document.queryCommandState('underline'));
            }

            document.getElementById('soanEditor').addEventListener('keyup', soanUpdateToolbar);
            document.getElementById('soanEditor').addEventListener('mouseup', soanUpdateToolbar);
            document.addEventListener('selectionchange', function() {
                if (document.activeElement === document.getElementById('soanEditor')) soanUpdateToolbar();
            });

            // Close popup when clicking background
            document.getElementById('geminiPopupBg').addEventListener('click', function(e) {
                if (e.target === this) this.style.display = 'none';
            });

            document.getElementById('soanAiInput').addEventListener('keydown', e => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) window.soanSendAI();
            });
        })();

        /* --- SOAN RESIZER LOGIC --- */
(function() {
    function initResizer(resizerId, getPanel, setSize, minSize, getOtherPanel, minOtherSize) {
        const resizer = document.getElementById(resizerId);
        if (!resizer) return;
        let dragging = false, startX = 0, startSize = 0, startOtherSize = 0;

        resizer.addEventListener('mousedown', function(e) {
            dragging = true;
            startX = e.clientX;
            const panel = getPanel();
            const other = getOtherPanel ? getOtherPanel() : null;
            startSize = panel.getBoundingClientRect().width;
            if (other) startOtherSize = other.getBoundingClientRect().width;
            resizer.classList.add('dragging');
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
            e.preventDefault();
        });

        document.addEventListener('mousemove', function(e) {
            if (!dragging) return;
            const dx = e.clientX - startX;
            const panel = getPanel();
            const newSize = Math.max(minSize, startSize + dx);
            setSize(panel, newSize);
        });

        document.addEventListener('mouseup', function() {
            if (!dragging) return;
            dragging = false;
            resizer.classList.remove('dragging');
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        });
    }

    // Resizer 1: kéo left panel
    initResizer(
        'soanResizer1',
        () => document.getElementById('soanLeft'),
        (panel, size) => { panel.style.width = size + 'px'; panel.style.flexShrink = '0'; },
        140
    );

    // Resizer 2: kéo right panel (kéo ngược)
    initResizer(
        'soanResizer2',
        () => document.getElementById('soanRight'),
        (panel, size) => { panel.style.width = size + 'px'; panel.style.flexShrink = '0'; },
        160
    );

    // Resizer 2 kéo ngược chiều (dx âm thì right to lên)
    (function() {
        const resizer = document.getElementById('soanResizer2');
        if (!resizer) return;
        // Override: right panel kéo ngược
        let dragging = false, startX = 0, startSize = 0;
        resizer.onmousedown = null;
        resizer.addEventListener('mousedown', function(e) {
            dragging = true;
            startX = e.clientX;
            startSize = document.getElementById('soanRight').getBoundingClientRect().width;
            resizer.classList.add('dragging');
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
            e.preventDefault();
            e.stopImmediatePropagation();
        }, true);
        document.addEventListener('mousemove', function(e) {
            if (!dragging) return;
            const dx = e.clientX - startX;
            const right = document.getElementById('soanRight');
            const newSize = Math.max(160, startSize - dx);
            right.style.width = newSize + 'px';
            right.style.flexShrink = '0';
        });
        document.addEventListener('mouseup', function() {
            if (!dragging) return;
            dragging = false;
            resizer.classList.remove('dragging');
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        });
    })();
})();
function sResolveNextPrefix(prefix) {
    const isNumber = /^\d+$/.test(prefix);
    const isRomanUpper = /^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/.test(prefix) && (prefix.length > 1 || ['I', 'V', 'X'].includes(prefix));
    const isRomanLower = /^m{0,4}(cm|cd|d?c{0,3})(xc|xl|l?x{0,3})(ix|iv|v?i{0,3})$/.test(prefix) && (prefix.length > 1 || ['i', 'v', 'x'].includes(prefix));
    const isAlphaUpper = /^[A-Z]$/.test(prefix);
    const isAlphaLower = /^[a-z]$/.test(prefix);

    const getRomanVal = s => {
        s = s.toUpperCase();
        const map = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
        let val = 0;
        for (let i = 0; i < s.length; i++) {
            let curr = map[s[i]], next = map[s[i + 1]];
            if (next && curr < next) val -= curr;
            else val += curr;
        }
        return val;
    };

    const toRoman = (num, upper) => {
        const lookup = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
        let roman = '';
        for (let i in lookup) {
            while (num >= lookup[i]) { roman += i; num -= lookup[i]; }
        }
        return upper ? roman : roman.toLowerCase();
    };

    if (isNumber) return (parseInt(prefix) + 1).toString();
    if (isRomanUpper) return toRoman(getRomanVal(prefix) + 1, true);
    if (isRomanLower) return toRoman(getRomanVal(prefix) + 1, false);
    if (isAlphaUpper) return String.fromCharCode(prefix.charCodeAt(0) + 1);
    if (isAlphaLower) return String.fromCharCode(prefix.charCodeAt(0) + 1);
    return null;
}

window.soanAddListItem = function() {
    const editor = document.getElementById('soanEditor');
    editor.focus();
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const lineText = range.startContainer.parentElement.innerText || "";

    let nextPrefix = "1", punc = ".", before = "";
    const match = lineText.match(/^((?:\s*(?:[0-9]+|[a-zA-Z]|[IVXLCDMivxlcdm]+)[\.\)]\s*)*\s*(?:[0-9]+|[a-zA-Z]|[IVXLCDMivxlcdm]+)[\.\)]\s+)/);

    if (match) {
        const lastPart = match[1].match(/([\s\S]*?)(\b[0-9]+|\b[a-zA-Z]|\b[IVXLCDMivxlcdm]+)([\.\)])\s+$/);
        if (lastPart) {
            before = lastPart[1]; punc = lastPart[3];
            const next = sResolveNextPrefix(lastPart[2]);
            if (next) nextPrefix = next;
        }
    }
    document.execCommand('insertText', false, (lineText.trim() ? "\\n" : "") + before + nextPrefix + punc + " ");
};

window.soanAddBullet = function() {
    const editor = document.getElementById('soanEditor');
    editor.focus();
    const textBefore = sGetTextBeforeCursor();
    const lines = textBefore.split('\n');
    const currentLine = lines[lines.length - 1];

    // Kiểm tra xem dòng trước đó có dùng dấu chấm tròn (•) hoặc gạch ngang (-) không
    let bullet = "• "; 
    for (let i = lines.length - 1; i >= 0; i--) {
        const m = lines[i].match(/^(\s*[•\-\*]\s+)/);
        if (m) { bullet = m[1]; break; }
    }

    let insertStr = (currentLine.trim().length > 0 ? "\n" : "") + bullet;
    document.execCommand('insertText', false, insertStr);
    soanCountWords();
};

/* --- HELPER FUNCTIONS --- */
function sGetRawText(html) {
    // Chuyển đổi HTML sang văn bản thuần túy và xử lý xuống dòng
    let res = html.replace(/<br\s*\/?>/gi, '\n').replace(/<\/div>\s*<div[^>]*>/gi, '\n').replace(/<[^>]+>/g, '');
    const txt = document.createElement('textarea');
    txt.innerHTML = res;
    return txt.value;
}

function sGetTextBeforeCursor() {
    const editor = document.getElementById('soanEditor');
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return '';
    const range = sel.getRangeAt(0).cloneRange();
    range.setStart(editor, 0); // Lấy toàn bộ nội dung từ đầu đến vị trí con trỏ hiện tại
    return sGetRawText(range.cloneContents().textContent || range.toString());
}
/* ══════════════════════════════════════════════════
   TOPIK GRID — Luyện viết theo lưới thi TOPIK
   Luật:
   - Mỗi âm tiết Hangul = 1 ô (사랑해 → 사|랑|해)
   - Số: 2 chữ số 1 ô; số lẻ cuối: 1 ô
   - Dấu câu: 1 ô riêng
   - Sau ! và ? cách 1 ô trống; dấu khác không cách
   - Lùi 1 ô đầu đoạn (bắt đầu hàng mới)
   - Không để ô trống đầu dòng (trừ indent đầu đoạn)
   - Nếu âm tiết cuối vừa đủ ô cuối hàng mà tiếp theo là dấu
     → viết chung dấu vào ô đó
   - Mỗi 100 ô: highlight
   - 1 hàng = 20 ô
══════════════════════════════════════════════════ */

/* ── TOPIK History (localStorage) ── */
const TOPIK_HISTORY_KEY = 'topikHistory_v1';
const TOPIK_HISTORY_MAX = 30;

function topikGetHistory() {
    try { return JSON.parse(localStorage.getItem(TOPIK_HISTORY_KEY) || '[]'); } catch { return []; }
}

function topikSaveToHistory(text, title) {
    if (!text || text.trim().length < 5) return;
    const history = topikGetHistory();
    const filtered = history.filter(h => h.text !== text);
    filtered.unshift({
        text,
        title: (title || '').trim() || '',
        saved_at: new Date().toISOString(),
        char_count: text.length
    });
    // Giới hạn số lượng
    const trimmed = filtered.slice(0, TOPIK_HISTORY_MAX);
    localStorage.setItem(TOPIK_HISTORY_KEY, JSON.stringify(trimmed));
}

function topikDeleteHistoryItem(idx) {
    const history = topikGetHistory();
    history.splice(idx, 1);
    localStorage.setItem(TOPIK_HISTORY_KEY, JSON.stringify(history));
    topikRenderHistory();
}

function topikClearHistory() {
    if (!confirm('Xóa toàn bộ lịch sử TOPIK?')) return;
    localStorage.removeItem(TOPIK_HISTORY_KEY);
    topikRenderHistory();
    toast('Đã xóa lịch sử');
}

function topikLoadHistoryItem(idx) {
    const history = topikGetHistory();
    const item = history[idx];
    if (!item) return;
    document.getElementById('topikInput').value = item.text;
    const ti = document.getElementById('topikTitleInput');
    if (ti) ti.value = item.title || '';
    toast('Đã tải đoạn văn từ lịch sử');
    document.getElementById('topikInput').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function topikRenderHistory() {
    const history = topikGetHistory();
    const section = document.getElementById('topikHistorySection');
    const listEl = document.getElementById('topikHistoryList');
    if (!section || !listEl) return;

    section.style.display = history.length ? '' : 'none';

    if (!history.length) { listEl.innerHTML = ''; return; }

    function formatDate(iso) {
        const d = new Date(iso);
        const now = new Date();
        const diffMs = now - d;
        const diffMin = Math.floor(diffMs / 60000);
        const diffH = Math.floor(diffMs / 3600000);
        const diffDay = Math.floor(diffMs / 86400000);
        if (diffMin < 1) return 'Vừa xong';
        if (diffMin < 60) return `${diffMin} phút trước`;
        if (diffH < 24) return `${diffH} giờ trước`;
        if (diffDay === 1) return 'Hôm qua';
        return d.toLocaleDateString('vi-VN');
    }

    listEl.innerHTML = history.map((item, i) => {
        const preview = item.text.slice(0, 80).replace(/\n/g, ' ') + (item.text.length > 80 ? '…' : '');
        const charCount = item.char_count || item.text.length;
        const titleHtml = item.title ? `<div class="topik-history-item-title">${esc(item.title)}</div>` : '';
        return `
        <div class="topik-history-item" onclick="topikLoadHistoryItem(${i})">
            <div class="topik-history-item-body">
                ${titleHtml}<div class="topik-history-item-preview">${esc(preview)}</div>
                <div class="topik-history-item-meta">${charCount} ký tự · ${formatDate(item.saved_at)}</div>
            </div>
            <button class="topik-history-del" title="Xóa"
                onclick="event.stopPropagation(); topikDeleteHistoryItem(${i})">
                <span class="material-icons" style="font-size:15px;vertical-align:middle">close</span>
            </button>
        </div>`;
    }).join('');
}

/* ── TOPIK Realtime Render ── */
let _topikRealtimeTimer = null;
function topikRealtimeRender() {
    clearTimeout(_topikRealtimeTimer);
    _topikRealtimeTimer = setTimeout(() => {
        const input = document.getElementById('topikInput').value.trim();
        if (!input) {
            document.getElementById('topikResult').style.display = 'none';
            return;
        }
        topikRenderGrid(input);
    }, 150);
}
window.topikRealtimeRender = topikRealtimeRender;

function topikInit() {
    topikRenderHistory();
}

// Expose tất cả hàm topik ra global
window.topikInit              = topikInit;
window.topikRender            = topikRender;
window.topikRenderGrid        = topikRenderGrid;
window.topikPaste             = topikPaste;
window.topikClear             = topikClear;
window.topikPrint             = topikPrint;
window.topikClearHistory      = topikClearHistory;
window.topikDeleteHistoryItem = topikDeleteHistoryItem;
window.topikLoadHistoryItem   = topikLoadHistoryItem;
window.topikSaveGrid          = topikSaveGrid;

// Lưu nội dung lưới hiện tại vào localStorage (hỗ trợ cả 2 chế độ)


// Lưu nội dung lưới hiện tại vào localStorage (hỗ trợ cả 2 chế độ)
function topikSaveGrid() {
    const resultEl = document.getElementById('topikResult');
    if (!resultEl || resultEl.style.display === 'none') {
        toast('Chưa có lưới để lưu!'); return;
    }

    const input = document.getElementById('topikInput').value.trim();
    if (!input) { toast('Không có nội dung để lưu!'); return; }
    const title = (document.getElementById('topikTitleInput')?.value || '').trim();
    topikSaveToHistory(input, title);
    topikRenderHistory();
    const saveData = { mode: 'text', text: input, title, savedAt: Date.now() };
    localStorage.setItem('topikSavedGrid', JSON.stringify(saveData));
    toast('Đã lưu lưới vào trình duyệt!');
}

async function topikPaste() {
    try {
        const text = await navigator.clipboard.readText();
        if (text) {
            document.getElementById('topikInput').value = text;
            topikRealtimeRender();
            toast('Đã dán nội dung từ clipboard!');
        } else {
            toast('Clipboard trống!');
        }
    } catch (e) {
        toast('Không thể đọc clipboard. Vui lòng dán thủ công (Ctrl+V).');
    }
}
function topikClear() {
    document.getElementById('topikInput').value = '';
    document.getElementById('topikResult').style.display = 'none';
}

function topikPrint() {
    const result = document.getElementById('topikResult');
    if (result.style.display === 'none') { toast('Hãy tạo lưới trước!'); return; }
    window.print();
}

/**
 * Tokenize text thành mảng token theo luật TOPIK.
 * Token types:
 *   'syllable'    — 1 âm tiết Hangul → 1 ô
 *   'num'         — chuỗi số đã chia cặp → 1 ô
 *   'latin'       — 1 ký tự Latin → 1 ô
 *   'punct'       — dấu câu thường → 1 ô
 *   'punct_space' — dấu ! ? → 1 ô + 1 ô trống sau
 *   'indent'      — lùi đầu đoạn
 *   'para_end'    — kết thúc đoạn (fill dòng)
 */
function topikTokenize(text) {
    const PUNCT = /[.,!?:;…"'"'「」『』()《》【】—–·]/;
    const paragraphs = text.split(/\n+/);
    const tokens = [];

    for (let pi = 0; pi < paragraphs.length; pi++) {
        const para = paragraphs[pi].trim();
        if (!para) continue;

        tokens.push({ type: 'indent' });

        let i = 0;
        let lastWasContent = false;
        while (i < para.length) {
            const ch = para[i];

            // Khoảng trắng → chỉ thêm ô cách nếu trước đó là từ/số (không phải dấu câu)
            if (/\s/.test(ch)) {
                if (lastWasContent) {
                    tokens.push({ type: 'space' });
                    lastWasContent = false;
                }
                i++;
                continue;
            }

            // Số → gom rồi tách cặp
            if (/\d/.test(ch)) {
                let num = '';
                while (i < para.length && /\d/.test(para[i])) { num += para[i++]; }
                for (let j = 0; j < num.length; j += 2) {
                    tokens.push({ type: 'num', text: num.slice(j, j + 2) });
                }
                lastWasContent = true;
                continue;
            }

            // Dấu câu — không có ô cách trước dấu, xóa ô cách vừa thêm nếu có
            if (PUNCT.test(ch)) {
                // Nếu token vừa thêm là 'space' thì xóa đi (không cách trước dấu)
                if (tokens.length && tokens[tokens.length - 1].type === 'space') {
                    tokens.pop();
                }
                const ptype = (ch === '!' || ch === '?') ? 'punct_space' : 'punct';
                tokens.push({ type: ptype, text: ch });
                lastWasContent = false; // sau dấu câu KHÔNG thêm space nữa (kể cả . ,)
                i++;
                continue;
            }

            // Âm tiết Hangul (U+AC00–U+D7A3) hoặc Jamo → mỗi char 1 token
            if (/[\uAC00-\uD7A3\u1100-\u11FF\u3130-\u318F]/.test(ch)) {
                tokens.push({ type: 'syllable', text: ch });
                lastWasContent = true;
                i++;
                continue;
            }

            // Chữ Latinh → gom 2 chữ 1 ô theo chuẩn TOPIK
            if (/[a-zA-Z]/.test(ch)) {
                let latinStr = '';
                while (i < para.length && /[a-zA-Z]/.test(para[i])) { latinStr += para[i++]; }
                for (let j = 0; j < latinStr.length; j += 2) {
                    tokens.push({ type: 'latin', text: latinStr.slice(j, j + 2) });
                }
                lastWasContent = true;
                continue;
            }

            // Ký tự khác → mỗi char 1 ô
            tokens.push({ type: 'other', text: ch });
            lastWasContent = true;
            i++;
        }

        // Luôn push para_end cho mọi đoạn...

        // Luôn push para_end cho mọi đoạn (kể cả đoạn cuối)
        // để layout fill đủ hàng cuối một cách tường minh,
        // thay vì phụ thuộc vào vòng fill backup ở cuối topikLayout.
        tokens.push({ type: 'para_end' });
    }

    return tokens;
}

/**
 * Layout tokens vào lưới 20 ô/hàng.
 * Trả về mảng rows, mỗi row là mảng 20 cell { text, blank, milestone, absIdx }.
 */
function topikLayout(tokens) {
    const COLS = 20;
    const cells = [];
    let cellCount = 0;

    function addCell(text, opts = {}) {
        cellCount++;
        cells.push({
            text: text || '',
            blank: opts.blank || false,
            absIdx: cellCount
        });
    }

    // nextCol(): vị trí (1-indexed) của ô SẮP được điền tiếp theo.
    // cellCount là số ô đã điền → ô tiếp theo ở vị trí (cellCount % COLS) + 1.
    // Khi cellCount % COLS === 0 tức đang ở đầu hàng mới → ô tiếp theo là cột 1.
    // → isLastCol đúng khi (cellCount % COLS) === COLS - 1  (0-indexed: ô thứ 19 trong hàng)
    function nextCol() { return (cellCount % COLS) + 1; }

    const CONTENT_TYPES = new Set(['syllable', 'num', 'latin', 'punct', 'punct_space']);

    for (let ti = 0; ti < tokens.length; ti++) {
        const tok = tokens[ti];

        // ── Đầu đoạn: fill hàng hiện tại rồi thêm ô indent ──
        if (tok.type === 'indent') {
            if (cellCount === 0) {
                // Đoạn đầu tiên: thêm ô blank giống các đoạn khác
                addCell('', { blank: true });
                continue;
            }
            // Đoạn tiếp theo: fill nốt hàng hiện tại rồi thêm ô thụt lùi
            if (cellCount % COLS !== 0) {
                while (cellCount % COLS !== 0) addCell('');
            }
            addCell('', { blank: true }); // ô lùi đầu đoạn
            continue;
        }

        // ── Kết thúc đoạn: fill nốt hàng ──
        if (tok.type === 'para_end') {
            while (cellCount % COLS !== 0) addCell('');
            continue;
        }

        // ── Ô cách giữa các từ (space) ──
        if (tok.type === 'space') {
            // Không thêm ô trống nếu đang đứng ở đầu hàng (ô 0 hoặc vừa bắt đầu hàng mới)
            // cellCount % COLS === 0 nghĩa là vừa điền xong ô cuối hàng trước → đầu hàng mới
            if (cellCount % COLS !== 0) {
                addCell('', { blank: true });
                // Nếu vừa thêm xong mà lại rơi đúng đầu hàng mới thì xóa ô trống đó đi
                // if (cellCount % COLS === 0) {
                //     cells.pop();
                //     cellCount--;
                // }
            }
            continue;
        }

        // ── Token nội dung ──
        if (CONTENT_TYPES.has(tok.type)) {
            // isLastCol: ô SẮP điền có phải ô cuối hàng (cột 20) không?
            // nextCol() = (cellCount % COLS) + 1; khi = 20 → đây là ô cuối hàng.
            const isLastCol = (cellCount % COLS) === (COLS - 1);
            const nextTok = tokens[ti + 1];

            // Nếu ô này là ô cuối hàng VÀ token tiếp theo là dấu câu
            // → viết chung dấu vào ô này
            if (isLastCol && nextTok && (nextTok.type === 'punct' || nextTok.type === 'punct_space')) {
                addCell(tok.text + nextTok.text);
                const wasSpace = nextTok.type === 'punct_space';
                ti++;
                if (wasSpace) { /* đầu hàng mới rồi, không thêm ô trống */ }
            } else {
                addCell(tok.text);
                if (tok.type === 'punct_space') {
                    if (cellCount % COLS !== 0) {
                        addCell('', { blank: true });
                        if (cellCount % COLS === 0) {
                            cells.pop();
                            cellCount--;
                        }
                    }
                }
            }
            continue;
        }
    }

    // Fill hàng cuối
    while (cellCount % COLS !== 0) addCell('');

    // ── Post-process: không để từ bị tách cuối hàng ──
    // Nếu ô cuối hàng có nội dung VÀ ô đầu hàng sau cũng có nội dung (space bị nuốt)
    // → đẩy ô cuối xuống đầu hàng sau, fill ô cuối = trống
    // for (let i = COLS - 1; i < cells.length - COLS; i += COLS) {
    //     const lastCell = cells[i];
    //     const firstNextCell = cells[i + 1];
    //     if (lastCell.text && !lastCell.blank && firstNextCell.text && !firstNextCell.blank) {
    //         // Dịch chuyển: fill ô cuối hàng = trống, chèn nội dung vào đầu hàng sau
    //         // nhưng đầu hàng sau đã có nội dung → cần shift toàn bộ hàng sau sang phải 1 ô
    //         const movedText = lastCell.text;
    //         lastCell.text = '';
    //         // Shift hàng tiếp theo sang phải 1, chèn movedText vào đầu
    //         const rowStart = i + 1;
    //         const rowEnd = i + COLS; // exclusive
    //         // Ô cuối hàng sau sẽ bị đẩy ra → chỉ shift nếu ô cuối hàng sau trống
    //         if (!cells[rowEnd - 1].text) {
    //             for (let j = rowEnd - 1; j > rowStart; j--) {
    //                 cells[j].text  = cells[j - 1].text;
    //                 cells[j].blank = cells[j - 1].blank;
    //             }
    //             cells[rowStart].text  = movedText;
    //             cells[rowStart].blank = false;
    //         }
    //     }
    // }

    // Chunk thành hàng 20 ô
    const rows = [];
    for (let i = 0; i < cells.length; i += COLS) {
        rows.push(cells.slice(i, i + COLS));
    }

    // Đánh dấu milestone: hàng nào chứa ô thứ 100, 200, 300,... → highlight cạnh dưới hàng đó
    const milestoneRows = new Set();
    for (let i = 99; i < cells.length; i += 100) {
        milestoneRows.add(Math.floor(i / COLS));
    }

    return { rows, milestoneRows };
}

function topikRenderGrid(input) {
    const tokens = topikTokenize(input);
    const { rows, milestoneRows } = topikLayout(tokens);

    const totalCells = rows.length * 20;
    const filledCells = rows.flat().filter(c => c.text).length;
    const sentenceCount = (input.match(/[.!?。？！]+/g) || []).length || input.split(/\s{2,}|\n/).filter(s => s.trim()).length;

    document.getElementById('topikStats').innerHTML =
        `<span>Số câu: <b>${sentenceCount}</b></span>
         <span>Tổng số ô: <b>${totalCells}</b></span>
         <span>Ô có nội dung: <b>${filledCells}</b></span>
         <span>Số hàng: <b>${rows.length}</b></span>`;

    const container = document.getElementById('topikGridContainer');
    container.innerHTML = '';

    rows.forEach((row, ri) => {
        const rowEl = document.createElement('div');
        let rowCls = 'topik-row';
        if (milestoneRows.has(ri)) rowCls += ' topik-row--milestone';
        rowEl.className = rowCls;

        const rowNum = document.createElement('div');
        rowNum.className = 'topik-row-num';
        rowNum.textContent = ri + 1;
        rowEl.appendChild(rowNum);

        row.forEach(cell => {
            const cellEl = document.createElement('div');
            let cls = 'topik-cell';
            if (cell.blank) cls += ' topik-cell--blank';
            if (!cell.text && !cell.blank) cls += ' topik-cell--empty';
            cellEl.className = cls;
            if (cell.text) cellEl.textContent = cell.text;
            rowEl.appendChild(cellEl);
        });

        container.appendChild(rowEl);
    });

    document.getElementById('topikResult').style.display = 'block';
}

function topikRender() {
    const input = document.getElementById('topikInput').value.trim();
    if (!input) { toast('Vui lòng nhập đoạn văn!'); return; }

    topikRenderGrid(input);
    document.getElementById('topikGridContainer').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ══════════════════════════════════════
   POMODORO LOGIC
══════════════════════════════════════ */
const pomoModes = {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60
};
let currentPomoMode = 'work';
let pomoTimeLeft = pomoModes[currentPomoMode];
let pomoInterval = null;
let isPomoRunning = false;

window.togglePomodoro = function() {
    document.getElementById('floatingPomo').classList.toggle('open');
};

window.setPomoMode = function(mode, btn) {
    // Cập nhật giao diện nút Tab
    document.querySelectorAll('.pomo-tab').forEach(t => t.classList.remove('active'));
    if(btn) btn.classList.add('active');
    else document.querySelector(`.pomo-tab[onclick*="${mode}"]`).classList.add('active');

    // Reset lại logic đồng hồ theo chế độ mới
    currentPomoMode = mode;
    pomoTimeLeft = pomoModes[currentPomoMode];
    clearInterval(pomoInterval);
    isPomoRunning = false;
    updatePomoDisplay();
    updatePomoBtnState();
};

window.updatePomoDisplay = function() {
    let m = Math.floor(pomoTimeLeft / 60);
    let s = pomoTimeLeft % 60;
    const timeString = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    
    // Cập nhật số to trong bảng
    document.getElementById('pomoTimerDisplay').textContent = timeString;

    // Cập nhật ra ngoài nút bong bóng mini
    const floatingBtn = document.querySelector('.floating-pomo-btn');
    if (floatingBtn) {
        // Chỉ hiện số khi đang chạy cho gọn, hoặc ông chủ có thể bỏ câu điều kiện if để lúc nào nó cũng hiện
        if (isPomoRunning) {
            floatingBtn.innerHTML = `🍅 ${timeString}`;
        } else {
            floatingBtn.innerHTML = `<span class="material-icons">timer</span>`;
        }
    }

    // Hiển thị thời gian đếm ngược lên Tab trình duyệt
    if (isPomoRunning) {
        document.title = `[${timeString}] HanVocab`;
    } else {
        document.title = 'HanVocab';
    }
};

window.togglePomoTimer = function() {
    if (isPomoRunning) {
        // Nếu đang chạy thì Tạm dừng
        clearInterval(pomoInterval);
        isPomoRunning = false;
    } else {
        // Bắt đầu đếm ngược
        isPomoRunning = true;
        pomoInterval = setInterval(() => {
            pomoTimeLeft--;
            updatePomoDisplay();

            // Xử lý khi hết giờ
            if (pomoTimeLeft <= 0) {
                clearInterval(pomoInterval);
                isPomoRunning = false;
                updatePomoBtnState();
                updatePomoDisplay();
                
                // Kêu chuông bíp bíp
                playPomoAlarm();
                
                // Hiện thông báo (Dùng setTimeout để chuông kêu trước khi Alert block luồng trình duyệt)
                setTimeout(() => {
                    alert("Hết giờ rồi ông chủ ơi 🫪! Thay đổi chế độ học/nghỉ ngơi đi nào.");
                }, 100);
            }
        }, 1000);
    }
    updatePomoBtnState();
};

window.resetPomoTimer = function() {
    clearInterval(pomoInterval);
    isPomoRunning = false;
    pomoTimeLeft = pomoModes[currentPomoMode];
    updatePomoDisplay();
    updatePomoBtnState();
};

window.updatePomoBtnState = function() {
    const btn = document.getElementById('pomoStartBtn');
    if (isPomoRunning) {
        btn.textContent = 'Tạm dừng';
        btn.className = 'pomo-btn pause';
    } else {
        btn.textContent = 'Bắt đầu';
        btn.className = 'pomo-btn start';
    }
};

// Hàm tạo âm thanh tít tít báo hiệu hết giờ không cần file mp3 (dùng Web Audio API)
window.playPomoAlarm = function() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        
        // Tạo tiếng Bíp 1
        const osc1 = ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(800, ctx.currentTime); // Tần số âm thanh
        osc1.connect(ctx.destination);
        osc1.start();
        osc1.stop(ctx.currentTime + 0.3); // Kêu 0.3s
        
        // Tạo tiếng Bíp 2 sau đó 0.4s
        const osc2 = ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(800, ctx.currentTime + 0.4); 
        osc2.connect(ctx.destination);
        osc2.start(ctx.currentTime + 0.4);
        osc2.stop(ctx.currentTime + 0.7);

    } catch(e) {
        console.log("Trình duyệt không hỗ trợ Web Audio API");
    }
};

// Khởi động giao diện ban đầu lúc mới load trang
updatePomoDisplay();

/* ══════════════════════════════════════
   TRANG CHỦ - QUẢN LÝ TIỆN ÍCH TRONG WEB
══════════════════════════════════════ */
window.openInternalTool = function(tabName, modeValue) {
    // 1. Cập nhật thanh địa chỉ URL theo dạng ?mode=... (không reload web)
    const url = new URL(window.location);
    url.searchParams.set('mode', modeValue);
    window.history.pushState({}, '', url);

    // 2. Kích hoạt tính năng
    switchTab(tabName);
    
    // 3. Quét và cập nhật lại vệt sáng (active) trên menu thanh bên
    document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
    const sidebarBtn = document.querySelector(`.sidebar-item[onclick*="'${tabName}'"]`);
    if (sidebarBtn) sidebarBtn.classList.add('active');
};

/* ══════════════════════════════════════
   DRAG & DROP POMODORO (HÚT CẠNH + ĐỔI HƯỚNG BUNG)
══════════════════════════════════════ */
const pomoWrapper = document.getElementById('pomoWrapper');
const pomoHeader = document.querySelector('.pomo-header');
const pomoBtn = document.querySelector('.floating-pomo-btn');

let isDragging = false;
let hasMoved = false; 
let isBtnTarget = false; 
let startX, startY;
let wrapperInitX, wrapperInitY;

pomoHeader.addEventListener('mousedown', (e) => startDrag(e, false));
pomoHeader.addEventListener('touchstart', (e) => startDrag(e, false), {passive: false});

pomoBtn.addEventListener('mousedown', (e) => startDrag(e, true));
pomoBtn.addEventListener('touchstart', (e) => startDrag(e, true), {passive: false});

document.addEventListener('mousemove', onDragMove);
document.addEventListener('touchmove', onDragMove, {passive: false});
document.addEventListener('mouseup', onDragEnd);
document.addEventListener('touchend', onDragEnd);

function startDrag(e, isBtn) {
    if (e.target.tagName === 'BUTTON' && !isBtn) return; 

    isDragging = true;
    hasMoved = false;
    isBtnTarget = isBtn;

    const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
    startX = clientX;
    startY = clientY;

    const rect = pomoWrapper.getBoundingClientRect();
    wrapperInitX = rect.left;
    wrapperInitY = rect.top;

    pomoWrapper.style.bottom = 'auto';
    pomoWrapper.style.right = 'auto';
    pomoWrapper.style.left = wrapperInitX + 'px';
    pomoWrapper.style.top = wrapperInitY + 'px';
    pomoWrapper.style.transition = 'none';
}

function onDragMove(e) {
    if (!isDragging) return;

    const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

    const dx = clientX - startX;
    const dy = clientY - startY;

    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        hasMoved = true;
        if (e.type.includes('touch')) e.preventDefault(); 
        pomoWrapper.style.left = (wrapperInitX + dx) + 'px';
        pomoWrapper.style.top = (wrapperInitY + dy) + 'px';
    }
}

function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;
    
    if (isBtnTarget && !hasMoved) {
        togglePomodoro();
        return; 
    }

    if (hasMoved) {
        const rect = pomoWrapper.getBoundingClientRect();
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;
        const PADDING = 24;

        // 1. Chống lọt ra ngoài mép dọc
        let targetY = rect.top;
        const maxY = screenH - rect.height - PADDING; 
        targetY = Math.max(PADDING, Math.min(targetY, maxY)); 

        // 2. Hút nam châm ngang + Quyết định hướng lề
        let targetX;
        const centerX = rect.left + (rect.width / 2); 

        if (centerX < screenW / 2) {
            targetX = PADDING; // Hút mép trái
            pomoWrapper.classList.add('align-left');
            pomoWrapper.classList.remove('align-right');
        } else {
            targetX = screenW - rect.width - PADDING; // Hút mép phải
            pomoWrapper.classList.add('align-right');
            pomoWrapper.classList.remove('align-left');
        }

        // 3. Quyết định hướng bung dọc (Tùy theo nửa trên/dưới)
        const centerY = targetY + (rect.height / 2);
        if (centerY < screenH / 2) {
            pomoWrapper.classList.add('valign-top'); // Ở trên -> Bung xuống
            pomoWrapper.classList.remove('valign-bottom');
        } else {
            pomoWrapper.classList.add('valign-bottom'); // Ở dưới -> Bung lên
            pomoWrapper.classList.remove('valign-top');
        }

        // 4. Bật trượt mượt
        pomoWrapper.style.transition = 'left 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), top 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)';
        pomoWrapper.style.left = targetX + 'px';
        pomoWrapper.style.top = targetY + 'px';
    }
}

/* ══════════════════════════════════════
   CÀI ĐẶT THANH BÊN (SETTINGS) MỚI
══════════════════════════════════════ */
let sidebarPrefs = JSON.parse(localStorage.getItem('hanvocab_sidebar_prefs')) || {};

function initSidebarSettings() {
    const listEl = document.getElementById('sidebarSettingsList');
    const sidebarItems = document.querySelectorAll('.sidebar-nav .sidebar-item');
    
    if (!listEl) return;
    let html = '';
    
    sidebarItems.forEach((item, index) => {
        const label = item.getAttribute('data-label');
        if (!label) return; 

        // 1. NGÓ LƠ NÚT ADMIN: Không cho hiện trong bảng Cài đặt
        if (label === 'Admin') return; 

        const itemId = 'sidebar_item_nav_' + index;
        item.id = itemId; 

        // 2. NHỮNG NÚT "BẤT TỬ": Bắt buộc phải hiện, không cho phép tắt
        const isAlwaysVisible = (label === 'Trang chủ' || label === 'Danh sách');

        // Mặc định bật nếu người dùng chưa tắt (và không phải nút bất tử)
        const isVisible = isAlwaysVisible ? true : (sidebarPrefs[label] !== false); 
        
        // Gán trạng thái ẩn/hiện lúc load web
        item.style.display = isVisible ? 'flex' : 'none';

        // 3. TẠO GIAO DIỆN CHECKBOX
        if (isAlwaysVisible) {
            // Nút bất tử: Checkbox bị khóa cứng (disabled), mờ đi cho đẹp
            html += `
            <label class="settings-item" style="opacity: 0.6; cursor: not-allowed;" title="Tính năng gốc, không thể tắt">
                <span>${esc(label)}</span>
                <input type="checkbox" checked disabled style="cursor: not-allowed;" />
            </label>`;
        } else {
            // Nút bình thường: Cho phép tắt/bật thoải mái
            html += `
            <label class="settings-item">
                <span>${esc(label)}</span>
                <input type="checkbox" onchange="toggleSidebarItem('${escA(label)}', '${itemId}', this.checked)" ${isVisible ? 'checked' : ''} />
            </label>`;
        }
    });
    
    listEl.innerHTML = html;
}

window.toggleSidebarItem = function(label, itemId, isVisible) {
    // Lưu vào LocalStorage
    sidebarPrefs[label] = isVisible;
    localStorage.setItem('hanvocab_sidebar_prefs', JSON.stringify(sidebarPrefs));
    
    // Gán lại giao diện
    const item = document.getElementById(itemId);
    if (item) {
        item.style.display = isVisible ? 'flex' : 'none';
    }
};

window.toggleSettingsMenu = function(e) {
    e.stopPropagation();
    const popup = document.getElementById('settingsMenuPopup');
    const overlay = document.getElementById('navMenuOverlay');
    
    // Đóng cái menu gốc nếu nó đang lỡ mở
    document.getElementById('navMenuPopup').classList.remove('open');
    
    const isOpen = popup.classList.toggle('open');
    overlay.classList.toggle('open', isOpen);
};

// Khởi chạy vòng quét sau khi web load xong
setTimeout(initSidebarSettings, 300);

/* ══════════════════════════════════════
   CALENDAR (LỊCH TỰ CODE - SERVER & LOCAL)
══════════════════════════════════════ */
let calCurrentDate = new Date();
let selectedCalDate = null;

// Lưu trữ 2 luồng dữ liệu riêng biệt
let calEvents = JSON.parse(localStorage.getItem('hanvocab_cal_events')) || {}; // Lịch cá nhân
let globalCalEvents = []; // Lịch chung Server (Supabase)

// ── TẢI LỊCH TỪ SERVER ──
async function loadGlobalCalendar() {
    if (!sp) return;
    try {
        const { data, error } = await sp.from('calendar_events').select('*');
        if (error) {
            console.warn('Chưa tạo bảng calendar_events hoặc lỗi:', error);
            return;
        }
        if (data) {
            globalCalEvents = data;
            // Nếu đang mở tab Lịch thì vẽ lại luôn
            if (document.getElementById('pane-calendar')?.classList.contains('active')) {
                renderCalendar();
            }
            // 🚨 THÊM DÒNG NÀY: Ép Topbar cập nhật ngay sau khi Server đổ dữ liệu về!
            if (typeof updateTopbarDateAndEvents === 'function') {
                updateTopbarDateAndEvents();
            }
        }
    } catch (e) { console.error(e); }
}
// Chạy hàm tải lịch ngay khi load web (đợi 1s cho an toàn)
setTimeout(loadGlobalCalendar, 1000);


/////
// ── VẼ LỊCH ──
window.renderCalendar = function() {
    const year = calCurrentDate.getFullYear();
    const month = calCurrentDate.getMonth();
    const lbl = document.getElementById('calMonthYear');
    if (lbl) lbl.textContent = `Tháng ${month + 1}, ${year}`;
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysContainer = document.getElementById('calDays');
    if (!daysContainer) return;
    daysContainer.innerHTML = '';
    
    const today = new Date();
    for (let i = 0; i < firstDay; i++) daysContainer.innerHTML += `<div class="cal-day empty"></div>`;
    
    for (let i = 1; i <= daysInMonth; i++) {
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const isToday = (i === today.getDate() && month === today.getMonth() && year === today.getFullYear());
        
        // Lọc sự kiện Server (Có tính lặp năm - Cắt "YYYY-" đi để so sánh "MM-DD")
        const dayEventsGlobal = globalCalEvents.filter(e => e.date === dateKey || (e.is_yearly && e.date.substring(5) === dateKey.substring(5)));
        
        // Lọc sự kiện Local (Có tính lặp năm)
        const dayEventsLocal = [];
        Object.keys(calEvents).forEach(dKey => {
            calEvents[dKey].forEach(ev => {
                const isYearly = typeof ev === 'object' && ev.is_yearly;
                if (dKey === dateKey || (isYearly && dKey.substring(5) === dateKey.substring(5))) {
                    dayEventsLocal.push(ev);
                }
            });
        });
        
        // 1. Render lịch Server (Màu & Icon tùy chỉnh)
        let eventsHtml = dayEventsGlobal.map(ev => {
            const iconHtml = ev.icon ? `<span class="material-icons" style="font-size:11px; margin-right:3px; vertical-align:middle;">${esc(ev.icon)}</span>` : '';
            const bgColor = ev.color || '#1a56db';
            return `<div class="cal-event" style="background: ${bgColor};" title="[Chung] ${escA(ev.content)}">${iconHtml}${ev.period ? `<span style="opacity:0.8; margin-right:3px;">${esc(ev.period)}</span> ` : ''}${esc(ev.content)}</div>`;
        }).join('');
        
        // 2. Render lịch Cá nhân
        eventsHtml += dayEventsLocal.map(ev => {
            if (typeof ev === 'string') return `<div class="cal-event">${esc(ev)}</div>`;
            const iconHtml = ev.is_yearly ? `<span class="material-icons" style="font-size:11px; margin-right:3px; vertical-align:middle;">event_repeat</span>` : '';
            return `<div class="cal-event" title="[Cá nhân] ${escA(ev.content)}">${iconHtml}<span style="color:#ffb8b8;">${esc(ev.period)}</span> ${esc(ev.content)}</div>`;
        }).join('');
        
        daysContainer.innerHTML += `
            <div class="cal-day ${isToday ? 'today' : ''}" onclick="openCalModal('${dateKey}')">
                <div class="cal-day-num">${i}</div>
                ${eventsHtml}
            </div>
        `;
    }
};

// ── HIỂN THỊ DANH SÁCH ──
window.renderCalEventList = function() {
    const listEl = document.getElementById('calEventListContent');
    
    // Lọc sự kiện Server
    const dayEventsGlobal = globalCalEvents.filter(e => e.date === selectedCalDate || (e.is_yearly && e.date.substring(5) === selectedCalDate.substring(5)));
    
    // Lọc sự kiện Local kèm index gốc để xóa cho chuẩn xác
    const dayEventsLocal = [];
    Object.keys(calEvents).forEach(dKey => {
        calEvents[dKey].forEach((ev, idx) => {
            const isYearly = typeof ev === 'object' && ev.is_yearly;
            if (dKey === selectedCalDate || (isYearly && dKey.substring(5) === selectedCalDate.substring(5))) {
                let evObj = typeof ev === 'string' ? { content: ev } : { ...ev };
                evObj._origKey = dKey; // Chìa khóa để tìm về quá khứ xóa
                evObj._origIdx = idx;
                dayEventsLocal.push(evObj);
            }
        });
    });
    
    if (dayEventsLocal.length === 0 && dayEventsGlobal.length === 0) {
        listEl.innerHTML = '<div style="text-align:center; padding: 24px; font-size: 13px; color: var(--txt3);">🫪 Trống trơn! Không có sự kiện nào.</div>';
        return;
    }
    
    let html = '';
    
    dayEventsGlobal.forEach(ev => {
        const iconHtml = ev.icon ? `<span class="material-icons" style="font-size:14px; vertical-align:middle; color:${ev.color};">${esc(ev.icon)}</span> ` : '';
        const repeatBadge = ev.is_yearly ? `<span style="background:#e0e7ff; color:#4338ca; padding:2px 6px; border-radius:4px; font-size:9px; margin-left:6px;">HÀNG NĂM</span>` : '';
        html += `
        <div class="cal-detail-item" style="border-left: 3px solid ${ev.color || '#1a56db'};">
            ${isAdmin ? `<button class="del-btn" onclick="deleteCalEvent('${ev.id}', true)" title="Xóa lịch Server"><span class="material-icons" style="font-size:16px;">delete</span></button>` : ''}
            <div class="cal-detail-row"><strong>Trạng thái:</strong> <span style="color: ${ev.color || '#1a56db'}; font-weight: 700; font-size: 11px;">[LỊCH CHUNG SERVER]</span>${repeatBadge}</div>
            ${ev.period ? `<div class="cal-detail-row"><strong>Tiết:</strong> <span style="color: var(--accent, #4f7cff); font-weight: 600;">${esc(ev.period)}</span></div>` : ''}
            <div class="cal-detail-row"><strong>Nội dung:</strong> ${iconHtml}${esc(ev.content || '—')}</div>
            ${ev.homework ? `<div class="cal-detail-row"><strong>Bài tập:</strong> ${esc(ev.homework)}</div>` : ''}
        </div>`;
    });
    
    dayEventsLocal.forEach(ev => {
        const repeatBadge = ev.is_yearly ? `<span style="background:#fce7f3; color:#4f46e5; padding:2px 6px; border-radius:4px; font-size:9px; margin-left:6px;">HÀNG NĂM</span>` : '';
        html += `
        <div class="cal-detail-item">
            <button class="del-btn" onclick="deleteCalEvent('${ev._origKey}', false, ${ev._origIdx})" title="Xóa lịch cá nhân"><span class="material-icons" style="font-size:16px;">delete</span></button>
            <div class="cal-detail-row"><strong>Trạng thái:</strong> <span style="color: #6b7280; font-weight: 700; font-size: 11px;">[LỊCH CÁ NHÂN]</span>${repeatBadge}</div>
            ${ev.period ? `<div class="cal-detail-row"><strong>Tiết:</strong> <span style="color: var(--accent, #4f7cff); font-weight: 600;">${esc(ev.period)}</span></div>` : ''}
            <div class="cal-detail-row"><strong>Nội dung:</strong> ${esc(ev.content || '—')}</div>
            ${ev.homework ? `<div class="cal-detail-row"><strong>Bài tập:</strong> ${esc(ev.homework)}</div>` : ''}
        </div>`;
    });
    
    listEl.innerHTML = html;
};

// ── LƯU & XÓA ──
window.showCalAddForm = function() {
    document.getElementById('calEventListView').style.display = 'none';
    document.getElementById('calEventAddView').style.display = 'block';
    document.getElementById('calModalTitle').innerHTML = isAdmin ? 'Thêm lịch <span style="color:#1a56db;">[SERVER]</span>' : 'Thêm lịch <span style="color:#6b7280;">[CÁ NHÂN]</span>';
    
    document.getElementById('calEvPeriod').value = '';
    document.getElementById('calEvContent').value = '';
    document.getElementById('calEvHomework').value = '';
    document.getElementById('calEvYearly').checked = false;
    
    // Hiện khung tùy chỉnh cho Admin
    document.getElementById('calAdminOptions').style.display = isAdmin ? 'block' : 'none';
    document.getElementById('calEvColor').value = '#1a56db';
    document.getElementById('calEvIcon').value = '';
    
    setTimeout(() => document.getElementById('calEvPeriod').focus(), 50);
};

window.saveCalEvent = async function() {
    const period = document.getElementById('calEvPeriod').value.trim();
    const content = document.getElementById('calEvContent').value.trim();
    const homework = document.getElementById('calEvHomework').value.trim();
    const is_yearly = document.getElementById('calEvYearly').checked;
    
    if (!period && !content) { toast('Gõ nhẹ cái Tiết học hoặc Nội dung nha!'); return; }
    
    if (isAdmin) {
        const color = document.getElementById('calEvColor').value || '#1a56db';
        const icon = document.getElementById('calEvIcon').value.trim();
        const entry = { date: selectedCalDate, period, content, homework, is_yearly, color, icon };
        try {
            const { data, error } = await sp.from('calendar_events').insert([entry]).select();
            if (error) throw error;
            if (data && data.length) globalCalEvents.push(data[0]);
            toast('Đã lưu sự kiện Server!');
        } catch(e) { toast('Lỗi: ' + e.message); return; }
    } else {
        if (!calEvents[selectedCalDate]) calEvents[selectedCalDate] = [];
        calEvents[selectedCalDate].push({ period, content, homework, is_yearly });
        localStorage.setItem('hanvocab_cal_events', JSON.stringify(calEvents));
        toast('Đã lưu lịch cá nhân!');
    }
    
    renderCalendar();
    hideCalAddForm();
    renderCalEventList();
};

window.deleteCalEvent = async function(idOrOrigKey, isGlobal, origIdx) {
    if (!confirm('Chắc chắn muốn xóa lịch này?')) return;
    
    if (isGlobal) {
        if (!isAdmin) { toast('Chỉ Admin mới xóa được lịch chung!'); return; }
        try {
            const { error } = await sp.from('calendar_events').delete().eq('id', idOrOrigKey);
            if (error) throw error;
            globalCalEvents = globalCalEvents.filter(e => String(e.id) !== String(idOrOrigKey));
            toast('Đã xóa lịch Server!');
        } catch(e) { toast('Lỗi: ' + e.message); return; }
    } else {
        calEvents[idOrOrigKey].splice(origIdx, 1);
        if (calEvents[idOrOrigKey].length === 0) delete calEvents[idOrOrigKey];
        localStorage.setItem('hanvocab_cal_events', JSON.stringify(calEvents));
        toast('Đã xóa lịch cá nhân!');
    }
    
    renderCalendar();
    renderCalEventList();
};

window.calPrevMonth = function() { calCurrentDate.setMonth(calCurrentDate.getMonth() - 1); renderCalendar(); };
window.calNextMonth = function() { calCurrentDate.setMonth(calCurrentDate.getMonth() + 1); renderCalendar(); };

// ── QUẢN LÝ MODAL ──
window.openCalModal = function(dateKey) {
    selectedCalDate = dateKey;
    const [y, m, d] = dateKey.split('-');
    document.getElementById('calEventDateLbl').textContent = `Thứ ${new Date(y, m-1, d).getDay() === 0 ? 'Chủ nhật' : new Date(y, m-1, d).getDay() + 1}, ngày ${d}/${m}/${y}`;
    
    renderCalEventList();
    document.getElementById('calEventListView').style.display = 'block';
    document.getElementById('calEventAddView').style.display = 'none';
    document.getElementById('calModalTitle').textContent = 'Lịch trình ngày';
    document.getElementById('calEventModal').classList.add('show');
};
window.closeCalModal = function() { document.getElementById('calEventModal').classList.remove('show'); };


// ── FORM ACTIONS ──
window.showCalAddForm = function() {
    document.getElementById('calEventListView').style.display = 'none';
    document.getElementById('calEventAddView').style.display = 'block';
    // Đổi tiêu đề dựa theo role
    document.getElementById('calModalTitle').innerHTML = isAdmin ? 'Thêm lịch <span style="color:#1a56db;">[SERVER]</span>' : 'Thêm lịch <span style="color:#6b7280;">[CÁ NHÂN]</span>';
    
    document.getElementById('calEvPeriod').value = '';
    document.getElementById('calEvContent').value = '';
    document.getElementById('calEvHomework').value = '';
    setTimeout(() => document.getElementById('calEvPeriod').focus(), 50);
};

window.hideCalAddForm = function() {
    document.getElementById('calEventListView').style.display = 'block';
    document.getElementById('calEventAddView').style.display = 'none';
    document.getElementById('calModalTitle').textContent = 'Lịch trình ngày';
};

/* ══════════════════════════════════════
   TOPBAR WIDGETS (CLOCK, WEATHER, SEARCH)
══════════════════════════════════════ */
// 1. Đồng hồ
function updateTopbarClock() {
    const now = new Date();
    const clockEl = document.getElementById('topbarClock');
    if (clockEl) clockEl.textContent = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}
setInterval(updateTopbarClock, 1000);
updateTopbarClock();

// 2. Thời tiết Suwon (Sử dụng Open-Meteo API miễn phí, không cần key)
async function fetchWeather() {
    try {
        // Tọa độ Suwon: Lat 37.2636, Lon 127.0286
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=37.2636&longitude=127.0286&current_weather=true');
        const data = await res.json();
        if (data && data.current_weather) {
            const temp = Math.round(data.current_weather.temperature);
            const code = data.current_weather.weathercode;
            let icon = '⛅'; // Default
            if (code === 0) icon = '☀️'; // Nắng
            else if (code >= 1 && code <= 3) icon = '⛅'; // Có mây
            else if (code >= 51 && code <= 67) icon = '🌧️'; // Mưa
            else if (code >= 71 && code <= 77) icon = '❄️'; // Tuyết
            else if (code >= 95) icon = '🌩️'; // Bão
            
            const tempEl = document.getElementById('topbarTemp');
            if (tempEl) tempEl.textContent = `${icon} ${temp}°C`;
        }
    } catch(e) { console.log('Không lấy được thời tiết:', e); }
}
fetchWeather();
setInterval(fetchWeather, 30 * 60 * 1000); // Tự cập nhật mỗi 30 phút

// 3. Tra từ nhanh toàn cục
window.doGlobalSearch = function(val) {
    if (!val.trim()) return;
    
    // Đá người dùng về tab Danh sách
    openInternalTool('list', 'danhsach');
    
    // Bắn chữ xuống thanh search chính và kích hoạt bộ lọc
    const mainSearch = document.getElementById('searchKor');
    if (mainSearch) {
        mainSearch.value = val;
        mainSearch.focus();
        onSearch(); // Kích hoạt lọc bảng ngay lập tức
    }
    
    // Xóa trắng ô search topbar cho đẹp
    document.getElementById('globalSearchInp').value = '';
};

// 4. Ngày và Ticker Sự kiện hôm nay
let topbarEventsList = [];
let topbarEventTickerTimer = null;
let currentEventIdx = 0;

window.updateTopbarDateAndEvents = function() {
    const now = new Date();
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const dateStr = `${days[now.getDay()]}, ${now.getDate()}/${now.getMonth() + 1}`;
    const dateEl = document.getElementById('topbarDate');
    if(dateEl) dateEl.textContent = dateStr;

    // Lấy Key ngày chuẩn hôm nay
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const dateKey = `${y}-${m}-${d}`;
    const mmdd = `${m}-${d}`;

    let todaysEvents = [];

    // Hàm thông minh tự động ghép Tiết học + Nội dung
    const formatEventText = (ev) => {
        if (typeof ev === 'string') return ev;
        let txt = '';
        if (ev.period) txt += `[${ev.period}] `; // Đóng ngoặc vuông cái tiết học cho ngầu
        if (ev.content) txt += ev.content;
        return txt.trim() || 'Sự kiện không tên';
    };
    
    // Moi sự kiện từ Server
    if (typeof globalCalEvents !== 'undefined') {
        globalCalEvents.forEach(ev => {
            if (ev.date === dateKey || (ev.is_yearly && ev.date.substring(5) === mmdd)) {
                todaysEvents.push(formatEventText(ev));
            }
        });
    }
    
    // Moi sự kiện từ Local (Cá nhân)
    if (typeof calEvents !== 'undefined') {
        Object.keys(calEvents).forEach(dKey => {
            calEvents[dKey].forEach(ev => {
                const isYearly = typeof ev === 'object' && ev.is_yearly;
                if (dKey === dateKey || (isYearly && dKey.substring(5) === mmdd)) {
                    todaysEvents.push(formatEventText(ev));
                }
            });
        });
    }

    // Chốt danh sách sự kiện
    topbarEventsList = todaysEvents.length ? todaysEvents : ['Trống lịch! Chơi game thôi 🫪'];
    startEventTicker();
};

window.startEventTicker = function() {
    clearInterval(topbarEventTickerTimer);
    const textEl = document.getElementById('topbarEventText');
    if (!textEl) return;

    currentEventIdx = 0;
    textEl.textContent = topbarEventsList[currentEventIdx];
    textEl.classList.remove('ticker-in', 'ticker-out'); // Gỡ hiệu ứng nếu có

    // Nếu có từ 2 sự kiện trở lên thì mới quay vòng
    if (topbarEventsList.length > 1) {
        topbarEventTickerTimer = setInterval(() => {
            textEl.classList.remove('ticker-in');
            textEl.classList.add('ticker-out');
            
            setTimeout(() => {
                currentEventIdx = (currentEventIdx + 1) % topbarEventsList.length;
                textEl.textContent = topbarEventsList[currentEventIdx];
                textEl.classList.remove('ticker-out');
                textEl.classList.add('ticker-in');
            }, 400); 
        }, 3500); 
    }
};

// Cập nhật sau 1.5s lúc load web để đảm bảo Supabase đã đổ dữ liệu về
setTimeout(updateTopbarDateAndEvents, 1500); 

// Gắn sự kiện để hễ thêm/xóa lịch là Topbar tự động cập nhật ngay lập tức
const originalSaveCalEvent2937 = window.saveCalEvent;
if(originalSaveCalEvent2937) {
    window.saveCalEvent = async function() {
        await originalSaveCalEvent2937.apply(this, arguments);
        setTimeout(updateTopbarDateAndEvents, 500);
    };
}
const originalDeleteCalEvent2937 = window.deleteCalEvent;
if(originalDeleteCalEvent2937) {
    window.deleteCalEvent = async function() {
        await originalDeleteCalEvent2937.apply(this, arguments);
        setTimeout(updateTopbarDateAndEvents, 500);
    };
}

// ===================================================================
// 1. KHAI BÁO BIẾN HỆ THỐNG CHO TERMINAL (Đã giấu sạch 100% Key) 🫪
// ===================================================================
let commandHistory = [];
let historyIndex = -1;
const USER_COMMANDS = ['help', 'clear', 'exit', 'list', 'ai', 'groq'];
const ADMIN_COMMANDS = ['add', 'delete'];

let isWaitingForConfirm = false;
let pendingAddData = null;
let isWaitingForDelete = false;
let deleteCandidates = [];

// Gemini (ĐÃ XÓA KEY KHỎI FRONTEND CHO AN TOÀN)
let isAiMode = false;
let aiChatHistory = [];

// Groq (ĐÃ XÓA KEY KHỎI FRONTEND CHO AN TOÀN)
let isGroqMode = false;
let groqChatHistory = [];

function printTerminalError(msg, body, inputEl) {
    const errorLine = document.createElement('div');
    errorLine.className = 'terminal-line';
    errorLine.style.color = '#ff5f56'; 
    errorLine.textContent = msg;
    body.insertBefore(errorLine, inputEl);
}

function printHelp(body, inputEl) {
    let helpMsg = `Available commands for you:\n- ${USER_COMMANDS.join('\n- ')}`;
    if (isAdmin) {
        helpMsg += `\n\nAdmin privileges detected! Extra commands:\n- ${ADMIN_COMMANDS.join('\n- ')}`;
    }
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.style.color = '#ffbd2e'; 
    line.style.whiteSpace = 'pre';
    line.textContent = helpMsg;
    body.insertBefore(line, inputEl);
}

// ===================================================================
// 4. LẮNG NGHE SỰ KIỆN BÀN PHÍM TRONG TERMINAL
// ===================================================================
document.getElementById('terminalInput')?.addEventListener('keydown', function(e) {
    const body = document.getElementById('terminalBody');
    const inputField = this;
    if (!body) return;

    if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (!isWaitingForConfirm && !isWaitingForDelete && !isAiMode && !isGroqMode && commandHistory.length > 0) {
            if (historyIndex === -1) historyIndex = commandHistory.length - 1;
            else if (historyIndex > 0) historyIndex--;
            this.value = commandHistory[historyIndex];
        }
    } 
    else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!isWaitingForConfirm && !isWaitingForDelete && !isAiMode && !isGroqMode && historyIndex !== -1) {
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                this.value = commandHistory[historyIndex];
            } else {
                historyIndex = -1;
                this.value = "";
            }
        }
    }
    else if (e.key === 'Enter') {
        const input = this.value.trim();
        if (input === "" && !isWaitingForConfirm && !isWaitingForDelete) return;

        if (!isWaitingForConfirm && !isWaitingForDelete && !isAiMode && !isGroqMode && commandHistory[commandHistory.length - 1] !== input && input !== "") {
            commandHistory.push(input);
        }
        historyIndex = -1;

        // 🧠 CHẾ ĐỘ GROQ (SIÊU TỐC) ⚡
        if (isGroqMode) {
            const ans = input.toLowerCase();
            
            if (ans === 'exit' || ans === 'quit') {
                isGroqMode = false;
                const resLine = document.createElement('div');
                resLine.className = 'terminal-line';
                resLine.style.color = '#f97316';
                resLine.textContent = `[Groq] Đã ngắt kết nối siêu tốc. Trở về Terminal hệ thống. 🫪`;
                body.insertBefore(resLine, inputField.parentElement);
                
                document.getElementById('terminalPromptPrefix').textContent = (isAdmin ? 'admin' : 'user') + '@hanvocab:~' + (isAdmin ? '#' : '$') + ' ';
                this.value = "";
                body.scrollTop = body.scrollHeight;
                return;
            }

            const userLine = document.createElement('div');
            userLine.className = 'terminal-line';
            userLine.innerHTML = `<span class="terminal-prompt" style="color: #fbd38d;">you@groq:~$</span> <span style="color: #fff;">${esc(input)}</span>`;
            body.insertBefore(userLine, inputField.parentElement);

            groqChatHistory.push({ role: "user", content: input });

            const loadingLine = document.createElement('div');
            loadingLine.className = 'terminal-line';
            loadingLine.style.color = '#6b7280';
            loadingLine.style.fontStyle = 'italic';
            loadingLine.textContent = 'Groq đang bay tới server... ⚡';
            body.insertBefore(loadingLine, inputField.parentElement);
            
            this.value = "";
            this.disabled = true;
            body.scrollTop = body.scrollHeight;

            const startTime = performance.now();

            fetch("/api/chat-groq", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: groqChatHistory })
            })
            .then(res => res.json())
            .then(data => {
                loadingLine.remove();
                if (data.error) throw new Error(data.error.message || data.error);
                
                const endTime = performance.now();
                const timeTaken = ((endTime - startTime) / 1000).toFixed(2);
                
                const reply = data.choices[0].message.content;
                groqChatHistory.push({ role: "assistant", content: reply });

                const aiLine = document.createElement('div');
                aiLine.className = 'terminal-line';
                aiLine.style.color = '#f97316';
                const promptSpan = `<span class="terminal-prompt" style="color: #ea580c;">groq@ai:~$</span> `;
                aiLine.innerHTML = promptSpan;
                body.insertBefore(aiLine, inputField.parentElement);

                const speedNote = `\n<span style="font-size: 11px; color: #10b981; font-style: italic;">⚡ Tốc độ: ${timeTaken}s</span>`;

                let i = 0;
                let formattedReply = reply.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#fff;">$1</strong>').replace(/\n/g, '<br>') + speedNote;
                let currentText = "";
                let isTag = false;

                function typeWriterTerminal() {
                    if (i < formattedReply.length) {
                        let char = formattedReply.charAt(i);
                        if (char === '<') isTag = true;
                        currentText += char;
                        if (char === '>') isTag = false;

                        if (!isTag) {
                            aiLine.innerHTML = promptSpan + currentText;
                            body.scrollTop = body.scrollHeight;
                        }
                        i++;
                        setTimeout(typeWriterTerminal, isTag ? 0 : 8); 
                    } else {
                        inputField.disabled = false;
                        inputField.focus();
                    }
                }
                typeWriterTerminal();
            })
            .catch(err => {
                loadingLine.remove();
                groqChatHistory.pop();
                printTerminalError(`[Lỗi Groq] ${err.message} 🫪`, body, inputField.parentElement);
                inputField.disabled = false;
                inputField.focus();
            });

            return; 
        }

        // 🧠 CHẾ ĐỘ GEMINI ĐÃ DÙNG API NỘI BỘ VERCEL 🫪
        if (isAiMode) {
            const ans = input.toLowerCase();
            
            if (ans === 'exit' || ans === 'quit') {
                isAiMode = false;
                const resLine = document.createElement('div');
                resLine.className = 'terminal-line';
                resLine.style.color = '#ffbd2e';
                resLine.textContent = `[Gemini] Đã ngắt kết nối AI. Trở về Terminal hệ thống. 🫪`;
                body.insertBefore(resLine, inputField.parentElement);
                
                document.getElementById('terminalPromptPrefix').textContent = (isAdmin ? 'admin' : 'user') + '@hanvocab:~' + (isAdmin ? '#' : '$') + ' ';
                this.value = "";
                body.scrollTop = body.scrollHeight;
                return;
            }

            const userLine = document.createElement('div');
            userLine.className = 'terminal-line';
            userLine.innerHTML = `<span class="terminal-prompt" style="color: #a78bfa;">you@gemini:~$</span> <span style="color: #fff;">${esc(input)}</span>`;
            body.insertBefore(userLine, inputField.parentElement);

            aiChatHistory.push({ role: "user", parts: [{ text: input }] });

            const loadingLine = document.createElement('div');
            loadingLine.className = 'terminal-line';
            loadingLine.style.color = '#6b7280';
            loadingLine.style.fontStyle = 'italic';
            loadingLine.textContent = 'Gemini đang gõ... ⏳';
            body.insertBefore(loadingLine, inputField.parentElement);
            
            this.value = "";
            this.disabled = true; 
            body.scrollTop = body.scrollHeight;

            // 🟢 ĐÃ SỬA CHỖ NÀY: GỌI VÀO API NỘI BỘ, KHÔNG TRUYỀN KEY 🫪
            fetch("/api/chat-gemini", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: aiChatHistory })
            })
            .then(res => res.json())
            .then(data => {
                loadingLine.remove();
                if (data.error) throw new Error(data.error.message || data.error);
                
                const reply = data.candidates[0].content.parts[0].text;
                aiChatHistory.push({ role: "model", parts: [{ text: reply }] });

                const aiLine = document.createElement('div');
                aiLine.className = 'terminal-line';
                aiLine.style.color = '#a3c97a';
                const promptSpan = `<span class="terminal-prompt" style="color: #6366f1;">gemini@ai:~$</span> `;
                aiLine.innerHTML = promptSpan;
                body.insertBefore(aiLine, inputField.parentElement);

                let i = 0;
                let formattedReply = reply.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#fff;">$1</strong>').replace(/\n/g, '<br>');
                let currentText = "";
                let isTag = false;

                function typeWriterTerminal() {
                    if (i < formattedReply.length) {
                        let char = formattedReply.charAt(i);
                        if (char === '<') isTag = true;
                        currentText += char;
                        if (char === '>') isTag = false;

                        if (!isTag) {
                            aiLine.innerHTML = promptSpan + currentText;
                            body.scrollTop = body.scrollHeight;
                        }
                        i++;
                        setTimeout(typeWriterTerminal, isTag ? 0 : 12);
                    } else {
                        inputField.disabled = false;
                        inputField.focus();
                    }
                }
                typeWriterTerminal();
            })
            .catch(err => {
                loadingLine.remove();
                aiChatHistory.pop(); 
                printTerminalError(`[Lỗi Gemini] ${err.message} 🫪`, body, inputField.parentElement);
                inputField.disabled = false;
                inputField.focus();
            });

            return; 
        }

        // LỆNH HỆ THỐNG BÌNH THƯỜNG
        const userLine = document.createElement('div');
        userLine.className = 'terminal-line';
        if (isWaitingForConfirm) {
            userLine.innerHTML = `<span class="terminal-prompt">></span> ${esc(input)}`;
        } else if (isWaitingForDelete) {
            userLine.innerHTML = `<span class="terminal-prompt">delete></span> ${esc(input)}`;
        } else {
            const promptSymbol = isAdmin ? '#' : '$'; 
            const userType = isAdmin ? 'admin' : 'user';
            userLine.innerHTML = `<span class="terminal-prompt">${userType}@hanvocab:~${promptSymbol}</span> ${esc(input)}`;
        }
        body.insertBefore(userLine, this.parentElement);

        if (isWaitingForConfirm) {
            const ans = input.toLowerCase();
            if (ans === 'y' || ans === 'yes' || ans === '') { 
                doAdd({ 
                    kor: pendingAddData.word, type: pendingAddData.class, mean: pendingAddData.mean, 
                    rom: typeof romanize === 'function' ? romanize(pendingAddData.word) : '', 
                    ex: '', exm: '', topic: 'Terminal' 
                });
                
                const resLine = document.createElement('div');
                resLine.className = 'terminal-line';
                resLine.style.color = '#27c93f';
                resLine.textContent = pendingAddData.isNewMeaning 
                    ? `[OK] Đã thêm nghĩa mới "${pendingAddData.mean}" cho từ "${pendingAddData.word}" nha ông chủ! 🫪`
                    : `[OK] Đã thêm thành công từ "${pendingAddData.word}" nha ông chủ! 🫪`;
                body.insertBefore(resLine, this.parentElement);
            } else {
                const resLine = document.createElement('div');
                resLine.className = 'terminal-line';
                resLine.style.color = '#ffbd2e';
                resLine.textContent = `[ABORT] Tớ đã hủy thao tác thêm từ rồi nhé.`;
                body.insertBefore(resLine, this.parentElement);
            }
            isWaitingForConfirm = false;
            pendingAddData = null;
            document.getElementById('terminalPromptPrefix').textContent = (isAdmin ? 'admin' : 'user') + '@hanvocab:~' + (isAdmin ? '#' : '$') + ' ';
        } 
        else if (isWaitingForDelete) {
            const ans = input.toLowerCase();
            if (ans === 'c' || ans === 'cancel' || ans === 'n') {
                printTerminalError(`[ABORT] Đã quay xe, không trảm từ nào hết 🫪.`, body, this.parentElement);
            } else {
                const idx = parseInt(ans) - 1;
                if (isNaN(idx) || idx < 0 || idx >= deleteCandidates.length) {
                    printTerminalError(`Số không hợp lệ! Nhập lại từ 1 đến ${deleteCandidates.length}, hoặc gõ 'c' để thoát nha ông chủ.`, body, this.parentElement);
                    this.value = "";
                    body.scrollTop = body.scrollHeight;
                    return; 
                }

                const targetWord = deleteCandidates[idx];
                
                if (typeof sb !== 'undefined' && sb) {
                    sp.from('korean_vocab').delete().eq('id', targetWord.id).then(({error}) => {
                        if (!error) { words = words.filter(w => w.id !== targetWord.id); refresh(); }
                    });
                } else {
                    words = words.filter(w => w.id !== targetWord.id);
                    if (typeof saveLocal === 'function') saveLocal();
                    refresh();
                }

                const resLine = document.createElement('div');
                resLine.className = 'terminal-line';
                resLine.style.color = '#ff5f56';
                resLine.textContent = `[DELETED] Tiễn bạn "${targetWord.korean}" lên đường bình an! 🫪`;
                body.insertBefore(resLine, this.parentElement);
            }
            isWaitingForDelete = false;
            deleteCandidates = [];
            document.getElementById('terminalPromptPrefix').textContent = (isAdmin ? 'admin' : 'user') + '@hanvocab:~' + (isAdmin ? '#' : '$') + ' ';
        }
        else {
            const args = input.split(' ');
            const command = args[0].toLowerCase();
            
            const isUserCmd = USER_COMMANDS.includes(command);
            const isAdminCmd = ADMIN_COMMANDS.includes(command);

            if (isAdminCmd && !isAdmin) {
                printTerminalError(`Permission denied: Command '${command}' requires root privileges.`, body, this.parentElement);
            } else if (!isUserCmd && !isAdminCmd) {
                printTerminalError(`-bash: ${command}: command not found`, body, this.parentElement);
            } else if (command === 'clear') {
                const lines = body.querySelectorAll('.terminal-line');
                lines.forEach(line => line.remove());
            } else if (command === 'help') {
                printHelp(body, this.parentElement);
            } else if (command === 'groq') {
                isGroqMode = true;
                const welcomeLine = document.createElement('div');
                welcomeLine.className = 'terminal-line';
                welcomeLine.style.color = '#f97316';
                welcomeLine.innerHTML = `<strong>[Groq System]</strong> Đã kết nối AI siêu tốc qua Vercel Backend ⚡!<br>Gõ <span style="color:#ffbd2e">exit</span> để thoát khỏi chế độ này.`;
                body.insertBefore(welcomeLine, this.parentElement);
                
                document.getElementById('terminalPromptPrefix').innerHTML = '<span style="color: #fbd38d;">you@groq:~$</span> ';
                
                if (groqChatHistory.length === 0) {
                    groqChatHistory.push({
                        role: "system",
                        content: "Bạn là một trợ lý ảo siêu nhanh tên là 2937 AI. Trả lời bằng tiếng Việt, xưng 'tớ' và gọi người dùng là 'ông chủ'. Thường xuyên sử dụng icon '🫪'."
                    });
                    groqChatHistory.push({
                        role: "assistant",
                        content: "Tuân lệnh ông chủ 🫪! Groq siêu tốc đã sẵn sàng."
                    });
                }
            } else if (command === 'ai') {
                isAiMode = true;
                const welcomeLine = document.createElement('div');
                welcomeLine.className = 'terminal-line';
                welcomeLine.style.color = '#a78bfa'; 
                welcomeLine.innerHTML = `<strong>[Gemini System]</strong> Đã kết nối AI qua Vercel Backend 🫪!<br>Tớ ở đây sẵn sàng trả lời mọi thứ. Gõ <span style="color:#ffbd2e">exit</span> để thoát khỏi chế độ này.`;
                body.insertBefore(welcomeLine, this.parentElement);
                
                document.getElementById('terminalPromptPrefix').innerHTML = '<span style="color: #a78bfa;">you@gemini:~$</span> ';
                
                if (aiChatHistory.length === 0) {
                    aiChatHistory.push({
                        role: "user",
                        parts: [{ text: "Hãy đóng vai là Gemini, một trợ lý ảo dễ thương, xưng 'tớ' và gọi người dùng là 'ông chủ'. Thường xuyên sử dụng icon '🫪'." }]
                    });
                    aiChatHistory.push({
                        role: "model",
                        parts: [{ text: "Tuân lệnh ông chủ 🫪! Tớ sẵn sàng phục vụ rồi đây." }]
                    });
                }
            } else if (command === 'exit') {
                if (typeof openInternalTool === 'function') {
                    openInternalTool('home', 'home');
                } else {
                    switchTab('home');
                }
                const resLine = document.createElement('div');
                resLine.className = 'terminal-line';
                resLine.style.color = '#27c93f';
                resLine.textContent = `[OK] Đang dọn dẹp và đưa ông chủ về Trang Chủ... Tạm biệt! 🫪`;
                body.insertBefore(resLine, this.parentElement);
            } else if (command === 'list') {
                if (!words || words.length === 0) {
                    printTerminalError(`Kho từ vựng đang trống trơn ông chủ ơi! 🫪`, body, this.parentElement);
                } else {
                    const sortedWords = [...words].sort((a, b) => (a.korean || '').localeCompare(b.korean || ''));
                    let listMsg = 'DANH SÁCH TỪ VỰNG HIỆN CÓ:\n--------------------------\n';
                    sortedWords.forEach(w => {
                        listMsg += `> ${w.korean} : ${w.meaning} [${w.type || '기타'}]\n`;
                    });
                    const resLine = document.createElement('div');
                    resLine.className = 'terminal-line';
                    resLine.style.color = '#85B7EB';
                    resLine.style.whiteSpace = 'pre';
                    resLine.textContent = listMsg;
                    body.insertBefore(resLine, this.parentElement);
                }
            } else if (command === 'delete') {
                deleteCandidates = words.filter(w => w.topic === 'Terminal');
                
                if (deleteCandidates.length === 0) {
                    printTerminalError(`Chưa có từ nào được thêm qua Terminal để xóa đâu nha! 🫪`, body, this.parentElement);
                } else {
                    isWaitingForDelete = true;
                    let promptMsg = 'DANH SÁCH TỪ TERMINAL:\n----------------------\n';
                    deleteCandidates.forEach((w, i) => {
                        promptMsg += `[${i + 1}] ${w.korean} - ${w.meaning}\n`;
                    });
                    promptMsg += `\nÔng chủ muốn trảm từ số mấy? (Hoặc gõ 'c' để quay xe) 🫪:`;

                    const promptLine = document.createElement('div');
                    promptLine.className = 'terminal-line';
                    promptLine.style.color = '#ffbd2e';
                    promptLine.style.whiteSpace = 'pre';
                    promptLine.textContent = promptMsg;
                    body.insertBefore(promptLine, this.parentElement);
                    
                    document.getElementById('terminalPromptPrefix').textContent = 'delete> ';
                }
            } else if (command === 'add') {
                const payloadStr = input.substring(3).trim();
                const regex = /(word|mean|class)\s+(.+?)(?=\s+(?:word|mean|class)\b|$)/gi;
                let match;
                let parsed = { word: '', mean: '', class: '기타' };
                
                while ((match = regex.exec(payloadStr)) !== null) {
                    const key = match[1].toLowerCase();
                    const val = match[2].trim();
                    if (key === 'word') parsed.word = val;
                    if (key === 'mean') parsed.mean = val;
                    if (key === 'class') {
                        const rawClass = val.toLowerCase();
                        if (['noun', 'n', 'danh từ', 'danh tu', '명사'].includes(rawClass)) parsed.class = '명사';
                        else if (['verb', 'v', 'động từ', 'dong tu', '동사'].includes(rawClass)) parsed.class = '동사';
                        else if (['adj', 'a', 'adjective', 'tính từ', 'tinh tu', '형용사'].includes(rawClass)) parsed.class = '형용사';
                        else if (['adv', 'adverb', 'trạng từ', 'trang tu', '부사'].includes(rawClass)) parsed.class = '부사';
                        else if (['excl', 'thán từ', 'than tu', '감탄사'].includes(rawClass)) parsed.class = '감탄사';
                        else parsed.class = '기타';
                    }
                }

                if (!parsed.word || !parsed.mean) {
                    printTerminalError(`Lỗi cú pháp gòi! Ông chủ cần gõ ít nhất 'word' và 'mean'.\nVD: add word 한국 class noun mean Hàn Quốc`, body, this.parentElement);
                } else {
                    const existing = words.filter(w => w.korean === parsed.word);
                    const sameMean = existing.some(w => norm(w.meaning) === norm(parsed.mean));
                    
                    if (sameMean) {
                        printTerminalError(`[WARN] Từ "${parsed.word}" với nghĩa "${parsed.mean}" đã có sẵn trong từ điển rồi ông chủ ơi! 🫪`, body, this.parentElement);
                    } else {
                        isWaitingForConfirm = true;
                        parsed.isNewMeaning = existing.length > 0;
                        pendingAddData = parsed;
                        
                        const promptLine = document.createElement('div');
                        promptLine.className = 'terminal-line';
                        promptLine.style.color = '#85B7EB';
                        
                        if (parsed.isNewMeaning) {
                            promptLine.innerText = `Từ "${parsed.word}" đã tồn tại với nghĩa:\n${existing.map(w => '• ' + w.meaning).join('\n')}\n\nÔng chủ có muốn thêm nghĩa mới "${parsed.mean}" không 🫪? [Y/n]`;
                        } else {
                            promptLine.innerText = `Ông chủ có chắc muốn thêm từ mới này không 🫪?\n🇰🇷 Từ: ${parsed.word}\n🏷️ Loại: ${parsed.class}\n🇻🇳 Nghĩa: ${parsed.mean}\n\n[Y/n]`;
                        }
                        
                        body.insertBefore(promptLine, this.parentElement);
                        document.getElementById('terminalPromptPrefix').textContent = '> ';
                    }
                }
            }
        }

        this.value = "";
        body.scrollTop = body.scrollHeight;
    }
});