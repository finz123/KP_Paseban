// middleware\authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();
const pool = require('../config/db');
const User = require('../models/userModel'); // Tambahkan impor model User
const Session = require('../models/sessionModel'); // Tambahkan ini

exports.verifyToken = async (req, res, next) => {
    const token = req.headers['x-token']; // Mengambil token dari header 'x-token'

    if (!token) {
        return res.status(401).json({ message: 'Token tidak tersedia.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded);

        const session = await Session.findBySessionId(decoded.sessionId);

        if (!session || session.user_id !== decoded.id) {
            console.warn("Sesi tidak valid atau tidak ditemukan.");
            return res.status(403).json({ message: 'Sesi tidak valid.' });
        }

        req.user = { id: decoded.id, sessionId: decoded.sessionId, role: decoded.role };
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(403).json({ message: 'Token expired' });
        }
        return res.status(403).json({ message: 'Token tidak valid.' });
    }
};
      
exports.verifyAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Akses ditolak, bukan admin.' });
    }
    next();
};