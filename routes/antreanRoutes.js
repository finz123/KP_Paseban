//routes\antreanRoutes.js
const express = require('express');
const router = express.Router();
const { createAntrean, getAllAntrean, getAntreanToday, updateLoket, updateStatus, updateUserId } = require('../controllers/antreanController');
const { resetCounters, resetPendingToCancelled } = require('../controllers/resetController');

router.post('/create', createAntrean);
router.get('/list', getAllAntrean);
router.patch('/status/today', getAntreanToday); // Update status antrean "today" by nomorAntrean
router.patch('/loket', updateLoket);
router.patch('/status', updateStatus);
router.patch('/user', updateUserId ); 
router.patch('/reset-counters', resetCounters);
router.patch('/reset-pending', resetPendingToCancelled);

module.exports = router;
