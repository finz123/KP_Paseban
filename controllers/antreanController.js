//controllers\antreanController.js
const QueueTypes = require('../models/queueTypes');
const QueueLogs = require('../models/QueueLog');
const AntrianCounter = require('../models/antrianCounter');

async function createAntrean(req, res) {
  try {
    const { pasienType, serviceType, nonpk } = req.body;
    console.log(req.body)

    // Step 1: Get queue code
    const queueTypeResults = await QueueTypes.getByType(pasienType, serviceType);
    if (queueTypeResults.length === 0) {
      return res.status(400).json({ message: 'Invalid pasienType or serviceType' });
    }
    const queueCode = queueTypeResults[0].queueCode;

    // Step 2: Increment or create counter
    const counterResults = await AntrianCounter.getByType(pasienType, serviceType);
    let newCounter = 1;
    if (counterResults.length > 0) {
      await AntrianCounter.incrementCounter(pasienType, serviceType);
      newCounter = counterResults[0].counter + 1;
    } else {
      await AntrianCounter.createCounter(pasienType, serviceType);
    }

    // Step 3: Generate queue number
    const nomorAntrean = `${queueCode}-${String(newCounter).padStart(3, '0')}`;

    // Step 4: Generate timestamp for `waiting_stamp` in local time (+7 timezone)
    const now = new Date();
    const options = { timeZone: 'Asia/Jakarta', hour12: false };
    const waitingStamp = new Intl.DateTimeFormat('en-GB', {
      ...options,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(now).replace(/,/, '').replace(/\/|-/g, '-'); // Format ke 'YYYY-MM-DD HH:mm:ss'

    // Step 5: Insert into queueLogs
    const antreanData = {
      nonpk: nonpk || '',
      nomorAntrean,
      serviceType,
      pasienType,
      waiting_stamp: waitingStamp,
      status: 'waiting',
    };
    const result = await QueueLogs.create(antreanData);

    // Emit event to connected clients via Socket.IO
    const io = req.app.get('socketio'); // Get Socket.IO instance
    io.emit('new_antrean', {
      message: 'Antrean created successfully',
      nomorAntrean,
      waiting_stamp: waitingStamp,
      id: result.insertId,
    });

    return res.status(201).json({
      message: 'Antrean created successfully',
      nomorAntrean,
      waiting_stamp: waitingStamp,
      id: result.insertId,
    });
  } catch (error) {
    console.error('Error creating antrean:', error.message);
    return res.status(500).json({ message: 'Error creating antrean' });
  }
}

async function getAllAntrean(req, res) {
  try {
    const antreanList = await QueueLogs.getAll();
    return res.status(200).json(antreanList);
  } catch (error) {
    console.error('Error fetching antrean:', error.message);
    return res.status(500).json({ message: 'Error fetching antrean' });
  }
}

async function getAntreanToday(req, res) {
    try {
      const antreanList = await QueueLogs.getToday();
      return res.status(200).json(antreanList);
    } catch (error) {
      console.error('Error fetching antrean for today:', error.message);
      return res.status(500).json({ message: 'Error fetching antrean for today' });
    }
  }
  
async function updateLoket(req, res) {
    try {
      const { nomorAntrean, loket } = req.body;
  
      if (!nomorAntrean || !loket) {
        return res.status(400).json({ message: 'Nomor antrean dan loket wajib diisi.' });
      }
  
      const result = await QueueLogs.updateLoketByNomorAntrean(nomorAntrean, loket); // Perbaikan di sini
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Nomor antrean tidak ditemukan.' });
      }
  
      // Emit event to notify clients about loket update
      const io = req.app.get('socketio');
      io.emit('loket_updated', {
        nomorAntrean,
        loket,
      });
  
      return res.status(200).json({ message: 'Loket berhasil diperbarui.' });
    } catch (error) {
      console.error('Error updating loket:', error.message);
      return res.status(500).json({ message: 'Error updating loket' });
    }
  }

  async function updateStatus(req, res) {
     try {
        const { nomorAntrean, status } = req.body;

        // Validasi input
        if (!nomorAntrean || !status) {
            return res.status(400).json({ message: 'Nomor antrean dan status wajib diisi.' });
        }

        const validStatuses = ['waiting','recalled', 'called', 'processed', 'pending', 'cancelled', 'completed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Status tidak valid.' });
        }

        // Update status di database
        const result = await QueueLogs.updateStatus(nomorAntrean, status);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Nomor antrean tidak ditemukan atau tidak sesuai dengan tanggal hari ini.' });
        }

        // Emit event ke client via Socket.IO
        const io = req.app.get('socketio');
        io.emit('status_updated_today_by_nomorAntrean', { nomorAntrean, status });

        return res.status(200).json({
            message: `Status antrean ${nomorAntrean} berhasil diperbarui ke '${status}'.`,
            updatedRows: result.affectedRows,
        });
    } catch (error) {
        console.error('Error updating status for today by nomorAntrean:', error.message);
        return res.status(500).json({ message: 'Error updating status for today by nomorAntrean' });
    }
}
  
  async function updateUserId(req, res) {
    try {
        const { nomorAntrean, userId } = req.body;

        if (!nomorAntrean || !userId) {
            return res.status(400).json({ message: 'Nomor antrean dan userId wajib diisi.' });
        }

        const result = await QueueLogs.updateUserIdByNomorAntrean(nomorAntrean, userId);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Nomor antrean tidak ditemukan.' });
        }

        return res.status(200).json({ message: 'User ID berhasil diperbarui.' });
    } catch (error) {
        console.error('Error updating user ID:', error.message);
        return res.status(500).json({ message: 'Error updating user ID' });
    }
}

module.exports = { createAntrean, 
  getAllAntrean, 
  getAntreanToday, 
  updateLoket, 
  updateStatus, 
  updateUserId };
