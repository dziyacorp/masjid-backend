// Load finance page
async function loadFinancePage() {
    const pageContent = document.getElementById('pageContent');
    
    pageContent.innerHTML = `
        <div class="table-container">
            <div class="table-header">
                <h2>💰 Laporan Keuangan</h2>
                <button class="btn-add" id="addFinanceBtn">➕ Tambah Transaksi</button>
            </div>
            
            <div class="tabs">
                <button class="tab-btn active" data-tab="all">Semua</button>
                <button class="tab-btn" data-tab="income">Pemasukan</button>
                <button class="tab-btn" data-tab="expense">Pengeluaran</button>
                <button class="tab-btn" data-tab="summary">Ringkasan</button>
            </div>
            
            <div id="financeContent">
                <p style="text-align: center; padding: 40px; color: #718096;">
                    Loading...
                </p>
            </div>
        </div>
    `;
    
    // Load all finances
    await loadFinanceData();
    
    // Setup tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const tab = this.getAttribute('data-tab');
            switch(tab) {
                case 'all':
                    loadFinanceData();
                    break;
                case 'income':
                    loadFinanceData('income');
                    break;
                case 'expense':
                    loadFinanceData('expense');
                    break;
                case 'summary':
                    loadFinanceSummaryTab();
                    break;
            }
        });
    });
    
    // Setup add button
    document.getElementById('addFinanceBtn').addEventListener('click', showAddFinanceModal);
}

// Load finance data
async function loadFinanceData(type = null) {
    try {
        let endpoint = '/admin/finance';
        if (type) {
            endpoint += `?type=${type}`;
        }
        
        const response = await apiRequest(endpoint);
        
        if (response.success) {
            displayFinanceTable(response.data, type);
        } else {
            document.getElementById('financeContent').innerHTML = `
                <p style="text-align: center; padding: 40px; color: #dc3545;">
                    Gagal memuat data keuangan
                </p>
            `;
        }
    } catch (error) {
        console.error('Error loading finance:', error);
        document.getElementById('financeContent').innerHTML = `
            <p style="text-align: center; padding: 40px; color: #dc3545;">
                Terjadi kesalahan saat memuat data keuangan
            </p>
        `;
    }
}

// Display finance table
function displayFinanceTable(data, type = null) {
    if (data.length === 0) {
        document.getElementById('financeContent').innerHTML = `
            <p style="text-align: center; padding: 40px; color: #718096;">
                Belum ada data keuangan
            </p>
        `;
        return;
    }
    
    // Calculate totals
    const totals = data.reduce((acc, item) => {
        if (item.type === 'income') {
            acc.income += parseFloat(item.amount);
        } else {
            acc.expense += parseFloat(item.amount);
        }
        return acc;
    }, { income: 0, expense: 0 });
    
    let html = `
        <div style="margin-bottom: 20px; padding: 15px; background: #f7fafc; border-radius: 8px;">
            <strong>Total Pemasukan:</strong> <span style="color: #28a745; font-weight: 600;">${formatCurrency(totals.income)}</span><br>
            <strong>Total Pengeluaran:</strong> <span style="color: #dc3545; font-weight: 600;">${formatCurrency(totals.expense)}</span><br>
            <strong>Saldo:</strong> <span style="color: #667eea; font-weight: 700;">${formatCurrency(totals.income - totals.expense)}</span>
        </div>
        
        <table>
            <thead>
                <tr>
                    <th>Tanggal</th>
                    <th>Tipe</th>
                    <th>Sumber</th>
                    <th>Deskripsi</th>
                    <th>Jumlah</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    data.forEach(finance => {
        const isIncome = finance.type === 'income';
        html += `
            <tr>
                <td>${formatDate(finance.date)}</td>
                <td>
                    <span style="background: ${isIncome ? '#d4edda' : '#f8d7da'}; 
                                color: ${isIncome ? '#155724' : '#721c24'}; 
                                padding: 4px 10px; border-radius: 15px; font-size: 12px;">
                        ${isIncome ? 'Pemasukan' : 'Pengeluaran'}
                    </span>
                </td>
                <td><strong>${finance.source}</strong></td>
                <td>${finance.description || '-'}</td>
                <td>
                    <span style="color: ${isIncome ? '#28a745' : '#dc3545'}; font-weight: 600;">
                        ${formatCurrency(finance.amount)}
                    </span>
                </td>
                <td>
                    <button class="action-btn btn-edit" onclick="showEditFinanceModal(${finance.id})">
                        Edit
                    </button>
                    <button class="action-btn btn-delete" onclick="deleteFinance(${finance.id})">
                        Hapus
                    </button>
                </td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
    `;
    
    document.getElementById('financeContent').innerHTML = html;
}

// Load finance summary tab
async function loadFinanceSummaryTab() {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    document.getElementById('financeContent').innerHTML = `
        <div>
            <div style="margin-bottom: 20px;">
                <label><strong>Pilih Tahun:</strong></label>
                <select id="yearSelect" style="padding: 8px; margin-left: 10px;">
                    ${Array.from({length: 5}, (_, i) => currentYear - i)
                        .map(year => `<option value="${year}" ${year === currentYear ? 'selected' : ''}>${year}</option>`)
                        .join('')}
                </select>
            </div>
            
            <div id="yearlySummary">
                <p style="text-align: center; padding: 40px; color: #718096;">
                    Loading ringkasan tahunan...
                </p>
            </div>
        </div>
    `;
    
    // Load yearly summary
    loadYearlySummary(currentYear);
    
    // Setup year change
    document.getElementById('yearSelect').addEventListener('change', function() {
        loadYearlySummary(this.value);
    });
}

// Load yearly summary
async function loadYearlySummary(year) {
    try {
        const response = await apiRequest(`/admin/finance/summary/yearly?year=${year}`);
        
        if (response.success) {
            displayYearlySummary(response.data, year);
        } else {
            document.getElementById('yearlySummary').innerHTML = `
                <p style="text-align: center; padding: 40px; color: #dc3545;">
                    Gagal memuat ringkasan
                </p>
            `;
        }
    } catch (error) {
        console.error('Error loading yearly summary:', error);
        document.getElementById('yearlySummary').innerHTML = `
            <p style="text-align: center; padding: 40px; color: #dc3545;">
                Terjadi kesalahan
            </p>
        `;
    }
}

// Display yearly summary
function displayYearlySummary(data, year) {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    
    let html = `
        <table>
            <thead>
                <tr>
                    <th>Bulan</th>
                    <th>Pemasukan</th>
                    <th>Pengeluaran</th>
                    <th>Saldo</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    let grandTotal = { income: 0, expense: 0 };
    
    // Create array for all 12 months
    const monthsData = Array(12).fill(null).map((_, i) => {
        const monthData = data.find(d => d.month === i + 1);
        return {
            month: i + 1,
            income: monthData?.income || 0,
            expense: monthData?.expense || 0
        };
    });
    
    monthsData.forEach(item => {
        const balance = item.income - item.expense;
        grandTotal.income += item.income;
        grandTotal.expense += item.expense;
        
        html += `
            <tr>
                <td><strong>${monthNames[item.month - 1]}</strong></td>
                <td style="color: #28a745; font-weight: 600;">${formatCurrency(item.income)}</td>
                <td style="color: #dc3545; font-weight: 600;">${formatCurrency(item.expense)}</td>
                <td style="color: ${balance >= 0 ? '#28a745' : '#dc3545'}; font-weight: 600;">
                    ${formatCurrency(balance)}
                </td>
            </tr>
        `;
    });
    
    // Grand total
    const grandBalance = grandTotal.income - grandTotal.expense;
    html += `
        <tr style="background: #667eea; color: white; font-weight: 700;">
            <td><strong>TOTAL ${year}</strong></td>
            <td>${formatCurrency(grandTotal.income)}</td>
            <td>${formatCurrency(grandTotal.expense)}</td>
            <td>${formatCurrency(grandBalance)}</td>
        </tr>
    `;
    
    html += `
            </tbody>
        </table>
    `;
    
    document.getElementById('yearlySummary').innerHTML = html;
}

// Show add/edit finance modal
function showAddFinanceModal(financeId = null) {
    const modalHTML = `
        <div class="modal" id="financeModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${financeId ? '✏️ Edit Transaksi' : '➕ Tambah Transaksi'}</h3>
                    <button class="modal-close" id="closeFinanceModal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="financeForm">
                        <div class="form-row">
                            <label>Tanggal</label>
                            <input type="date" id="financeDate" required>
                        </div>
                        <div class="form-row">
                            <label>Tipe Transaksi</label>
                            <select id="financeType" required>
                                <option value="income">Pemasukan</option>
                                <option value="expense">Pengeluaran</option>
                            </select>
                        </div>
                        <div class="form-row">
                            <label>Jumlah (Rp)</label>
                            <input type="number" id="financeAmount" required min="0" placeholder="Contoh: 5000000">
                        </div>
                        <div class="form-row">
                            <label>Sumber/Destinasi</label>
                            <input type="text" id="financeSource" required placeholder="Contoh: Zakat, Listrik, dll">
                        </div>
                        <div class="form-row">
                            <label>Deskripsi</label>
                            <textarea id="financeDescription" placeholder="Keterangan tambahan..."></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn-cancel" id="cancelFinanceModal">Batal</button>
                    <button class="btn-primary" id="saveFinanceBtn">${financeId ? 'Update' : 'Simpan'}</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('financeDate').value = today;
    
    // If editing, load existing data
    if (financeId) {
        loadFinanceForEdit(financeId);
    }
    
    // Setup modal events
    setupFinanceModalEvents(financeId);
    
    // Show modal
    document.getElementById('financeModal').classList.add('active');
}

// Load finance for edit
async function loadFinanceForEdit(id) {
    try {
        const response = await apiRequest('/admin/finance');
        if (response.success) {
            const finance = response.data.find(f => f.id == id);
            if (finance) {
                document.getElementById('financeDate').value = finance.date;
                document.getElementById('financeType').value = finance.type;
                document.getElementById('financeAmount').value = finance.amount;
                document.getElementById('financeSource').value = finance.source;
                document.getElementById('financeDescription').value = finance.description || '';
            }
        }
    } catch (error) {
        console.error('Error loading finance for edit:', error);
    }
}

// Setup finance modal events
function setupFinanceModalEvents(financeId = null) {
    const modal = document.getElementById('financeModal');
    
    // Close modal
    document.getElementById('closeFinanceModal').addEventListener('click', () => {
        modal.remove();
    });
    
    document.getElementById('cancelFinanceModal').addEventListener('click', () => {
        modal.remove();
    });
    
    // Save finance
    document.getElementById('saveFinanceBtn').addEventListener('click', async () => {
        const formData = {
            date: document.getElementById('financeDate').value,
            type: document.getElementById('financeType').value,
            amount: document.getElementById('financeAmount').value,
            source: document.getElementById('financeSource').value,
            description: document.getElementById('financeDescription').value
        };
        
        try {
            let response;
            if (financeId) {
                // Update existing
                response = await apiRequest(`/admin/finance/${financeId}`, {
                    method: 'PUT',
                    body: JSON.stringify(formData)
                });
            } else {
                // Create new
                response = await apiRequest('/admin/finance', {
                    method: 'POST',
                    body: JSON.stringify(formData)
                });
            }
            
            if (response.success) {
                alert(financeId ? '✅ Transaksi berhasil diperbarui!' : '✅ Transaksi berhasil ditambahkan!');
                modal.remove();
                loadFinanceData();
            } else {
                alert('❌ Gagal menyimpan transaksi: ' + response.message);
            }
        } catch (error) {
            console.error('Error saving finance:', error);
            alert('❌ Terjadi kesalahan saat menyimpan transaksi');
        }
    });
}

// Delete finance
async function deleteFinance(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
        return;
    }
    
    try {
        const response = await apiRequest(`/admin/finance/${id}`, {
            method: 'DELETE'
        });
        
        if (response.success) {
            alert('✅ Transaksi berhasil dihapus!');
            loadFinanceData();
        } else {
            alert('❌ Gagal menghapus transaksi: ' + response.message);
        }
    } catch (error) {
        console.error('Error deleting finance:', error);
        alert('❌ Terjadi kesalahan saat menghapus transaksi');
    }
}

// Make functions globally accessible
window.showEditFinanceModal = showAddFinanceModal;
window.deleteFinance = deleteFinance;