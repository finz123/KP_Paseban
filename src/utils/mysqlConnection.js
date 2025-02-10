import mysql from 'mysql2/promise';

// Membuat koneksi pool ke MySQL
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'KP_PASEBAN',  // Pastikan database ditetapkan di sini
});

// Fungsi helper untuk memilih database
export const selectDatabase = async (dbName) => {
  try {
    await pool.query(`USE ${dbName}`);
  } catch (error) {
    throw new Error(`Error selecting database: ${error.message}`);
  }
};

// Helper untuk menjalankan query
export const runQuery = async (query, values = []) => {
  try {
    const [results] = await pool.query(query, values);
    return results;
  } catch (error) {
    console.error(`Error executing query: ${error.message}`);
    throw new Error(`Error executing query: ${error.message}`);
  }
};

export default pool;