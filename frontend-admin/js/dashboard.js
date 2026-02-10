// Load dashboard page
function loadDashboardPage() {
    const pageTitle = document.getElementById('pageTitle');
    const pageContent = document.getElementById('pageContent');
    const userName = document.getElementById('userName');
    
    // Set page title
    pageTitle.textContent = 'Dashboard';
    
    // Set user name
    const user = getUserInfo();
    if (user) {
        userName.textContent = user.name;
    }
    
    // Load dashboard content
    pageContent.innerHTML = `
        <div class="dashboard-grid">
            <div class="card">
                <div class="card-header">
                    <div>
                        <div class="card-title">Jadwal Sholat</div>
                        <div class="card-value" id="scheduleCount">Loading...</div>
                    </div>
                    <div class="card-icon schedule">🕌</div>
                </div>
                <div class="card-footer">Terakhir diperbarui hari ini</div>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <div>
                        <div class="card-title">Informasi</div>
                        <div class="card-value" id="infoCount">Loading...</div>
                    </div>
                    <div class="card-icon info">ℹ️</div>
                </div>
                <div class="card-footer">Total informasi aktif</div>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <div>
                        <div class="card-title">Transaksi Keuangan</div>
                        <div class="card-value" id="financeCount">Loading...</div>
                    </div>
                    <div class="card-icon finance">💰</div>
                </div>
                <div class="card-footer">Bulan ini</div>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <div>
                        <div class="card-title">Berita</div>
                        <div class="card-value" id="newsCount">Loading...</div>
                    </div>
                    <div class="card-icon news">📰</div>
                </div>
                <div class="card-footer">Artikel terbaru</div>
            </div>
        </div>
        
        <div class="table-container">
            <div class="table-header">
                <h2>📊 Ringkasan Keuangan Bulan Ini</h2>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Kategori</th>
                        <th>Jumlah</th>
                        <th>Persentase</th>
                    </tr>
                </thead>
                <tbody id="financeSummary">
                    <tr>
                        <td colspan="3" style="text-align: center;">Loading...</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
    
    // Load dashboard statistics
    loadDashboardStats();
    
    // Load finance summary
    loadFinanceSummary();
}

// Load dashboard statistics
async function loadDashboardStats() {
    try {
        // Get schedule count
        const schedule = await apiRequest('/public/schedule');
        if (schedule.success && schedule.data) {
            document.getElementById('scheduleCount').textContent = '1';
        }
        
        // Get information count
        const info = await apiRequest('/public/information');
        if (info.success) {
            document.getElementById('infoCount').textContent = info.data.length;
        }
        
        // Get finance count (current month)
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const finances = await apiRequest(`/admin/finance?year=${year}&month=${month}`);
        if (finances.success) {
            document.getElementById('financeCount').textContent = finances.data.length;
        }
        
        // Get news count
        const news = await apiRequest('/public/news?limit=100');
        if (news.success) {
            document.getElementById('newsCount').textContent = news.data.length;
        }
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

// Load finance summary
async function loadFinanceSummary() {
    try {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        
        const summary = await apiRequest(`/admin/finance/summary/monthly?year=${year}&month=${month}`);
        
        if (summary.success) {
            const { income, expense, balance } = summary.data;
            const total = income + expense;
            const tbody = document.getElementById('financeSummary');
            
            tbody.innerHTML = `
                <tr>
                    <td><strong>Pemasukan</strong></td>
                    <td><strong style="color: #28a745;">${formatCurrency(income)}</strong></td>
                    <td>${total > 0 ? Math.round((income / total) * 100) : 0}%</td>
                </tr>
                <tr>
                    <td><strong>Pengeluaran</strong></td>
                    <td><strong style="color: #dc3545;">${formatCurrency(expense)}</strong></td>
                    <td>${total > 0 ? Math.round((expense / total) * 100) : 0}%</td>
                </tr>
                <tr style="background: #f0f8ff;">
                    <td><strong><em>Saldo</em></strong></td>
                    <td><strong style="color: #667eea;">${formatCurrency(balance)}</strong></td>
                    <td>100%</td>
                </tr>
            `;
        }
    } catch (error) {
        console.error('Error loading finance summary:', error);
        document.getElementById('financeSummary').innerHTML = `
            <tr>
                <td colspan="3" style="text-align: center; color: #dc3545;">
                    Gagal memuat data keuangan
                </td>
            </tr>
        `;
    }
}

// Setup menu navigation
document.addEventListener('DOMContentLoaded', function() {
    const menuItems = document.querySelectorAll('.menu-item[data-page]');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            menuItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Load corresponding page
            const page = this.getAttribute('data-page');
            loadPage(page);
        });
    });
});

// Load page based on menu selection
function loadPage(page) {
    const pageTitle = document.getElementById('pageTitle');
    const pageContent = document.getElementById('pageContent');
    
    switch(page) {
        case 'dashboard':
            loadDashboardPage();
            break;
        case 'schedule':
            pageTitle.textContent = 'Jadwal Sholat';
            loadSchedulePage();
            break;
        case 'information':
            pageTitle.textContent = 'Informasi Masjid';
            loadInformationPage();
            break;
        case 'finance':
            pageTitle.textContent = 'Laporan Keuangan';
            loadFinancePage();
            break;
        case 'news':
            pageTitle.textContent = 'Berita & Pengumuman';
            loadNewsPage();
            break;
        case 'users':
            pageTitle.textContent = 'Manajemen User';
            loadUsersPage();
            break;
    }
}