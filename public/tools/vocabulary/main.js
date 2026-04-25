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
                    sp.from('profiles').select('role, display_name, avatar').eq('id', user.id).single().then(({ data }) => {
                        isAdmin = data?.role?.toLowerCase() === 'admin';
                        profileData = data;
                        resolve();
                    }).catch(() => resolve());
                });
            }
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
        function refresh() { renderTable(); updateTopics(); if (document.getElementById('pane-flash').classList.contains('active')) buildFlash(); if (document.getElementById('pane-write').classList.contains('active')) buildWrite(); if (document.getElementById('pane-type').classList.contains('active')) buildType(); if (document.getElementById('pane-listen').classList.contains('active')) buildListen(); }

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
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            const tabNames = ['list', 'flash', 'write', 'type', 'listen', 'mc', 'quiz', 'topik', 'soan', 'admin'];
            document.querySelectorAll('.tab').forEach((t, i) => { if (tabNames[i] === n) t.classList.add('active'); });
            document.querySelectorAll('.pane').forEach(p => p.classList.remove('active'));
            document.getElementById('pane-' + n).classList.add('active');
            document.body.classList.toggle('soan-active', n === 'soan');
            if (n === 'flash') buildFlash();
            if (n === 'write') buildWrite();
            if (n === 'type') buildType();
            if (n === 'listen') buildListen();
            if (n === 'mc') { buildMC(); requestAnimationFrame(() => { const w = document.getElementById('mcWrap'); if (w) w.focus(); }); }
            if (n === 'quiz') buildQuiz();
            if (n === 'topik') topikInit();
            if (n === 'admin') buildAdmin();
            if (n === 'soan') { soanInit(); }
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
                'danhsach': 'list', 'flashcard': 'flash', 'flash': 'flash',
                'luyenviet': 'write', 'write': 'write',
                'luyentu': 'type', 'type': 'type',
                'luyenghe': 'listen', 'listen': 'listen',
                'tracnghiem': 'mc', 'mc': 'mc',
                'kiemtra': 'quiz', 'quiz': 'quiz',
                'soan': 'soan', 'admin': 'admin',
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
                    const labelMap = { list:'Danh sách', flash:'Flashcard', write:'Luyện viết', type:'Luyện từ', listen:'Luyện nghe', mc:'Trắc nghiệm', quiz:'Kiểm tra', soan:'Soạn bài', admin:'Admin' };
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

function topikInit() {}

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

            // Latin / ký tự khác → mỗi char 1 ô
            tokens.push({ type: 'latin', text: ch });
            lastWasContent = true;
            i++;
        }

        if (pi < paragraphs.length - 1) {
            tokens.push({ type: 'para_end' });
        }
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

    function currentCol() { return cellCount % COLS || COLS; }

    const CONTENT_TYPES = new Set(['syllable', 'num', 'latin', 'punct', 'punct_space']);

    for (let ti = 0; ti < tokens.length; ti++) {
        const tok = tokens[ti];

        // ── Đầu đoạn: fill hàng hiện tại rồi thêm ô indent ──
        if (tok.type === 'indent') {
            if (cellCount > 0 && cellCount % COLS !== 0) {
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
            // Không thêm ô trống nếu đang đứng đầu hàng mới
            if (cellCount % COLS !== 0) {
                addCell('', { blank: true });
            }
            continue;
        }

        // ── Token nội dung ──
        if (CONTENT_TYPES.has(tok.type)) {
            const col = currentCol();
            const isLastCol = (col === COLS);
            const nextTok = tokens[ti + 1];

            // Nếu ô này là ô cuối hàng VÀ token tiếp theo là dấu câu
            // → viết chung dấu vào ô này
            if (isLastCol && nextTok && (nextTok.type === 'punct' || nextTok.type === 'punct_space')) {
                addCell(tok.text + nextTok.text);
                const wasSpace = nextTok.type === 'punct_space';
                ti++; // skip dấu
                if (wasSpace) {
                    // Sau ! ? cần 1 ô trống — nhưng đây đã đầu hàng mới rồi
                    // nên KHÔNG thêm ô trống (tránh ô trắng đầu hàng)
                    // → bỏ qua ô trống vì dòng mới bắt đầu
                }
            } else {
                addCell(tok.text);
                if (tok.type === 'punct_space') {
                    // Sau ! ? thêm 1 ô trống — nhưng không được ở đầu hàng mới
                    if (cellCount % COLS !== 0) {
                        addCell('', { blank: true });
                    }
                }
            }
            continue;
        }
    }

    // Fill hàng cuối
    while (cellCount % COLS !== 0) addCell('');

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

function topikRender() {
    const input = document.getElementById('topikInput').value.trim();
    if (!input) { toast('Vui lòng nhập đoạn văn!'); return; }

    const tokens = topikTokenize(input);
    const { rows, milestoneRows } = topikLayout(tokens);

    const totalCells = rows.length * 20;
    const filledCells = rows.flat().filter(c => c.text).length;

    document.getElementById('topikStats').innerHTML =
        `<span>Tổng số ô: <b>${totalCells}</b></span>
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
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}