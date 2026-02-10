// Load schedule page
async function loadSchedulePage() {
    const pageContent = document.getElementById('pageContent');
    
    pageContent.innerHTML = `
        <div class="table-container">
            <div class="table-header">
                <h2>📅 Jadwal Sholat Hari Ini</h2>
                <button class="btn-add" id="editScheduleBtn">✏️ Edit Jadwal</button>
            </div>
            
            <div id="scheduleDisplay">
                <p style="text-align: center; padding: 40px; color: #718096;">
                    Loading...
                </p>
            </div>
        </div>
    `;
    
    // Load current schedule
    await loadCurrentSchedule();
    
    // Setup edit button
    document.getElementById('editScheduleBtn').addEventListener('click', showScheduleModal);
}

// Load current schedule
async function loadCurrentSchedule() {
    try {
        const response = await apiRequest('/public/schedule');
        
        if (response.success && response.data) {
            const schedule = response.data;
            displaySchedule(schedule);
        } else {
            document.getElementById('scheduleDisplay').innerHTML = `
                <p style="text-align: center; padding: 40px; color: #dc3545;">
                    Jadwal sholat belum tersedia
                </p>
            `;
        }
    } catch (error) {
        console.error('Error loading schedule:', error);
        document.getElementById('scheduleDisplay').innerHTML = `
            <p style="text-align: center; padding: 40px; color: #dc3545;">
                Gagal memuat jadwal sholat
            </p>
        `;
    }
}

// Display schedule
function displaySchedule(schedule) {
    const displayDiv = document.getElementById('scheduleDisplay');
    
    displayDiv.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Tanggal</th>
                    <th>Lokasi</th>
                    <th>Subuh</th>
                    <th>Dzuhur</th>
                    <th>Ashar</th>
                    <th>Maghrib</th>
                    <th>Isya</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${formatDate(schedule.date)}</td>
                    <td>${schedule.location || 'Jakarta, Indonesia'}</td>
                    <td><strong>${formatTime(schedule.subuh)}</strong></td>
                    <td><strong>${formatTime(schedule.dzuhur)}</strong></td>
                    <td><strong>${formatTime(schedule.ashar)}</strong></td>
                    <td><strong>${formatTime(schedule.maghrib)}</strong></td>
                    <td><strong>${formatTime(schedule.isya)}</strong></td>
                </tr>
            </tbody>
        </table>
    `;
}

// Show schedule modal
function showScheduleModal() {
    const modalHTML = `
        <div class="modal" id="scheduleModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>✏️ Edit Jadwal Sholat</h3>
                    <button class="modal-close" id="closeScheduleModal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="scheduleForm">
                        <div class="form-row">
                            <label>Tanggal</label>
                            <input type="date" id="scheduleDate" required>
                        </div>
                        <div class="form-row">
                            <label>Lokasi</label>
                            <input type="text" id="scheduleLocation" value="Jakarta, Indonesia" required>
                        </div>
                        <div class="form-row">
                            <label>Subuh</label>
                            <input type="time" id="scheduleSubuh" required>
                        </div>
                        <div class="form-row">
                            <label>Dzuhur</label>
                            <input type="time" id="scheduleDzuhur" required>
                        </div>
                        <div class="form-row">
                            <label>Ashar</label>
                            <input type="time" id="scheduleAshar" required>
                        </div>
                        <div class="form-row">
                            <label>Maghrib</label>
                            <input type="time" id="scheduleMaghrib" required>
                        </div>
                        <div class="form-row">
                            <label>Isya</label>
                            <input type="time" id="scheduleIsya" required>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn-cancel" id="cancelScheduleModal">Batal</button>
                    <button class="btn-primary" id="saveScheduleBtn">Simpan</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('scheduleDate').value = today;
    
    // Setup modal events
    setupScheduleModalEvents();
    
    // Show modal
    document.getElementById('scheduleModal').classList.add('active');
}

// Setup schedule modal events
function setupScheduleModalEvents() {
    const modal = document.getElementById('scheduleModal');
    
    // Close modal
    document.getElementById('closeScheduleModal').addEventListener('click', () => {
        modal.remove();
    });
    
    document.getElementById('cancelScheduleModal').addEventListener('click', () => {
        modal.remove();
    });
    
    // Save schedule
    document.getElementById('saveScheduleBtn').addEventListener('click', async () => {
        const formData = {
            date: document.getElementById('scheduleDate').value,
            location: document.getElementById('scheduleLocation').value,
            subuh: document.getElementById('scheduleSubuh').value,
            dzuhur: document.getElementById('scheduleDzuhur').value,
            ashar: document.getElementById('scheduleAshar').value,
            maghrib: document.getElementById('scheduleMaghrib').value,
            isya: document.getElementById('scheduleIsya').value
        };
        
        try {
            const response = await apiRequest('/admin/schedule', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            
            if (response.success) {
                alert('✅ Jadwal sholat berhasil diperbarui!');
                modal.remove();
                loadCurrentSchedule();
            } else {
                alert('❌ Gagal memperbarui jadwal: ' + response.message);
            }
        } catch (error) {
            console.error('Error saving schedule:', error);
            alert('❌ Terjadi kesalahan saat menyimpan jadwal');
        }
    });
}