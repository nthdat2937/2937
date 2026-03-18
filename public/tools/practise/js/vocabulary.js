import { supabase, showToast } from './auth.js';

const $ = id => document.getElementById(id);

// ──────────── DOM ELs ────────────
const viewTopics = $('view-topics');
const viewWords = $('view-words');
const topicContainer = $('topic-list-container');
const wordContainer = $('word-list-container');
const navTitle = $('nav-title');
const navProgress = $('nav-progress');
const btnGlobalBack = $('btn-global-back');

let currentTopics = [];
let currentWords = [];
let voiceObj = null;

// ──────────── Utilities ────────────
function setView(isWordsView) {
  if (isWordsView) {
    viewTopics.classList.remove('active');
    viewWords.classList.add('active');
    navProgress.classList.remove('hidden');

    // Đổi logic Back btn: quay lại ds chủ đề
    btnGlobalBack.href = "javascript:void(0)";
    btnGlobalBack.onclick = (e) => {
      e.preventDefault();
      setView(false);
    };
  } else {
    viewWords.classList.remove('active');
    viewTopics.classList.add('active');
    navProgress.classList.add('hidden');
    navTitle.innerHTML = "Từ vựng theo chủ đề";

    // Đổi logic Back btn: Về Home
    btnGlobalBack.onclick = null;
    btnGlobalBack.href = "index.html";
  }
}

// ── TTS: Google Translate Audio via fetch→blob (bypass CORS) + Web Speech fallback ──
let currentAudio = null;
const audioCache = {};

function initTTS() {
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

  // Dừng audio đang phát
  if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; }

  // Dùng cache nếu có
  if (audioCache[krText]) {
    currentAudio = audioCache[krText];
    currentAudio.currentTime = 0;
    currentAudio.play().catch(() => speakWebSpeech(krText));
    return;
  }

  // MyMemory TTS — free, không cần key, hỗ trợ CORS
  try {
    const url = `https://api.mymemory.translated.net/api/tts?q=${encodeURIComponent(krText)}&lang=ko-KR`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error('MyMemory TTS failed');
    const blob = await resp.blob();
    const blobUrl = URL.createObjectURL(blob);
    const audio = new Audio(blobUrl);
    audio.playbackRate = 0.9;
    audioCache[krText] = audio;
    currentAudio = audio;
    await audio.play();
    return;
  } catch (e) {
    console.warn('MyMemory TTS thất bại, fallback Web Speech:', e.message);
  }

  speakWebSpeech(krText);
};

// ──────────── Fetch Dữ Liệu ────────────
async function loadTopics() {
  // Lấy danh sách topics
  const { data: topics, error } = await supabase
    .from('vocabulary_topics')
    .select('*')
    .order('order_index', { ascending: true });

  if (error) {
    console.error(error);
    topicContainer.innerHTML = '<div class="loader" style="color:#e05">Lỗi tải dữ liệu.</div>';
    return;
  }

  // Lấy danh sách topic user đã unlock (nếu đăng nhập)
  let unlockedIds = new Set();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: unlocks } = await supabase
      .from('user_unlocked_topics')
      .select('topic_id')
      .eq('user_id', user.id);
    unlockedIds = new Set((unlocks || []).map(u => u.topic_id));
  }

  // Gắn trạng thái lock thực tế vào từng topic
  currentTopics = (topics || []).map(t => ({
    ...t,
    _isLocked: t.is_locked === true && !unlockedIds.has(t.id)
  }));

  renderTopics();
}

async function loadWords(topicId) {
  wordContainer.innerHTML = '<div class="loader"><i class="fas fa-circle-notch fa-spin"></i> Đang tải từ vựng...</div>';

  const { data, error } = await supabase
    .from('vocabulary_words')
    .select('*')
    .eq('topic_id', topicId)
    .order('order_index', { ascending: true });

  if (error) {
    console.error(error);
    wordContainer.innerHTML = '<div class="loader" style="color:#e05">Lỗi tải dữ liệu.</div>';
    return;
  }
  currentWords = data || [];
  renderWords();
}

// ──────────── Render & Events ────────────
function renderTopics() {
  if (currentTopics.length === 0) {
    topicContainer.innerHTML = '<div class="loader">Chưa có chủ đề nào.</div>';
    return;
  }

  let html = '';
  currentTopics.forEach((t, idx) => {
    const isLocked = t._isLocked === true;
    const lockCls = isLocked ? 'locked' : 'unlocked';
    const lockIcon = isLocked
      ? '<i class="fas fa-lock"></i>'
      : '<i class="fas fa-lock-open"></i>';

    html += `
      <div class="topic-row ${lockCls}" onclick="onTopicClick(${t.id}, '${t.title_vn}', '${t.title_kr}', ${isLocked})">
        <div class="topic-idx">${idx + 1}</div>
        <div class="topic-title">
           ${t.title_vn} <span style="font-size:0.75rem; color:var(--text-muted); font-weight:700">-</span>
           <span class="topic-kr-hint">${t.title_kr}</span>
        </div>
        <div class="topic-lock">${lockIcon}</div>
      </div>
    `;
  });

  topicContainer.innerHTML = html;
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

  // Xác định topic cần unlock
  // topic_ids = null → mở tất cả topic đang bị lock
  let topicIds = coupon.topic_ids;
  if (!topicIds || topicIds.length === 0) {
    // Lấy tất cả id của topic đang bị lock
    const { data: lockedTopics } = await supabase
      .from('vocabulary_topics')
      .select('id')
      .eq('is_locked', true);
    topicIds = (lockedTopics || []).map(t => t.id);
  }

  if (topicIds.length === 0) {
    showToast('Không có chủ đề nào cần mở khóa!', 'info');
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
  showToast(`🎉 Mở khóa thành công ${topicIds.length} chủ đề!`, 'success');

  // Reload topics ngay, không cần delay
  await loadTopics();
};

window.onTopicClick = (id, vn, kr, isLocked) => {
  if (isLocked) {
    showToast('🔒 Chủ đề này đang bị khóa! Nhập coupon để mở khóa.', 'info');
    // Scroll lên coupon bar để người dùng thấy
    document.querySelector('.coupon-bar')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  navTitle.innerHTML = `${vn} <span style="color:#aeacd0;margin:0 4px">-</span> ${kr}`;
  setView(true);
  loadWords(id);
};

function renderWords() {
  updateProgress();

  if (currentWords.length === 0) {
    wordContainer.innerHTML = '<div class="loader">Chưa có từ vựng nào trong chủ đề này.</div>';
    return;
  }

  let html = '';
  currentWords.forEach((w, idx) => {
    html += `
      <div class="word-row">
        <div class="word-idx">${idx + 1}</div>
        
        <div class="word-vn-block">
            <div class="w-vn-txt">${w.word_vn}</div>
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
             />
        </div>
      </div>
    `;
  });

  wordContainer.innerHTML = html;
}

function updateProgress() {
  const correct = document.querySelectorAll(".word-kr-input.success");
  navProgress.innerHTML = `${correct.length} / ${currentWords.length}`;
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
    await loadTopics();

    // Lắng nghe sự kiện đồng bộ từ auth.js (SSO)
    window.addEventListener('auth-changed', (e) => {
      console.log("DEBUG VOCAB: Auth Changed Event Received:", e.detail);
      const { user, profile } = e.detail;
      if (user) {
        loadUserStats(profile);
      } else {
        loadUserStats(null);
      }
    });

    // Nếu profile đã được load sẵn trong window bởi auth.js (ưu tiên tối ưu)
    if (window.currentUserProfile) {
      console.log("DEBUG VOCAB: Profile already ready in window, syncing...");
      loadUserStats(window.currentUserProfile);
    } else {
      console.log("DEBUG VOCAB: Waiting for auth-changed event to sync stats...");
    }

    console.log("DEBUG VOCAB: App started successfully.");
  } catch (err) {
    console.error("DEBUG VOCAB: CRITICAL ERROR DURING START:", err);
    if (topicContainer) {
      topicContainer.innerHTML = `<div class="loader" style="color:#e05">
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