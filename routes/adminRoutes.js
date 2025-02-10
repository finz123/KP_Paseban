// auth-system\routes\adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

router.get('/login-activity', verifyToken, verifyAdmin, adminController.getLoginActivity);4

router.get('/admin', verifyToken, verifyAdmin, (req, res) => {
    res.json({ message: 'Akses admin berhasil.' });
});


module.exports = router;
