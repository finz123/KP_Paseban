// src/app/components/kiosk/MenuDropdown.js

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // For Next.js 13+
import { Button, Menu, MenuItem } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Swal from 'sweetalert2';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://192.168.6.79:3100';

const MenuDropdown = ({ role, username }) => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
    
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    if (role === 'admin') {
      router.push('/login/loket/admin'); // Navigate to account management page
    }
    handleMenuClose();
  };

  const handleKinerjaClick = () => {
    if (role === 'admin') {
      router.push('/login/loket/admin/kinerja'); // Navigate to performance page
    }
    handleMenuClose();
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      const currentLoket = localStorage.getItem('selectedLoket');

      if (!token) {
        Swal.fire('Error', 'Token not found', 'error');
        return;
      }

      // Reset Loket if one is selected
      if (currentLoket) {
        try {
          const clearLoketResponse = await fetch(`${BASE_URL}/loket/${currentLoket}/clear`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (clearLoketResponse.ok) {
            console.log(`Loket ${currentLoket} has been reset.`);
          } else {
            const errorData = await clearLoketResponse.json();
            console.warn(`Failed to reset Loket ${currentLoket}:`, errorData.message);
            Swal.fire('Error', `Failed to reset Loket ${currentLoket}.`, 'error');
          }
        } catch (error) {
          console.error(`Error during Loket reset:`, error.message);
          Swal.fire('Error', `An error occurred while resetting Loket ${currentLoket}.`, 'error');
        }
      }

      // Perform logout
      const logoutResponse = await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'x-token': token,
          'Content-Type': 'application/json',
        },
      });

      if (logoutResponse.ok) {
        Swal.fire({
          title: 'Logout Successful',
          text: 'You have been logged out.',
          icon: 'success',
          timer: 2000, // Swal otomatis hilang setelah 2 detik
          showConfirmButton: false, // Sembunyikan tombol "OK"
          timerProgressBar: true, // Tampilkan progress bar
        });
        
        
        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('selectedLoket');
        localStorage.removeItem('queues');
        localStorage.removeItem('pendingQueues');
        localStorage.removeItem('currentQueue');

        // Reload to stop any ongoing processes
        if (typeof window !== 'undefined') {
          window.location.reload();
        }

        console.clear();
        router.push('/login');
      } else {
        const errorData = await logoutResponse.json();
        Swal.fire('Error', errorData.message || 'Logout failed.', 'error');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      Swal.fire('Error', 'An error occurred during logout.', 'error');
      localStorage.removeItem('token');
      localStorage.removeItem('selectedLoket');
      console.clear();
      router.push('/login');
    }
  };

  return (
    <>
      <Button
        id="menu-button"
        aria-controls={open ? 'menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleMenuClick}
        startIcon={<AccountCircleIcon />}
        style={{
          position: 'absolute',
          top: '50px',
          right: '60px',
          fontSize: '1rem',
          backgroundColor: '#00796b',
          color: '#fff',
          borderRadius: '30px',
          padding: '10px 40px',
        }}
      >
        Menu
      </Button>
      <Menu
        id="menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        MenuListProps={{
          'aria-labelledby': 'menu-button',
        }}
      >
        {role === 'admin' ? (
          <MenuItem onClick={handleProfileClick}>Manajemen Akun</MenuItem>
        ) : (
          <MenuItem disabled>Manajemen Akun</MenuItem>
        )}
        {role === 'admin' ? (
          <MenuItem onClick={handleKinerjaClick}>Kinerja Pelayanan</MenuItem>
        ) : (
          <MenuItem disabled>Kinerja Pelayanan</MenuItem>
        )}
        <MenuItem onClick={handleLogout}>
          <LogoutIcon style={{ marginRight: '8px' }} />
          Keluar
        </MenuItem>
      </Menu>
    </>
  );
};

export default MenuDropdown;
