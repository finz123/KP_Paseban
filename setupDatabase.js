// setupDatabase.js
const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
    try {
        // Koneksi ke MySQL
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        });

        // Buat database jika belum ada
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
        console.log(`Database ${process.env.DB_NAME} siap digunakan.`);

        // Pilih database
        await connection.changeUser({ database: process.env.DB_NAME });

        // Buat tabel users
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                role varchar(50) DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Tabel users dibuat.');

        // Buat tabel refresh_tokens
        await connection.query(`
            CREATE TABLE IF NOT EXISTS refresh_tokens (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                token VARCHAR(500) NOT NULL UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('Tabel refresh_tokens dibuat.');

        // Buat tabel sessions
        await connection.query(`
            CREATE TABLE IF NOT EXISTS sessions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                session_id VARCHAR(255) NOT NULL UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('Tabel sessions dibuat.');

        // Buat tabel login_activity
        await connection.query(`
            CREATE TABLE IF NOT EXISTS login_activity (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                ip_address VARCHAR(45),
                user_agent TEXT,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('Tabel login_activity dibuat.');

            // Buat tabel queueLogs
    await connection.query(`
        CREATE TABLE IF NOT EXISTS queueLogs (
          id INT AUTO_INCREMENT PRIMARY KEY,
          nonpk VARCHAR(255) NOT NULL,
          nomorAntrean VARCHAR(50) NOT NULL,
          loket VARCHAR(100),
          serviceType VARCHAR(100) NOT NULL,
          pasienType VARCHAR(100) NOT NULL,
          status VARCHAR(50) NOT NULL,
          waiting_stamp DATETIME NOT NULL,
          called_stamp DATETIME,
          processed_stamp DATETIME,
          complete_stamp DATETIME,
          no_show_stamp DATETIME,
          cancel_stamp DATETIME,
          user_id INT,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);
      console.log('Tabel queueLogs dibuat.');
  
      // Buat tabel queueTypes
      await connection.query(`
        CREATE TABLE IF NOT EXISTS queueTypes (
          id INT AUTO_INCREMENT PRIMARY KEY,
          userType VARCHAR(50) NOT NULL,
          serviceType VARCHAR(50) NOT NULL,
          queueCode VARCHAR(10) NOT NULL UNIQUE
        )
      `);
      console.log('Tabel queueTypes dibuat.');
  
      // Buat tabel antrianCounter
      await connection.query(`
        CREATE TABLE IF NOT EXISTS antrian_counter (
          id INT AUTO_INCREMENT PRIMARY KEY,
          pasienType VARCHAR(50) NOT NULL,
          serviceType VARCHAR(50) NOT NULL,
          counter INT DEFAULT 0 NOT NULL,
          UNIQUE KEY (pasienType, serviceType)
        )
      `);
      console.log('Tabel antrianCounter dibuat.');
  
      // Buat tabel loket
      await connection.query(`
        CREATE TABLE IF NOT EXISTS loket (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(50) NOT NULL,
          description VARCHAR(255),
          user_id INT,
          status ENUM('active', 'inactive') DEFAULT 'active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
        )
      `);
      console.log('Tabel loket dibuat.');

      //buat table reset Logs
      await connection.query(`
        CREATE TABLE IF NOT EXISTS reset_logs (
          id INT AUTO_INCREMENT PRIMARY KEY,
          reset_time DATETIME NOT NULL,
          status VARCHAR(50) DEFAULT 'SUCCESS',
          message TEXT
          )   
      `);
  
      // Isi data awal untuk tabel users
      await connection.query(`
        INSERT INTO users (username, password, email, role)
        VALUES 
        ('admin', '$2b$12$vFLivozASgSIcsgP5MQNw.gBmZ47j.qM60uXPCR5/8Dl6EeznaZNu', 'admin@gmail.com', 'admin')
      `);
      console.log('Data awal untuk tabel users berhasil dimasukkan.');
  
      // Isi data awal untuk tabel queueTypes
      await connection.query(`
        INSERT INTO queueTypes (userType, serviceType, queueCode)
        VALUES 
        ('Karyawan', 'BPJS', 'KB'),
        ('Umum', 'BPJS', 'UB'),
        ('Karyawan', 'PJPK', 'KP'),
        ('Umum', 'ASURANSI', 'UA'),
        ('Umum', 'UMUM', 'UU')
      `);
      console.log('Data awal untuk tabel queueTypes berhasil dimasukkan.');
  
      // Isi data awal untuk tabel antrianCounter
      await connection.query(`
        INSERT INTO antrian_counter (pasienType, serviceType, counter)
        VALUES 
        ('Umum', 'ASURANSI', 0),
        ('Umum', 'UMUM', 0),
        ('Umum', 'BPJS', 0),
        ('Karyawan', 'BPJS', 0),
        ('Karyawan', 'PJPK', 0)
      `);
      console.log('Data awal untuk tabel antrianCounter berhasil dimasukkan.');
  
      // Isi data awal untuk tabel loket
      await connection.query(`
        INSERT INTO loket (name, description, status)
        VALUES 
        ('Loket 1', 'Pelayanan Umum', 'active'),
        ('Loket 2', 'BPJS Karyawan', 'active'),
        ('Loket 3', 'BPJS Umum', 'active'),
        ('Loket 4', 'Asuransi', 'active')
      `);
      console.log('Data awal untuk tabel loket berhasil dimasukkan.');

        // Tutup koneksi
        await connection.end();
        console.log('Setup database selesai.');
    } catch (error) {
        console.error('Error saat setup database:', error.message);
    }
})();
