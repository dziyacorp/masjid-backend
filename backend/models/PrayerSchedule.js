const pool = require('../config/database');

class PrayerSchedule {
  static async getCurrentSchedule() {
    try {
      const result = await pool.query(
        'SELECT * FROM prayer_schedules ORDER BY date DESC LIMIT 1'
      );
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async updateSchedule(data) {
    try {
      const { date, subuh, dzuhur, ashar, maghrib, isya, location } = data;
      
      const existingResult = await pool.query(
        'SELECT id FROM prayer_schedules WHERE date = $1',
        [date]
      );

      if (existingResult.rows.length > 0) {
        // Update existing
        await pool.query(
          `UPDATE prayer_schedules 
           SET subuh = $1, dzuhur = $2, ashar = $3, maghrib = $4, isya = $5, location = $6
           WHERE date = $7`,
          [subuh, dzuhur, ashar, maghrib, isya, location, date]
        );
      } else {
        // Insert new
        await pool.query(
          `INSERT INTO prayer_schedules (date, subuh, dzuhur, ashar, maghrib, isya, location) 
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [date, subuh, dzuhur, ashar, maghrib, isya, location]
        );
      }

      return await this.getCurrentSchedule();
    } catch (error) {
      throw error;
    }
  }

  static async getScheduleByDate(startDate, endDate) {
    try {
      const result = await pool.query(
        'SELECT * FROM prayer_schedules WHERE date BETWEEN $1 AND $2 ORDER BY date ASC',
        [startDate, endDate]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = PrayerSchedule;
