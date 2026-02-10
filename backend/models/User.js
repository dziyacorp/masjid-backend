const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async register(username, password, name, role = 'admin') {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await pool.query(
        'INSERT INTO users (username, password, name, role) VALUES ($1, $2, $3, $4) RETURNING *',
        [username, hashedPassword, name, role]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async login(username, password) {
    try {
      const result = await pool.query(
        'SELECT * FROM users WHERE username = $1',
        [username]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const user = result.rows[0];
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return null;
      }

      return {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role
      };
    } catch (error) {
      throw error;
    }
  }

  static async getAllUsers() {
    try {
      const result = await pool.query(
        'SELECT id, username, name, role, created_at FROM users ORDER BY created_at DESC'
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async updateUser(id, name, role) {
    try {
      const result = await pool.query(
        'UPDATE users SET name = $1, role = $2 WHERE id = $3 RETURNING *',
        [name, role, id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async deleteUser(id) {
    try {
      const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
      return result.rowCount > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
