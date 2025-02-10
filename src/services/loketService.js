// src\services\loketService.js
import { runQuery } from '../utils/mysqlConnection';

export async function getLoketList() {
    try {
      const query = `SELECT * FROM loket`;
      const loketList = await runQuery(query);
      return loketList;
    } catch (error) {
      console.error('Error fetching active loket list:', error.message);
      throw new Error('Error fetching active loket list');
    }
  }
  
  
  export async function getActiveLoketList() {
    try {
      const query = `SELECT * FROM loket WHERE status = 'active'`;
      const loketList = await runQuery(query);
      return loketList;
    } catch (error) {
      console.error('Error fetching active loket list:', error.message);
      throw new Error('Error fetching active loket list');
    }
  }

  export async function getInactiveLoketList() {
    try {
      const query = `SELECT * FROM loket WHERE status = 'inactive'`;
      const loketList = await runQuery(query);
      return loketList;
    } catch (error) {
      console.error('Error fetching active loket list:', error.message);
      throw new Error('Error fetching active loket list');
    }
  }

  
// Function to assign a user to a loket
export async function assignUserToLoketWithToken(loketId, token) {
  try {
    if (!loketId || !Number.isInteger(Number(loketId)) || loketId <= 0) {
      throw new Error('Invalid loketId');
    }

    const userResponse = await fetch('http://192.168.6.79:3000/api/auth/me', {
      headers: {
        'x-token': token,
      },
    });

    if (!userResponse.ok) {
      const errorDetails = await userResponse.text();
      console.error(`Failed to fetch user data: ${errorDetails}`);
      throw new Error(`Failed to fetch user data: ${userResponse.statusText}`);
    }

    const userData = await userResponse.json();
    const userId = userData.id;

    if (!userId) {
      throw new Error('User ID not found in /me response');
    }

    const loketCheckQuery = `SELECT user_id, status FROM loket WHERE id = ?`;
    const [loketData] = await runQuery(loketCheckQuery, [loketId]);

    if (!loketData) {
      throw new Error(`Loket ${loketId} does not exist.`);
    }

    if (loketData.user_id !== null && loketData.status === 'active') {
      if (loketData.user_id !== userId) {
        throw new Error(`Loket ${loketId} Sedang Digunakan.`);
      }
    }

    const assignQuery = `UPDATE loket SET user_id = ?, status = 'active' WHERE id = ?`;
    const result = await runQuery(assignQuery, [userId, loketId]);

    if (result.affectedRows === 0) {
      throw new Error(`Failed to assign Loket ${loketId}.`);
    }

    return { message: `User ID '${userId}' successfully assigned to Loket ID '${loketId}'` };
  } catch (error) {
    console.error('Error assigning user to loket:', error.message);
    throw new Error(error.message || 'Error assigning user to loket');
  }
}
  
  export async function getLoketById(loketId) {
    try {
      const query = `SELECT * FROM loket WHERE id = ?`;
      const loket = await runQuery(query, [loketId]);
  
      if (loket.length === 0) {
        throw new Error(`Loket with ID '${loketId}' not found.`);
      }
  
      return loket[0];
    } catch (error) {
      console.error('Error fetching loket by ID:', error.message);
      throw new Error('Error fetching loket by ID');
    }
  }
  
  
  export async function updateLoketStatus(loketId, status) {
    try {
      if (!['active', 'inactive'].includes(status)) {
        throw new Error(`Status '${status}' is invalid. Valid statuses are 'active' and 'inactive'.`);
      }
  
      if (!loketId || isNaN(loketId)) {
        throw new Error('Invalid Loket ID');
      }
  
      // Check if loket exists
      const loketExistsQuery = `SELECT COUNT(*) AS count FROM loket WHERE id = ?`;
      const [loketExists] = await runQuery(loketExistsQuery, [loketId]);
      if (loketExists.count === 0) {
        throw new Error(`Loket with ID '${loketId}' does not exist.`);
      }
  
      const query = `UPDATE loket SET status = ? WHERE id = ?`;
      const result = await runQuery(query, [status, loketId]);
  
      return { message: `Loket ID '${loketId}' status updated to '${status}'` };
    } catch (error) {
      console.error('Error updating loket status:', error.message);
      throw new Error('Error updating loket status');
    }
  }
    
  
  export async function clearUserFromLoket(loketId) {
    try {
      const query = `UPDATE loket SET user_id = NULL, status = 'inactive' WHERE id = ?`;
      const result = await runQuery(query, [loketId]);
  
      if (result.affectedRows === 0) {
        throw new Error(`Loket with ID '${loketId}' not found.`);
      }
  
      return { message: `User cleared from Loket ID '${loketId}' and status set to 'inactive'.` };
    } catch (error) {
      console.error('Error clearing user from loket:', error.message);
      throw new Error('Error clearing user from loket');
    }
  }
  
  
  
  export async function createLoket(name, description, status = 'active') {
    try {
      if (!name || name.trim() === '') {
        throw new Error('Loket name is required');
      }
  
      if (!description || description.trim() === '') {
        throw new Error('Loket description is required');
      }
  
      if (!['active', 'inactive'].includes(status)) {
        throw new Error(`Status '${status}' is invalid. Valid statuses are 'active' and 'inactive'.`);
      }
  
      const query = `
        INSERT INTO loket (name, description, status)
        VALUES (?, ?, ?)
      `;
      const result = await runQuery(query, [name.trim(), description.trim(), status]);
      return { message: 'Loket created successfully', id: result.insertId };
    } catch (error) {
      console.error('Error creating loket:', error.message);
      throw new Error('Error creating loket');
    }
  }
    