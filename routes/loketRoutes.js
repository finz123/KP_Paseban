//routes\loketRoutes.js
const express = require('express');
const {
  getAllLoket,
  getActiveLoket,
  updateLoketStatus,
  assignUserToLoket,
  clearUserFromLoket,
  getInactiveLoket,
} = require('../controllers/loketController');

const router = express.Router();

router.get('/', getAllLoket); // Mendapatkan semua loket
router.get('/active', getActiveLoket); // Mendapatkan loket aktif
router.get('/inactive', getInactiveLoket); // Mendapatkan loket tidak aktif
router.patch('/status', updateLoketStatus); // Memperbarui status loket
router.post('/assign', assignUserToLoket); // Menugaskan user ke loket
router.post('/clear', clearUserFromLoket); // Menghapus user dari loket

module.exports = router;
