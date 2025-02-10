// controllers\userController.js
const User = require('../models/userModel');
const { hashPassword } = require('../utils/auth');

exports.createUser = async (req, res) => {
  try {
      const { username, email, password, role } = req.body;

      // Validasi input
      if (!username || !email || !password || !role) {
          return res.status(400).json({ message: 'Username, email, password, dan role wajib diisi.' });
      }

      // Cek apakah email sudah digunakan
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
          return res.status(400).json({ message: 'Email sudah digunakan.' });
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Simpan user ke database
      await User.createUser(username, hashedPassword, email, role);

      res.status(201).json({ message: 'User berhasil dibuat.' });
  } catch (error) {
      console.error('Error creating user:', error.message);
      res.status(500).json({ message: 'Terjadi kesalahan saat membuat user.' });
  }
};

exports.getProfile = async (req, res, next) => {
    try {
      console.log('Memproses request profil untuk user ID:', req.user.id);
  
      const user = await User.findById(req.user.id);
  
      if (!user) {
        console.log('Pengguna tidak ditemukan');
        return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
      }
  
      const { id, username, email, role, created_at } = user; // Tambahkan id ke dalam destruktur
      res.status(200).json({ id, username, email, role, created_at }); // Sertakan id dalam respons
    } catch (error) {
      console.error('Error in getProfile:', error);
      next(error);
    }
  };

 // Fungsi untuk memperbarui user
exports.updateUser = async (req, res) => {
  try {
      const { id } = req.params; // Ambil ID dari parameter URL
      const { username, email, password, role } = req.body;

      // Validasi input
      if (!id) {
          return res.status(400).json({ message: 'User ID diperlukan.' });
      }

      // Siapkan data yang akan diupdate
      const updateData = {};
      if (username) updateData.username = username;
      if (email) updateData.email = email;
      if (role) updateData.role = role;

      // Hash password jika disediakan
      if (password) {
          updateData.password = await hashPassword(password);
      }

      // Update user di database
      const result = await User.updateUser(id, updateData);

      if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'User tidak ditemukan atau tidak ada perubahan.' });
      }

      res.status(200).json({ message: 'User berhasil diperbarui.' });
  } catch (error) {
      console.error('Error updating user:', error.message);
      res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui user.' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
      const users = await User.getAllUsers();
      res.status(200).json(users);
  } catch (error) {
      console.error('Error fetching all users:', error.message);
      res.status(500).json({ message: 'Error fetching all users.' });
  }
};

// Hapus user
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await User.deleteById(id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
        }

        res.status(200).json({ message: 'Pengguna berhasil dihapus.' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user.' });
    }
};