// Load information page
async function loadInformationPage() {
    const pageContent = document.getElementById('pageContent');
    
    pageContent.innerHTML = `
        <div class="table-container">
            <div class="table-header">
                <h2>ℹ️ Informasi Masjid</h2>
                <button class="btn-add" id="addInfoBtn">➕ Tambah Informasi</button>
            </div>
            
            <div class="tabs">
                <button class="tab-btn active" data-tab="all">Semua</button>
                <button class="tab-btn" data-tab="profile">Profil</button>
                <button class="tab-btn" data-tab="kegiatan">Kegiatan</button>
                <button class="tab-btn" data-tab="kontak">Kontak</button>
            </div>
            
            <div id="informationTable">
                <p style="text-align: center; padding: 40px; color: #718096;">
                    Loading...
                </p>
            </div>
        </div>
    `;
    
    // Load all information
    await loadInformationData();
    
    // Setup tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.getAttribute('data-tab');
            loadInformationData(category !== 'all' ? category : null);
        });
    });
    
    // Setup add button
    document.getElementById('addInfoBtn').addEventListener('click', showAddInfoModal);
}

// Load information data
async function loadInformationData(category = null) {
    try {
        let endpoint = '/admin/information';
        if (category) {
            endpoint += `?category=${category}`;
        }
        
        const response = await apiRequest(endpoint);
        
        if (response.success) {
            displayInformationTable(response.data);
        } else {
            document.getElementById('informationTable').innerHTML = `
                <p style="text-align: center; padding: 40px; color: #dc3545;">
                    Gagal memuat informasi
                </p>
            `;
        }
    } catch (error) {
        console.error('Error loading information:', error);
        document.getElementById('informationTable').innerHTML = `
            <p style="text-align: center; padding: 40px; color: #dc3545;">
                Terjadi kesalahan saat memuat informasi
            </p>
        `;
    }
}

// Display information table
function displayInformationTable(data) {
    if (data.length === 0) {
        document.getElementById('informationTable').innerHTML = `
            <p style="text-align: center; padding: 40px; color: #718096;">
                Belum ada informasi
            </p>
        `;
        return;
    }
    
    let html = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Judul</th>
                    <th>Kategori</th>
                    <th>Tanggal</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    data.forEach(info => {
        html += `
            <tr>
                <td>${info.id}</td>
                <td><strong>${info.title}</strong></td>
                <td>
                    <span style="background: ${
                        info.category === 'profile' ? '#667eea' : 
                        info.category === 'kegiatan' ? '#4facfe' : 
                        info.category === 'kontak' ? '#f5576c' : '#43e97b'
                    }; color: white; padding: 4px 10px; border-radius: 15px; font-size: 12px;">
                        ${info.category}
                    </span>
                </td>
                <td>${formatDate(info.created_at)}</td>
                <td>
                    <button class="action-btn btn-edit" onclick="showEditInfoModal(${info.id})">
                        Edit
                    </button>
                    <button class="action-btn btn-delete" onclick="deleteInformation(${info.id})">
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
    
    document.getElementById('informationTable').innerHTML = html;
}

// Show add/edit info modal
function showAddInfoModal(infoId = null) {
    const modalHTML = `
        <div class="modal" id="infoModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${infoId ? '✏️ Edit Informasi' : '➕ Tambah Informasi'}</h3>
                    <button class="modal-close" id="closeInfoModal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="infoForm">
                        <div class="form-row">
                            <label>Judul</label>
                            <input type="text" id="infoTitle" required placeholder="Judul informasi">
                        </div>
                        <div class="form-row">
                            <label>Kategori</label>
                            <select id="infoCategory" required>
                                <option value="general">General</option>
                                <option value="profile">Profil</option>
                                <option value="kegiatan">Kegiatan</option>
                                <option value="kontak">Kontak</option>
                            </select>
                        </div>
                        <div class="form-row">
                            <label>Isi Konten</label>
                            <textarea id="infoContent" required placeholder="Konten informasi..."></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn-cancel" id="cancelInfoModal">Batal</button>
                    <button class="btn-primary" id="saveInfoBtn">${infoId ? 'Update' : 'Simpan'}</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // If editing, load existing data
    if (infoId) {
        loadInfoForEdit(infoId);
    }
    
    // Setup modal events
    setupInfoModalEvents(infoId);
    
    // Show modal
    document.getElementById('infoModal').classList.add('active');
}

// Load info for edit
async function loadInfoForEdit(id) {
    try {
        const response = await apiRequest(`/admin/information`);
        if (response.success) {
            const info = response.data.find(i => i.id == id);
            if (info) {
                document.getElementById('infoTitle').value = info.title;
                document.getElementById('infoCategory').value = info.category;
                document.getElementById('infoContent').value = info.content;
            }
        }
    } catch (error) {
        console.error('Error loading info for edit:', error);
    }
}

// Setup info modal events
function setupInfoModalEvents(infoId = null) {
    const modal = document.getElementById('infoModal');
    
    // Close modal
    document.getElementById('closeInfoModal').addEventListener('click', () => {
        modal.remove();
    });
    
    document.getElementById('cancelInfoModal').addEventListener('click', () => {
        modal.remove();
    });
    
    // Save info
    document.getElementById('saveInfoBtn').addEventListener('click', async () => {
        const formData = {
            title: document.getElementById('infoTitle').value,
            content: document.getElementById('infoContent').value,
            category: document.getElementById('infoCategory').value
        };
        
        try {
            let response;
            if (infoId) {
                // Update existing
                response = await apiRequest(`/admin/information/${infoId}`, {
                    method: 'PUT',
                    body: JSON.stringify(formData)
                });
            } else {
                // Create new
                response = await apiRequest('/admin/information', {
                    method: 'POST',
                    body: JSON.stringify(formData)
                });
            }
            
            if (response.success) {
                alert(infoId ? '✅ Informasi berhasil diperbarui!' : '✅ Informasi berhasil ditambahkan!');
                modal.remove();
                loadInformationData();
            } else {
                alert('❌ Gagal menyimpan informasi: ' + response.message);
            }
        } catch (error) {
            console.error('Error saving information:', error);
            alert('❌ Terjadi kesalahan saat menyimpan informasi');
        }
    });
}

// Delete information
async function deleteInformation(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus informasi ini?')) {
        return;
    }
    
    try {
        const response = await apiRequest(`/admin/information/${id}`, {
            method: 'DELETE'
        });
        
        if (response.success) {
            alert('✅ Informasi berhasil dihapus!');
            loadInformationData();
        } else {
            alert('❌ Gagal menghapus informasi: ' + response.message);
        }
    } catch (error) {
        console.error('Error deleting information:', error);
        alert('❌ Terjadi kesalahan saat menghapus informasi');
    }
}

// Make function globally accessible
window.showEditInfoModal = showAddInfoModal;
window.deleteInformation = deleteInformation;