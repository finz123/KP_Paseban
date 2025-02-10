const express = require('express');
const { resetCounters, resetPendingToCancelled } = require('../controllers/resetController');
const Loket = require('../models/loket');
const Token = require('../models/tokenModel');
const Session = require('../models/sessionModel');
const ResetLogs = require('../models/resetLogs');
const router = express.Router();

// Route untuk reset harian secara manual
router.post('/reset-all', async (req, res) => {
  const io = req.app.get('socketio'); // Mengambil instance Socket.IO

  try {
    console.log('Menjalankan reset harian secara manual.');

    // Reset antrean counter
    const counterResetResult = await resetCounters(io);

    // Reset antrean status (pending -> cancelled)
    const statusResetResult = await resetPendingToCancelled(io);

    // Update semua loket menjadi inactive
    const loketStatusResult = await Loket.setAllInactive();

    // Clear semua pengguna dari loket
    const clearUsersResult = await Loket.clearAllUsers();

    // Hapus semua refresh tokens
    const tokenDeleteResult = await Token.deleteAll();

    // Hapus semua sesi
    const sessionDeleteResult = await Session.deleteAll();

    // Log reset
    const resetMessage = `Reset manual berhasil:
    - ${counterResetResult.affectedRows || 0} antrean counter direset.
    - ${statusResetResult.affectedRows || 0} antrean pending diubah menjadi cancelled.
    - ${loketStatusResult.affectedRows || 0} loket diubah menjadi inactive.
    - ${clearUsersResult.affectedRows || 0} pengguna dihapus dari loket.
    - ${tokenDeleteResult.affectedRows || 0} refresh token dihapus.
    - ${sessionDeleteResult.affectedRows || 0} sesi dihapus.`;

    await ResetLogs.create('SUCCESS', resetMessage);

    // Emit event untuk client
    io.emit('reset_complete', {
      message: 'Reset manual berhasil dilakukan.',
      details: {
        countersReset: counterResetResult.affectedRows || 0,
        statusResetCount: statusResetResult.affectedRows || 0,
        loketInactiveCount: loketStatusResult.affectedRows || 0,
        usersClearedCount: clearUsersResult.affectedRows || 0,
        tokensDeleted: tokenDeleteResult.affectedRows || 0,
        sessionsDeleted: sessionDeleteResult.affectedRows || 0,
      },
    });

    console.log(resetMessage);

    res.status(200).json({
      message: 'Reset manual berhasil dilakukan.',
      details: {
        countersReset: counterResetResult.affectedRows || 0,
        statusResetCount: statusResetResult.affectedRows || 0,
        loketInactiveCount: loketStatusResult.affectedRows || 0,
        usersClearedCount: clearUsersResult.affectedRows || 0,
        tokensDeleted: tokenDeleteResult.affectedRows || 0,
        sessionsDeleted: sessionDeleteResult.affectedRows || 0,
      },
    });
  } catch (error) {
    console.error('Error during manual reset:', error.message);

    // Log error ke reset_logs
    const errorMessage = `Reset manual gagal: ${error.message}`;
    await ResetLogs.create('FAILED', errorMessage);

    // Emit event error
    io.emit('reset_error', {
      message: 'Terjadi kesalahan saat melakukan reset manual.',
      error: error.message,
    });

    res.status(500).json({ message: 'Error during manual reset', error: error.message });
  }
});

module.exports = router;
