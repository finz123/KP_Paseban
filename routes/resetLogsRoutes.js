const express = require('express');
const { logReset, getAllLogs, getLogsByDate } = require('../controllers/resetLogsController');

const router = express.Router();

// Route untuk mencatat log reset
router.post('/log', logReset);

// Route untuk mendapatkan semua log reset
router.get('/logs', getAllLogs);

// Route untuk mendapatkan log reset berdasarkan tanggal
router.get('/logs/date', getLogsByDate);

module.exports = router;
