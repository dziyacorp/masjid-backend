document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');
    
    // Check if user is already logged in
    checkAuthStatus();

    // Handle login form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            // Show loading state
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<span class="loading-spinner"></span> Loading...';
            submitBtn.disabled = true;
            loginMessage.textContent = '';

            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;

            if (response.ok && data.success) {
                // Save token and user info
                setToken(data.data.token);
                setUserInfo(data.data.user);
                
                // Show success message
                loginMessage.textContent = 'Login berhasil! Mengarahkan...';
                loginMessage.className = 'message success';
                
                // Redirect to dashboard
                setTimeout(() => {
                    showDashboard();
                }, 1000);
            } else {
                loginMessage.textContent = data.message || 'Login gagal';
                loginMessage.className = 'message error';
            }
        } catch (error) {
            console.error('Login error:', error);
            // Reset button
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Login';
            submitBtn.disabled = false;
            loginMessage.textContent = 'Terjadi kesalahan. Silakan coba lagi.';
            loginMessage.className = 'message error';
        }
    });
});

// Check authentication status
function checkAuthStatus() {
    const token = getToken();
    if (token) {
        showDashboard();
    }
}

// Show dashboard
function showDashboard() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('dashboardSection').style.display = 'flex';
    
    // Load dashboard data
    loadDashboardPage();
    
    // Set user info in header
    const user = getUserInfo();
    if (user) {
        document.getElementById('userName').textContent = user.name;
    }
}

// Logout function
function logout() {
    removeToken();
    clearUserInfo();
    document.getElementById('loginSection').style.display = 'flex';
    document.getElementById('dashboardSection').style.display = 'none';
    location.reload();
}

// Attach logout to button
document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
});