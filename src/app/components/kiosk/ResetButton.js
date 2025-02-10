//src\app\components\kiosk\ResetButton.js
'use client';

import React, { useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function ResetButton() {
    axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const handleReset = async () => {
        try {
            const response = await axios.post('/reset/reset-all'); // Endpoint benar dari backend
            const data = response.data;
    
            if (response.status === 200) {
                Swal.fire({
                    title: 'Berhasil',
                    text: 'Nomor antrean berhasil direset.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                });
                console.log('Nomor antrean berhasil direset!', data);
            } else {
                Swal.fire({
                    title: 'Gagal',
                    text: data.message || 'Gagal mereset nomor antrean.',
                    icon: 'error',
                });
                console.error(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error resetting nomor antrean:', error);
            Swal.fire({
                title: 'Error',
                text: 'Terjadi kesalahan saat mereset nomor antrean.',
                icon: 'error',
            });
        }
    };

    // Reset otomatis setiap 1 jam

    // Sembunyikan tombol dari tampilan
    return (
        <button
            onClick={handleReset}
            style={{
                display: 'none', // Sembunyikan tombol agar tidak terlihat
            }}
        >
            Reset Nomor Antrean
        </button>
       /*  untuk tombol reset manual
         return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
                onClick={handleReset}
                style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: '#007BFF',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
                }}
            >
                Reset Nomor Antrean
            </button>
        </div>*/ 
        
    );
}

export default ResetButton;