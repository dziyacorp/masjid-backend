// Load users page
async function loadUsersPage() {
    const pageContent = document.getElementById('pageContent');
    
    pageContent.innerHTML = `
        <div class="table-container">
            <div class="table-header">
                <h2>👥 Manajemen User</h2>
                <button class="btn-add" id="addUserBtn">➕ Tambah User</button>
            </div>
            
            <div id="usersTable">
                <p style="text-align: center; padding: 40px; color: #718096;">
                    Loading...
                </p>
            </div>
        </div>
    `;
    
    // Load all users
    await loadUsersData();
    
    // Setup add button
    document.getElementById('addUserBtn').addEventListener('click', showAddUserModal);
}

// Load users data
async function loadUsersData() {
    try {
        const response = await apiRequest('/admin/users');
        
        if (response.success) {
            displayUsersTable(response.data);
        } else {
            document.getElementById('usersTable').innerHTML = `
                <p style="text-align: center; padding: 40px; color: #dc3545;">
                    Gagal memuat data user
                </p>
            `;
        }
    } catch (error) {
        console.error('Error loading users:', error);
        document.getElementById('usersTable').innerHTML = `
            <p style="text-align: center; padding: 40px; color: #dc3545;">
                Terjadi kesalahan saat memuat data user
            </p>
        `;
    }
}

// Display users table
function displayUsersTable(data) {
    if (data.length === 0) {
        document.getElementById('usersTable').innerHTML = `
            <p style="text-align: center; padding: 40px; color: #718096;">
                Belum ada user
            </p>
        `;
        return;
    }
    
    let html = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Nama</th>
                    <th>Role</th>
                    <th>Tanggal Daftar</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    data.forEach(user => {
        html += `
            <tr>
                <td>${user.id}</td>
                <td><strong>${user.username}</strong></td>
                <td>${user.name}</td>
                <td>
                    <span style="background: ${user.role === 'admin' ? '#667eea' : '#4facfe'}; 
                                color: white; padding: 4px 10px; border-radius: 15px; font-size: 12px;">
                        ${user.role}
                    </span>
                </td>
                <td>${formatDate(user.created_at)}</td>
                <td>
                    <button class="action-btn btn-edit" onclick="showEditUserModal(${user.id})">
                        Edit
                    </button>
                    ${user.id !== 1 ? `<button class="action-btn btn-delete" onclick="deleteUser(${user.id})">
                        Hapus
                    </button>` : ''}
                </td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
    `;
    
    document.getElementById('usersTable').innerHTML = html;
}

// Show add/edit user modal
function showAddUserModal(userId = null) {
    const modalHTML = `
        <div class="modal" id="userModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${userId ? '✏️ Edit User' : '➕ Tambah User'}</h3>
                    <button class="modal-close" id="closeUserModal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="userForm">
                        ${!userId ? `
                        <div class="form-row">
                            <label>Username</label>
                            <input type="text" id="userUsername" required placeholder="Username">
                        </div>
                        <div class="form-row">
                            <label>Password</label>
                            <input type="password" id="userPassword" required placeholder="Password minimal 6 karakter">
                        </div>
                        ` : ''}
                        <div class="form-row">
                            <label>Nama Lengkap</label>
                            <input type="text" id="userName" required placeholder="Nama lengkap">
                        </div>
                        <div class="form-row">
                            <label>Role</label>
                            <select id="userRole" required>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                            </select>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn-cancel" id="cancelUserModal">Batal</button>
                    <button class="btn-primary" id="saveUserBtn">${userId ? 'Update' : 'Simpan'}</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // If editing, load existing data
    if (userId) {
        loadUserForEdit(userId);
    }
    
    // Setup modal events
    setupUserModalEvents(userId);
    
    // Show modal
    document.getElementById('userModal').classList.add('active');
}

// Load user for edit
async function loadUserForEdit(id) {
    try {
        const response = await apiRequest('/admin/users');
        if (response.success) {
            const user = response.data.find(u => u.id == id);
            if (user) {
                document.getElementById('userName').value = user.name;
                document.getElementById('userRole').value = user.role;
            }
        }
    } catch (error) {
        console.error('Error loading user for edit:', error);
    }
}

// Setup user modal events
function setupUserModalEvents(userId = null) {
    const modal = document.getElementById('userModal');
    
    // Close modal
    document.getElementById('closeUserModal').addEventListener('click', () => {
        modal.remove();
    });
    
    document.getElementById('cancelUserModal').addEventListener('click', () => {
        modal.remove();
    });
    
    // Save user
    document.getElementById('saveUserBtn').addEventListener('click', async () => {
        let formData;
        
        if (userId) {
            // Update existing
            formData = {
                name: document.getElementById('userName').value,
                role: document.getElementById('userRole').value
            };
        } else {
            // Create new
            formData = {
                username: document.getElementById('userUsername').value,
                password: document.getElementById('userPassword').value,
                name: document.getElementById('userName').value,
                role: document.getElementById('userRole').value
            };
            
            // Validate password
            if (formData.password.length < 6) {
                alert('Password minimal 6 karakter!');
                return;
            }
        }
        
        try {
            let response;
            if (userId) {
                // Update existing
                response = await apiRequest(`/admin/users/${userId}`, {
                    method: 'PUT',
                    body: JSON.stringify(formData)
                });
            } else {
                // Create new - use auth/register endpoint
                response = await apiRequest('/auth/register', {
                    method: 'POST',
                    body: JSON.stringify(formData)
                });
            }
            
            if (response.success) {
                alert(userId ? '✅ User berhasil diperbarui!' : '✅ User berhasil ditambahkan!');
                modal.remove();
                loadUsersData();
            } else {
                alert('❌ Gagal menyimpan user: ' + response.message);
            }
        } catch (error) {
            console.error('Error saving user:', error);
            alert('❌ Terjadi kesalahan: ' + error.message);
        }
    });
}

// Delete user
async function deleteUser(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus user ini?')) {
        return;
    }
    
    try {
        const response = await apiRequest(`/admin/users/${id}`, {
            method: 'DELETE'
        });
        
        if (response.success) {
            alert('✅ User berhasil dihapus!');
            loadUsersData();
        } else {
            alert('❌ Gagal menghapus user: ' + response.message);
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('❌ Terjadi kesalahan saat menghapus user');
    }
}

// Make functions globally accessible
window.showEditUserModal = showAddUserModal;
window.deleteUser = deleteUser;