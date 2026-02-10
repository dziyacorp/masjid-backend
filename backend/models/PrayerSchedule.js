const pool = require('../config/database');

class PrayerSchedule {
  // Get current prayer schedule
  static async getCurrentSchedule() {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM prayer_schedules ORDER BY date DESC LIMIT 1'
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Update prayer schedule
  static async updateSchedule(data) {
    try {
      const { date, subuh, dzuhur, ashar, maghrib, isya, location } = data;
      
      const [existing] = await pool.execute(
        'SELECT id FROM prayer_schedules WHERE date = ?',
        [date]
      );

      if (existing.length > 0) {
        // Update existing
        await pool.execute(
          `UPDATE prayer_schedules 
           SET subuh = ?, dzuhur = ?, ashar = ?, maghrib = ?, isya = ?, location = ?
           WHERE date = ?`,
          [subuh, dzuhur, ashar, maghrib, isya, location, date]
        );
      } else {
        // Insert new
        await pool.execute(
          `INSERT INTO prayer_schedules (date, subuh, dzuhur, ashar, maghrib, isya, location) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [date, subuh, dzuhur, ashar, maghrib, isya, location]
        );
      }

      return await this.getCurrentSchedule();
    } catch (error) {
      throw error;
    }
  }

  // Get schedule by date range
  static async getScheduleByDate(startDate, endDate) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM prayer_schedules WHERE date BETWEEN ? AND ? ORDER BY date ASC',
        [startDate, endDate]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = PrayerSchedule;