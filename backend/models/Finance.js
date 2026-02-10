const pool = require('../config/database');

class Finance {
  // Get all finances
  static async getAllFinances(type = null) {
    try {
      let query = 'SELECT * FROM finances';
      let params = [];
      
      if (type) {
        query += ' WHERE type = ?';
        params.push(type);
      }
      
      query += ' ORDER BY date DESC';
      
      const [rows] = await pool.execute(query, params);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Create finance record
  static async createFinance(data) {
    try {
      const { date, type, amount, source, description } = data;
      const [result] = await pool.execute(
        'INSERT INTO finances (date, type, amount, source, description) VALUES (?, ?, ?, ?, ?)',
        [date, type, amount, source, description]
      );
      return { id: result.insertId, ...data };
    } catch (error) {
      throw error;
    }
  }

  // Update finance record
  static async updateFinance(id, data) {
    try {
      const { date, type, amount, source, description } = data;
      const [result] = await pool.execute(
        'UPDATE finances SET date = ?, type = ?, amount = ?, source = ?, description = ? WHERE id = ?',
        [date, type, amount, source, description, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Delete finance record
  static async deleteFinance(id) {
    try {
      const [result] = await pool.execute('DELETE FROM finances WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get monthly summary
  static async getMonthlySummary(year, month) {
    try {
      const startDate = `${year}-${month.padStart(2, '0')}-01`;
      const endDate = `${year}-${month.padStart(2, '0')}-31`;
      
      const [income] = await pool.execute(
        'SELECT SUM(amount) as total FROM finances WHERE type = "income" AND date BETWEEN ? AND ?',
        [startDate, endDate]
      );
      
      const [expense] = await pool.execute(
        'SELECT SUM(amount) as total FROM finances WHERE type = "expense" AND date BETWEEN ? AND ?',
        [startDate, endDate]
      );
      
      return {
        income: income[0].total || 0,
        expense: expense[0].total || 0,
        balance: (income[0].total || 0) - (expense[0].total || 0)
      };
    } catch (error) {
      throw error;
    }
  }

  // Get yearly summary
  static async getYearlySummary(year) {
    try {
      const [rows] = await pool.execute(
        `SELECT 
          MONTH(date) as month,
          SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
          SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense
         FROM finances 
         WHERE YEAR(date) = ?
         GROUP BY MONTH(date)
         ORDER BY month`,
        [year]
      );
      
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Finance;