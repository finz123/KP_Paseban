// src/utils/jwtUtils.js
import jwt from 'jsonwebtoken';
import { runQuery } from './mysqlConnection';

// Penyimpanan sementara untuk refresh token (idealnya menggunakan basis data)
let refreshTokens = new Set(); // Set untuk menyimpan refresh token yang valid

// Membuat access token
export const generateToken = (user) => {
  try {
    return jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }  // Access token berlaku 1 jam
    );
  } catch (error) {
    throw new Error('Error generating access token');
  }
};

// Membuat refresh token
export const generateRefreshToken = async (user) => {
  try {
    const refreshToken = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 hari
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');

    // Hapus token lama hanya jika token baru berhasil dibuat
    console.log(`Removing old tokens for user: ${user.id}`);
    await runQuery(`DELETE FROM refresh_tokens WHERE user_id = ?`, [user.id]);

    console.log('Inserting new refresh token into database...');
    await runQuery(
      `INSERT INTO refresh_tokens (token, user_id, expires_at) VALUES (?, ?, ?)`,
      [refreshToken, user.id, expiresAt]
    );

    console.log('Refresh token saved to database successfully.');
    return refreshToken;
  } catch (error) {
    console.error('Error generating refresh token:', error.message);
    throw new Error('Error generating refresh token');
  }
};

const activeRotations = new Set(); // Set untuk menyimpan user ID yang sedang merotasi token

export const verifyAndRotateRefreshToken = async (oldRefreshToken) => {
  let user = null;
  try {
    console.log('Verifying refresh token:', oldRefreshToken);

    const rows = await runQuery(`SELECT * FROM refresh_tokens WHERE token = ?`, [oldRefreshToken]);

    if (rows.length === 0) {
      console.warn('Refresh token not found in database');
      throw new Error('Invalid refresh token');
    }

    const refreshTokenRecord = rows[0];
    const currentTime = new Date();

    if (new Date(refreshTokenRecord.expires_at) < currentTime) {
      console.warn('Refresh token has expired');
      throw new Error('Refresh token expired');
    }

    user = jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Pastikan rotasi simultan dicegah
    if (activeRotations.has(user.id)) {
      console.warn(`Refresh token rotation already in progress for user: ${user.id}`);
      return { user, newRefreshToken: oldRefreshToken }; // Berikan token lama jika rotasi sudah berjalan
    }

    activeRotations.add(user.id);

    // Hapus token lama
    console.log('Removing old tokens for user:', user.id);
    await runQuery(`DELETE FROM refresh_tokens WHERE user_id = ?`, [user.id]);

    // Buat token baru
    console.log('Generating new refresh token...');
    const newRefreshToken = await generateRefreshToken(user);

    activeRotations.delete(user.id);
    return { user, newRefreshToken };
  } catch (error) {
    if (user) {
      activeRotations.delete(user.id);
    }
    console.error('Error verifying and rotating refresh token:', error.message);
    throw error;
  }
};

// Memverifikasi access token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expired'); // Error spesifik untuk token kadaluarsa
    }
    throw new Error('Invalid access token');
  }
};

// Middleware untuk validasi token
export const authenticateToken = (req) => {
  const token = req.headers.get('x-token'); 
  if (!token) {
    throw new Error('Authorization or Token header is missing');
  }

  try {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    return decodedData; // Kembalikan data token jika valid
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      console.error('Access token expired:', error.message);
      throw new Error('Token expired'); // Tangani khusus untuk token kadaluwarsa
    }
    console.error('Error verifying token:', error.message);
    throw new Error('Invalid access token');
  }
};