const pool = require('../config/database');

class Information {
  // Get all information
  static async getAllInformation() {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM information ORDER BY created_at DESC'
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get information by category
  static async getInformationByCategory(category) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM information WHERE category = ? ORDER BY created_at DESC',
        [category]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Create new information
  static async createInformation(title, content, category) {
    try {
      const [result] = await pool.execute(
        'INSERT INTO information (title, content, category) VALUES (?, ?, ?)',
        [title, content, category]
      );
      return { id: result.insertId, title, content, category };
    } catch (error) {
      throw error;
    }
  }

  // Update information
  static async updateInformation(id, title, content, category) {
    try {
      const [result] = await pool.execute(
        'UPDATE information SET title = ?, content = ?, category = ? WHERE id = ?',
        [title, content, category, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Delete information
  static async deleteInformation(id) {
    try {
      const [result] = await pool.execute('DELETE FROM information WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Information;