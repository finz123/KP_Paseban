// src/services/antreanService.js
import { runQuery } from '../utils/mysqlConnection';

// Define valid statuses
const validStatuses = ['waiting', 'called', 'pending', 'recalled', 'completed', 'processed', 'cancelled'];

// Generate queue number by interacting with MySQL
export async function generateNomorAntrean(pasienType, serviceType) {
  try {
    // Retrieve queueCode based on pasienType and serviceType
    const queueCodeQuery = `SELECT queueCode FROM queueTypes WHERE userType = ? AND serviceType = ?`;
    const queueCodeResults = await runQuery(queueCodeQuery, [pasienType, serviceType]);
    const kodePrefix = queueCodeResults[0]?.queueCode;

    if (!kodePrefix) throw new Error(`No matching queue code for pasienType '${pasienType}' and serviceType '${serviceType}'`);

    // Retrieve or update counter for given pasienType and serviceType
    const counterQuery = `SELECT counter FROM antrian_counter WHERE pasienType = ? AND serviceType = ?`;
    const counterResults = await runQuery(counterQuery, [pasienType, serviceType]);
    let newCounter = 1;

    if (counterResults.length > 0) {
      newCounter = counterResults[0].counter + 1;
      const updateCounterQuery = `UPDATE antrian_counter SET counter = ? WHERE pasienType = ? AND serviceType = ?`;
      await runQuery(updateCounterQuery, [newCounter, pasienType, serviceType]);
    } else {
      const insertCounterQuery = `INSERT INTO antrian_counter (pasienType, serviceType, counter) VALUES (?, ?, ?)`;
      await runQuery(insertCounterQuery, [pasienType, serviceType, newCounter]);
    }

    return `${kodePrefix}-${String(newCounter).padStart(3, '0')}`;
  } catch (error) {
    console.error('Error generating nomor antrean:', error);
    throw new Error('Error generating nomor antrean');
  }
}

// Create a queue entry by calling MySQL
export async function createAntreanOtomatis(pasienType, serviceType, nonpk = null) {
  try {
    const nomorAntrean = await generateNomorAntrean(pasienType, serviceType);
    
    // Jika nonpk tidak tersedia, gunakan nilai default
    const nonpkValue = nonpk || '';

    const query = `INSERT INTO queueLogs (nonpk, nomorAntrean, serviceType, pasienType, status, waiting_stamp)
                   VALUES (?, ?, ?, ?, 'waiting', NOW())`;
    const result = await runQuery(query, [nonpkValue, nomorAntrean, serviceType, pasienType]);
    return { message: 'Antrean created successfully', id: result.insertId, nomorAntrean };
  } catch (error) {
    console.error('Error in createAntreanOtomatis:', error);
    throw new Error('Error creating antrean otomatis');
  }
}



// Update queue status in MySQL with status validation
export async function updateAntreanStatus(nomorAntrean, newStatus) {
  try {
    // Validasi status baru
    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Status '${newStatus}' is not valid.`);
    }

    // Tentukan kolom timestamp berdasarkan status
    let timestampColumn = null;
    switch (newStatus) {
      case 'waiting':
        timestampColumn = 'waiting_stamp';
        break;
      case 'called':
        timestampColumn = 'called_stamp';
        break;
      case 'processed':
        timestampColumn = 'processed_stamp';
        break;
      case 'completed':
        timestampColumn = 'complete_stamp';
        break;
      case 'pending':
        timestampColumn = 'no_show_stamp';
        break;
      case 'cancelled':
        timestampColumn = 'cancel_stamp';
        break;
    
      default:
        timestampColumn = null; // Tidak ada kolom timestamp untuk status lain
    }

    // Query untuk memperbarui status antrean
    let query = `UPDATE queueLogs SET status = ?`;
    const queryParams = [newStatus, nomorAntrean];

    // Tambahkan timestamp jika ada kolom yang relevan
    if (timestampColumn) {
      query += `, ${timestampColumn} = NOW()`;
    }
    query += ` WHERE nomorAntrean = ?`;

    const result = await runQuery(query, queryParams);

    // Cek apakah ada antrean yang berhasil diperbarui
    if (result.affectedRows === 0) {
      throw new Error(`Queue with number '${nomorAntrean}' not found.`);
    }

    return { message: `Queue '${nomorAntrean}' status updated to '${newStatus}'`, status: newStatus };
  } catch (error) {
    console.error('Error updating antrean status:', error);
    throw new Error('Error updating antrean status');
  }
}

// Update the loket for a specific queue entry in MySQL
export async function updateAntreanLoket(nomorAntrean, loketName) {
  try {
    const query = `UPDATE queueLogs SET loket = ? WHERE nomorAntrean = ?`;
    await runQuery(query, [loketName, nomorAntrean]);
    return { message: 'Loket updated successfully' };
  } catch (error) {
    console.error('Error updating loket:', error);
    throw new Error('Error updating loket');
  }
}

export async function updateAntreanUserId(nomorAntrean, userId) {
  try {
    // Query untuk memperbarui kolom user_id di queueLogs
    const query = `UPDATE queueLogs SET user_id = ? WHERE nomorAntrean = ?`;
    const queryParams = [userId, nomorAntrean];

    const result = await runQuery(query, queryParams);

    // Periksa apakah ada antrean yang berhasil diperbarui
    if (result.affectedRows === 0) {
      throw new Error(`Queue with number '${nomorAntrean}' not found.`);
    }

    return { message: `Queue '${nomorAntrean}' user_id updated to '${userId}'`, userId };
  } catch (error) {
    // Tangani error jika terjadi pelanggaran constraint foreign key
    if (error.message.includes("foreign key constraint fails")) {
      console.error(`User with ID '${userId}' does not exist.`);
      throw new Error(`User with ID '${userId}' does not exist.`);
    }
    console.error('Error updating user_id in antrean:', error);
    throw new Error('Error updating user_id in antrean');
  }
}


// Fungsi untuk melakukan reset antrean
export async function resetAllNomorAntrean() {
  try {
    // Periksa apakah reset sudah dilakukan dalam 24 jam terakhir
    const checkQuery = `
      SELECT reset_time 
      FROM reset_logs 
      WHERE reset_time >= NOW() - INTERVAL 1 DAY AND status = 'SUCCESS'
    `;
    const result = await runQuery(checkQuery);

    if (result.length > 0) {
      console.log('Reset already performed in the last 24 hours.');
      return { message: 'Reset already performed in the last 24 hours.' };
    }

    // Lakukan reset antrean
    const resetQuery = `UPDATE antrian_counter SET counter = 0`;
    await runQuery(resetQuery);

    // Menyimpan log berhasil
    const logQuery = `
      INSERT INTO reset_logs (reset_time, status, message)
      VALUES (NOW(), 'SUCCESS', 'Reset completed successfully')
    `;
    await runQuery(logQuery);

    console.log('Antrean berhasil di-reset.');
    return { message: 'All queue counters reset successfully' };
  } catch (error) {
    console.error('Error resetting all nomor antrean:', error);

    // Menyimpan log gagal
    const errorLogQuery = `
      INSERT INTO reset_logs (reset_time, status, message)
      VALUES (NOW(), 'FAILED', ?)
    `;
    await runQuery(errorLogQuery, [error.message]);

    throw new Error('Error resetting all nomor antrean');
  }
}

// Fungsi untuk mengecek apakah reset sudah dilakukan pada waktu tertentu
export async function checkResetStatus(date) {
  try {
    const checkQuery = `
      SELECT reset_time 
      FROM reset_logs 
      WHERE DATE(reset_time) = ? AND status = 'SUCCESS'
    `;
    const result = await runQuery(checkQuery, [date]);

    return result.length > 0; // Jika ada log untuk tanggal itu, berarti sudah di-reset
  } catch (error) {
    console.error('Error checking reset status:', error);
    throw error;
  }
}


// Fetch all queues from MySQL
export async function getAntreanList() {
  try {
    const query = `SELECT * FROM queueLogs`;
    const antreanList = await runQuery(query);
    return antreanList;
  } catch (error) {
    console.error('Error fetching antrean list:', error.message);
    throw new Error(`Error fetching antrean list: ${error.message}`);
  }
}

// Fungsi untuk mereset status antrean dari "pending" ke "cancelled" untuk hari yang sama
export async function resetAntreanStatus() {
  try {
    // Periksa apakah reset status sudah dilakukan dalam 24 jam terakhir
    const checkQuery = `
      SELECT reset_time 
      FROM reset_logs 
      WHERE reset_time >= NOW() - INTERVAL 1 DAY AND status = 'SUCCESS' AND message LIKE 'Successfully reset%'
    `;
    const result = await runQuery(checkQuery);

    if (result.length > 0) {
      console.log('Reset status already performed in the last 24 hours.');
      return { message: 'Reset status already performed in the last 24 hours.' };
    }

    // Query untuk memperbarui semua antrean dengan status "pending" ke "cancelled" pada hari ini
    const resetQuery = `
      UPDATE queueLogs
      SET status = 'cancelled', cancel_stamp = NOW()
      WHERE status = 'pending' AND DATE(waiting_stamp) = CURDATE()
    `;
    const resetResult = await runQuery(resetQuery);

    // Periksa apakah ada antrean yang diubah
    if (resetResult.affectedRows === 0) {
      console.log('No pending queues found for today to reset.');
      const logQuery = `
        INSERT INTO reset_logs (reset_time, status, message)
        VALUES (NOW(), 'SUCCESS', 'No pending queues found for today to reset.')
      `;
      await runQuery(logQuery);

      return { message: 'No pending queues found for today to reset.' };
    }

    // Log keberhasilan reset
    const logMessage = `Successfully reset ${resetResult.affectedRows} pending queues to cancelled for today.`;
    const logQuery = `
      INSERT INTO reset_logs (reset_time, status, message)
      VALUES (NOW(), 'SUCCESS', ?)
    `;
    await runQuery(logQuery, [logMessage]);

    console.log(logMessage);
    return { message: logMessage };
  } catch (error) {
    console.error('Error resetting antrean status:', error);

    // Log kesalahan
    const errorLogQuery = `
      INSERT INTO reset_logs (reset_time, status, message)
      VALUES (NOW(), 'FAILED', ?)
    `;
    await runQuery(errorLogQuery, [error.message]);

    throw new Error('Error resetting antrean status');
  }
}