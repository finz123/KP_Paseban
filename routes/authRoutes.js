// routes\authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController')
const { verifyToken } = require('../middleware/authMiddleware'); // Pastikan path benar

// Route untuk registrasi
router.post('/register', authController.register);

// Route untuk login
router.post('/login', authController.login);

// Route untuk refresh token
router.post('/refresh-token', authController.refreshToken);

// Route untuk logout
router.post('/logout',verifyToken, authController.logout);

router.get('/me', verifyToken, userController.getProfile);

module.exports = router;
