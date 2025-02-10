// controllers\authController.js
const { hashPassword, comparePassword } = require('../utils/auth');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const useragent = require('express-useragent');

// Import Models
const User = require('../models/userModel');
const Token = require('../models/tokenModel');
const Session = require('../models/sessionModel');
const LoginActivity = require('../models/loginActivityModel');

require('dotenv').config();

exports.register = async (req, res, next) => {
    const { username, password, email } = req.body;

    try {
        const hashedPassword = await hashPassword(password);
        await User.create(username, hashedPassword, email);

        // Emit event via Socket.IO
        const io = req.app.get('socketio');
        io.emit('user_registered', { username, email });
        
        res.status(201).json({ message: 'Registrasi berhasil.' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ message: 'Username atau email sudah digunakan.' });
        } else {
            console.error('Error during registration:', error);
            next(error);
        }
    }
};

exports.login = async (req, res, next) => {
    console.log('Request Body:', req.body); // Debugging
    const { username, password } = req.body;

    try {
        // 1. Cari user berdasarkan username
        const user = await User.findByUsername(username);

        if (!user) {
            return res.status(400).json({ message: 'Username atau password salah.' });
        }

        // 2. Periksa password
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Username atau password salah.' });
        }

        // 3. Generate Access Token dan Refresh Token
        const sessionId = uuidv4();
        const accessToken = jwt.sign(
            { id: user.id, role: user.role, sessionId },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Access token berlaku 15 menit
        );
        const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '7d', // Refresh token berlaku 7 hari
        });

        // 4. Hapus semua sesi sebelumnya
        await Session.deleteByUserId(user.id); // Hapus sesi lama dari database

        // 5. Simpan Session ID ke database
        await Session.create(user.id, sessionId);

        // 6. Simpan Refresh Token ke database
        await Token.createOrUpdate(user.id, refreshToken);

        // 7. Catat Aktivitas Login
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        await LoginActivity.log(user.id, ipAddress, userAgent);

        // 8. Setel Refresh Token ke cookie HTTP-only
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Gunakan cookie aman di production
            sameSite: 'Strict', // Cegah pengiriman lintas domain
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari dalam milidetik
        });

        // Emit event via Socket.IO
        const io = req.app.get('socketio');
        io.emit('user_logged_in', { username, id: user.id });

        // 9. Kirimkan Access Token ke client
        res.status(200).json({
            accessToken,
            message: 'Login berhasil.',
        });
    } catch (error) {
        console.error('Error during login:', error);
        next(error);
    }
};

exports.refreshToken = async (req, res, next) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token tidak tersedia.' });
    }

    try {
        const tokenData = await Token.findByToken(refreshToken);
        if (!tokenData) {
            return res.status(403).json({ message: 'Refresh token tidak valid.' });
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Refresh token tidak valid.' });
            }

            const session = await Session.findByUserId(decoded.id);
            if (!session) {
                return res.status(403).json({ message: 'Sesi tidak valid.' });
            }

            const newAccessToken = jwt.sign(
                { id: decoded.id, role: decoded.role, sessionId: session.session_id },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.status(200).json({ accessToken: newAccessToken });
        });
    } catch (error) {
        console.error('Error during refresh token:', error.message);
        next(error);
    }
};
    
  exports.logout = async (req, res, next) => {
    const { sessionId } = req.user;
  
    try {
      const session = await Session.findBySessionId(sessionId);
      if (!session) {
        return res.status(404).json({ message: 'Sesi tidak ditemukan.' });
      }
  
      await Session.deleteBySessionId(sessionId);
      await Token.deleteByUserId(req.user.id);

    // Emit event via Socket.IO
    const io = req.app.get('socketio');
    io.emit('user_logged_out', { id: req.user.id });

  
      res.status(200).json({ message: 'Logout berhasil.' });
    } catch (error) {
      console.error('Error saat logout:', error.message);
      next(error);
    }
  };