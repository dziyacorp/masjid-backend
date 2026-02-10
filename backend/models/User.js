const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Register new admin
  static async register(username, password, name, role = 'admin') {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await pool.execute(
        'INSERT INTO users (username, password, name, role) VALUES (?, ?, ?, ?)',
        [username, hashedPassword, name, role]
      );
      return { id: result.insertId, username, name, role };
    } catch (error) {
      throw error;
    }
  }

  // Login
  static async login(username, password) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );

      if (rows.length === 0) {
        return null;
      }

      const user = rows[0];
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

  // Get all users
  static async getAllUsers() {
    try {
      const [rows] = await pool.execute('SELECT id, username, name, role, created_at FROM users');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Update user
  static async updateUser(id, name, role) {
    try {
      const [result] = await pool.execute(
        'UPDATE users SET name = ?, role = ? WHERE id = ?',
        [name, role, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Delete user
  static async deleteUser(id) {
    try {
      const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;