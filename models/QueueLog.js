const pool = require('../config/db');

const QueueLogs = {
    async create({ nonpk, nomorAntrean, serviceType, pasienType, status }) {
        const query = `
          INSERT INTO queueLogs 
          (nonpk, nomorAntrean, serviceType, pasienType, status, waiting_stamp) 
          VALUES (?, ?, ?, ?, ?, NOW())
        `;
        const [result] = await pool.execute(query, [nonpk, nomorAntrean, serviceType, pasienType, status]);
        return result;
      },
    
      async getAll() {
        const query = `SELECT * FROM queueLogs`;
        const [rows] = await pool.execute(query);
        return rows;
      },
    
      async getToday() {
        const query = `
            SELECT * 
            FROM queueLogs 
            WHERE 
                DATE(waiting_stamp) = CURDATE() OR
                DATE(called_stamp) = CURDATE() OR
                DATE(processed_stamp) = CURDATE() OR
                DATE(complete_stamp) = CURDATE() OR
                DATE(no_show_stamp) = CURDATE() OR
                DATE(cancel_stamp) = CURDATE()
        `;
        const [rows] = await pool.execute(query);
        return rows;
    },
    

  async updateStatus(nomorAntrean, status) {
    const query = `
      UPDATE queueLogs SET status = ?, ${status}_stamp = NOW() 
      WHERE nomorAntrean = ?
    `;
    return await pool.execute(query, [status, nomorAntrean]);
  },

  async updateStatus(nomorAntrean, status) {
    const statusColumnMapping = {
      waiting: 'waiting_stamp',
      called: 'called_stamp',
      recalled:'called_stamp',
      processed: 'processed_stamp',
      pending: 'no_show_stamp',
      completed:'complete_stamp',
      cancelled: 'cancel_stamp',
    };

    const column = statusColumnMapping[status];
    if (!column) {
      throw new Error(`Invalid status: ${status}`);
    }

    const query = `
      UPDATE queueLogs 
      SET status = ?, ${column} = IF(${column} IS NULL, NOW(), ${column}) 
      WHERE nomorAntrean = ? AND DATE(waiting_stamp) = CURDATE()
    `;
    const [result] = await pool.execute(query, [status, nomorAntrean]);
    return result;
  },


  async updateLoketByNomorAntrean(nomorAntrean, loket) {
    const query = `
      UPDATE queueLogs
      SET loket = ?
      WHERE nomorAntrean = ?
    `;
    const [result] = await pool.execute(query, [loket, nomorAntrean]);
    return result;
  },

  async updateUserIdByNomorAntrean(nomorAntrean, userId) {
    const query = `
      UPDATE queueLogs
      SET user_id = ?
      WHERE nomorAntrean = ?
    `;
    const [result] = await pool.execute(query, [userId, nomorAntrean]);
    return result;
    },
  
  async resetPendingToCancelled() {
    const query = `
      UPDATE queueLogs 
      SET status = 'cancelled', cancel_stamp = NOW() 
      WHERE status = 'pending' AND DATE(waiting_stamp) = CURDATE()
    `;
    const [result] = await pool.execute(query);
    return result;
  },
  
  async getPendingByDate(date) {
    const query = `
      SELECT * FROM queueLogs 
      WHERE status = 'pending' AND DATE(waiting_stamp) = ?
    `;
    const [rows] = await pool.execute(query, [date]);
    return rows;
  },

  async resetPendingStatusByDate(date) {
    const query = `
      UPDATE queueLogs 
      SET status = 'cancelled', cancel_stamp = NOW() 
      WHERE status = 'pending' AND DATE(waiting_stamp) = ?
    `;
    const [result] = await pool.execute(query, [date]);
    return result;
  },


};

module.exports = QueueLogs;
