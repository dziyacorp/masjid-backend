// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Helper function to get token from localStorage
function getToken() {
    return localStorage.getItem('auth_token');
}

// Helper function to set token
function setToken(token) {
    localStorage.setItem('auth_token', token);
}

// Helper function to remove token
function removeToken() {
    localStorage.removeItem('auth_token');
}

// Helper function to get user info
function getUserInfo() {
    const user = localStorage.getItem('user_info');
    return user ? JSON.parse(user) : null;
}

// Helper function to set user info
function setUserInfo(user) {
    localStorage.setItem('user_info', JSON.stringify(user));
}

// Helper function to clear user info
function clearUserInfo() {
    localStorage.removeItem('user_info');
}

// API Request helper
async function apiRequest(endpoint, options = {}) {
    const token = getToken();
    
    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        }
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Format time
function formatTime(timeString) {
    if (!timeString) return '-';
    return timeString.substring(0, 5);
}