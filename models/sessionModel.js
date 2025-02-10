// models/sessionModel.js
const pool = require('../config/db');

const Session = {
  // Membuat sesi baru
  async create(userId, sessionId) {
    const query = `INSERT INTO sessions (user_id, session_id, created_at) VALUES (?, ?, NOW())`;
    const [result] = await pool.execute(query, [userId, sessionId]);
    return result;
  },

  // Membuat atau memperbarui sesi
  async createOrUpdate(userId, sessionId) {
    const deleteQuery = `DELETE FROM sessions WHERE user_id = ?`;
    const insertQuery = `INSERT INTO sessions (user_id, session_id, created_at) VALUES (?, ?, NOW())`;

    await pool.execute(deleteQuery, [userId]); // Hapus sesi lama
    const [result] = await pool.execute(insertQuery, [userId, sessionId]);
    return result;
  },

  // Mencari sesi berdasarkan session_id
  async findBySessionId(sessionId) {
    const query = `SELECT * FROM sessions WHERE session_id = ?`;
    const [rows] = await pool.execute(query, [sessionId]);
    return rows.length > 0 ? rows[0] : null;
  },

  // Mencari sesi berdasarkan user_id
  async findByUserId(userId) {
    const query = `SELECT * FROM sessions WHERE user_id = ?`;
    const [rows] = await pool.execute(query, [userId]);
    return rows.length > 0 ? rows[0] : null;
  },

  // Menghapus sesi berdasarkan session_id
  async deleteBySessionId(sessionId) {
    const query = `DELETE FROM sessions WHERE session_id = ?`;
    const [result] = await pool.execute(query, [sessionId]);
    return result;
  },

  // Menghapus sesi berdasarkan user_id
  async deleteByUserId(userId) {
    const query = `DELETE FROM sessions WHERE user_id = ?`;
    const [result] = await pool.execute(query, [userId]);
    return result;
  },

  // Menghapus semua sesi
  async deleteAll() {
    const query = `DELETE FROM sessions`;
    const [result] = await pool.execute(query);
    return result;
  },

  // Mendapatkan semua sesi (opsional untuk debugging atau admin)
  async getAllSessions() {
    const query = `SELECT * FROM sessions`;
    const [rows] = await pool.execute(query);
    return rows;
  },
};

module.exports = Session;
