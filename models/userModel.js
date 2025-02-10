// models\userModel.js
const pool = require('../config/db');

const User = {
    async create(username, hashedPassword, email) {
        return pool.execute(
            'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
            [username, hashedPassword, email]
        );
    },

    async createUser(username, hashedPassword, email, role) {
        const query = `INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)`;
        return pool.execute(query, [username, hashedPassword, email, role]);
    },

    async findByUsername(username) {
        const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
        return rows.length > 0 ? rows[0] : null;
    },

    
    async findByEmail(username) {
        const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [username]);
        return rows.length > 0 ? rows[0] : null;
    },

    async getAllUsers() {
        const query = `
          SELECT id, username, email, role 
          FROM users 
        `;
        const [rows] = await pool.execute(query);
        return rows;
      },

    async findById(user_id) {
        const query = `
          SELECT id, username, email, role, created_at 
          FROM users 
          WHERE id = ?
        `;
        const [rows] = await pool.execute(query, [user_id]);
        return rows.length > 0 ? rows[0] : null;
      },
    
      async updateUser(userId, { username, email, password, role }) {
        const fields = [];
        const values = [];

        // Perbarui hanya field yang diisi
        if (username) {
            fields.push('username = ?');
            values.push(username);
        }
        if (email) {
            fields.push('email = ?');
            values.push(email);
        }
        if (password) {
            fields.push('password = ?'); // Password akan di-hash di controller
            values.push(password);
        }
        if (role) {
            fields.push('role = ?');
            values.push(role);
        }

        values.push(userId); // Tambahkan userId untuk WHERE clause

        const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
        const [result] = await pool.execute(query, values);
        return result;
    },

    async deleteById(userId) {
        return pool.execute('DELETE FROM users WHERE id = ?', [userId]);
    },

};

module.exports = User;