const ResetLogs = require('../models/resetLogs');

// Fungsi untuk mencatat log reset
async function logReset(status, message, io = null) {
  try {
    const result = await ResetLogs.create({ status, message });

    if (io) {
      io.emit('reset_log', {
        id: result.insertId,
        reset_time: new Date().toISOString(),
        status,
        message,
      });
    }

    return {
      message: 'Log reset berhasil dicatat.',
      logId: result.insertId,
    };
  } catch (error) {
    console.error('Error logging reset:', error.message);
    throw error;
  }
}

// Fungsi untuk mendapatkan semua log reset
async function getAllLogs(req, res) {
  try {
    const logs = await ResetLogs.getAllLogs();
    return res.status(200).json(logs);
  } catch (error) {
    console.error('Error fetching reset logs:', error.message);
    return res.status(500).json({ message: 'Error fetching reset logs' });
  }
}

// Fungsi untuk mendapatkan log reset berdasarkan tanggal
async function getLogsByDate(req, res) {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: 'Tanggal wajib diisi.' });
    }

    const logs = await ResetLogs.getLogsByDate(date);
    return res.status(200).json(logs);
  } catch (error) {
    console.error('Error fetching reset logs by date:', error.message);
    return res.status(500).json({ message: 'Error fetching reset logs by date' });
  }
}

module.exports = { logReset, getAllLogs, getLogsByDate };
