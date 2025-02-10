//server.js
const http = require('http'); // Import HTTP module
const app = require('./app'); // Import Express app dari app.js
const { init } = require('./config/socket'); // Import konfigurasi Socket.IO
const { scheduleResetAntrean } = require('./cron/resetAntreanCron');
const path = require('path');
require('dotenv').config(); // Memuat variabel lingkungan dari file .env

// Fungsi untuk setup database
const setupDatabase = async () => {
    try {
        // Path relatif ke setupDatabase.js
        const setupPath = path.resolve(__dirname, 'setupDatabase.js');
        await require(setupPath);
        console.log('Database setup completed successfully.');
    } catch (error) {
        console.error('Error during database setup:', error.message);
    }
};

// Jalankan setup database sebelum server dijalankan
(async () => {
    await setupDatabase(); // Setup database

    // Buat server HTTP
    const server = http.createServer(app);

    // Inisialisasi Socket.IO
    const io = init(server);

    // Simpan Socket.IO instance ke app
    app.set('socketio', io);

    // Menjadwalkan reset antrean harian dengan cron
    scheduleResetAntrean(io);

    const PORT = process.env.PORT;

    // Jalankan server
    server.listen(PORT, () => {
        console.log(`Server berjalan di http://0.0.0.0:${PORT}`);
    });
})();
