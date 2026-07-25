/**
 * Supabase Auth Override for MonkeyType Clone
 * Hooks into Monkeytype's ORIGINAL native login UI and routes auth to Supabase.
 */
(function () {
  'use strict';

  const sb = () => window.__supabase;

  // Track initialization state
  let _initialSessionHandled = false;
  let _authFullyReady = false;

  // Format Supabase user for Monkeytype
  function formatUser(user) {
    if (!user) return null;
    return {
      uid: user.id,
      email: user.email,
      emailVerified: true,
      username: user.user_metadata?.username || user.email?.split('@')[0],
      providerData: user.providerData || [
        { providerId: 'password' }
      ],
    };
  }

  // Synchronously read stored session from localStorage on script load
  function getStoredSupabaseUser() {
    try {
      const keys = Object.keys(localStorage);
      for (const k of keys) {
        if (k.startsWith('sb-') && k.endsWith('-auth-token')) {
          const raw = localStorage.getItem(k);
          if (raw) {
            const parsed = JSON.parse(raw);
            const user = parsed?.user || parsed?.currentSession?.user;
            if (user && user.id) {
              return formatUser(user);
            }
          }
        }
      }
    } catch (e) {
      console.error('[Supabase Auth] Error reading stored session:', e);
    }
    return null;
  }

  // Set initial stored user SYNCHRONOUSLY before app bundle runs
  const initialUser = getStoredSupabaseUser();
  window.__supabaseAuthSessionUser = initialUser;
  window.__getStoredSupabaseUser = getStoredSupabaseUser;
  // Remember if we had a stored user at boot time
  window.__supabaseHadStoredUser = !!initialUser;
  console.log('[Supabase Auth] Synchronous initial user:', initialUser?.email || 'None');

  // Update Monkeytype internal auth state
  async function syncMonkeytypeAuthState(user) {
    const formatted = formatUser(user);
    window.__supabaseAuthSessionUser = formatted;

    if (typeof window.__mt_setUid === 'function') {
      window.__mt_setUid(formatted);
    }
    if (typeof window.__mt_onAuthChanged === 'function') {
      await window.__mt_onAuthChanged(!!formatted, formatted);
    }
  }

  // Expose global auth helpers
  window.__supabaseAuth = {
    signUp: async (email, password, username) => {
      const { data, error } = await sb().auth.signUp({
        email,
        password,
        options: { data: { username } },
      });
      if (error) throw new Error(error.message);
      if (data?.user) {
        await syncMonkeytypeAuthState(data.user);
      }
      return data;
    },

    signIn: async (email, password) => {
      const { data, error } = await sb().auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);
      if (data?.user) {
        await syncMonkeytypeAuthState(data.user);
      }
      return data;
    },

    signOut: async () => {
      const { error } = await sb().auth.signOut();
      if (error) throw new Error(error.message);
      window.__supabaseAuthSessionUser = null;
      window.__supabaseHadStoredUser = false;
      await syncMonkeytypeAuthState(null);
      if (typeof window.__mt_pE === 'function') {
        window.__mt_pE('/login');
      } else {
        window.location.reload();
      }
    },

    getUser: async () => {
      const stored = getStoredSupabaseUser();
      if (stored) return stored;
      const { data: { user } } = await sb().auth.getUser();
      return user;
    },

    getSession: async () => {
      const { data: { session } } = await sb().auth.getSession();
      return session;
    },
  };

  // Listen for Supabase auth state changes
  sb().auth.onAuthStateChange(async (event, session) => {
    console.log('[Supabase Auth]', event, session?.user?.email);

    if (event === 'INITIAL_SESSION') {
      _initialSessionHandled = true;

      if (session?.user) {
        // Session restored successfully
        const formatted = formatUser(session.user);
        window.__supabaseAuthSessionUser = formatted;
        console.log('[Supabase Auth] INITIAL_SESSION restored user:', formatted.email);

        // Ensure profile exists
        try {
          const { data: existing } = await sb()
            .from('mt_profiles')
            .select('id')
            .eq('id', session.user.id)
            .maybeSingle();
          if (!existing) {
            await sb().from('mt_profiles').insert({
              id: session.user.id,
              username: session.user.user_metadata?.username || 'user_' + session.user.id.substring(0, 8),
              email: session.user.email,
            });
          }
        } catch (e) {
          console.warn('[Supabase Auth] Profile check error:', e);
        }

        // If Monkeytype callbacks are already registered, sync state
        if (_authFullyReady || typeof window.__mt_onAuthChanged === 'function') {
          await syncMonkeytypeAuthState(session.user);
        }
      } else if (window.__supabaseHadStoredUser) {
        // INITIAL_SESSION came back null but we had a stored user.
        // This means the token might be expired. Try to refresh.
        console.log('[Supabase Auth] INITIAL_SESSION null but had stored user, attempting refresh...');
        try {
          const { data: refreshData, error: refreshError } = await sb().auth.refreshSession();
          if (refreshData?.session?.user) {
            const formatted = formatUser(refreshData.session.user);
            window.__supabaseAuthSessionUser = formatted;
            console.log('[Supabase Auth] Token refresh succeeded:', formatted.email);
            if (_authFullyReady || typeof window.__mt_onAuthChanged === 'function') {
              await syncMonkeytypeAuthState(refreshData.session.user);
            }
          } else {
            // Refresh truly failed - token is completely invalid
            console.log('[Supabase Auth] Token refresh failed, user is logged out', refreshError?.message);
            window.__supabaseAuthSessionUser = null;
            window.__supabaseHadStoredUser = false;
          }
        } catch (e) {
          console.error('[Supabase Auth] Token refresh error:', e);
          // Keep the stored user as fallback - don't wipe it
          // The user will stay "logged in" based on localStorage data
        }
      } else {
        // No stored user and no session - genuinely not logged in
        window.__supabaseAuthSessionUser = null;
      }
      return; // Don't fall through for INITIAL_SESSION
    }

    // Handle non-initial events (SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED, etc.)
    if (session?.user) {
      const formatted = formatUser(session.user);
      window.__supabaseAuthSessionUser = formatted;

      // Ensure profile exists in mt_profiles
      try {
        const { data: existing } = await sb()
          .from('mt_profiles')
          .select('id')
          .eq('id', session.user.id)
          .maybeSingle();

        if (!existing) {
          await sb().from('mt_profiles').insert({
            id: session.user.id,
            username: session.user.user_metadata?.username || 'user_' + session.user.id.substring(0, 8),
            email: session.user.email,
          });
        }
      } catch (e) {
        console.warn('[Supabase Auth] Profile check error:', e);
      }

      // Sync with Monkeytype if callbacks are ready
      if (typeof window.__mt_onAuthChanged === 'function') {
        await syncMonkeytypeAuthState(session.user);
      }
    } else if (event === 'SIGNED_OUT') {
      // Only clear on explicit sign out, not on transient states
      window.__supabaseAuthSessionUser = null;
      window.__supabaseHadStoredUser = false;
      if (typeof window.__mt_onAuthChanged === 'function') {
        await syncMonkeytypeAuthState(null);
      }
    }
  });

  // Called by the main bundle after __mt_onAuthChanged is registered
  // to ensure Supabase session state is synced
  window.__supabaseAuthReady = async function () {
    _authFullyReady = true;
    // If INITIAL_SESSION already fired and we have a user, re-sync
    if (_initialSessionHandled && window.__supabaseAuthSessionUser) {
      console.log('[Supabase Auth] Re-syncing after bundle ready:', window.__supabaseAuthSessionUser.email);
      await syncMonkeytypeAuthState(window.__supabaseAuthSessionUser);
    }
  };

  // Enable all disabled inputs and buttons in native UI
  function unlockNativeAuthUI() {
    const pageLogin = document.getElementById('pageLogin');
    if (!pageLogin) return;

    // Enable inputs and buttons
    const disabledElements = pageLogin.querySelectorAll('[disabled]');
    disabledElements.forEach(el => {
      el.removeAttribute('disabled');
      el.disabled = false;
    });

    // Hide any "Authentication uninitialized" / warning notices
    const warnings = pageLogin.querySelectorAll('.text-error, .warning, [class*="uninitialized"]');
    warnings.forEach(w => {
      if (w.textContent.toLowerCase().includes('uninitialized') || w.textContent.toLowerCase().includes('failed')) {
        w.style.display = 'none';
      }
    });
  }

  // Intercept native form submissions inside #pageLogin
  function attachNativeFormInterceptors() {
    const pageLogin = document.getElementById('pageLogin');
    if (!pageLogin) return;

    const forms = pageLogin.querySelectorAll('form');
    forms.forEach(form => {
      if (form.dataset.sbHooked) return;
      form.dataset.sbHooked = 'true';

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const inputs = Array.from(form.querySelectorAll('input'));
        const emailInput = inputs.find(i => i.type === 'email' || i.name === 'email' || (i.placeholder && i.placeholder.toLowerCase().includes('email')));
        const passwordInput = inputs.find(i => i.type === 'password' || i.name === 'password' || (i.placeholder && i.placeholder.toLowerCase().includes('password')));
        const usernameInput = inputs.find(i => i.type === 'text' && (i.name === 'username' || (i.placeholder && i.placeholder.toLowerCase().includes('username'))));

        const isSignUp = !!usernameInput || form.innerText.toLowerCase().includes('register') || form.innerText.toLowerCase().includes('sign up');

        const submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('button');

        try {
          if (submitBtn) submitBtn.disabled = true;

          if (isSignUp) {
            if (!emailInput?.value || !passwordInput?.value || !usernameInput?.value) {
              alert('Vui lòng điền đầy đủ thông tin.');
              return;
            }
            await window.__supabaseAuth.signUp(emailInput.value, passwordInput.value, usernameInput.value);
          } else {
            if (!emailInput?.value || !passwordInput?.value) {
              alert('Vui lòng nhập Email và Mật khẩu.');
              return;
            }
            await window.__supabaseAuth.signIn(emailInput.value, passwordInput.value);
          }

          // Navigate to Account page upon successful auth
          if (typeof window.__mt_pE === 'function') {
            window.__mt_pE('/account');
          } else {
            window.location.href = '/account';
          }
        } catch (err) {
          alert('Lỗi: ' + (err.message || 'Đăng nhập/Đăng ký thất bại'));
        } finally {
          if (submitBtn) submitBtn.disabled = false;
        }
      }, true);
    });
  }

  // Continuously ensure native UI stays unlocked and hooked
  const observer = new MutationObserver(() => {
    unlockNativeAuthUI();
    attachNativeFormInterceptors();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.body, { childList: true, subtree: true });
      unlockNativeAuthUI();
      attachNativeFormInterceptors();
    });
  } else {
    observer.observe(document.body, { childList: true, subtree: true });
    unlockNativeAuthUI();
    attachNativeFormInterceptors();
  }

  console.log('[MonkeyType-Supabase] Native UI Auth hook active');
})();
