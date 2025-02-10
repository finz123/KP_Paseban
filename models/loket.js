const pool = require('../config/db');

const Loket = {
  async getAll() {
    const query = `SELECT * FROM loket`;
    const [rows] = await pool.execute(query);
    return rows;
  },

  async getActive() {
    const query = `SELECT * FROM loket WHERE status = 'active'`;
    const [rows] = await pool.execute(query);
    return rows;
  },

  async getInactive() {
    const query = `SELECT * FROM loket WHERE status = 'inactive'`;
    const [rows] = await pool.execute(query);
    return rows;
  },

  async updateStatus(loketId, status) {
    const query = `UPDATE loket SET status = ? WHERE id = ?`;
    const [result] = await pool.execute(query, [status, loketId]);
    return result;
  },

  async assignUser(loketId, userId) {
    const query = `UPDATE loket SET user_id = ?, status = 'active' WHERE id = ?`;
    const [result] = await pool.execute(query, [userId, loketId]);
    return result;
  },

  async clearUser(loketId) {
    const query = `UPDATE loket SET user_id = NULL, status = 'inactive' WHERE id = ?`;
    const [result] = await pool.execute(query, [loketId]);
    return result;
  },

  async setAllInactive() {
    const query = `UPDATE loket SET status = 'inactive'`;
    const [result] = await pool.execute(query);
    return result;
  },

  async clearAllUsers() {
    console.log('Running clearAllUsers query...');
    const query = `UPDATE loket SET user_id = NULL`;
    const [result] = await pool.execute(query); // Tidak ada parameter
    console.log('Clear all users result:', result);
    return result;
  }
  };

module.exports = Loket;
