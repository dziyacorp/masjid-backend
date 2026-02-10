const pool = require('../config/database');

class Finance {
  static async getAllFinances(type = null) {
    try {
      let query = 'SELECT * FROM finances';
      let params = [];
      
      if (type) {
        query += ' WHERE type = $1';
        params.push(type);
      }
      
      query += ' ORDER BY date DESC';
      
      const result = await pool.query(query, params);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async createFinance(data) {
    try {
      const { date, type, amount, source, description } = data;
      const result = await pool.query(
        'INSERT INTO finances (date, type, amount, source, description) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [date, type, amount, source, description]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async updateFinance(id, data) {
    try {
      const { date, type, amount, source, description } = data;
      const result = await pool.query(
        'UPDATE finances SET date = $1, type = $2, amount = $3, source = $4, description = $5 WHERE id = $6 RETURNING *',
        [date, type, amount, source, description, id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async deleteFinance(id) {
    try {
      const result = await pool.query('DELETE FROM finances WHERE id = $1 RETURNING *', [id]);
      return result.rowCount > 0;
    } catch (error) {
      throw error;
    }
  }

  static async getMonthlySummary(year, month) {
    try {
      const startDate = `${year}-${month.padStart(2, '0')}-01`;
      const endDate = `${year}-${month.padStart(2, '0')}-31`;
      
      const incomeResult = await pool.query(
        'SELECT COALESCE(SUM(amount), 0) as total FROM finances WHERE type = $1 AND date BETWEEN $2 AND $3',
        ['income', startDate, endDate]
      );
      
      const expenseResult = await pool.query(
        'SELECT COALESCE(SUM(amount), 0) as total FROM finances WHERE type = $1 AND date BETWEEN $2 AND $3',
        ['expense', startDate, endDate]
      );
      
      return {
        income: parseFloat(incomeResult.rows[0].total),
        expense: parseFloat(expenseResult.rows[0].total),
        balance: parseFloat(incomeResult.rows[0].total) - parseFloat(expenseResult.rows[0].total)
      };
    } catch (error) {
      throw error;
    }
  }

  static async getYearlySummary(year) {
    try {
      const result = await pool.query(
        `SELECT 
          EXTRACT(MONTH FROM date) as month,
          SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
          SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense
         FROM finances 
         WHERE EXTRACT(YEAR FROM date) = $1
         GROUP BY EXTRACT(MONTH FROM date)
         ORDER BY month`,
        [year]
      );
      
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Finance;
