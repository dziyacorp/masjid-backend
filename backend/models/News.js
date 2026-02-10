const pool = require('../config/database');

class News {
  static async getAllNews(limit = 10) {
    try {
      const result = await pool.query(
        'SELECT * FROM news ORDER BY created_at DESC LIMIT $1',
        [limit]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async getNewsById(id) {
    try {
      const result = await pool.query('SELECT * FROM news WHERE id = $1', [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async createNews(title, content, image_url = null) {
    try {
      const result = await pool.query(
        'INSERT INTO news (title, content, image_url) VALUES ($1, $2, $3) RETURNING *',
        [title, content, image_url]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async updateNews(id, title, content, image_url = null) {
    try {
      const result = await pool.query(
        'UPDATE news SET title = $1, content = $2, image_url = $3 WHERE id = $4 RETURNING *',
        [title, content, image_url, id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async deleteNews(id) {
    try {
      const result = await pool.query('DELETE FROM news WHERE id = $1 RETURNING *', [id]);
      return result.rowCount > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = News;
