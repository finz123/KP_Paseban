//controllers\loketController.js
const Loket = require('../models/loket');

// Mendapatkan semua loket
exports.getAllLoket = async (req, res) => {
    try {
        const loketList = await Loket.getAll();
        res.status(200).json(loketList);
    } catch (error) {
        console.error('Error fetching all lokets:', error.message);
        res.status(500).json({ message: 'Error fetching lokets' });
    }
};

// Mendapatkan loket aktif
exports.getActiveLoket = async (req, res) => {
    try {
        const activeLokets = await Loket.getActive();
        res.status(200).json(activeLokets);
    } catch (error) {
        console.error('Error fetching active lokets:', error.message);
        res.status(500).json({ message: 'Error fetching active lokets' });
    }
};

// Mendapatkan loket tidak aktif
exports.getInactiveLoket = async (req, res) => {
    try {
        const inactiveLokets = await Loket.getInactive();
        res.status(200).json(inactiveLokets);
    } catch (error) {
        console.error('Error fetching inactive lokets:', error.message);
        res.status(500).json({ message: 'Error fetching inactive lokets' });
    }
};

// Memperbarui status loket
exports.updateLoketStatus = async (req, res) => {
    try {
        const { loketId, status } = req.body;

        if (!loketId || !['active', 'inactive'].includes(status)) {
            return res.status(400).json({ message: 'Loket ID dan status valid diperlukan.' });
        }

        const result = await Loket.updateStatus(loketId, status);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Loket tidak ditemukan.' });
        }

        // Emit event to clients
        const io = req.app.get('socketio');
        io.emit('loket_status_updated', { loketId, status });

        res.status(200).json({ message: 'Status loket berhasil diperbarui.' });
    } catch (error) {
        console.error('Error updating loket status:', error.message);
        res.status(500).json({ message: 'Error updating loket status' });
    }
};

// Menugaskan user ke loket
exports.assignUserToLoket = async (req, res) => {
    try {
        const { loketId, userId } = req.body;

        if (!loketId || !userId) {
            return res.status(400).json({ message: 'Loket ID dan User ID diperlukan.' });
        }

        const result = await Loket.assignUser(loketId, userId);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Loket tidak ditemukan.' });
        }

        // Emit event to clients
        const io = req.app.get('socketio');
        io.emit('loket_user_assigned', { loketId, userId });

        res.status(200).json({ message: 'User berhasil ditugaskan ke loket.' });
    } catch (error) {
        console.error('Error assigning user to loket:', error.message);
        res.status(500).json({ message: 'Error assigning user to loket' });
    }
};

// Menghapus user dari loket
exports.clearUserFromLoket = async (req, res) => {
    try {
        const { loketId } = req.body;

        if (!loketId) {
            return res.status(400).json({ message: 'Loket ID diperlukan.' });
        }

        const result = await Loket.clearUser(loketId);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Loket tidak ditemukan.' });
        }

        // Emit event to clients
        const io = req.app.get('socketio');
        io.emit('loket_user_cleared', { loketId });

        res.status(200).json({ message: 'User berhasil dihapus dari loket.' });
    } catch (error) {
        console.error('Error clearing user from loket:', error.message);
        res.status(500).json({ message: 'Error clearing user from loket' });
    }
};
