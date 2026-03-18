import { supabase } from './supabase-client.js';

// DOM Elements
const navRight = document.querySelector('.nav-right');
let currentUser = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});

// Check Authentication Status
async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
        currentUser = session.user;
        await loadUserProfile();
        updateAuthUI(true);
    } else {
        currentUser = null;
        updateAuthUI(false);
    }

    // Listen for auth state changes
    supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN') {
            currentUser = session.user;
            await loadUserProfile();
            updateAuthUI(true);
        } else if (event === 'SIGNED_OUT') {
            currentUser = null;
            updateAuthUI(false);
        }
    });
}

// Load User Profile from 'profiles' table
async function loadUserProfile() {
    if (!currentUser) return;

    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .single();

        if (data) {
            currentUser.profile = data;
        }
    } catch (e) {
        console.error('Error loading profile:', e);
    }
}

// Update UI based on auth state
function updateAuthUI(isLoggedIn) {
    // Remove existing auth buttons if any
    const existingAuthBtn = document.getElementById('authBtn');
    if (existingAuthBtn) existingAuthBtn.remove();
    
    const existingUserMenu = document.getElementById('userMenu');
    if (existingUserMenu) existingUserMenu.remove();

    if (isLoggedIn) {
        // Show User Menu
        const displayName = currentUser.profile?.display_name || currentUser.email.split('@')[0];
        const userMenu = document.createElement('div');
        userMenu.id = 'userMenu';
        userMenu.className = 'user-menu';
        userMenu.style.display = 'flex';
        userMenu.style.alignItems = 'center';
        userMenu.style.gap = '12px';
        userMenu.innerHTML = `
            <div class="user-info" style="text-align: right;">
                <div style="font-weight: 600; font-size: 0.9rem;">${displayName}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">${currentUser.profile?.role || 'Member'}</div>
            </div>
            <button id="logoutBtn" class="theme-toggle" title="Đăng xuất">
                <i class="fa-solid fa-right-from-bracket"></i>
            </button>
        `;
        
        // Insert before the theme toggle or stats
        // Finding where to insert: .nav-right contains theme-toggle and nav-stats
        // We want it to be the first item in nav-right seems appropriate or next to theme toggle
        // Let's prepend it to nav-right
        navRight.insertBefore(userMenu, navRight.firstChild);

        document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    } else {
        // Show Login Button
        const loginBtn = document.createElement('button');
        loginBtn.id = 'authBtn';
        loginBtn.className = 'theme-toggle'; // Reuse theme-toggle style for consistency
        loginBtn.style.width = 'auto'; // Auto width for text
        loginBtn.style.padding = '0 16px';
        loginBtn.style.gap = '8px';
        loginBtn.innerHTML = `<i class="fa-solid fa-user"></i> <span style="font-size: 0.9rem; font-weight: 600;">Đăng nhập</span>`;
        loginBtn.onclick = () => openModal('loginModal');
        
        navRight.insertBefore(loginBtn, navRight.firstChild);
    }
}

// Handle Login
window.handleLogin = async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorEl = document.getElementById('loginError');
    
    if(!email || !password) {
        showError(errorEl, 'Vui lòng nhập đầy đủ thông tin');
        return;
    }

    setLoading(true, 'loginSubmit');

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    setLoading(false, 'loginSubmit');

    if (error) {
        showError(errorEl, 'Đăng nhập thất bại: ' + (error.message === 'Invalid login credentials' ? 'Sai email hoặc mật khẩu' : error.message));
        return;
    }

    closeModal('loginModal');
    document.getElementById('loginForm').reset();
    showToast('Đăng nhập thành công', 'success');
}

// Handle Register
window.handleRegister = async (e) => {
    e.preventDefault();
    
    const displayName = document.getElementById('regDisplayName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    const errorEl = document.getElementById('regError');

    // Validation
    if (displayName.length < 3) return showError(errorEl, 'Tên hiển thị quá ngắn');
    if (password.length < 6) return showError(errorEl, 'Mật khẩu tối thiểu 6 ký tự');
    if (password !== confirmPassword) return showError(errorEl, 'Mật khẩu không khớp');

    setLoading(true, 'regSubmit');

    try {
        // Check existing user logic (simplified from ntdMusic)
        // Note: Real validation happens at DB level usually, but we can check profiles if RLS allows reading
        
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    display_name: displayName,
                    phone: phone
                }
            }
        });

        if (authError) throw authError;

        if (authData.user) {
            // Create Profile if not exists
             const { error: profileError } = await supabase
                .from('profiles')
                .insert([{
                  id: authData.user.id,
                  display_name: displayName,
                  email: email,
                  phone: phone,
                  role: 'Member'
                }]);
            
            if (profileError) console.error('Profile creation error', profileError);
        }

        closeModal('registerModal');
        document.getElementById('registerForm').reset();
        showToast('Đăng ký thành công! Đang đăng nhập...', 'success');

    } catch (error) {
        showError(errorEl, error.message);
    } finally {
        setLoading(false, 'regSubmit');
    }
}

// Handle Logout
async function handleLogout() {
    showConfirm('Bạn có chắc muốn đăng xuất?', async (confirmed) => {
        if (confirmed) {
            await supabase.auth.signOut();
            showToast('Đã đăng xuất', 'info');
        }
    });
}

// Helpers
function showError(el, msg) {
    el.textContent = msg;
    el.style.display = 'block';
    setTimeout(() => {
        el.style.display = 'none';
    }, 5000);
}

function setLoading(isLoading, btnId) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    
    if (isLoading) {
        btn.dataset.originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
        btn.disabled = true;
    } else {
        btn.innerHTML = btn.dataset.originalText;
        btn.disabled = false;
    }
}

function showToast(msg, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return; // Should exist now

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';

    toast.innerHTML = `
        <div class="toast-icon"><i class="fa-solid ${icon}"></i></div>
        <div class="toast-msg">${msg}</div>
    `;

    container.appendChild(toast);

    // Remove after 3s
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards';
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

// Global Confirm Dialog
let confirmCallback = null;
window.showConfirm = (msg, callback) => {
    document.getElementById('confirmMessage').textContent = msg;
    document.getElementById('confirmModal').classList.add('active');
    confirmCallback = callback;
}

window.closeConfirm = (status) => {
    document.getElementById('confirmModal').classList.remove('active');
    if (confirmCallback) confirmCallback(status);
    confirmCallback = null;
}

// --- Modal Logic (to be compatible with demo.html structure) ---
window.openModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
}

window.closeModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
}

window.switchToRegister = () => {
    closeModal('loginModal');
    openModal('registerModal');
}

window.switchToLogin = () => {
    closeModal('registerModal');
    openModal('loginModal');
}

// Close modals on clicks outside
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('active');
        }
    });
});
