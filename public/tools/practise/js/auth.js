// ===== auth.js =====
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://ktqdzlhvdkerjajffgfi.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0cWR6bGh2ZGtlcmphamZmZ2ZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2OTgxNTMsImV4cCI6MjA4MzI3NDE1M30.6xz0SVuj6x72VcLZyJpVtNMMWSmyOEtGhmKiVMu46xI";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: true, detectSessionInUrl: true, autoRefreshToken: true }
});

let currentUser = null;
let currentProfile = null;

function $(id) { return document.getElementById(id); }

export function showToast(msg, type = 'info') {
  const t = document.createElement('div');
  t.className = `practise-toast practise-toast--${type}`;
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('practise-toast--show'));
  setTimeout(() => { t.classList.remove('practise-toast--show'); setTimeout(() => t.remove(), 400); }, 3200);
}

function setError(id, msg) { const el = $(id); if (el) el.textContent = msg; }
function clearErrors(formId) { document.querySelectorAll(`#${formId} .p-error`).forEach(e => e.textContent = ''); }

export function updateAuthUI() {
  const hasUser = !!currentUser;
  const hasProfile = !!currentProfile;

  $('hdr-btn-login')?.classList.toggle('hidden', hasUser);
  $('hdr-user-block')?.classList.toggle('hidden', !hasUser);
  $('lb-login-prompt')?.classList.toggle('hidden', hasUser);

  if (!hasUser) return;

  const nameEl = $('hdr-display-name');
  if (nameEl) nameEl.textContent = hasProfile ? currentProfile.display_name : currentUser.email.split('@')[0];

  const avatarEl = $('hdr-avatar');
  if (avatarEl) {
    const initial = hasProfile ? (currentProfile.display_name || '?')[0].toUpperCase() : currentUser.email[0].toUpperCase();
    const avatarUrl = hasProfile ? currentProfile.avatar?.trim() : '';
    avatarEl.innerHTML = avatarUrl
      ? `<img src="${avatarUrl}" alt="avatar" onerror="this.outerHTML='<span>${initial}</span>'" />`
      : `<span>${initial}</span>`;
  }

  if (hasProfile) {
    const lb = currentProfile.leaderboard_stats || { diamonds: 0, xp: 0 };
    const dEl = $('stat-diamonds'); const xEl = $('stat-xp');
    if (dEl) dEl.textContent = lb.diamonds ?? 0;
    if (xEl) xEl.textContent = lb.xp ?? 0;
  }
}

let profileLoadingPromise = null;

async function loadProfile(userId) {
  if (profileLoadingPromise) return profileLoadingPromise;
  profileLoadingPromise = (async () => {
    try {
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single();
      const { data: lb } = await supabase.from('leaderboard').select('*').eq('user_id', userId).maybeSingle();
      currentProfile = profile ? { ...profile, leaderboard_stats: lb } : null;
      window.currentUserProfile = currentProfile;
      updateAuthUI();
      window.dispatchEvent(new CustomEvent('auth-changed', { detail: { user: currentUser, profile: currentProfile } }));
    } catch (err) {
      console.error("AUTH: loadProfile error:", err);
    } finally {
      profileLoadingPromise = null;
    }
  })();
  return profileLoadingPromise;
}

// ── Khởi động: đợi DOM xong rồi mới setup auth ──
async function initAuth() {
  // Bước 1: Kiểm tra session trực tiếp từ localStorage (không qua listener)
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) {
    currentUser = session.user;
    window.currentUser = currentUser;
    await loadProfile(currentUser.id);
  }

  // Bước 2: Đăng ký listener để bắt các sự kiện tiếp theo (login/logout)
  supabase.auth.onAuthStateChange(async (event, session) => {
    console.log("AUTH:", event, session?.user?.email ?? 'no user');
    if (event === 'SIGNED_IN' && session?.user) {
      // Chỉ xử lý nếu là user mới (tránh duplicate với getSession ở trên)
      if (currentUser?.id !== session.user.id) {
        currentUser = session.user;
        window.currentUser = currentUser;
        await loadProfile(currentUser.id);
      }
    } else if (event === 'SIGNED_OUT') {
      currentUser = null; currentProfile = null;
      window.currentUser = null; window.currentUserProfile = null;
      updateAuthUI();
      window.dispatchEvent(new CustomEvent('auth-changed', { detail: { user: null, profile: null } }));
    } else if (event === 'TOKEN_REFRESHED' && session?.user) {
      currentUser = session.user;
      window.currentUser = currentUser;
    }
  });
}

// Đợi DOM ready mới chạy
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAuth);
} else {
  initAuth();
}

export async function checkAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user && !currentUser) {
    currentUser = session.user; window.currentUser = currentUser;
    await loadProfile(currentUser.id);
  } else { updateAuthUI(); }
}

// ── Modals ──
function openModal(id) { $(id)?.classList.add('active'); }
function closeModal(id) { $(id)?.classList.remove('active'); }

window.openLoginModal = () => { closeModal('reg-modal'); openModal('login-modal'); };
window.openRegModal = () => { closeModal('login-modal'); openModal('reg-modal'); };
window.closeLoginModal = () => closeModal('login-modal');
window.closeRegModal = () => closeModal('reg-modal');
window.openProfileModal = () => {
  if (!currentProfile) return;
  $('profile-name').textContent = currentProfile.display_name || '';
  $('profile-email').textContent = currentUser?.email || '';
  $('profile-phone').textContent = currentProfile.phone || '—';
  $('profile-role').textContent = currentProfile.role || 'Member';
  $('profile-streak').textContent = (currentProfile['Streak'] || 0) + ' ngày';
  openModal('profile-modal');
};
window.closeProfileModal = () => closeModal('profile-modal');

['login-modal', 'reg-modal', 'profile-modal'].forEach(id => {
  $(id)?.addEventListener('click', e => { if (e.target.id === id) closeModal(id); });
});

// ── Login/Register: dùng DOMContentLoaded để chắc chắn form đã có ──
document.addEventListener('DOMContentLoaded', () => {
  $('login-form')?.addEventListener('submit', async e => {
    e.preventDefault(); clearErrors('login-form');
    const email = $('login-email').value.trim(), password = $('login-password').value;
    const btn = $('login-submit-btn');
    btn.disabled = true; btn.textContent = 'Đang đăng nhập…';
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    btn.disabled = false; btn.textContent = 'Đăng nhập';
    if (error) { setError('login-error', error.message.includes('Invalid login credentials') ? 'Email hoặc mật khẩu không đúng!' : 'Lỗi: ' + error.message); return; }
    closeModal('login-modal'); $('login-form').reset();
    // Reload profile sau khi đăng nhập vì onAuthStateChange có thể không fire do đã có session
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) { currentUser = session.user; window.currentUser = currentUser; await loadProfile(currentUser.id); }
    showToast('Chào mừng trở lại! 👋', 'success');
  });

  $('reg-form')?.addEventListener('submit', async e => {
    e.preventDefault(); clearErrors('reg-form');
    const displayName = $('reg-name').value.trim(), email = $('reg-email').value.trim();
    const phone = $('reg-phone').value.trim(), password = $('reg-password').value, confirm = $('reg-confirm').value;
    let ok = true;
    if (displayName.length < 3) { setError('reg-name-error', 'Tên tối thiểu 3 ký tự'); ok = false; }
    if (!/^0\d{9}$/.test(phone)) { setError('reg-phone-error', 'Số điện thoại không hợp lệ'); ok = false; }
    if (password.length < 6) { setError('reg-pw-error', 'Mật khẩu tối thiểu 6 ký tự'); ok = false; }
    if (password !== confirm) { setError('reg-cpw-error', 'Mật khẩu không khớp'); ok = false; }
    if (!ok) return;
    const { data: dup } = await supabase.from('profiles').select('display_name').eq('display_name', displayName).maybeSingle();
    if (dup) { setError('reg-name-error', 'Tên đã tồn tại'); return; }
    const btn = $('reg-submit-btn');
    btn.disabled = true; btn.textContent = 'Đang đăng ký…';
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password, options: { data: { display_name: displayName, phone }, emailRedirectTo: window.location.origin } });
    btn.disabled = false; btn.textContent = 'Đăng ký';
    if (authError) { setError('reg-email-error', authError.message.includes('already registered') ? 'Email đã được đăng ký!' : 'Lỗi: ' + authError.message); return; }
    await new Promise(r => setTimeout(r, 500));
    const uid = authData.user?.id;
    if (uid) {
      const { data: ex } = await supabase.from('profiles').select('id').eq('id', uid).maybeSingle();
      if (!ex) {
        await supabase.from('profiles').insert([{ id: uid, display_name: displayName, email, phone, role: 'Member' }]);
        await supabase.from('leaderboard').insert([{ user_id: uid, diamonds: 0, topik_score: 0, xp: 0 }]);
      }
    }
    closeModal('reg-modal'); $('reg-form').reset();
    showToast('Đăng ký thành công! 🎉', 'success');
  });
});

// ── Logout ──
window.handleLogout = async () => {
  if (!confirm('Bạn có chắc muốn đăng xuất?')) return;
  await supabase.auth.signOut();
  showToast('Đã đăng xuất!', 'info');
};