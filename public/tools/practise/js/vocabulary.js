import { supabase, showToast } from './auth.js';

const $ = id => document.getElementById(id);

// ──────────── Ngôn ngữ hiển thị (VI / EN) ────────────
let currentLang = localStorage.getItem('vocab-lang') || 'vi';

/** Lấy nhãn từ vựng theo ngôn ngữ hiện tại. Fallback về word_vn nếu word_en trống. */
function getLabel(word) {
  if (currentLang === 'en' && word.word_en) return word.word_en;
  return word.word_vn ?? '';
}

/** Lấy tên chủ đề theo ngôn ngữ hiện tại. */
function getTopicLabel(topic) {
  if (currentLang === 'en' && topic.title_en) return topic.title_en;
  return topic.title_vn ?? '';
}

/** Đổi ngôn ngữ và re-render view hiện tại. */
window.switchLang = (lang) => {
  if (lang === currentLang) return;
  currentLang = lang;
  localStorage.setItem('vocab-lang', lang);
  updateLangUI();

  // Re-render view đang active
  const active = ['view-topics', 'view-words', 'view-matching', 'view-mcq', 'view-listen']
    .find(id => document.getElementById(id)?.classList.contains('active'));
  if (active === 'view-topics') renderTopics();
  else if (active === 'view-words') renderWords();
  else if (active === 'view-matching') renderMatching();
  else if (active === 'view-mcq') renderMCQ();
  else if (active === 'view-listen') renderListen();
};

function updateLangUI() {
  const btnVI = $('lang-btn-vi');
  const btnEN = $('lang-btn-en');
  const header = $('wh-meaning');
  if (btnVI) btnVI.classList.toggle('lang-btn-active', currentLang === 'vi');
  if (btnEN) btnEN.classList.toggle('lang-btn-active', currentLang === 'en');
  if (header) header.textContent = currentLang === 'en' ? 'English' : 'Tiếng Việt';
}

// ──────────── DOM ELs (lazy — tránh null khi module load trước DOM) ────────────
const viewBooks = () => $('view-books');
const viewTopics = () => $('view-topics');
const viewWords = () => $('view-words');
const viewMatching = () => $('view-matching');
const viewRain = () => $('view-rain');

let currentBook = '듣기읽기'; // cuốn đang chọn
const topicContainer = () => $('topic-list-container');
const wordContainer = () => $('word-list-container');
const navTitle = () => $('nav-title');
const navProgress = () => $('nav-progress');
const btnGlobalBack = () => $('btn-global-back');

let currentTopics = [];
let currentWords = [];

// Khai báo sớm để tránh temporal dead zone trong setView
let rainState = {
  pool: [], totalWords: 0, activeWords: [],
  hp: 100, score: 0, missed: 0,
  difficulty: 'easy', spawnTimer: null, tickTimer: null,
  running: false, paused: false,
};
let voiceObj = null;

// ──────────── Utilities ────────────
function setView(mode) {
  ['view-books', 'view-topics', 'view-words', 'view-matching', 'view-rain', 'view-mcq', 'view-listen', 'view-custom-setup'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
  });

  // Dừng rain game nếu rời view
  if (mode !== 'rain' && rainState.running) {
    rainState.running = false;
    clearInterval(rainState.spawnTimer);
    clearInterval(rainState.tickTimer);
  }

  if (mode === 'words') {
    document.getElementById('view-words').classList.add('active');
    navProgress().classList.remove('hidden');
    btnGlobalBack().href = "javascript:void(0)";
    btnGlobalBack().onclick = (e) => { e.preventDefault(); setView('topics'); };
  } else if (mode === 'matching') {
    document.getElementById('view-matching')?.classList.add('active');
    navProgress().classList.add('hidden');
    btnGlobalBack().href = "javascript:void(0)";
    btnGlobalBack().onclick = (e) => { e.preventDefault(); setView('topics'); };
  } else if (mode === 'mcq') {
    document.getElementById('view-mcq')?.classList.add('active');
    navProgress().classList.add('hidden');
    btnGlobalBack().href = "javascript:void(0)";
    btnGlobalBack().onclick = (e) => {
      e.preventDefault();
      if (window._mcqKeyHandler) document.removeEventListener('keydown', window._mcqKeyHandler);
      if (window._mcqNextKeyHandler) document.removeEventListener('keydown', window._mcqNextKeyHandler);
      setView('topics');
    };
  } else if (mode === 'listen') {
    document.getElementById('view-listen')?.classList.add('active');
    navProgress().classList.add('hidden');
    btnGlobalBack().href = "javascript:void(0)";
    btnGlobalBack().onclick = (e) => {
      e.preventDefault();
      window.speechSynthesis?.cancel();
      setView('topics');
    };
  } else if (mode === 'rain') {
    document.getElementById('view-rain')?.classList.add('active');
    navProgress().classList.add('hidden');
    btnGlobalBack().href = "javascript:void(0)";
    btnGlobalBack().onclick = (e) => {
      e.preventDefault();
      rainState.running = false;
      clearInterval(rainState.spawnTimer);
      clearInterval(rainState.tickTimer);
      setView('topics');
    };
  } else if (mode === 'topics') {
    document.getElementById('view-topics').classList.add('active');
    navProgress().classList.add('hidden');
    const bookLabel = currentBook === '듣기읽기' ? '🎧 듣기 · 읽기' : '✏️ 어휘 · 문법';
    navTitle().innerHTML = bookLabel;
    btnGlobalBack().href = "javascript:void(0)";
    btnGlobalBack().onclick = (e) => { e.preventDefault(); setView('books'); };
  } else {
    // books
    document.getElementById('view-books')?.classList.add('active');
    navProgress().classList.add('hidden');
    navTitle().innerHTML = "Từ vựng";
    btnGlobalBack().onclick = null;
    btnGlobalBack().href = "index.html";
  }
}

// ── TTS: VoiceRSS API (ko-kr) + Web Speech fallback ──
const VOICERSS_API_KEY = '047ac5aaf9764834997d89dfdfbce82b'; // 👈 Thay bằng key của bạn tại voicerss.org

let currentAudio = null;
const audioCache = {};

function initTTS() {
  // Khởi tạo Web Speech làm fallback (nếu VoiceRSS thất bại)
  const synth = window.speechSynthesis;
  if (!synth) return;
  const trySetVoice = () => {
    const voices = synth.getVoices();
    voiceObj = voices.find(v => v.lang === 'ko-KR' || v.lang === 'ko_KR') || null;
  };
  trySetVoice();
  synth.onvoiceschanged = trySetVoice;
}

function speakWebSpeech(krText) {
  const synth = window.speechSynthesis;
  if (!synth) { console.warn('TTS: không có engine nào khả dụng'); return; }
  synth.cancel();
  setTimeout(() => {
    const utt = new SpeechSynthesisUtterance(krText);
    utt.lang = 'ko-KR'; utt.rate = 0.85; utt.pitch = 1.0; utt.volume = 1.0;
    if (voiceObj) utt.voice = voiceObj;
    utt.onerror = e => { if (e.error !== 'interrupted' && e.error !== 'canceled') console.warn('TTS:', e.error); };
    synth.speak(utt);
  }, 50);
}

window.playAudio = async (krText) => {
  if (!krText) return;

  // Dừng audio HTML đang phát
  if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; currentAudio = null; }
  // Dừng cả Web Speech đang phát (tránh chồng giọng)
  window.speechSynthesis?.cancel();

  // Luôn tạo token mới — kể cả khi dùng cache
  // để hủy bất kỳ VoiceRSS nào đang load dở từ trước
  const token = Symbol();
  playAudio._token = token;

  // Dùng cache nếu có
  if (audioCache[krText]) {
    currentAudio = audioCache[krText];
    currentAudio.currentTime = 0;
    currentAudio.play().catch(() => speakWebSpeech(krText));
    return;
  }

  // VoiceRSS TTS — đợi load xong mới phát, không fallback sớm
  if (VOICERSS_API_KEY && VOICERSS_API_KEY !== 'YOUR_API_KEY_HERE') {
    try {
      const url = `https://api.voicerss.org/?key=${VOICERSS_API_KEY}&hl=ko-kr&r=-5&c=MP3&f=16khz_16bit_mono&src=${encodeURIComponent(krText)}`;
      await new Promise((resolve, reject) => {
        const audio = new Audio(url);
        audio.oncanplaythrough = () => {
          // Nếu đã click từ khác trong lúc load → hủy, không phát
          if (playAudio._token !== token) { reject(new Error('cancelled')); return; }
          audioCache[krText] = audio;
          currentAudio = audio;
          audio.play().then(resolve).catch(reject);
        };
        audio.onerror = reject;
        setTimeout(() => reject(new Error('VoiceRSS timeout')), 5000);
      });
      return;
    } catch (e) {
      if (e.message === 'cancelled') return; // Bị hủy chủ động → không fallback
      console.warn('VoiceRSS TTS thất bại, fallback Web Speech:', e.message);
    }
  }

  speakWebSpeech(krText);
};

// ──────────── Fetch Dữ Liệu ────────────
async function loadTopics(userId = null) {
  // Lấy danh sách topics
  const { data: topics, error } = await supabase
    .from('vocabulary_topics')
    .select('*')
    .order('order_index', { ascending: true });

  if (error) {
    console.error(error);
    topicContainer().innerHTML = '<div class="loader" style="color:#e05">Lỗi tải dữ liệu.</div>';
    return;
  }

  // Lấy danh sách topic user đã unlock (nếu đăng nhập)
  let unlockedIds = new Set();
  // Ưu tiên dùng userId truyền vào (tránh race condition), fallback getUser
  const uid = userId || (await supabase.auth.getUser()).data?.user?.id;
  if (uid) {
    const { data: unlocks } = await supabase
      .from('user_unlocked_topics')
      .select('topic_id')
      .eq('user_id', uid);
    unlockedIds = new Set((unlocks || []).map(u => u.topic_id));
  }

  // Gắn trạng thái lock thực tế vào từng topic
  currentTopics = (topics || []).map(t => ({
    ...t,
    _isLocked: t.is_locked === true && !unlockedIds.has(t.id)
  }));

  renderTopics();
}

async function loadWords(topicId, skipRender = false) {
  if (!skipRender) {
    wordContainer().innerHTML = '<div class="loader"><i class="fas fa-circle-notch fa-spin"></i> Đang tải từ vựng...</div>';
  }

  const { data, error } = await supabase
    .from('vocabulary_words')
    .select('*')
    .eq('topic_id', topicId)
    .eq('book', currentBook)
    .order('order_index', { ascending: true });

  if (error) {
    console.error(error);
    if (!skipRender) wordContainer().innerHTML = '<div class="loader" style="color:#e05">Lỗi tải dữ liệu.</div>';
    return;
  }
  currentWords = data || [];
  if (!skipRender) renderWords();
}

// ──────────── Render & Events ────────────
function renderTopics() {
  if (currentTopics.length === 0) {
    topicContainer().innerHTML = '<div class="loader">Chưa có chủ đề nào.</div>';
    return;
  }

  let html = '';
  currentTopics.forEach((t, idx) => {
    const isLocked = t._isLocked === true;
    const lockCls = isLocked ? 'locked' : 'unlocked';
    const lockIcon = isLocked
      ? '<i class="fas fa-lock"></i>'
      : '<i class="fa-solid fa-crown"></i>';

    html += `
      <div class="topic-row ${lockCls}" onclick="onTopicClick(${t.id}, '${getTopicLabel(t)}', '${t.title_kr}', ${isLocked})">
        <div class="topic-idx">${t.order_index}과</div>
        <div class="topic-title">
           ${t.title_kr} <span style="font-size:0.75rem; color:var(--text-muted); font-weight:700">-</span>
           <span class="topic-kr-hint">${getTopicLabel(t)}</span>
        </div>
        <div class="topic-lock">${lockIcon}</div>
      </div>
    `;
  });

  topicContainer().innerHTML = html;
}


// ── Coupon unlock ──
window.applyCoupon = async () => {
  const input = document.getElementById('coupon-input');
  const code = input?.value.trim().toUpperCase();
  if (!code) { showToast('Vui lòng nhập mã coupon!', 'error'); return; }

  // Phải đăng nhập mới dùng coupon
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    showToast('🔑 Vui lòng đăng nhập để sử dụng coupon!', 'error');
    if (window.openLoginModal) openLoginModal();
    return;
  }

  const btn = document.getElementById('btn-unlock');
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>'; }

  // Tra cứu coupon
  const { data: coupon, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code)
    .eq('is_active', true)
    .maybeSingle();

  if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-unlock-alt"></i> Mở khóa'; }

  if (error || !coupon) {
    showToast('❌ Mã coupon không hợp lệ hoặc đã hết hạn!', 'error');
    return;
  }

  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    showToast('❌ Mã coupon đã hết hạn!', 'error');
    return;
  }

  // Kiểm tra giới hạn lượt dùng
  if (coupon.max_uses !== null && coupon.max_uses !== undefined) {
    if ((coupon.used_count || 0) >= coupon.max_uses) {
      showToast(`❌ Mã coupon đã đạt giới hạn ${coupon.max_uses} lượt!`, 'error');
      return;
    }
  }

  // Kiểm tra scope — coupon hanhan không được dùng ở trang từ vựng
  if (coupon.scope !== 'vocab' && coupon.scope !== 'all') {
    showToast('⚠️ Mã này không dùng được cho phần Từ vựng!', 'error');
    return;
  }

  // Xác định topic cần unlock
  // topic_ids = null → mở tất cả topic đang bị lock VÀ user chưa unlock
  let topicIds = coupon.topic_ids;
  if (!topicIds || topicIds.length === 0) {
    // Lấy tất cả id của topic đang bị lock trong DB
    const { data: lockedTopics } = await supabase
      .from('vocabulary_topics')
      .select('id')
      .eq('is_locked', true);
    topicIds = (lockedTopics || []).map(t => t.id);
  }

  // Loại trừ topic user đã unlock rồi — tránh lỗi và toast sai số
  if (topicIds.length > 0) {
    const { data: alreadyUnlocked } = await supabase
      .from('user_unlocked_topics')
      .select('topic_id')
      .eq('user_id', user.id)
      .in('topic_id', topicIds);
    const unlockedSet = new Set((alreadyUnlocked || []).map(r => r.topic_id));
    topicIds = topicIds.filter(id => !unlockedSet.has(id));
  }

  if (topicIds.length === 0) {
    showToast('<i class="fa-solid fa-check" style="color:green;font-size:20px;"></i> Bạn đã mở khóa tất cả chủ đề rồi!', 'info');
    return;
  }

  // Insert vào user_unlocked_topics (upsert để tránh trùng)
  const rows = topicIds.map(tid => ({
    user_id: user.id,
    topic_id: tid,
    coupon_code: code
  }));

  const { error: insertErr } = await supabase
    .from('user_unlocked_topics')
    .upsert(rows, { onConflict: 'user_id,topic_id' });

  if (insertErr) {
    showToast('Lỗi lưu dữ liệu: ' + insertErr.message, 'error');
    return;
  }

  // Tăng used_count
  await supabase
    .from('coupons')
    .update({ used_count: (coupon.used_count || 0) + 1 })
    .eq('id', coupon.id);

  if (input) input.value = '';

  // Toast — tránh crash khi max_uses = null
  const remaining = coupon.max_uses != null
    ? ` — Còn lại: ${coupon.max_uses - (coupon.used_count + 1)} lượt`
    : '';
  showToast(`🎉 Mở khóa thành công ${topicIds.length} chủ đề!${remaining}`, 'success');

  // Reload topics ngay, không cần delay
  await loadTopics();
};

// ──────────── Book Picker ────────────
window.selectBook = (book) => {
  currentBook = book;
  setView('topics');
  loadTopics(window.currentUser?.id);
};

// ──────────── Game Picker ────────────
let pendingTopicId = null;
let pendingTopicVn = null;
let pendingTopicKr = null;

function openGamePicker(id, vn, kr) {
  pendingTopicId = id;
  pendingTopicVn = vn;
  pendingTopicKr = kr;
  document.getElementById('game-picker-overlay').classList.add('active');
}

window.closeGamePicker = () => {
  document.getElementById('game-picker-overlay').classList.remove('active');
};

window.startGame = async (mode) => {
  window.closeGamePicker();
  navTitle().innerHTML = `${pendingTopicVn} <span style="color:#aeacd0;margin:0 4px">-</span> ${pendingTopicKr}`;
  if (mode === 'matching') {
    setView('matching');
    await loadWords(pendingTopicId, true);
    renderMatching();
  } else if (mode === 'mcq') {
    setView('mcq');
    await loadWords(pendingTopicId, true);
    renderMCQ();
  } else if (mode === 'listen') {
    setView('listen');
    await loadWords(pendingTopicId, true);
    renderListen();
  } else {
    setView('words');
    await loadWords(pendingTopicId);
  }
};

window.onTopicClick = async (id, vn, kr, isLocked) => {
  if (isLocked) {
    showToast('🔒 Chủ đề này đang bị khóa! Nhập coupon để mở khóa.', 'info');
    document.querySelector('.coupon-bar')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  // Kiểm tra có từ vựng trong cuốn hiện tại không
  const { count } = await supabase
    .from('vocabulary_words')
    .select('id', { count: 'exact', head: true })
    .eq('topic_id', id)
    .eq('book', currentBook);
  if (!count || count === 0) {
    showToast(`📭 Chủ đề này chưa có từ vựng trong cuốn ${currentBook}!`, 'info');
    return;
  }
  openGamePicker(id, vn, kr);
};

function renderWords() {
  updateProgress();

  if (currentWords.length === 0) {
    wordContainer().innerHTML = '<div class="loader">Chưa có từ vựng nào trong chủ đề này.</div>';
    return;
  }

  let html = '';
  currentWords.forEach((w, idx) => {
    html += `
      <div class="word-row">
        <div class="word-idx">${idx + 1}</div>
        
        <div class="word-vn-block">
            <div class="w-vn-txt">${getLabel(w)}</div>
            <button class="btn-audio" onclick="playAudio('${w.word_kr}')" title="Nghe phát âm">
               <i class="fas fa-volume-up"></i>
            </button>
        </div>
        
        <div class="word-kr-block">
             <input type="text" 
                    class="word-kr-input" 
                    placeholder="한국어···" 
                    data-answer="${w.word_kr}"
                    onblur="checkWord(this)"
                    onkeydown="handleKeydown(event, this)"
                    inputmode="none"
                    autocomplete="off"
                    autocorrect="off"
                    autocapitalize="off"
                    spellcheck="false"
             />
        </div>
      </div>
    `;
  });

  wordContainer().innerHTML = html;
}

function updateProgress() {
  const correct = document.querySelectorAll(".word-kr-input.success");
  navProgress().innerHTML = `${correct.length} / ${currentWords.length}`;
}

async function loadUserStats(profileData = null) {
  const dEl = document.getElementById('stat-diamonds');
  const xEl = document.getElementById('stat-xp');

  // Nếu có profileData từ sự kiện auth-changed (tối ưu nhất)
  if (profileData && profileData.leaderboard_stats) {
    const lb = profileData.leaderboard_stats;
    if (dEl) dEl.textContent = lb.diamonds ?? 0;
    if (xEl) xEl.textContent = lb.xp ?? 0;
    console.log("DEBUG VOCAB: Stats synced from Auth Profile Event:", lb);
    return;
  }

  // Fallback: Tự load nếu chưa có profileData
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    if (dEl) dEl.textContent = 0;
    if (xEl) xEl.textContent = 0;
    return;
  }

  console.log("DEBUG VOCAB: Loading stats manually for User:", user.id);
  const { data: current, error } = await supabase
    .from("leaderboard")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("DEBUG VOCAB: Error loading user stats manually:", error);
    return;
  }

  if (current) {
    if (dEl) dEl.textContent = current.diamonds ?? 0;
    if (xEl) xEl.textContent = current.xp ?? 0;
    console.log("DEBUG VOCAB: Stats synced manually from DB:", current);
  }
}

async function rewardUser(diamonds, xp) {
  const {
    data: { user },
  } = await supabase.auth.getUser(); // Dùng getUser thay vì getSession để chính xác hơn

  if (!user) {
    showToast("Bạn cần đăng nhập để được cộng điểm!", "error");
    return;
  }

  const userId = user.id;

  // 1. Lấy điểm hiện tại
  const { data: current, error: fetchErr } = await supabase
    .from("leaderboard")
    .select("diamonds, xp")
    .eq("user_id", userId)
    .maybeSingle();

  if (fetchErr) {
    console.error("Fetch error:", fetchErr);
    showToast("Lỗi lấy điểm: " + fetchErr.message, "error");
    return;
  }

  // 2. Tính toán điểm mới
  const newDiamonds = (current?.diamonds || 0) + diamonds;
  const newXp = (current?.xp || 0) + xp;

  console.log(`DEBUG VOCAB: Current stats [D:${current?.diamonds || 0}, XP:${current?.xp || 0}] -> New stats [D:${newDiamonds}, XP:${newXp}]`);

  // 3. Upsert (Cập nhật hoặc Chèn mới)
  const { error: upsertErr } = await supabase
    .from("leaderboard")
    .upsert({
      user_id: userId,
      diamonds: newDiamonds,
      xp: newXp,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });

  if (upsertErr) {
    console.error("DEBUG VOCAB: Upsert error:", upsertErr);
    showToast("Lỗi cộng điểm: " + upsertErr.message, "error");
  } else {
    // Thành công: Cập nhật UI Header
    const dEl = document.getElementById('stat-diamonds');
    const xEl = document.getElementById('stat-xp');
    if (dEl) dEl.textContent = newDiamonds;
    if (xEl) xEl.textContent = newXp;

    showRewardPopup(diamonds, xp);
  }
}

function showRewardPopup(d, x) {
  const popup = document.createElement('div');
  popup.style.cssText = `
        position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%);
        background: #7c6ce0; color: white; padding: 10px 20px; border-radius: 20px;
        font-weight: 800; font-size: 0.9rem; z-index: 1000; animation: bounceIn 0.5s ease;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2); pointer-events: none;
    `;
  // Thống nhất icon: Sét (Bolt) = Kim cương, Sao (Star) = XP
  popup.innerHTML = `+${d} <i class="fa-solid fa-diamond"></i> &nbsp; +${x} <i class="fas fa-star"></i>`;
  document.body.appendChild(popup);

  setTimeout(() => {
    popup.style.transition = 'opacity 0.5s, transform 0.5s';
    popup.style.opacity = '0';
    popup.style.transform = 'translate(-50%, -20px)';
    setTimeout(() => popup.remove(), 500);
  }, 2000);
}

window.checkWord = async (el) => {
  if (el.readOnly) return;

  const val = el.value.trim();
  const ans = el.getAttribute("data-answer");

  if (val.length === 0) {
    el.classList.remove("success", "error");
    return;
  }

  // Khóa ô nhập liệu ngay khi kiểm tra
  el.readOnly = true;

  if (val === ans) {
    el.classList.add("success");
    el.classList.remove("error");
    // Cộng thưởng khi đúng
    await rewardUser(3, 1);
  } else {
    el.classList.add("error");
    el.classList.remove("success");
    // Hiện đáp án đúng nếu sai
    el.value = ans;
  }
  updateProgress();
};

window.handleKeydown = (e, el) => {
  if (e.key === "Enter") {
    const val = el.value.trim();
    if (val.length === 0) return;

    // Thực hiện kiểm tra
    checkWord(el);

    // Chuyển sang câu tiếp theo chưa bị khóa
    focusNextIncomplete();
  }
};

function focusNextIncomplete() {
  const allInputs = Array.from(document.querySelectorAll(".word-kr-input"));
  const next = allInputs.find((input) => !input.readOnly);
  if (next) {
    next.focus();
  }
}

// ──────────── Matching Game (Ghép thẻ) ────────────
let matchState = {
  pool: [],
  cards: [],        // mixed flat array: [{id, text, side}]
  selected: null,   // {id, side, elId}
  matched: new Set(),
  errors: 0,
  total: 0,
  roundIndex: 0,
  BATCH: 6          // 6 từ = 12 thẻ → lưới 3×4
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function renderMatching() {
  matchState.pool = shuffle([...currentWords]);
  matchState.roundIndex = 0;
  matchState.errors = 0;
  startMatchRound();
}

function startMatchRound() {
  const s = matchState;
  const start = s.roundIndex * s.BATCH;
  const slice = s.pool.slice(start, start + s.BATCH);

  if (slice.length === 0) { renderMatchDone(); return; }

  // Tạo flat array: mỗi từ → 2 thẻ (kr + vn), trộn lẫn
  const cards = [];
  slice.forEach(w => {
    cards.push({ id: w.id, text: w.word_kr, side: 'kr', elId: `mc-kr-${w.id}` });
    cards.push({ id: w.id, text: getLabel(w), side: 'vn', elId: `mc-vn-${w.id}` });
  });

  s.cards = shuffle(cards);
  s.selected = null;
  s.matched = new Set();
  s.errorPairs = new Set();
  s.total = slice.length;

  renderMatchBoard();
}

function renderMatchBoard() {
  const area = document.getElementById('matching-area');
  if (!area) return;
  const s = matchState;
  const totalRounds = Math.ceil(s.pool.length / s.BATCH);
  const currentRound = s.roundIndex + 1;
  const doneCount = s.roundIndex * s.BATCH;

  const cardsHtml = s.cards.map(c => `
    <button class="match-card match-card-${c.side}" id="${c.elId}"
            onclick="selectCard('${c.side}','${c.id}','${c.elId}')">
      <span class="match-card-lang">${c.side === 'kr' ? '한' : currentLang.toUpperCase()}</span>
      <span class="match-card-text">${c.text}</span>
    </button>`).join('');

  area.innerHTML = `
    <div class="match-meta">
      <span class="match-round-badge">Vòng ${currentRound}/${totalRounds}</span>
      <span class="match-progress-text">${doneCount}/${s.pool.length} từ</span>
    </div>
    <div class="match-progress-bar">
      <div class="match-progress-fill" style="width:${Math.round(doneCount / s.pool.length * 100)}%"></div>
    </div>
    <div class="match-grid" id="match-grid">
      ${cardsHtml}
    </div>
  `;
}

window.selectCard = (side, rawId, elId) => {
  const s = matchState;
  const id = Number(rawId);

  if (s.matched.has(id + '-' + side) || s.matched.has(id)) return;

  // Track which specific card (kr or vn) is matched to avoid double-deselect
  const el = document.getElementById(elId);
  if (!el || el.disabled) return;

  // If clicking the same card → deselect
  if (s.selected && s.selected.elId === elId) {
    el.classList.remove('selected');
    s.selected = null;
    return;
  }

  // Deselect previous if same side
  if (s.selected && s.selected.side === side) {
    document.getElementById(s.selected.elId)?.classList.remove('selected');
    s.selected = null;
  }

  // First pick
  if (!s.selected) {
    el.classList.add('selected');
    s.selected = { id, side, elId };
    return;
  }

  // Second pick — must be opposite side
  const prev = s.selected;
  if (prev.side === side) {
    // Same side again (shouldn't reach here, but safety)
    document.getElementById(prev.elId)?.classList.remove('selected');
    el.classList.add('selected');
    s.selected = { id, side, elId };
    return;
  }

  // Check match
  const prevEl = document.getElementById(prev.elId);
  if (prev.id === id) {
    // Correct!
    [prevEl, el].forEach(e => {
      e?.classList.remove('selected');
      e?.classList.add('matched');
      e.disabled = true;
    });
    s.matched.add(id);
    s.selected = null;

    if (s.matched.size === s.total) {
      setTimeout(() => { s.roundIndex++; startMatchRound(); }, 600);
    }
  } else {
    // ❌ Wrong — chỉ đếm 1 lần mỗi cặp từ sai (dù bấm sai nhiều lần)
    const pairKey = [prev.id, id].sort().join('-');
    if (!s.errorPairs) s.errorPairs = new Set();
    if (!s.errorPairs.has(pairKey)) {
      s.errorPairs.add(pairKey);
      s.errors++;
    }
    [prevEl, el].forEach(e => e?.classList.add('wrong'));
    setTimeout(() => {
      [prevEl, el].forEach(e => e?.classList.remove('wrong', 'selected'));
      s.selected = null;
    }, 650);
  }
};

function renderMatchDone() {
  const area = document.getElementById('matching-area');
  if (!area) return;
  const total = matchState.pool.length;
  // tỉ lệ sai: errors = số lần bấm sai (mỗi lần ghép sai = +1)
  // 3 sao: không sai lần nào
  // 2 sao: sai < 50% số từ
  // 1 sao: sai >= 50% số từ
  const uniqueWrong = matchState.errorPairs?.size ?? matchState.errors;
  const correctRate = 1 - (uniqueWrong / total);
  const stars = correctRate > 0.75 ? '⭐⭐⭐' : correctRate > 0.5 ? '⭐⭐' : '⭐';
  area.innerHTML = `
    <div class="match-done">
      <div class="match-done-stars">${stars}</div>
      <div class="match-done-title">Hoàn thành!</div>
      <div class="match-done-sub">Ghép đúng ${total} từ &nbsp;·&nbsp; Sai ${uniqueWrong} cặp</div>
      <button class="match-restart-btn" onclick="renderMatching()">🔄 Chơi lại</button>
    </div>
  `;
  rewardUser(total * 2, total);
}

// ──────────── Init ────────────
async function startApp() {
  try {
    console.log("DEBUG VOCAB: Initializing TTS...");
    initTTS();

    console.log("DEBUG VOCAB: Checking Supabase object...", typeof supabase);
    if (!supabase) {
      throw new Error("Supabase object is not defined. Check auth.js import.");
    }

    console.log("DEBUG VOCAB: Loading Topics...");
    setView('books'); // Bắt đầu ở màn chọn sách

    // Lắng nghe sự kiện đồng bộ từ auth.js (SSO)
    window.addEventListener('auth-changed', (e) => {
      console.log("DEBUG VOCAB: Auth Changed Event Received:", e.detail);
      const { user, profile } = e.detail;
      if (user) {
        loadUserStats(profile);
        if (viewTopics().classList.contains('active')) loadTopics(user.id);
      } else {
        loadUserStats(null);
        loadTopics(null); // Đăng xuất → hiện lại lock
      }
    });

    // Nếu profile đã được load sẵn trong window bởi auth.js (ưu tiên tối ưu)
    if (window.currentUserProfile) {
      console.log("DEBUG VOCAB: Profile already ready in window, syncing...");
      loadUserStats(window.currentUserProfile);
      if (viewTopics().classList.contains('active')) loadTopics(window.currentUser?.id);
    } else {
      console.log("DEBUG VOCAB: Waiting for auth-changed event to sync stats...");
    }

    console.log("DEBUG VOCAB: App started successfully.");
    updateLangUI();
  } catch (err) {
    console.error("DEBUG VOCAB: CRITICAL ERROR DURING START:", err);
    if (topicContainer) {
      topicContainer().innerHTML = `<div class="loader" style="color:#e05">
                <i class="fas fa-exclamation-triangle"></i><br>
                Lỗi khởi tạo: ${err.message}<br>
                Vui lòng kiểm tra Console (F12)
            </div>`;
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}
// ──────────── Rain Game (Mưa từ vựng) ────────────
// rainState moved to top of file

const RAIN_DIFF = {
  easy: { label: '🟢 Dễ', spawnInterval: null },
  medium: { label: '🟡 Trung bình', spawnInterval: 10000 },
  hard: { label: '🔴 Khó', spawnInterval: 3000 },
};

window.openRainDiffPicker = () => {
  document.getElementById('game-picker-overlay').classList.remove('active');
  document.getElementById('rain-diff-overlay').classList.add('active');
};

window.startRain = async (diff) => {
  document.getElementById('rain-diff-overlay').classList.remove('active');
  navTitle().innerHTML = `${pendingTopicVn} <span style="color:#aeacd0;margin:0 4px">-</span> ${pendingTopicKr}`;
  setView('rain');
  await loadWords(pendingTopicId, true);
  rainState.difficulty = diff;
  rainInit();
};

function rainInit() {
  const container = document.getElementById('rain-container');
  if (!container) return;

  clearInterval(rainState.spawnTimer);
  clearInterval(rainState.tickTimer);

  rainState.pool = shuffle([...currentWords]);
  rainState.totalWords = currentWords.length;
  rainState.activeWords = [];
  rainState.hp = 100;
  rainState.score = 0;
  rainState.missed = 0;
  rainState.running = false;
  rainState.paused = false;

  const diff = RAIN_DIFF[rainState.difficulty];

  container.innerHTML = `
    <div class="rain-hud">
      <span class="rain-score" id="rain-score"><i class="fa-solid fa-check" style="color:green;font-size:20px;"></i> 0/${rainState.totalWords}</span>
      <div class="rain-hp-bar-wrap">
        <div class="rain-hp-bar" id="rain-hp-bar" style="width:100%"></div>
      </div>
      <span class="rain-hp-text" id="rain-hp-text">❤️ 100</span>
      <button class="rain-pause-btn" id="rain-pause-btn" onclick="rainTogglePause()" title="Tạm dừng">⏸</button>
    </div>
    <div class="rain-field" id="rain-field">
      <div class="rain-particles" id="rain-particles"></div>
    </div>
    <div class="rain-input-area">
      <input class="rain-input" id="rain-input" type="text"
             placeholder="Gõ tiếng Hàn..." inputmode="none"
             autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
             onkeydown="if(event.key==='Enter') rainSubmit()" />
      <button class="rain-submit" onclick="rainSubmit()">↵</button>
    </div>
    <div class="rain-start" id="rain-start">
      <div class="rain-go-icon">🌧️</div>
      <div class="rain-go-title">Mưa từ vựng</div>
      <div class="rain-diff-badge">${diff.label}</div>
      <div class="rain-go-sub">${rainState.totalWords} từ sẽ rơi xuống — gõ tiếng Hàn trước khi mất!<br>Nhập sai hoặc miss → mất 5 HP</div>
      <button class="rain-btn" onclick="rainStart()">▶ Bắt đầu</button>
    </div>
  `;

}

window.rainStart = () => {
  document.getElementById('rain-start').style.display = 'none';
  rainState.running = true;
  rainState.paused = false;

  rainSpawnWord();

  if (rainState.difficulty !== 'easy') {
    const diff = RAIN_DIFF[rainState.difficulty];
    rainState.spawnTimer = setInterval(() => {
      if (!rainState.running || rainState.paused) return;
      if (rainState.pool.length > 0) rainSpawnWord();
    }, diff.spawnInterval);
  }

  rainState.tickTimer = setInterval(rainTick, 300);
  setTimeout(() => {
    const inp = document.getElementById('rain-input');
    if (inp) {
      inp.focus();
      if (window.KBD) KBD.open(inp);
    }
  }, 100);
};

window.rainTogglePause = () => {
  if (!rainState.running) return;
  rainState.paused = !rainState.paused;

  const btn = document.getElementById('rain-pause-btn');
  const field = document.getElementById('rain-field');

  if (rainState.paused) {
    // Tạm dừng animation của tất cả từ đang rơi
    field?.querySelectorAll('.rain-word').forEach(el => el.style.animationPlayState = 'paused');
    if (btn) btn.textContent = '▶';

    // Hiện overlay pause
    const ol = document.createElement('div');
    ol.className = 'rain-pause-overlay';
    ol.id = 'rain-pause-ol';
    ol.innerHTML = `<div class="rain-go-icon">⏸</div><div class="rain-go-title" style="color:white">Đã tạm dừng</div><button class="rain-btn" onclick="rainTogglePause()">▶ Tiếp tục</button>`;
    document.getElementById('rain-container')?.appendChild(ol);
  } else {
    // Tiếp tục — nhưng phải cộng thêm thời gian đã pause vào animEnd
    document.getElementById('rain-pause-ol')?.remove();
    field?.querySelectorAll('.rain-word').forEach(el => el.style.animationPlayState = 'running');
    if (btn) btn.textContent = '⏸';
    const inp = document.getElementById('rain-input');
    if (inp) {
      inp.focus();
      if (window.KBD) KBD.open(inp);
    }
  }
};

function rainSpawnWord() {
  if (!rainState.running || rainState.paused) return;
  if (rainState.pool.length === 0) return; // hết từ, không spawn nữa

  const word = rainState.pool.pop();
  const field = document.getElementById('rain-field');
  if (!field) return;

  const fieldW = field.clientWidth || 300;
  const minX = 10, maxX = fieldW - 140;
  const x = Math.floor(Math.random() * (maxX - minX) + minX);

  const el = document.createElement('div');
  el.className = 'rain-word';
  el.id = `rw-${word.id}-${Date.now()}`;
  el.style.left = x + 'px';
  el.innerHTML = `<div class="rain-word-text">${getLabel(word)}</div>`;
  field.appendChild(el);

  const animEnd = Date.now() + 15000;
  rainState.activeWords.push({ id: word.id, elId: el.id, el, wordObj: word, animEnd });
  rainHighlightFirst();
}

function rainHighlightFirst() {
  rainState.activeWords.forEach((w, i) => {
    w.el?.classList.toggle('active-word', i === 0);
  });
}

function rainTick() {
  if (!rainState.running || rainState.paused) return;
  const now = Date.now();

  rainState.activeWords
    .filter(w => now >= w.animEnd)
    .forEach(w => rainMiss(w));

  // Hết từ active VÀ pool rỗng → kết thúc
  if (rainState.pool.length === 0 && rainState.activeWords.length === 0 && rainState.running) {
    rainGameOver(false); // false = hoàn thành, không phải game over
  }
}

function rainMiss(entry) {
  if (!rainState.running) return;
  rainState.activeWords = rainState.activeWords.filter(w => w.elId !== entry.elId);
  entry.el?.classList.add('wrong-word');
  setTimeout(() => entry.el?.remove(), 400);

  rainState.missed++;
  rainDamage(5);
  rainHighlightFirst();

  if (rainState.difficulty === 'easy' && rainState.running && rainState.pool.length > 0) {
    setTimeout(rainSpawnWord, 600);
  }
}

function rainDamage(dmg) {
  rainState.hp = Math.max(0, rainState.hp - dmg);
  const pct = rainState.hp;
  const bar = document.getElementById('rain-hp-bar');
  const txt = document.getElementById('rain-hp-text');
  if (bar) {
    bar.style.width = pct + '%';
    bar.style.background = pct > 50
      ? 'linear-gradient(90deg,#ff4757,#ff6b81)'
      : pct > 25
        ? 'linear-gradient(90deg,#ffa502,#ffbe76)'
        : 'linear-gradient(90deg,#c0392b,#ff4757)';
  }
  if (txt) txt.textContent = `❤️ ${rainState.hp}`;
  if (rainState.hp <= 0) rainGameOver(true);
}

window.rainSubmit = () => {
  if (!rainState.running || rainState.paused) return;
  const input = document.getElementById('rain-input');
  if (!input) return;
  const val = input.value.trim();
  if (!val) return;

  let matched = null;
  for (const w of rainState.activeWords) {
    if (w.wordObj.word_kr === val) { matched = w; break; }
  }

  if (matched) {
    rainState.activeWords = rainState.activeWords.filter(w => w.elId !== matched.elId);
    matched.el?.classList.add('correct-word');
    rainParticles(matched.el, '#3ab89a');
    setTimeout(() => matched.el?.remove(), 500);

    rainState.score++;
    const scoreEl = document.getElementById('rain-score');
    if (scoreEl) scoreEl.textContent = `<i class="fa-solid fa-check" style="color:green;font-size:20px;"></i> ${rainState.score}/${rainState.totalWords}`;

    rainHighlightFirst();

    if (rainState.difficulty === 'easy' && rainState.running && rainState.pool.length > 0) {
      setTimeout(rainSpawnWord, 400);
    }

    // Hết từ ngay sau khi nhập đúng từ cuối
    if (rainState.pool.length === 0 && rainState.activeWords.length === 0) {
      setTimeout(() => rainGameOver(false), 500);
    }
  } else {
    input.style.borderColor = '#ff4757';
    setTimeout(() => input.style.borderColor = '', 500);
    rainDamage(5);
  }

  input.value = '';
  input.focus();
};

function rainParticles(el, color) {
  const field = document.getElementById('rain-particles');
  if (!field || !el) return;
  const rect = el.getBoundingClientRect();
  const fRect = field.getBoundingClientRect();
  const cx = rect.left - fRect.left + rect.width / 2;
  const cy = rect.top - fRect.top + rect.height / 2;
  for (let i = 0; i < 8; i++) {
    const p = document.createElement('div');
    p.className = 'rain-particle';
    p.style.cssText = `background:${color};left:${cx + (Math.random() - .5) * 40}px;top:${cy + (Math.random() - .5) * 20}px`;
    field.appendChild(p);
    setTimeout(() => p.remove(), 800);
  }
}

function rainGameOver(isDead) {
  if (!rainState.running) return;
  rainState.running = false;
  clearInterval(rainState.spawnTimer);
  clearInterval(rainState.tickTimer);

  const container = document.getElementById('rain-container');
  if (!container) return;

  // Xóa overlay pause nếu có
  document.getElementById('rain-pause-ol')?.remove();

  const diff = RAIN_DIFF[rainState.difficulty];
  const el = document.createElement('div');
  el.className = 'rain-gameover';
  el.innerHTML = `
    <div class="rain-go-icon">${isDead ? '💀' : '🎉'}</div>
    <div class="rain-go-title">${isDead ? 'Game Over!' : 'Hoàn thành!'}</div>
    <div class="rain-diff-badge">${diff.label}</div>
    <div class="rain-go-sub">
      <i class="fa-solid fa-check" style="color:green;font-size:20px;"></i> Đúng: <strong style="color:#5fd4b5">${rainState.score}</strong> &nbsp;·&nbsp;
      <i class="fa-solid fa-xmark" style="color:red;font-size:20px;"></i> Miss: <strong style="color:#ff6b81">${rainState.missed}</strong> &nbsp;·&nbsp;
      <i class="fa-solid fa-heart"></i> HP: <strong style="color:white">${rainState.hp}</strong>
    </div>
    <button class="rain-btn" onclick="startRain('${rainState.difficulty}')">🔄 Chơi lại</button>
    <button class="rain-btn" style="background:rgba(255,255,255,0.1);margin-top:0" onclick="openRainDiffPicker()">Đổi độ khó</button>
  `;
  container.appendChild(el);
}

// ──────────── MCQ Game (Trắc nghiệm 4 đáp án) ────────────
let mcqState = {
  pool: [],
  current: 0,
  correct: 0,
  wrong: 0,
  answered: false,
};

function renderMCQ() {
  mcqState.pool = shuffle([...currentWords]);
  mcqState.current = 0;
  mcqState.correct = 0;
  mcqState.wrong = 0;
  mcqState.answered = false;

  const area = document.getElementById('mcq-area');
  if (!area) return;
  mcqNextQuestion(area);
}

function mcqNextQuestion(area) {
  const s = mcqState;
  if (!area) area = document.getElementById('mcq-area');
  if (!area) return;

  if (s.current >= s.pool.length) {
    mcqDone(area); return;
  }

  const word = s.pool[s.current];
  s.answered = false;

  // Tạo 3 distractor từ các từ khác trong pool (loại trừ từ hiện tại)
  const others = s.pool.filter((_, i) => i !== s.current);
  const distractors = shuffle(others).slice(0, 3).map(w => getLabel(w));
  const choices = shuffle([getLabel(word), ...distractors]);

  const progressPct = Math.round((s.current / s.pool.length) * 100);

  area.innerHTML = `
    <div class="mcq-meta">
      <span class="mcq-badge">Câu ${s.current + 1}/${s.pool.length}</span>
      <span class="mcq-score-text"><i class="fa-solid fa-check" style="color:green;font-size:20px;"></i> ${s.correct} &nbsp;<i class="fa-solid fa-xmark" style="color:red;font-size:20px;"></i> ${s.wrong}</span>
    </div>
    <div class="mcq-progress-bar"><div class="mcq-progress-fill" style="width:${progressPct}%"></div></div>
    <div class="mcq-question-card">
      <div class="mcq-lang-label">korean</div>
      <div class="mcq-question-kr">${word.word_kr}</div>
      <button class="mcq-audio-btn" onclick="playAudio('${word.word_kr}')" title="Nghe phát âm">
        <i class="fas fa-volume-up"></i>
      </button>
    </div>
    <div class="mcq-prompt">Chọn nghĩa tiếng Việt đúng:</div>
    <div class="mcq-choices" id="mcq-choices">
      ${choices.map((c, i) => `
        <button class="mcq-choice" id="mcq-c${i}" data-label="${c.replace(/"/g, '&quot;')}" onclick="mcqSelect(${i}, '${c.replace(/'/g, "\\'")}', '${getLabel(word).replace(/'/g, "\\'")}')">
          <span class="mcq-key-badge">${i + 1}</span>${c}
        </button>
      `).join('')}
    </div>
  `;

  // Gắn keyboard listener 1–4
  mcqAttachKeyListener(choices, getLabel(word));
}

function mcqAttachKeyListener(choices, correct) {
  // Xóa listener cũ nếu có
  if (window._mcqKeyHandler) {
    document.removeEventListener('keydown', window._mcqKeyHandler);
  }
  window._mcqKeyHandler = (e) => {
    const idx = ['1', '2', '3', '4'].indexOf(e.key);
    if (idx === -1 || mcqState.answered) return;
    // Flash hiệu ứng nhấn phím
    const btn = document.getElementById(`mcq-c${idx}`);
    if (btn) {
      btn.classList.add('mcq-key-pressed');
      setTimeout(() => btn.classList.remove('mcq-key-pressed'), 150);
      mcqSelect(idx, choices[idx], correct);
    }
  };
  document.addEventListener('keydown', window._mcqKeyHandler);
}

window.mcqSelect = (idx, chosen, correct) => {
  if (mcqState.answered) return;
  mcqState.answered = true;

  // Tắt key listener ngay khi đã trả lời — tránh Enter/số kích hoạt nút tiếp tục
  if (window._mcqKeyHandler) {
    document.removeEventListener('keydown', window._mcqKeyHandler);
    window._mcqKeyHandler = null;
  }

  const isCorrect = chosen === correct;
  if (isCorrect) mcqState.correct++; else mcqState.wrong++;

  // Highlight đáp án — dùng data-label thay vì textContent (vì có badge số bên trong)
  document.querySelectorAll('.mcq-choice').forEach(btn => {
    btn.disabled = true;
    if (btn.dataset.label === correct) {
      btn.classList.add('mcq-correct');
    } else if (btn.id === `mcq-c${idx}` && !isCorrect) {
      btn.classList.add('mcq-wrong');
    }
  });

  if (isCorrect) {
    showRewardPopup(2, 1);
    setTimeout(() => {
      mcqState.current++;
      mcqNextQuestion();
    }, 900);
  } else {
    const area = document.getElementById('mcq-area');
    if (area) {
      const nextBtn = document.createElement('button');
      nextBtn.className = 'mcq-next-btn';
      nextBtn.innerHTML = 'Tiếp tục →';
      // Dùng setTimeout để tránh Enter đang giữ trigger ngay lập tức
      nextBtn.addEventListener('click', () => { mcqState.current++; mcqNextQuestion(); });
      area.appendChild(nextBtn);
      // Gắn Enter để qua câu tiếp — nhưng chỉ sau 300ms (tránh bắt Enter vừa nhấn)
      setTimeout(() => {
        window._mcqNextKeyHandler = (e) => {
          if (e.key === 'Enter') {
            document.removeEventListener('keydown', window._mcqNextKeyHandler);
            window._mcqNextKeyHandler = null;
            mcqState.current++;
            mcqNextQuestion();
          }
        };
        document.addEventListener('keydown', window._mcqNextKeyHandler);
      }, 300);
    }
  }
};

function mcqDone(area) {
  if (!area) area = document.getElementById('mcq-area');
  if (!area) return;
  const total = mcqState.pool.length;
  const rate = mcqState.correct / total;
  const stars = rate >= 0.9 ? '⭐⭐⭐' : rate >= 0.6 ? '⭐⭐' : '⭐';
  area.innerHTML = `
    <div class="match-done">
      <div class="match-done-stars">${stars}</div>
      <div class="match-done-title">Hoàn thành!</div>
      <div class="match-done-sub">
        <i class="fa-solid fa-check" style="color:green;font-size:20px;"></i> Đúng: <strong>${mcqState.correct}/${total}</strong> &nbsp;·&nbsp;
        <i class="fa-solid fa-xmark" style="color:red;font-size:20px;"></i> Sai: <strong>${mcqState.wrong}</strong>
      </div>
      <button class="match-restart-btn" onclick="renderMCQ()">🔄 Chơi lại</button>
    </div>
  `;
  rewardUser(mcqState.correct * 2, mcqState.correct);
}

window.renderMCQ = renderMCQ;

// ──────────── Listen & Type Game (Nghe & Gõ) ────────────
let listenState = {
  pool: [],
  current: 0,
  correct: 0,
  wrong: 0,
  hintUsed: false,
};

function renderListen() {
  listenState.pool = shuffle([...currentWords]);
  listenState.current = 0;
  listenState.correct = 0;
  listenState.wrong = 0;

  const area = document.getElementById('listen-area');
  if (!area) return;
  listenNextQuestion(area);
}

function listenNextQuestion(area) {
  const s = listenState;
  if (!area) area = document.getElementById('listen-area');
  if (!area) return;

  if (s.current >= s.pool.length) {
    listenDone(area); return;
  }

  const word = s.pool[s.current];
  s.hintUsed = false;
  const progressPct = Math.round((s.current / s.pool.length) * 100);

  // Auto-play TTS khi chuyển câu
  setTimeout(() => playAudio(word.word_kr), 200);

  area.innerHTML = `
    <div class="mcq-meta">
      <span class="mcq-badge">Câu ${s.current + 1}/${s.pool.length}</span>
      <span class="mcq-score-text"><i class="fa-solid fa-check" style="color:green;font-size:20px;"></i> ${s.correct} &nbsp;<i class="fa-solid fa-xmark" style="color:red;font-size:20px;"></i> ${s.wrong}</span>
    </div>
    <div class="mcq-progress-bar"><div class="mcq-progress-fill" style="width:${progressPct}%"></div></div>

    <div class="listen-card">
      <div class="listen-wave" id="listen-wave">
        <span></span><span></span><span></span><span></span><span></span>
      </div>
      <div class="listen-vn-hint">${getLabel(word)}</div>
      <div class="listen-btns">
        <button class="listen-play-btn" onclick="playAudio('${word.word_kr}')">
          <i class="fas fa-volume-up"></i> Nghe lại
        </button>
        <button class="listen-play-btn listen-slow-btn" onclick="listenPlaySlow('${word.word_kr}')">
          <i class="fas fa-volume-down"></i> Chậm
        </button>
      </div>
    </div>

    <div class="listen-hint-wrap" id="listen-hint-wrap"></div>

    <div class="listen-input-wrap">
      <input type="text" id="listen-input" class="word-kr-input listen-input-el"
             placeholder="Gõ tiếng Hàn bạn vừa nghe..."
             inputmode="none"
             autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
             onkeydown="if(event.key==='Enter') listenSubmit()" />
      <div class="listen-action-row">
        <button class="listen-hint-btn" onclick="listenShowHint('${word.word_kr.replace(/'/g, "\\'")}')">
          💡 Gợi ý (-1 XP)
        </button>
        <button class="listen-submit-btn" onclick="listenSubmit()">Kiểm tra →</button>
      </div>
    </div>
  `;

  // Mở KBD cho ô nhập
  setTimeout(() => {
    const inp = document.getElementById('listen-input');
    if (inp && window.KBD && window.KBD.isEnabled && window.KBD.isEnabled()) {
      KBD.open(inp);
    }
  }, 300);

  // Wave animation khi đang phát âm
  activateWave(word.word_kr);
}

function activateWave(kr) {
  const wave = document.getElementById('listen-wave');
  if (!wave) return;
  wave.classList.add('playing');
  // Tắt sau khi âm thanh ước tính xong (~2s)
  setTimeout(() => wave?.classList.remove('playing'), 2200);
}

window.listenPlaySlow = (kr) => {
  const synth = window.speechSynthesis;
  if (!synth) return;
  synth.cancel();
  setTimeout(() => {
    const utt = new SpeechSynthesisUtterance(kr);
    utt.lang = 'ko-KR'; utt.rate = 0.55; utt.pitch = 1.0; utt.volume = 1.0;
    if (window.voiceObj) utt.voice = window.voiceObj;
    synth.speak(utt);
    activateWave(kr);
  }, 50);
};

window.listenShowHint = (kr) => {
  if (listenState.hintUsed) return;
  listenState.hintUsed = true;
  const hintWrap = document.getElementById('listen-hint-wrap');
  if (!hintWrap) return;

  // Hiện 50% chữ cái đầu, che phần còn lại bằng _
  const chars = [...kr];
  const showCount = Math.max(1, Math.ceil(chars.length / 2));
  const hint = chars.map((c, i) => i < showCount ? `<span class="hint-shown">${c}</span>` : `<span class="hint-hidden">＿</span>`).join('');
  hintWrap.innerHTML = `<div class="listen-hint-box">💡 ${hint}</div>`;

  // Trừ 1 XP nhẹ (không trừ diamonds)
  const xEl = document.getElementById('stat-xp');
  if (xEl) {
    const cur = parseInt(xEl.textContent) || 0;
    if (cur > 0) xEl.textContent = cur - 1;
  }
};

window.listenSubmit = () => {
  const s = listenState;
  const input = document.getElementById('listen-input');
  if (!input || input.readOnly) return;
  const val = input.value.trim();
  if (!val) return;

  const word = s.pool[s.current];
  const isCorrect = val === word.word_kr;

  input.readOnly = true;
  input.classList.add(isCorrect ? 'success' : 'error');
  if (!isCorrect) input.value = word.word_kr; // Hiện đáp án đúng

  if (isCorrect) {
    s.correct++;
    const bonus = s.hintUsed ? 1 : 2;
    rewardUser(bonus, bonus);
    setTimeout(() => { s.current++; listenNextQuestion(); }, 900);
  } else {
    s.wrong++;
    const area = document.getElementById('listen-area');
    if (area) {
      const nextBtn = document.createElement('button');
      nextBtn.className = 'mcq-next-btn';
      nextBtn.innerHTML = 'Tiếp tục →';
      nextBtn.onclick = () => { s.current++; listenNextQuestion(); };
      area.appendChild(nextBtn);
    }
  }
};

function listenDone(area) {
  if (!area) area = document.getElementById('listen-area');
  if (!area) return;
  window.speechSynthesis?.cancel();
  const total = listenState.pool.length;
  const rate = listenState.correct / total;
  const stars = rate >= 0.9 ? '⭐⭐⭐' : rate >= 0.6 ? '⭐⭐' : '⭐';
  area.innerHTML = `
    <div class="match-done">
      <div class="match-done-stars">${stars}</div>
      <div class="match-done-title">Hoàn thành!</div>
      <div class="match-done-sub">
        <i class="fa-solid fa-check" style="color:green;font-size:20px;"></i> Đúng: <strong>${listenState.correct}/${total}</strong> &nbsp;·&nbsp;
        <i class="fa-solid fa-xmark" style="color:red;font-size:20px;"></i> Sai: <strong>${listenState.wrong}</strong>
      </div>
      <button class="match-restart-btn" onclick="renderListen()">🔄 Chơi lại</button>
    </div>
  `;
  rewardUser(listenState.correct * 2, listenState.correct);
}

window.renderListen = renderListen;

// ══════════════════════════════════════════════════════════════
// ──────────── LUYỆN THI TỰ CHỌN ────────────
// ══════════════════════════════════════════════════════════════

let customState = {
  book: '듣기읽기',
  selectedTopicIds: new Set(),
  questionCount: 30,  // 0 = tất cả
  mode: 'words',
  allTopics: [],      // mảng topic đã load (theo book đang chọn)
  topicWordCounts: {}, // { topicId: number }
};

// Mở trang setup tự chọn
window.openCustomPractice = () => {
  window.setView('custom');
  loadCustomTopics();
};

// Thêm 'custom' vào setView
const _origSetView = setView;
// Override setView để hỗ trợ view-custom-setup
const _patchedSetView = (mode) => {
  // Xử lý custom riêng
  if (mode === 'custom') {
    ['view-books', 'view-topics', 'view-words', 'view-matching', 'view-rain', 'view-mcq', 'view-listen', 'view-custom-setup'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('active');
    });
    if (rainState.running) {
      rainState.running = false;
      clearInterval(rainState.spawnTimer);
      clearInterval(rainState.tickTimer);
    }
    const el = document.getElementById('view-custom-setup');
    if (el) el.classList.add('active');
    navProgress().classList.add('hidden');
    navTitle().innerHTML = '🎯 Luyện thi tự chọn';
    btnGlobalBack().href = 'javascript:void(0)';
    btnGlobalBack().onclick = (e) => { e.preventDefault(); setView('books'); };
    return;
  }
  _origSetView(mode);
};
// Monkey-patch window.setView for HTML onclick calls
window.setView = _patchedSetView;
// Also patch the module-level reference used internally
// (We reassign the local name — JS module scope, so we wrap calls below)

async function loadCustomTopics() {
  const listEl = document.getElementById('custom-topic-list');
  if (!listEl) return;
  listEl.innerHTML = '<div class="loader"><i class="fas fa-circle-notch fa-spin"></i> Đang tải...</div>';

  // Load topics
  const { data: topics, error } = await supabase
    .from('vocabulary_topics')
    .select('*')
    .order('order_index', { ascending: true });

  if (error || !topics) {
    listEl.innerHTML = '<div style="color:#e05;font-size:0.85rem;padding:8px">Lỗi tải dữ liệu</div>';
    return;
  }

  // Lấy unlock status
  let unlockedIds = new Set();
  const uid = window.currentUser?.id;
  if (uid) {
    const { data: unlocks } = await supabase
      .from('user_unlocked_topics')
      .select('topic_id')
      .eq('user_id', uid);
    unlockedIds = new Set((unlocks || []).map(u => u.topic_id));
  }

  customState.allTopics = topics.map(t => ({
    ...t,
    _isLocked: t.is_locked === true && !unlockedIds.has(t.id)
  }));

  // Load word counts cho từng topic (batch)
  await loadCustomWordCounts();
  renderCustomTopicList();
  updateCustomCountInfo();
}

async function loadCustomWordCounts() {
  // Lấy số từ cho từng topic theo book đang chọn
  const topicIds = customState.allTopics
    .filter(t => !t._isLocked)
    .map(t => t.id);

  if (topicIds.length === 0) return;

  const { data } = await supabase
    .from('vocabulary_words')
    .select('topic_id')
    .in('topic_id', topicIds)
    .eq('book', customState.book);

  customState.topicWordCounts = {};
  (data || []).forEach(row => {
    customState.topicWordCounts[row.topic_id] = (customState.topicWordCounts[row.topic_id] || 0) + 1;
  });
}

function renderCustomTopicList() {
  const listEl = document.getElementById('custom-topic-list');
  if (!listEl) return;

  if (customState.allTopics.length === 0) {
    listEl.innerHTML = '<div style="color:var(--text-muted);font-size:0.85rem;padding:8px">Chưa có chủ đề nào</div>';
    return;
  }

  let html = '';
  customState.allTopics.forEach(t => {
    const isLocked = t._isLocked;
    const isSelected = customState.selectedTopicIds.has(t.id);
    const wCount = customState.topicWordCounts[t.id] || 0;
    const lockedClass = isLocked ? ' locked-topic' : '';
    const selectedClass = isSelected ? ' selected' : '';
    const label = currentLang === 'en' && t.title_en ? t.title_en : (t.title_vn || '');

    html += `
      <div class="custom-topic-item${selectedClass}${lockedClass}"
           onclick="${isLocked ? `showToast('🔒 Chủ đề này đang bị khóa!','info')` : `toggleCustomTopic(${t.id})`}">
        <div class="custom-topic-check"></div>
        <div class="custom-topic-name">${t.order_index}과 · ${t.title_kr} <span style="color:var(--text-muted);font-weight:600">- ${label}</span></div>
        <div class="custom-topic-count">${isLocked ? '🔒' : (wCount > 0 ? wCount + ' từ' : '—')}</div>
      </div>
    `;
  });
  listEl.innerHTML = html;
}

window.toggleCustomTopic = (id) => {
  if (customState.selectedTopicIds.has(id)) {
    customState.selectedTopicIds.delete(id);
  } else {
    customState.selectedTopicIds.add(id);
  }
  // Update UI
  const items = document.querySelectorAll('.custom-topic-item');
  items.forEach(item => {
    const onclick = item.getAttribute('onclick') || '';
    const match = onclick.match(/toggleCustomTopic\((\d+)\)/);
    if (match) {
      const tid = parseInt(match[1]);
      item.classList.toggle('selected', customState.selectedTopicIds.has(tid));
    }
  });
  updateCustomCountInfo();
  updateSelectAllBtn();
};

window.toggleSelectAllTopics = () => {
  const unlockedTopics = customState.allTopics.filter(t => !t._isLocked && (customState.topicWordCounts[t.id] || 0) > 0);
  const allSelected = unlockedTopics.every(t => customState.selectedTopicIds.has(t.id));

  if (allSelected) {
    // Bỏ chọn tất cả
    unlockedTopics.forEach(t => customState.selectedTopicIds.delete(t.id));
  } else {
    // Chọn tất cả
    unlockedTopics.forEach(t => customState.selectedTopicIds.add(t.id));
  }
  renderCustomTopicList();
  updateCustomCountInfo();
  updateSelectAllBtn();
};

function updateSelectAllBtn() {
  const btn = document.getElementById('btn-select-all');
  if (!btn) return;
  const unlockedTopics = customState.allTopics.filter(t => !t._isLocked && (customState.topicWordCounts[t.id] || 0) > 0);
  const allSelected = unlockedTopics.length > 0 && unlockedTopics.every(t => customState.selectedTopicIds.has(t.id));
  btn.textContent = allSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả';
}

function updateCustomCountInfo() {
  const infoEl = document.getElementById('custom-count-info');
  if (!infoEl) return;

  if (customState.selectedTopicIds.size === 0) {
    infoEl.textContent = '— Chưa chọn bài';
    return;
  }

  const totalWords = [...customState.selectedTopicIds].reduce((sum, id) => {
    return sum + (customState.topicWordCounts[id] || 0);
  }, 0);

  const q = customState.questionCount;
  const actualQ = q === 0 ? totalWords : Math.min(q, totalWords);
  infoEl.innerHTML = `Tổng <strong>${totalWords}</strong> từ từ <strong>${customState.selectedTopicIds.size}</strong> bài · Sẽ hỏi <strong>${actualQ}</strong> câu ngẫu nhiên`;
}

window.selectCustomBook = async (book) => {
  customState.book = book;
  customState.selectedTopicIds.clear();
  document.querySelectorAll('.custom-book-btn').forEach(btn => {
    btn.classList.toggle('active-book', btn.dataset.book === book);
  });
  await loadCustomWordCounts();
  renderCustomTopicList();
  updateCustomCountInfo();
};

window.selectCustomCount = (count) => {
  customState.questionCount = count;
  document.querySelectorAll('.custom-count-btn').forEach(btn => {
    btn.classList.toggle('active-count', parseInt(btn.dataset.count) === count);
  });
  updateCustomCountInfo();
};

window.selectCustomMode = (mode) => {
  customState.mode = mode;
  document.querySelectorAll('.custom-mode-btn').forEach(btn => {
    btn.classList.toggle('active-mode', btn.dataset.mode === mode);
  });
};

window.startCustomPractice = async () => {
  if (customState.selectedTopicIds.size === 0) {
    showToast('⚠️ Vui lòng chọn ít nhất 1 bài!', 'error');
    return;
  }

  const btn = document.getElementById('btn-start-custom');
  if (btn) { btn.disabled = true; btn.textContent = '⏳ Đang tải từ vựng...'; }

  try {
    // Load từ vựng từ tất cả topic đã chọn
    const topicIds = [...customState.selectedTopicIds];
    const { data, error } = await supabase
      .from('vocabulary_words')
      .select('*')
      .in('topic_id', topicIds)
      .eq('book', customState.book)
      .order('order_index', { ascending: true });

    if (error) throw error;

    let allWords = data || [];
    if (allWords.length === 0) {
      showToast('📭 Không có từ vựng nào trong các bài đã chọn!', 'error');
      return;
    }

    // Shuffle và giới hạn số câu
    allWords = shuffle(allWords);
    if (customState.questionCount > 0) {
      allWords = allWords.slice(0, customState.questionCount);
    }

    // Set currentWords để các game engine dùng được
    currentWords = allWords;

    // Build nav title
    const topicNames = customState.selectedTopicIds.size === 1
      ? (customState.allTopics.find(t => t.id === [...customState.selectedTopicIds][0])?.title_kr || '')
      : `${customState.selectedTopicIds.size} bài tổng hợp`;

    navTitle().innerHTML = `🎯 ${topicNames} <span style="color:#aeacd0;margin:0 4px">·</span> ${allWords.length} câu`;

    const mode = customState.mode;
    if (mode === 'words') {
      setView('words');
      renderWords();
      navProgress().classList.remove('hidden');
    } else if (mode === 'mcq') {
      setView('mcq');
      renderMCQ();
    } else if (mode === 'listen') {
      setView('listen');
      renderListen();
    }

    // Patch back button để quay về custom setup
    btnGlobalBack().href = 'javascript:void(0)';
    btnGlobalBack().onclick = (e) => {
      e.preventDefault();
      if (window._mcqKeyHandler) document.removeEventListener('keydown', window._mcqKeyHandler);
      if (window._mcqNextKeyHandler) document.removeEventListener('keydown', window._mcqNextKeyHandler);
      window.speechSynthesis?.cancel();
      _patchedSetView('custom');
    };

  } catch (err) {
    console.error(err);
    showToast('Lỗi tải dữ liệu: ' + err.message, 'error');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = '🚀 Bắt đầu luyện thi'; }
  }
};

// Patch setView function to also handle 'view-custom-setup' in the toggle list
const origSetViewForCustom = window.setView;
// Override the module-local setView used in setView's own body
// Since JS module closures don't allow this easily, we ensure
// the view-custom-setup element is hidden whenever setView is called for non-custom modes.
// We do this by wrapping the original exported window.setView.
const _finalSetView = (mode) => {
  // Always hide custom setup unless we're going to it
  if (mode !== 'custom') {
    document.getElementById('view-custom-setup')?.classList.remove('active');
  }
  origSetViewForCustom(mode);
};
window.setView = _finalSetView;