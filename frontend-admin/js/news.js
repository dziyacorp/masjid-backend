// Load news page
async function loadNewsPage() {
    const pageContent = document.getElementById('pageContent');
    
    pageContent.innerHTML = `
        <div class="table-container">
            <div class="table-header">
                <h2>📰 Berita & Pengumuman</h2>
                <button class="btn-add" id="addNewsBtn">➕ Tambah Berita</button>
            </div>
            
            <div id="newsTable">
                <p style="text-align: center; padding: 40px; color: #718096;">
                    Loading...
                </p>
            </div>
        </div>
    `;
    
    // Load all news
    await loadNewsData();
    
    // Setup add button
    document.getElementById('addNewsBtn').addEventListener('click', showAddNewsModal);
}

// Load news data
async function loadNewsData() {
    try {
        const response = await apiRequest('/admin/news?limit=100');
        
        if (response.success) {
            displayNewsTable(response.data);
        } else {
            document.getElementById('newsTable').innerHTML = `
                <p style="text-align: center; padding: 40px; color: #dc3545;">
                    Gagal memuat berita
                </p>
            `;
        }
    } catch (error) {
        console.error('Error loading news:', error);
        document.getElementById('newsTable').innerHTML = `
            <p style="text-align: center; padding: 40px; color: #dc3545;">
                Terjadi kesalahan saat memuat berita
            </p>
        `;
    }
}

// Display news table
function displayNewsTable(data) {
    if (data.length === 0) {
        document.getElementById('newsTable').innerHTML = `
            <p style="text-align: center; padding: 40px; color: #718096;">
                Belum ada berita
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
                    <th>Tanggal</th>
                    <th>Gambar</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    data.forEach(news => {
        html += `
            <tr>
                <td>${news.id}</td>
                <td><strong>${news.title}</strong><br><small style="color: #718096;">${news.content.substring(0, 50)}...</small></td>
                <td>${formatDate(news.created_at)}</td>
                <td>${news.image_url ? '✅' : '❌'}</td>
                <td>
                    <button class="action-btn btn-edit" onclick="showEditNewsModal(${news.id})">
                        Edit
                    </button>
                    <button class="action-btn btn-delete" onclick="deleteNews(${news.id})">
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
    
    document.getElementById('newsTable').innerHTML = html;
}

// Show add/edit news modal
function showAddNewsModal(newsId = null) {
    const modalHTML = `
        <div class="modal" id="newsModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${newsId ? '✏️ Edit Berita' : '➕ Tambah Berita'}</h3>
                    <button class="modal-close" id="closeNewsModal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="newsForm">
                        <div class="form-row">
                            <label>Judul Berita</label>
                            <input type="text" id="newsTitle" required placeholder="Judul berita">
                        </div>
                        <div class="form-row">
                            <label>Isi Berita</label>
                            <textarea id="newsContent" required placeholder="Konten berita..."></textarea>
                        </div>
                        <div class="form-row">
                            <label>URL Gambar (opsional)</label>
                            <input type="url" id="newsImageUrl" placeholder="https://example.com/image.jpg">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn-cancel" id="cancelNewsModal">Batal</button>
                    <button class="btn-primary" id="saveNewsBtn">${newsId ? 'Update' : 'Simpan'}</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // If editing, load existing data
    if (newsId) {
        loadNewsForEdit(newsId);
    }
    
    // Setup modal events
    setupNewsModalEvents(newsId);
    
    // Show modal
    document.getElementById('newsModal').classList.add('active');
}

// Load news for edit
async function loadNewsForEdit(id) {
    try {
        const response = await apiRequest('/admin/news?limit=100');
        if (response.success) {
            const news = response.data.find(n => n.id == id);
            if (news) {
                document.getElementById('newsTitle').value = news.title;
                document.getElementById('newsContent').value = news.content;
                document.getElementById('newsImageUrl').value = news.image_url || '';
            }
        }
    } catch (error) {
        console.error('Error loading news for edit:', error);
    }
}

// Setup news modal events
function setupNewsModalEvents(newsId = null) {
    const modal = document.getElementById('newsModal');
    
    // Close modal
    document.getElementById('closeNewsModal').addEventListener('click', () => {
        modal.remove();
    });
    
    document.getElementById('cancelNewsModal').addEventListener('click', () => {
        modal.remove();
    });
    
    // Save news
    document.getElementById('saveNewsBtn').addEventListener('click', async () => {
        const formData = {
            title: document.getElementById('newsTitle').value,
            content: document.getElementById('newsContent').value,
            image_url: document.getElementById('newsImageUrl').value || null
        };
        
        try {
            let response;
            if (newsId) {
                // Update existing
                response = await apiRequest(`/admin/news/${newsId}`, {
                    method: 'PUT',
                    body: JSON.stringify(formData)
                });
            } else {
                // Create new
                response = await apiRequest('/admin/news', {
                    method: 'POST',
                    body: JSON.stringify(formData)
                });
            }
            
            if (response.success) {
                alert(newsId ? '✅ Berita berhasil diperbarui!' : '✅ Berita berhasil ditambahkan!');
                modal.remove();
                loadNewsData();
            } else {
                alert('❌ Gagal menyimpan berita: ' + response.message);
            }
        } catch (error) {
            console.error('Error saving news:', error);
            alert('❌ Terjadi kesalahan saat menyimpan berita');
        }
    });
}

// Delete news
async function deleteNews(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
        return;
    }
    
    try {
        const response = await apiRequest(`/admin/news/${id}`, {
            method: 'DELETE'
        });
        
        if (response.success) {
            alert('✅ Berita berhasil dihapus!');
            loadNewsData();
        } else {
            alert('❌ Gagal menghapus berita: ' + response.message);
        }
    } catch (error) {
        console.error('Error deleting news:', error);
        alert('❌ Terjadi kesalahan saat menghapus berita');
    }
}

// Make functions globally accessible
window.showEditNewsModal = showAddNewsModal;
window.deleteNews = deleteNews;