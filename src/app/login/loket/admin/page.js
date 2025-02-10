//src\app\login\loket\admin\page.js
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  TextField,
  Button,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import Header from '../../../components/kiosk/Header';
import Footer from '../../../components/kiosk/footer';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { styled } from '@mui/system';
import Swal from 'sweetalert2';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import socket from '@/utils/socket';

const MovingText = styled(Typography)({
  whiteSpace: 'nowrap',
  display: 'inline-block',
  animation: 'marquee 15s linear infinite',
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: 'green',
  padding: '10px 0',
  textAlign: 'center',
  overflow: 'hidden',
  position: 'relative',
  width: '100%',
  '@keyframes marquee': {
    '0%': { transform: 'translateX(100%)' },
    '100%': { transform: 'translateX(-100%)' },
  },
});

// Define base URL in a separate constant
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3100';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: 'user' });
  const [editUserId, setEditUserId] = useState(null); // For editing user
  const [loading, setLoading] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [username, setUsername] = useState(''); // State untuk username
  const router = useRouter();

  useEffect(() => {
    console.log("Current Edit User ID:", editUserId);
    console.log("Current New User Data:", newUser);
  }, [editUserId, newUser]);
  
  // Fetch users from the API when the component mounts  
  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      setGreeting(
        hour < 10
          ? 'Selamat Pagi'
          : hour < 15
          ? 'Selamat Siang'
          : hour < 18
          ? 'Selamat Sore'
          : 'Selamat Malam'
      );
    };
    updateGreeting();
    const intervalId = setInterval(updateGreeting, 60000);
    return () => clearInterval(intervalId);
  }, []);

// **1. Fetch User Data dari /me**
const fetchUserData = useCallback(async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn("Token not found in localStorage. Redirecting to login...");
    router.push('/login');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/auth/me`, {
      headers: { 'x-token': token, 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      const data = await response.json();
      setUsername(data.username);
    } else {
      console.error("Failed to fetch user data:", response.statusText);
      router.push('/login');
    }
  } catch (error) {
    console.error("Error during user data fetch:", error.message);
    router.push('/login');
  }
}, [router]);

// **2. Fetch All Users**
const fetchUsers = useCallback(async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn("Token tidak ditemukan");
    router.push('/login');
    return;
  }

  try {
    const response = await axios.get(`${BASE_URL}/user/all`, {
      headers: {
        'x-token': token,
        'Content-Type': 'application/json',
      },
    });

    const formattedUsers = response.data.map(user => ({
      ...user,
      userId: user.userId || user.id, // Handle both userId and id fields
    }));
    setUsers(formattedUsers);
  } catch (error) {
    console.error("Error fetching users:", error.response?.data || error.message);
    if (error.response?.status === 403) {
      Swal.fire("Error", "Akses ditolak. Silakan login ulang.", "error");
      router.push('/login');
    }
  }
}, [router]);
      
// Add a new user
const handleAddUser = async () => {
  if (!newUser.username || !newUser.email || !newUser.password || !newUser.role) {
    Swal.fire('Error', 'Semua field harus diisi!', 'warning');
    return;
  }

  const token = localStorage.getItem('token'); // Ambil token dari localStorage
  if (!token) {
    Swal.fire('Error', 'Token tidak ditemukan. Silakan login ulang.', 'error');
    return;
  }

  try {
    setLoading(true);
    const response = await axios.post(
      `${BASE_URL}/user/create`, // Endpoint backend
      newUser,
      {
        headers: {
          'x-token': token, // Token autentikasi
          'Content-Type': 'application/json',
        },
      }
    );

    Swal.fire('Berhasil', 'User berhasil dibuat.', 'success');

    // Emit ke server setelah user berhasil ditambahkan
    socket.emit('userAdded', response.data);

    setUsers([...users, response.data]);
    resetForm(); // Reset form setelah menambahkan user
  } catch (error) {
    console.error('Error adding user:', error);
    Swal.fire('Error', 'Gagal menambahkan user.', 'error');
  } finally {
    setLoading(false);
  }
};

// Delete a user
const handleDeleteUser = async (userId) => {
  if (!userId) {
    Swal.fire('Error', 'ID user tidak valid.', 'error');
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    Swal.fire('Error', 'Token tidak ditemukan. Silakan login ulang.', 'error');
    return;
  }

  try {
    const confirmResult = await Swal.fire({
      title: 'Konfirmasi',
      text: `Apakah Anda yakin ingin menghapus user dengan ID ${userId}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
    });

    if (confirmResult.isConfirmed) {
      setLoading(true);
      await axios.delete(`${BASE_URL}/user/delete/${userId}`, {
        headers: {
          'x-token': token,
          'Content-Type': 'application/json',
        },
      });

      Swal.fire('Berhasil', 'User berhasil dihapus.', 'success');
      setUsers(users.filter((user) => user.userId !== userId));

      // Emit event ke server
      socket.emit('userDeleted', { userId });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    Swal.fire('Error', 'Gagal menghapus user.', 'error');
  } finally {
    setLoading(false);
  }
};

// Reset form
const resetForm = () => {
  setNewUser({ username: '', email: '', password: '', role: 'user' });
  setEditUserId(null);
};

// Update a user
const handleUpdateUser = async () => {
  if (!editUserId) {
    Swal.fire('Error', 'ID user tidak valid.', 'error');
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    Swal.fire('Error', 'Token tidak ditemukan. Silakan login ulang.', 'error');
    return;
  }

  try {
    setLoading(true);
    const response = await axios.put(
      `${BASE_URL}/user/update/${editUserId}`, // Endpoint backend
      {
        username: newUser.username,
        email: newUser.email,
        password: newUser.password || undefined,
        role: newUser.role,
      },
      {
        headers: {
          'x-token': token,
          'Content-Type': 'application/json',
        },
      }
    );

    Swal.fire('Berhasil', 'User berhasil diperbarui.', 'success');
    fetchUsers(); // Refresh daftar user
    resetForm(); // Reset form

    // Emit event ke server
    socket.emit('userUpdated', { userId: editUserId, updatedData: newUser });
  } catch (error) {
    console.error('Error updating user:', error);
    Swal.fire('Error', 'Gagal memperbarui user.', 'error');
  } finally {
    setLoading(false);
  }
};
  
  

  // Handle edit click
  const handleEditClick = (user) => {
    if (!user || !user.userId) {
      console.error("User data is missing or invalid:", user);
      return;
    }
  
    console.log("Editing User ID:", user.id); // Debugging log
    setEditUserId(user.userId); // Set ID user yang sedang diedit
    setNewUser({
      username: user.username || '',
      email: user.email || '',
      password: '', // Kosongkan password
      role: user.role || 'user',
    });

     // Emit event ke server
  socket.emit('userEditing', { userId: user.userId, username: user.username });
  };
  
    
  
  // **4. Kombinasi Fetch Data**
  useEffect(() => {
    fetchUserData();
    fetchUsers(); // Ambil data semua pengguna
  }, [fetchUserData, fetchUsers]);
    
  // Fungsi handleInputChange
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  useEffect(() => {
    fetchUsers();
    fetchUserData(); // Ambil data username dari /me
  
    // Listen for real-time updates
    const handleUserAdded = (newUser) => {
      console.log('User baru ditambahkan:', newUser);
      setUsers((prev) => [...prev, newUser]);
    };
  
    const handleUserUpdated = (updatedUser) => {
      console.log('User diperbarui:', updatedUser);
      setUsers((prev) =>
        prev.map((user) => (user.userId === updatedUser.userId ? updatedUser : user))
      );
    };
  
    const handleUserDeleted = (deletedUserId) => {
      console.log('User dihapus:', deletedUserId);
      setUsers((prev) => prev.filter((user) => user.userId !== deletedUserId));
    };
  
    socket.on('userAdded', handleUserAdded);
    socket.on('userUpdated', handleUserUpdated);
    socket.on('userDeleted', handleUserDeleted);
  
    return () => {
      socket.off('userAdded', handleUserAdded);
      socket.off('userUpdated', handleUserUpdated);
      socket.off('userDeleted', handleUserDeleted);
    };
  }, [fetchUsers, fetchUserData]);

  
  return (
    <>
    {/* Elemen di luar Container */}
    <Header />
    
    <button
  onClick={() => window.location.href = '/login/loket'}
  style={{
    position: 'absolute',
    top: '50px',
    right: '40px',
    fontSize: '1.2rem', // Perbesar teks
    backgroundColor: '#00796b',
    color: '#fff',
    border: 'none',
    borderRadius: '40px', // Sesuaikan sudut bulat
    padding: '15px 30px', // Perbesar ukuran kotak tombol
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px', // Jarak antara ikon dan teks
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Tambahkan bayangan
  }}
>
  <ArrowBackIcon style={{ fontSize: '1.5rem' }} /> {/* Ikon Material UI */}
  Kembali
</button>



    <MovingText>
      {greeting}, {username ? username.toUpperCase() : ''}! Selamat datang di Aplikasi Klinik Pratama Paseban, Salam Sehat 🙏🏼
    </MovingText>
   
      
    {/* Elemen di dalam Container */}
    <Container maxWidth="xl" sx={{ marginTop: 4 }}>
      <Typography variant="h4" sx={{ marginBottom: 3 }}>
        Manajemen Akun
      </Typography>
      {editUserId && (
    <Typography variant="subtitle1" color="secondary">
      Editing User: {newUser.username}
    </Typography>
  )}


      {/* Form Tambah / Edit User */}
      <Box display="flex" gap={2} marginBottom={3}>
        <TextField
          label="Username"
          name="username"
          value={newUser.username}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Email"
          name="email"
          value={newUser.email}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={newUser.password}
          onChange={handleInputChange}
          fullWidth
        />
        <Select name="role" value={newUser.role} onChange={handleInputChange} fullWidth>
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </Select>
        {editUserId ? (
  <Button
    variant="contained"
    color="secondary"
    onClick={handleUpdateUser}
    disabled={loading}
  >
    Update User
  </Button>
) : (
  <Button
    variant="contained"
    color="primary"
    onClick={handleAddUser}
    disabled={loading}
  >
    Add User
  </Button>
)}

      </Box>

      {/* Tabel Data User */}
<Table sx={{ width: '100%', border: '1px solid #ddd', borderRadius: '8px', overflowX: 'auto' }}>
  <TableHead>
    <TableRow>
      {/* Tambahkan kolom User ID */}
      <TableCell sx={{ fontWeight: 'bold', fontSize: '1.2rem', minWidth: 100 }}>
        User ID
      </TableCell>
      <TableCell sx={{ fontWeight: 'bold', fontSize: '1.2rem', minWidth: 150 }}>
        Username
      </TableCell>
      <TableCell sx={{ fontWeight: 'bold', fontSize: '1.2rem', minWidth: 200 }}>
        Email
      </TableCell>
      <TableCell sx={{ fontWeight: 'bold', fontSize: '1.2rem', minWidth: 100 }}>
        Role
      </TableCell>
      <TableCell sx={{ fontWeight: 'bold', fontSize: '1.2rem', minWidth: 150 }}>
        Actions
      </TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {users.map((user) => (
      <TableRow key={user.userId} sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
        {/* Tambahkan data User ID */}
        <TableCell sx={{ fontSize: '1rem', padding: '16px' }}>{user.userId}</TableCell>
        <TableCell sx={{ fontSize: '1rem', padding: '16px' }}>{user.username}</TableCell>
        <TableCell sx={{ fontSize: '1rem', padding: '16px' }}>{user.email}</TableCell>
        <TableCell sx={{ fontSize: '1rem', padding: '16px' }}>{user.role}</TableCell>
        <TableCell sx={{ padding: '16px' }}>
          <IconButton onClick={() => handleEditClick(user)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteUser(user.userId)}>
            <DeleteIcon color="error" />
          </IconButton>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>

    </Container>
    <Footer/>
    </>
  );
}