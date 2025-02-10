// src\app\components\kiosk\Keyboard.js'use client';

import { useState,useEffect } from 'react';
import { Box, Grid2, Button, TextField } from '@mui/material';
import { useRouter } from 'next/navigation'; // Corrected import from next/router
import { useNonpk } from '../../../context/NonpkContext';


const Keyboard = ({ value, onChange, onSubmit }) => {
  const [inputValue, setInputValue] = useState(value || '');
  const { nonpk, setNonpk } = useNonpk(); // Use context to store NPK
  const router = useRouter(); // Initialize the router

  // Sinkronkan `inputValue` saat `value` berubah
  useEffect(() => {
    setInputValue(value || '');
  }, [value]);


  const handleButtonClick = (value) => {
    if (inputValue.length >= 15) return;
    if (/^[A-Za-z0-9]$/.test(value)) {
      const newValue = inputValue + value;
      setInputValue(newValue);
      onChange(newValue); // Update parent component
      setNonpk(newValue); // Update context
    }
  };
    
  
  const handleDelete = () => {
    const newValue = inputValue.slice(0, -1);
    setInputValue(newValue);
    onChange(newValue); // Pastikan nilai di Context diperbarui
  };
  
  const handleClear = () => {
    setInputValue('');
    onChange(''); // Reset nilai di Context menjadi kosong
  };
  
  const handleEnter = () => {
    if (/^[A-Za-z0-9]{3,15}$/.test(inputValue)) {
      setNonpk(inputValue); // Save input value to context
      onSubmit(); // Trigger submit
    } else {
      alert('Nomor NPK yang Anda Input Belum Benar');
    }
  };
  
  return (
    <Box textAlign="center" p={2}>
      <TextField
        label="Nomor Pokok Karyawan"
        variant="outlined"
        value={inputValue}
        fullWidth
        InputProps={{
          readOnly: true,
        }}
        sx={{
          mb: 2,
          border: '2px solid #f00',
          borderRadius: '10px',
          '& .MuiOutlinedInput-root': {
            borderRadius: '10px',
          },
          '& .MuiOutlinedInput-input': {
            textAlign: 'center',
            fontSize: '1.5rem',
          },
        }}
      />
      <Box display="flex" justifyContent="center">
        <Grid2 container spacing={1} justifyContent="center" maxWidth="md">
          {/* Row 1: Numbers 1234567890 */}
          <Grid2 container item xs={12} justifyContent="center">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((number) => (
              <Grid2 item xs={1} key={number}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleButtonClick(number)}
                  sx={{
                    backgroundColor: '#fff',
                    color: '#000',
                    borderRadius: '15px',
                    fontSize: '1.5rem',
                    height: '60px',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      backgroundColor: '#f0f0f0',
                    },
                  }}
                >
                  {number}
                </Button>
              </Grid2>
            ))}
          </Grid2>

          {/* Row 2: Letters QWERTYUIOP */}
          <Grid2 container item xs={12} justifyContent="center">
            {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map((letter) => (
              <Grid2 item xs={1.2} key={letter}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleButtonClick(letter)}
                  sx={{
                    backgroundColor: '#fff',
                    color: '#000',
                    borderRadius: '15px',
                    fontSize: '1.5rem',
                    height: '60px',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      backgroundColor: '#f0f0f0',
                    },
                  }}
                >
                  {letter}
                </Button>
              </Grid2>
            ))}
          </Grid2>

          {/* Row 3: Letters ASDFGHJKL */}
          <Grid2 container item xs={12} justifyContent="center">
            {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'].map((letter) => (
              <Grid2 item xs={1.2} key={letter}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleButtonClick(letter)}
                  sx={{
                    backgroundColor: '#fff',
                    color: '#000',
                    borderRadius: '15px',
                    fontSize: '1.5rem',
                    height: '60px',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      backgroundColor: '#f0f0f0',
                    },
                  }}
                >
                  {letter}
                </Button>
              </Grid2>
            ))}
          </Grid2>

          {/* Row 4: Letters ZXCVBNM and Delete */}
          <Grid2 container item xs={12} justifyContent="center">
            {['Z', 'X', 'C', 'V', 'B', 'N', 'M'].map((letter) => (
              <Grid2 item xs={1.2} key={letter}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleButtonClick(letter)}
                  sx={{
                    backgroundColor: '#fff',
                    color: '#000',
                    borderRadius: '15px',
                    fontSize: '1.5rem',
                    height: '60px',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      backgroundColor: '#f0f0f0',
                    },
                  }}
                >
                  {letter}
                </Button>
              </Grid2>
            ))}
            <Grid2 item xs={1.2}>
              <Button
                variant="contained"
                color="warning"
                fullWidth
                onClick={handleDelete}
                sx={{
                  backgroundColor: '#ff4c4c',
                  color: '#fff',
                  borderRadius: '15px',
                  fontSize: '1.5rem',
                  height: '60px',
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    backgroundColor: '#ff1c1c',
                  },
                }}
              >
                Hapus
              </Button>
            </Grid2>
          </Grid2>

          {/* Row 5: Clear, Space, Enter */}
          <Grid2 container item xs={12} justifyContent="center">
            {/* Tombol bersihkan */}
            <Grid2 item xs={3}>
              <Button
                variant="contained"
                color="error"
                fullWidth
                onClick={handleClear}
                sx={{
                  backgroundColor: '#ff9800',
                  color: '#fff',
                  borderRadius: '15px',
                  fontSize: '1.5rem',
                  height: '60px',
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    backgroundColor: '#ffb74d',
                  },
                }}
              >
                Bersihkan
              </Button>
            </Grid2>
            {/* Tombol space */}
            <Grid2 item xs={3}>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: '#4c9eff',
                  color: '#fff',
                  borderRadius: '15px',
                  fontSize: '1.5rem',
                  height: '60px',
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    backgroundColor: '#1c7fff',
                  },
                }}
              >
                Spasi
              </Button>
            </Grid2>
            {/* Tombol enter */}
            <Grid2 item xs={3}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleEnter} // On enter click, navigate to /karyawan
                sx={{
                  backgroundColor: '#4caf50',
                  color: '#fff',
                  borderRadius: '15px',
                  fontSize: '1.5rem',
                  height: '60px',
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    backgroundColor: '##388e3c',
                  },
                }}
              >
                Kirim
              </Button>
            </Grid2>
          </Grid2>
        </Grid2>
      </Box>
    </Box>
  );
};

export default Keyboard;