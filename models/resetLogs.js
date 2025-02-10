const pool = require('../config/db');

const ResetLogs = {
  async create(status, message) {
    console.log('Creating reset log:', { status, message });
    const query = `
      INSERT INTO reset_logs (reset_time, status, message)
      VALUES (NOW(), ?, ?)
    `;
    const [result] = await pool.execute(query, [status, message]); // Tidak ada parameter undefined
    console.log('Reset log created:', result);
    return result;
  },
  
  async getAllLogs() {
    const query = `SELECT * FROM reset_logs ORDER BY reset_time DESC`;
    const [rows] = await pool.execute(query);
    return rows;
  },

  async getLogsByDate(date) {
    const query = `SELECT * FROM reset_logs WHERE DATE(reset_time) = ?`;
    const [rows] = await pool.execute(query, [date]);
    return rows;
  },
};

module.exports = ResetLogs;
