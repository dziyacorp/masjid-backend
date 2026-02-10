const pool = require('../config/database');

class News {
  // Get all news
  static async getAllNews(limit = 10) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM news ORDER BY created_at DESC LIMIT ?',
        [limit]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get news by ID
  static async getNewsById(id) {
    try {
      const [rows] = await pool.execute('SELECT * FROM news WHERE id = ?', [id]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Create news
  static async createNews(title, content, image_url = null) {
    try {
      const [result] = await pool.execute(
        'INSERT INTO news (title, content, image_url) VALUES (?, ?, ?)',
        [title, content, image_url]
      );
      return { id: result.insertId, title, content, image_url };
    } catch (error) {
      throw error;
    }
  }

  // Update news
  static async updateNews(id, title, content, image_url = null) {
    try {
      const [result] = await pool.execute(
        'UPDATE news SET title = ?, content = ?, image_url = ? WHERE id = ?',
        [title, content, image_url, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Delete news
  static async deleteNews(id) {
    try {
      const [result] = await pool.execute('DELETE FROM news WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = News;