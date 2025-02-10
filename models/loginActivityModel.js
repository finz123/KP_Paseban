// models\loginActivityModel.js
const pool = require('../config/db');

const LoginActivity = {
    async log(userId, ipAddress, userAgent) {
        return pool.execute(
            'INSERT INTO login_activity (user_id, ip_address, user_agent) VALUES (?, ?, ?)',
            [userId, ipAddress, userAgent]
        );
    },

    async getActivityByUserId(userId) {
        const [rows] = await pool.execute(
            'SELECT login_time, ip_address, user_agent FROM login_activity WHERE user_id = ?',
            [userId]
        );
        return rows;
    },

    async getAllActivity() {
        const [rows] = await pool.execute(`
            SELECT u.username, la.login_time, la.ip_address, la.user_agent
            FROM login_activity la
            JOIN users u ON la.user_id = u.id
        `);
        return rows;
    }
};

module.exports = LoginActivity;
