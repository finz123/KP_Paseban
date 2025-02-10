const cron = require('node-cron');
const { resetCounters, resetPendingToCancelled } = require('../controllers/resetController');
const ResetLogs = require('../models/resetLogs');
const Loket = require('../models/loket');
const Token = require('../models/tokenModel');
const Session = require('../models/sessionModel');


async function executeReset(io, retryCount = 3) {
  try {
    console.log('Menjalankan reset antrean, status, dan loket pada waktu yang dijadwalkan.');

    // Reset antrean counter
    const counterResetResult = await resetCounters(io);

    // Reset antrean status (pending -> cancelled)
    const statusResetResult = await resetPendingToCancelled(io);

    // Update semua loket menjadi inactive
    const loketStatusResult = await Loket.setAllInactive();

    // Clear semua pengguna dari loket
    const clearUsersResult = await Loket.clearAllUsers();

    // Hapus semua refresh token
    const tokensResetResult = await Token.deleteAll();

    // Hapus semua sesi
    const sessionDeleteResult = await Session.deleteAll();


    // Log reset
    const resetMessage = `Reset antrean berhasil:
      - ${counterResetResult.affectedRows || 0} antrean counter berhasil direset.
      - ${statusResetResult.affectedRows || 0} antrean "pending" diubah menjadi "cancelled".
      - ${loketStatusResult.affectedRows || 0} loket diubah menjadi inactive.
      - ${clearUsersResult.affectedRows || 0} user_id dihapus dari loket.
      - ${tokensResetResult.affectedRows || 0} semua refresh token dihapus.
      - ${sessionDeleteResult.affectedRows || 0} semuasession dihapus.`;


    await ResetLogs.create('SUCCESS', resetMessage);

    // Emit event untuk client
    io.emit('reset_complete', {
      message: 'Reset harian berhasil dilakukan.',
      details: {
        countersReset: counterResetResult.affectedRows || 0,
        statusResetCount: statusResetResult.affectedRows || 0,
        loketInactiveCount: loketStatusResult.affectedRows || 0,
        usersClearedCount: clearUsersResult.affectedRows || 0,
        tokensResetCount: tokensResetResult.affectedRows || 0,
        sessionsDeleted: sessionDeleteResult.affectedRows || 0,
      },
    });

    console.log(resetMessage);
  } catch (error) {
    console.error('Error during reset process:', error.message);

    // Log error ke reset_logs
    const errorMessage = `Reset gagal: ${error.message}`;
    await ResetLogs.create('FAILED', errorMessage);

    // Emit event error
    io.emit('reset_error', {
      message: 'Terjadi kesalahan saat melakukan reset harian.',
      error: error.message,
    });

    // Retry jika masih memiliki sisa retryCount
    if (retryCount > 0) {
      console.log(`Retrying reset... Remaining attempts: ${retryCount}`);
      setTimeout(() => executeReset(io, retryCount - 1), 10000); // Retry setelah 10 detik
    }
  }
}

function scheduleResetAntrean(io) {
  cron.schedule(
    '41 23 * * *', // Ubah waktu sesuai kebutuhan
    () => executeReset(io),
    {
      timezone: 'Asia/Jakarta',
    }
  );
}

module.exports = { scheduleResetAntrean };
