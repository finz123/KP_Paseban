// models/tokenModel.js
const pool = require('../config/db');

const Token = {
  // Membuat refresh token baru
  async create(userId, token) {
    const query = `INSERT INTO refresh_tokens (user_id, token, created_at) VALUES (?, ?, NOW())`;
    const [result] = await pool.execute(query, [userId, token]);
    return result;
  },

  // Membuat atau memperbarui refresh token berdasarkan user_id
  async createOrUpdate(userId, token) {
    const query = `
      INSERT INTO refresh_tokens (user_id, token, created_at)
      VALUES (?, ?, NOW())
      ON DUPLICATE KEY UPDATE token = VALUES(token), created_at = NOW()
    `;
    const [result] = await pool.execute(query, [userId, token]);
    return result;
  },

  // Mencari refresh token berdasarkan token
  async findByToken(token) {
    const query = `SELECT * FROM refresh_tokens WHERE token = ?`;
    const [rows] = await pool.execute(query, [token]);
    return rows.length > 0 ? rows[0] : null;
  },

  // Menghapus refresh token berdasarkan token
  async deleteByToken(token) {
    const query = `DELETE FROM refresh_tokens WHERE token = ?`;
    const [result] = await pool.execute(query, [token]);
    return result;
  },

  // Menghapus refresh token berdasarkan user_id
  async deleteByUserId(userId) {
    const query = `DELETE FROM refresh_tokens WHERE user_id = ?`;
    const [result] = await pool.execute(query, [userId]);
    return result;
  },

  // Menghapus semua refresh token
  async deleteAll() {
    const query = `DELETE FROM refresh_tokens`;
    const [result] = await pool.execute(query);
    return result;
  },

  // Mendapatkan semua refresh token (opsional untuk debugging atau laporan admin)
  async getAllTokens() {
    const query = `SELECT * FROM refresh_tokens`;
    const [rows] = await pool.execute(query);
    return rows;
  },
};

module.exports = Token;