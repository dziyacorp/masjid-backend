const express = require('express');
const router = express.Router();
const PrayerSchedule = require('../models/PrayerSchedule');
const Information = require('../models/Information');
const Finance = require('../models/Finance');
const News = require('../models/News');

// ========== PUBLIC PRAYER SCHEDULE ==========
router.get('/schedule', async (req, res) => {
  try {
    const schedule = await PrayerSchedule.getCurrentSchedule();
    res.json({ success: true, data: schedule });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ========== PUBLIC INFORMATION ==========
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

// ========== PUBLIC FINANCE SUMMARY ==========
router.get('/finance/summary', async (req, res) => {
  try {
    const { year, month } = req.query;
    const summary = await Finance.getMonthlySummary(year, month);
    res.json({ success: true, data: summary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ========== PUBLIC NEWS ==========
router.get('/news', async (req, res) => {
  try {
    const limit = req.query.limit || 10;
    const news = await News.getAllNews(limit);
    res.json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single news
router.get('/news/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const news = await News.getNewsById(id);
    
    if (news) {
      res.json({ success: true, data: news });
    } else {
      res.status(404).json({ success: false, message: 'Berita tidak ditemukan' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;