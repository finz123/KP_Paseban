// src\app\karyawan\nonpk\page.js
'use client';

import { useState, useEffect } from 'react';
import { Container, Grid, Typography, Box, Button } from '@mui/material';
import Keyboard from '../../components/kiosk/Keyboard';
import Image from 'next/image';
import logo from '../../../../public/images/logo.png';
import Footer from '../../components/kiosk/footer';
import Link from 'next/link';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNonpk } from '../../../context/NonpkContext';
import { useRouter } from 'next/navigation';
import socket from '@/utils/socket'; // Import koneksi socket.io

export default function Home() {
    const { nonpk, setNonpk } = useNonpk();
    const [message, setMessage] = useState('');
    const router = useRouter();
    // Cek nilai `nonpk` saat perubahan dan log untuk debugging

    useEffect(() => {
        console.log("NPK yang disetel di Context:", nonpk || "tidak ada nonpk");

        // Koneksi ke Socket.IO
        socket.on('connect', () => {
            console.log('Terhubung ke server Socket.IO:', socket.id);
        });

        // Cleanup koneksi saat komponen di-unmount
        return () => {
            socket.disconnect();
            console.log('Koneksi Socket.IO diputuskan.');
        };
    }, [nonpk]);


    const handleSubmit = () => {
        if (nonpk) {
            console.log("NPK yang disimpan ke Context:", nonpk);
            setMessage(`NPK ${nonpk} berhasil disimpan`);

            // Emit event ke server bahwa NPK telah dimasukkan
            socket.emit('npkSubmitted', { npk: nonpk, status: 'submitted' });

            setTimeout(() => router.push("/karyawan"), 100);
                } else {
            Swal.fire({
                title: 'NPK Kosong!',
                text: 'Masukkan NPK untuk melanjutkan.',
                icon: 'error',
                confirmButtonText: 'Coba Lagi',
            });
        }
    };
    const handleBack = () => {
        setNonpk('');  // Membersihkan nilai NPK
        socket.emit('npkCleared', { status: 'cleared' }); // Emit event jika NPK dibatalkan
        router.push('/dashboard');  // Navigasi ke halaman dashboard
    };

    return (
        <Container maxWidth="500" sx={{ paddingTop: '100px', paddingBottom: '10px' }}>
            <Box sx={{ position: 'absolute', top: 0, left: 0, padding: '10px' }}>
                <Link href="/dashboard" passHref>
                    <Image
                        src={logo}
                        alt="Logo"
                        width={250}
                        height={250}
                        style={{ cursor: 'pointer' }}
                    />
                </Link>
            </Box>

            <Box>
                <Grid item xs={5} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                    <Typography variant="h2" textAlign="center" mt={1} mb={2} color="#0060B1" fontFamily={'sans-serif'} fontWeight={'bold'}>
                        Selamat Datang
                    </Typography>
                    <Typography variant="h4" textAlign="center" mb={2} fontFamily={'sans-serif'}>
                        Silakan masukan Nomor NPK anda
                    </Typography>

                    {/* Pass nonpk and handleSubmit to Keyboard */}
                    <Keyboard value={nonpk} onChange={setNonpk} onSubmit={handleSubmit} />

                    {message && (
                        <Typography variant="h6" color={message.includes('Error') ? 'red' : 'green'} mt={2}>
                            {message}
                        </Typography>
                    )}

                    <Link href="/dashboard" passHref>
                        <Button
                            variant="outlined"
                            onClick={handleBack}
                            sx={{
                                width: 300,
                                height: 100,
                                borderColor: 'red',
                                color: 'red',
                                borderRadius: '10px',
                                marginTop: 4,
                                '&:hover': {
                                    borderColor: 'darkred',
                                    color: 'darkred',
                                },
                                fontSize: '40px',
                                fontWeight: 'bold',
                                fontFamily: 'sans-serif',
                                textTransform: 'none',
                            }}
                        >
                            Kembali
                        </Button>
                    </Link>
                </Grid> 
            </Box>
            
            <Footer/>
        </Container> 
    );
}