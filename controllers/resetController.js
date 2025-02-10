const AntrianCounter = require('../models/antrianCounter');
const QueueLogs = require('../models/QueueLog');
const Token = require('../models/tokenModel');


async function resetCounters(io = null) {
  try {
    const result = await AntrianCounter.resetCounters();

    if (result.affectedRows === 0) {
      throw new Error('No counters to reset.');
    }

    if (io) {
      io.emit('counters_reset', {
        message: 'Counters berhasil direset.',
        affectedRows: result.affectedRows,
      });
    }

    return {
      message: 'Counters berhasil direset.',
      affectedRows: result.affectedRows,
    };
  } catch (error) {
    console.error('Error resetting counters:', error.message);
    throw error;
  }
}

async function resetPendingToCancelled(io = null) {
  try {
    const result = await QueueLogs.resetPendingToCancelled();

    const message =
      result.affectedRows > 0
        ? 'Pending antrean berhasil direset menjadi cancelled.'
        : 'Tidak ada status pending yang perlu di-cancelled.';

    if (io) {
      io.emit('pending_reset', {
        message,
        affectedRows: result.affectedRows || 0,
      });
    }

    return { message, affectedRows: result.affectedRows || 0 };
  } catch (error) {
    console.error('Error resetting pending antrean:', error.message);
    throw error;
  }
}

async function resetTokens(io = null) {
  try {
    const result = await Token.deleteAll();

    // Emit event via Socket.IO jika `io` disediakan
    if (io) {
      io.emit('tokens_reset', {
        message: 'Semua refresh token berhasil dihapus.',
        affectedRows: result.affectedRows,
      });
    }

    return {
      message: 'Semua refresh token berhasil dihapus.',
      affectedRows: result.affectedRows,
    };
  } catch (error) {
    console.error('Error resetting tokens:', error.message);
    throw new Error('Error resetting tokens');
  }
}


module.exports = { resetCounters, resetPendingToCancelled, resetTokens };
