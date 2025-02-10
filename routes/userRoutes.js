// auth-system\routes\userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

router.get('/me', verifyToken, userController.getProfile);

router.put('/update/:id', verifyToken, verifyAdmin, userController.updateUser);

router.delete('/delete/:id', verifyToken, verifyAdmin, userController.deleteUser);

router.post('/create', verifyToken, verifyAdmin, userController.createUser);

router.get('/all', verifyToken, verifyAdmin, userController.getAllUsers);
module.exports = router;