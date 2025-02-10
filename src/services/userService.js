// src/services/userService.js
import { runQuery } from '../utils/mysqlConnection';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwtUtils';

// Fungsi untuk menghasilkan ID unik
const generateRandomId = async () => {
  while (true) {
    const randomId = Math.floor(1000 + Math.random() * 9000);
    const rows = await runQuery(`SELECT id FROM users WHERE id = ?`, [randomId]);
    if (Array.isArray(rows) && rows.length === 0) {
      return randomId;
    }
  }
};
    
  // Add a new user to the database with a random 4-digit ID
  export async function addUser(username, password, email, role = 'user') {
    try {
      const existingUser = await getUserByUsernameOrEmail(username, email);
      if (existingUser) {
        throw new Error('Username or email already exists');
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const createdAt = new Date();
      const updatedAt = new Date();
  
      // Generate a unique 4-digit ID
      const userId = await generateRandomId();
  
      const result = await runQuery(
        `INSERT INTO users (id, username, password, email, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, username, hashedPassword, email, role, createdAt, updatedAt]
      );
  
      return {
        message: 'User registered',
        userId,
        username,
        email,
        role,
      };
    } catch (error) {
      console.error('Error adding user:', error);
      throw new Error('Error adding user: ' + error.message);
    }
  }

// Check if username or email already exists
export async function getUserByUsernameOrEmail(username, email) {
    try {
      const rows = await runQuery(
        `SELECT id, username, email, role, created_at AS createdAt, updated_at AS updatedAt 
         FROM users 
         WHERE username = ? OR email = ?`,
        [username, email]
      );
  
      return rows.length ? rows[0] : null; // Returns the first match or null if none found
    } catch (error) {
      throw new Error('Error fetching user by username or email: ' + error.message);
    }
  }
    
// Update user details, including username
export async function updateUser(userId, newUsername, newPassword, newEmail, newRole) {
    try {
      const updatedAt = new Date();
  
      const result = await runQuery(
        `UPDATE users SET 
          username = COALESCE(?, username), 
          password = COALESCE(?, password), 
          email = COALESCE(?, email), 
          role = COALESCE(?, role), 
          updated_at = ? 
        WHERE id = ?`,
        [
          newUsername,
          newPassword ? await bcrypt.hash(newPassword, 10) : null,
          newEmail,
          newRole,
          updatedAt,
          userId,
        ]
      );
  
      if (result.affectedRows === 0) {
        throw new Error('User not found');
      }
  
      // Query the updated user to confirm changes and provide accurate response data
      const updatedUser = await getUserById(userId);
  
      return { message: `User ${userId} updated`, ...updatedUser };
    } catch (error) {
      throw new Error('Error updating user: ' + error.message);
    }
  }
    
// Delete a user by ID
export async function deleteUser(userId) {
  try {
    const result = await runQuery(`DELETE FROM users WHERE id = ?`, [userId]);
    if (result.affectedRows === 0) {
      throw new Error('User not found');
    }
    return { message: `User ${userId} deleted` };
  } catch (error) {
    throw new Error('Error deleting user: ' + error.message);
  }
}

// LOGIN USER
export async function loginUser(usernameOrEmail, password) {
  try {
    const rows = await runQuery(
      `SELECT * FROM users WHERE username = ? OR email = ?`,
      [usernameOrEmail, usernameOrEmail]
    );

    // Check if user exists
    if (!rows || rows.length === 0) {
      console.error("User not found for:", usernameOrEmail);
      throw new Error('User not found');
    }

    const user = rows[0];
    console.log("User data from database:", user); // Debug: Check user data structure

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.error("Invalid credentials for user:", usernameOrEmail);
      throw new Error('Invalid credentials');
    }

    // Construct user object to return
    const userData = {
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };

    console.log("User authentication successful:", userData); // Debug: Check response structure
    return { user: userData }; // Return user data only

  } catch (error) {
    console.error('Error logging in user:', error);
    throw new Error(error.message || 'Error logging in user');
  }
}
    
// Get user by ID
export async function getUserById(userId) {
    try {
      const rows = await runQuery(`SELECT * FROM users WHERE id = ?`, [userId]);
      if (rows.length === 0) {
        throw new Error('User not found');
      }
  
      const user = rows[0];
      return {
        userId: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      };
    } catch (error) {
      throw new Error('Error fetching user by ID: ' + error.message);
    }
  }

  export async function getAllUsers() {
    try {
      const rows = await runQuery(`SELECT * FROM users`);
      if (rows.length === 0) {
        return []; // Kembalikan array kosong jika tidak ada data
      }
  
      // Map data menjadi format yang lebih rapi
      return rows.map((user) => ({
        userId: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      }));
    } catch (error) {
      throw new Error('Error fetching all users: ' + error.message);
    }
  }
  