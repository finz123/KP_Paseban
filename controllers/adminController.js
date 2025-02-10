// controllers\adminController.js
const LoginActivity = require('../models/loginActivityModel');

exports.getLoginActivity = async (req, res, next) => {
    try {
        // Menggunakan model LoginActivity untuk mengambil semua aktivitas login
        const activities = await LoginActivity.getAllActivity();

        res.status(200).json(activities);
    } catch (error) {
        next(error);
    }
};
