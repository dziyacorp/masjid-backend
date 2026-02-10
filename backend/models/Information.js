const pool = require('../config/database');

class Information {
  static async getAllInformation() {
    try {
      const result = await pool.query(
        'SELECT * FROM information ORDER BY created_at DESC'
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async getInformationByCategory(category) {
    try {
      const result = await pool.query(
        'SELECT * FROM information WHERE category = $1 ORDER BY created_at DESC',
        [category]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async createInformation(title, content, category) {
    try {
      const result = await pool.query(
        'INSERT INTO information (title, content, category) VALUES ($1, $2, $3) RETURNING *',
        [title, content, category]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async updateInformation(id, title, content, category) {
    try {
      const result = await pool.query(
        'UPDATE information SET title = $1, content = $2, category = $3 WHERE id = $4 RETURNING *',
        [title, content, category, id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async deleteInformation(id) {
    try {
      const result = await pool.query('DELETE FROM information WHERE id = $1 RETURNING *', [id]);
      return result.rowCount > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Information;
