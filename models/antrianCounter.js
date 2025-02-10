const pool = require('../config/db');

const AntrianCounter = {
    async getByType(pasienType, serviceType) {
        const query = `
          SELECT counter FROM antrian_counter 
          WHERE pasienType = ? AND serviceType = ?
        `;
        const [rows] = await pool.execute(query, [pasienType, serviceType]);
        return rows;
      },
    
      async incrementCounter(pasienType, serviceType) {
        const query = `
          UPDATE antrian_counter 
          SET counter = counter + 1 
          WHERE pasienType = ? AND serviceType = ?
        `;
        return await pool.execute(query, [pasienType, serviceType]);
      },
    
      async createCounter(pasienType, serviceType) {
        const query = `
          INSERT INTO antrian_counter (pasienType, serviceType, counter) 
          VALUES (?, ?, 1)
        `;
        return await pool.execute(query, [pasienType, serviceType]);
      },
    
  async resetCounters() {
    const query = `
      UPDATE antrian_counter SET counter = 0
    `;
    const [result] = await pool.execute(query);
    return result;
  },
};

module.exports = AntrianCounter;
