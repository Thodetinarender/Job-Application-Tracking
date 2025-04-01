const API_BASE_URL = '/api/v1';

async function apiRequest(endpoint, method = 'GET', body = null, token = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Something went wrong');
    }

    return response.json();
}

// Handle registration
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    try {
        await apiRequest('/users/register', 'POST', { name, email, password });
        alert('Registration successful! Please login.');
    } catch (err) {
        alert(err.message);
    }
});

// Handle login
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const { token } = await apiRequest('/users/login', 'POST', { email, password });
        localStorage.setItem('token', token);
        alert('Login successful!');
        showDashboard();
    } catch (err) {
        alert(err.message);
    }
});

// Show dashboard
async function showDashboard() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const { stats } = await apiRequest('/dashboard', 'GET', null, token);
        document.getElementById('dashboard-stats').innerText = `
            Total Applications: ${stats.totalApplications}
            Applied: ${stats.applied}
            Interviewed: ${stats.interviewed}
            Offered: ${stats.offered}
            Rejected: ${stats.rejected}
        `;
        document.getElementById('dashboard').style.display = 'block';
    } catch (err) {
        alert(err.message);
    }
}

// Handle logout
document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('token');
    alert('Logged out successfully!');
    document.getElementById('dashboard').style.display = 'none';
});
