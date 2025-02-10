import { selectDatabase, runQuery } from '../../utils/mysqlConnection';
import { createTables, initialData } from '../../utils/setupQueries';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Membuat database jika belum ada
      await runQuery('CREATE DATABASE IF NOT EXISTS paseban');
      await selectDatabase('paseban');

      // Membuat tabel jika belum ada
      await runQuery(createTables.queueLogs);
      await runQuery(createTables.users);
      await runQuery(createTables.queueTypes);
      await runQuery(createTables.antrianCounter);
      await runQuery(createTables.loket);
      await runQuery(createTables.refreshTokens);
      await runQuery(createTables.blacklistTokens);
      await runQuery(createTables.resetLogs);

      // Mengisi data awal untuk queueTypes
      for (const data of initialData.queueTypes) {
        await runQuery(
          `INSERT INTO queueTypes (userType, serviceType, queueCode) VALUES (?, ?, ?) 
           ON DUPLICATE KEY UPDATE queueCode = VALUES(queueCode)`,
          [data.userType, data.serviceType, data.queueCode]
        );
      }

      // Mengisi data awal untuk users
      for (const data of initialData.users) {
        await runQuery(
          `INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?) 
           ON DUPLICATE KEY UPDATE email = VALUES(email), role = VALUES(role)`,
          [data.username, data.password, data.email, data.role]
        );
      }

      // Mengisi data awal untuk antrian_counter
      for (const data of initialData.antrianCounter) {
        await runQuery(
          `INSERT INTO antrian_counter (pasienType, serviceType, counter) VALUES (?, ?, ?)
           ON DUPLICATE KEY UPDATE counter = VALUES(counter)`,
          [data.pasienType, data.serviceType, data.counter]
        );
      }

      // Mengisi data awal untuk loket
for (const data of initialData.loket) {
  await runQuery(
    `INSERT INTO loket (name, description, user_id, status) VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE name = VALUES(name), status = VALUES(status)`,
    [data.name, data.description, data.user_id, data.status]
  );
}


      res.status(200).json({ message: 'Database setup completed!' });
    } catch (error) {
      console.error('Error in database setup:', error.message);
      res.status(500).json({ error: 'Setup error: ' + error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}