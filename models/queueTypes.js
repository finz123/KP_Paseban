const pool = require('../config/db');

const QueueTypes = {
  async getAll() {
    const query = `SELECT * FROM queueTypes`;
    return await pool.execute(query);
  },

  async getByType(userType, serviceType) {
    const query = `
      SELECT queueCode FROM queueTypes 
      WHERE userType = ? AND serviceType = ?
    `;
    const [rows] = await pool.execute(query, [userType, serviceType]);
    return rows;
  }
};

module.exports = QueueTypes;
