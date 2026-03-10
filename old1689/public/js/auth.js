const SUPABASE_URL = 'https://lcxqvdefqwxwcxkitifu.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjeHF2ZGVmcXd4d2N4a2l0aWZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNzI1MDMsImV4cCI6MjA3NDY0ODUwM30.10ubRSwnY5ruMslmemv6yMGpMzYSiyqJ8PvF06c1XFk'

const { createClient } = supabase
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Login handling - update to check for data before redirect
async function handleEmailLogin(username, password) {
    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: `${username}@example.com`,    // Sử dụng domain hợp lệ
            password: password,
        })
        if (error) throw error
        if (data.user) {
            await updateUIForLoggedInUser(data.user);
            window.location.href = './index.html';
        }
    } catch (error) {
        alert('Tài khoản không tồn tại!')
    }
}

// Register handling
async function handleEmailSignup(fullName, username, password) {
    try {
        const { data, error } = await supabaseClient.auth.signUp({
            email: `${username}@example.com`,    // Sử dụng domain hợp lệ
            password: password,
            options: {
                data: {
                    full_name: fullName,
                    username: username,
                    display_name: username       // Thêm display_name để hiển thị
                }
            }
        })
        if (error) throw error
        alert('Đăng ký thành công!')
        // Thay đổi cách redirect
        location.replace('./login.html')
    } catch (error) {
        alert('Lỗi đăng ký: ' + error.message)
    }
}

// Password reset handling - simplified
async function handlePasswordReset(email) {
    try {
        const { error } = await supabaseClient.auth.resetPasswordForEmail(email);
        if (error) throw error;
        alert('Link khôi phục mật khẩu đã được gửi đến email của bạn!');
    } catch (error) {
        alert('Lỗi gửi yêu cầu: ' + error.message);
    }
}

// Cập nhật hàm xử lý UI khi đã đăng nhập
function updateUIForLoggedInUser(user) {
    console.log('Updating UI for user:', user);
    
    const authButtons = document.getElementById('authButtons');
    const userInfo = document.getElementById('userInfo');
    const userName = document.getElementById('userName');
    const userAvatar = document.getElementById('userAvatar');

    if (authButtons) {
        authButtons.style.display = 'none';
    }
    
    if (userInfo) {
        userInfo.classList.remove('hidden');
        userInfo.style.display = 'flex';
        
        if (userName) {
            const displayName = user.user_metadata?.username 
                || user.user_metadata?.display_name 
                || user.user_metadata?.full_name 
                || user.email?.split('@')[0]
                || 'User';
            
            userName.textContent = displayName;
        }
        
        if (userAvatar) {
            userAvatar.src = `image/default-avatar.png`;
        }
    }
}

// Cập nhật hàm xử lý UI khi đã đăng xuất
function updateUIForLoggedOutUser() {
    const authButtons = document.getElementById('authButtons');
    const userInfo = document.getElementById('userInfo');

    if (authButtons) authButtons.style.display = 'flex';
    if (userInfo) userInfo.style.display = 'none';
    console.log('UI updated for logged out user');
}

// Form handling
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('#loginForm')
    const registerForm = document.querySelector('#registerForm')

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault()
            const username = loginForm.querySelector('input[name="username"]').value
            const password = loginForm.querySelector('input[type="password"]').value
            await handleEmailLogin(username, password)
        })
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault()
            const fullName = registerForm.querySelector('input[name="fullname"]').value
            const username = registerForm.querySelector('input[name="username"]').value
            const password = registerForm.querySelector('input[type="password"]').value
            const confirmPassword = registerForm.querySelectorAll('input[type="password"]')[1].value

            if (password !== confirmPassword) {
                alert('Mật khẩu xác nhận không khớp!')
                return
            }

            await handleEmailSignup(fullName, username, password)
        })
    }

    const resetPasswordForm = document.querySelector('#resetPasswordForm')
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault()
            const email = resetPasswordForm.querySelector('input[type="email"]').value
            await handlePasswordReset(email)
        })
    }

    // Thêm logout handler mới
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await supabaseClient.auth.signOut();
                window.location.href = './login.html';
            } catch (error) {
                console.error('Logout error:', error);
            }
        });
    }

    // Kiểm tra session ngay khi trang load
    checkSession();
})

// Listen for auth state changes
supabaseClient.auth.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event, session);
    if (session) {
        updateUIForLoggedInUser(session.user);
    } else {
        updateUIForLoggedOutUser();
    }
});

// Change password
function contact_Admin() {
    alert('Liên hệ zalo: 0934537548')
}



// Remove old checkSession function and replace with this one
async function checkSession() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    const currentPage = window.location.pathname;

    if (session) {
        // Nếu đã đăng nhập
        updateUIForLoggedInUser(session.user);
        
        // Nếu đang ở trang login/register thì chuyển về index
        if (currentPage.includes('login.html') || currentPage.includes('register.html')) {
            window.location.href = './index.html';
        }
    } else {
        // Nếu chưa đăng nhập
        updateUIForLoggedOutUser();
        
        // Nếu ở trang index thì chuyển về login
        if (currentPage.includes('index.html') || currentPage === '/public/') {
            window.location.href = './login.html';
        }
    }
}

// Single auth state change handler
supabaseClient.auth.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event);
    checkSession(); // Sử dụng checkSession để xử lý mọi thay đổi trạng thái
});

// Cảnh báo ánh sáng
function canhbaoanhsang() {
    alert('Cảnh báo thay đổi độ sáng!')
}