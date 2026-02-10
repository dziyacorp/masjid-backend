document.addEventListener('DOMContentLoaded', function() {
    // Load all data
    loadSchedule();
    loadInformation();
    loadFinanceSummary();
    loadNews();
    
    // Setup tab switching for information
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            loadInformation(category !== 'all' ? category : null);
        });
    });
});

// Load prayer schedule
async function loadSchedule() {
    try {
        const response = await apiRequest('/public/schedule');
        
        if (response.success && response.data) {
            const schedule = response.data;
            displaySchedule(schedule);
        } else {
            document.getElementById('scheduleContainer').innerHTML = `
                <div class="error-placeholder">
                    <div class="error-icon">⚠️</div>
                    <p>Jadwal sholat belum tersedia</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading schedule:', error);
        document.getElementById('scheduleContainer').innerHTML = `
            <div class="error-placeholder">
                <div class="error-icon">❌</div>
                <p>Gagal memuat jadwal sholat</p>
            </div>
        `;
    }
}

// Display schedule
function displaySchedule(schedule) {
    const container = document.getElementById('scheduleContainer');
    
    container.innerHTML = `
        <div class="prayer-item">
            <div class="prayer-name">Subuh</div>
            <div class="prayer-time">${formatTime(schedule.subuh)}</div>
        </div>
        <div class="prayer-item">
            <div class="prayer-name">Dzuhur</div>
            <div class="prayer-time">${formatTime(schedule.dzuhur)}</div>
        </div>
        <div class="prayer-item">
            <div class="prayer-name">Ashar</div>
            <div class="prayer-time">${formatTime(schedule.ashar)}</div>
        </div>
        <div class="prayer-item">
            <div class="prayer-name">Maghrib</div>
            <div class="prayer-time">${formatTime(schedule.maghrib)}</div>
        </div>
        <div class="prayer-item">
            <div class="prayer-name">Isya</div>
            <div class="prayer-time">${formatTime(schedule.isya)}</div>
        </div>
    `;
}

// Load information
async function loadInformation(category = null) {
    try {
        let endpoint = '/public/information';
        if (category) {
            endpoint += `?category=${category}`;
        }
        
        const response = await apiRequest(endpoint);
        
        if (response.success) {
            displayInformation(response.data);
        } else {
            document.getElementById('infoContainer').innerHTML = `
                <div class="error-placeholder">
                    <div class="error-icon">❌</div>
                    <p>Gagal memuat informasi</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading information:', error);
        document.getElementById('infoContainer').innerHTML = `
            <div class="error-placeholder">
                <div class="error-icon">❌</div>
                <p>Terjadi kesalahan saat memuat informasi</p>
            </div>
        `;
    }
}

// Display information
function displayInformation(data) {
    if (data.length === 0) {
        document.getElementById('infoContainer').innerHTML = `
            <div class="empty-placeholder">
                <div class="empty-icon">ℹ️</div>
                <p>Belum ada informasi</p>
            </div>
        `;
        return;
    }
    
    let html = '<div class="info-grid">';
    
    data.forEach(info => {
        html += `
            <div class="info-card">
                <h3>${info.title}</h3>
                <p>${info.content}</p>
            </div>
        `;
    });
    
    html += '</div>';
    
    document.getElementById('infoContainer').innerHTML = html;
}

// Load finance summary
async function loadFinanceSummary() {
    try {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        
        const response = await apiRequest(`/public/finance/summary?year=${year}&month=${month}`);
        
        if (response.success) {
            displayFinanceSummary(response.data);
        } else {
            document.getElementById('financeSummary').innerHTML = `
                <div class="error-placeholder">
                    <div class="error-icon">❌</div>
                    <p>Gagal memuat laporan keuangan</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading finance summary:', error);
        document.getElementById('financeSummary').innerHTML = `
            <div class="error-placeholder">
                <div class="error-icon">❌</div>
                <p>Terjadi kesalahan saat memuat laporan keuangan</p>
            </div>
        `;
    }
}

// Display finance summary
function displayFinanceSummary(data) {
    const { income, expense, balance } = data;
    
    document.getElementById('financeSummary').innerHTML = `
        <div class="finance-card income">
            <div class="finance-label">Total Pemasukan</div>
            <div class="finance-amount">${formatCurrency(income)}</div>
        </div>
        <div class="finance-card expense">
            <div class="finance-label">Total Pengeluaran</div>
            <div class="finance-amount">${formatCurrency(expense)}</div>
        </div>
        <div class="finance-card balance">
            <div class="finance-label">Saldo</div>
            <div class="finance-amount">${formatCurrency(balance)}</div>
        </div>
    `;
}

// Load news
async function loadNews() {
    try {
        const response = await apiRequest('/public/news?limit=6');
        
        if (response.success) {
            displayNews(response.data);
        } else {
            document.getElementById('newsContainer').innerHTML = `
                <div class="error-placeholder">
                    <div class="error-icon">❌</div>
                    <p>Gagal memuat berita</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading news:', error);
        document.getElementById('newsContainer').innerHTML = `
            <div class="error-placeholder">
                <div class="error-icon">❌</div>
                <p>Terjadi kesalahan saat memuat berita</p>
            </div>
        `;
    }
}

// Display news
function displayNews(data) {
    if (data.length === 0) {
        document.getElementById('newsContainer').innerHTML = `
            <div class="empty-placeholder">
                <div class="empty-icon">📰</div>
                <p>Belum ada berita</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    
    data.forEach(news => {
        html += `
            <div class="news-card">
                <div class="news-header">
                    <div class="news-date">${formatDate(news.created_at)}</div>
                    <div class="news-title">${news.title}</div>
                </div>
                <div class="news-content">
                    <p class="news-excerpt">${news.content.substring(0, 150)}...</p>
                    <a href="#" class="read-more">Baca Selengkapnya →</a>
                </div>
            </div>
        `;
    });
    
    document.getElementById('newsContainer').innerHTML = html;
}