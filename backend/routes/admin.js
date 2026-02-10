const express = require('express');
const router = express.Router();
const { verifyToken } = require('./auth');
const PrayerSchedule = require('../models/PrayerSchedule');
const Information = require('../models/Information');
const Finance = require('../models/Finance');
const News = require('../models/News');
const User = require('../models/User');

// All admin routes require authentication
router.use(verifyToken);

// ========== PRAYER SCHEDULE ROUTES ==========
// Get current schedule
router.get('/schedule', async (req, res) => {
  try {
    const schedule = await PrayerSchedule.getCurrentSchedule();
    res.json({ success: true, data: schedule });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update schedule
router.post('/schedule', async (req, res) => {
  try {
    const schedule = await PrayerSchedule.updateSchedule(req.body);
    res.json({ success: true, message: 'Jadwal sholat berhasil diperbarui', data: schedule });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ========== INFORMATION ROUTES ==========
// Get all information
router.get('/information', async (req, res) => {
  try {
    const category = req.query.category;
    let information;
    
    if (category) {
      information = await Information.getInformationByCategory(category);
    } else {
      information = await Information.getAllInformation();
    }
    
    res.json({ success: true, data: information });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create information
router.post('/information', async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const info = await Information.createInformation(title, content, category);
    res.status(201).json({ success: true, message: 'Informasi berhasil ditambahkan', data: info });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update information
router.put('/information/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category } = req.body;
    const updated = await Information.updateInformation(id, title, content, category);
    
    if (updated) {
      res.json({ success: true, message: 'Informasi berhasil diperbarui' });
    } else {
      res.status(404).json({ success: false, message: 'Informasi tidak ditemukan' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete information
router.delete('/information/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Information.deleteInformation(id);
    
    if (deleted) {
      res.json({ success: true, message: 'Informasi berhasil dihapus' });
    } else {
      res.status(404).json({ success: false, message: 'Informasi tidak ditemukan' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ========== FINANCE ROUTES ==========
// Get all finances
router.get('/finance', async (req, res) => {
  try {
    const type = req.query.type; // 'income' or 'expense'
    const finances = await Finance.getAllFinances(type);
    res.json({ success: true, data: finances });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create finance record
router.post('/finance', async (req, res) => {
  try {
    const finance = await Finance.createFinance(req.body);
    res.status(201).json({ success: true, message: 'Data keuangan berhasil ditambahkan', data: finance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update finance record
router.put('/finance/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Finance.updateFinance(id, req.body);
    
    if (updated) {
      res.json({ success: true, message: 'Data keuangan berhasil diperbarui' });
    } else {
      res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete finance record
router.delete('/finance/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Finance.deleteFinance(id);
    
    if (deleted) {
      res.json({ success: true, message: 'Data keuangan berhasil dihapus' });
    } else {
      res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get monthly summary
router.get('/finance/summary/monthly', async (req, res) => {
  try {
    const { year, month } = req.query;
    const summary = await Finance.getMonthlySummary(year, month);
    res.json({ success: true, data: summary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get yearly summary
router.get('/finance/summary/yearly', async (req, res) => {
  try {
    const { year } = req.query;
    const summary = await Finance.getYearlySummary(year);
    res.json({ success: true, data: summary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ========== NEWS ROUTES ==========
// Get all news
router.get('/news', async (req, res) => {
  try {
    const limit = req.query.limit || 10;
    const news = await News.getAllNews(limit);
    res.json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create news
router.post('/news', async (req, res) => {
  try {
    const { title, content, image_url } = req.body;
    const newNews = await News.createNews(title, content, image_url);
    res.status(201).json({ success: true, message: 'Berita berhasil ditambahkan', data: newNews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update news
router.put('/news/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, image_url } = req.body;
    const updated = await News.updateNews(id, title, content, image_url);
    
    if (updated) {
      res.json({ success: true, message: 'Berita berhasil diperbarui' });
    } else {
      res.status(404).json({ success: false, message: 'Berita tidak ditemukan' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete news
router.delete('/news/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await News.deleteNews(id);
    
    if (deleted) {
      res.json({ success: true, message: 'Berita berhasil dihapus' });
    } else {
      res.status(404).json({ success: false, message: 'Berita tidak ditemukan' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ========== USER MANAGEMENT ROUTES ==========
// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update user
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role } = req.body;
    const updated = await User.updateUser(id, name, role);
    
    if (updated) {
      res.json({ success: true, message: 'User berhasil diperbarui' });
    } else {
      res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.deleteUser(id);
    
    if (deleted) {
      res.json({ success: true, message: 'User berhasil dihapus' });
    } else {
      res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;