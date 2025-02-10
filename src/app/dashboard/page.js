'use client'; // Tambahkan ini di baris pertama

import { Button, Grid2, Typography, Box } from '@mui/material';
import Image from 'next/image'; 
import Link from 'next/link'; // Import Link dari Next.js
import logo_karyawan from '../../../public/images/logo_karyawan.jpeg';
import logo_umum from '../../../public/images/logo_umum.jpeg';
import Footer from '../components/kiosk/footer';
import Header from '../components/kiosk/Header';
import socket from '@/utils/socket'; // Import koneksi Socket.IO
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // Koneksi ke Socket.IO
    socket.on('connect', () => {
      console.log('Terhubung ke server Socket.IO:', socket.id);

      // Emit event ketika dashboard diakses
      socket.emit('dashboardAccessed', { status: 'Dashboard dibuka' });
    });

    // Cleanup koneksi saat komponen di-unmount
    return () => {
      socket.disconnect();
      console.log('Koneksi Socket.IO diputuskan.');
    };
  }, []);
  return (
    <>
      <Header />
      <Link href="/" passHref>
  <Box
    sx={{
      position: 'absolute',
      top: 30,
      left: 50,
      width: 200,
      height: 100,
      backgroundColor: 'transparant',
      cursor: 'pointer',
    }}
  >
    {/* Kotak klik, bisa diisi dengan elemen visual */}
  </Box>
</Link>

      <Box
        display="flex"
        flexDirection="column"  
        alignItems="center"
        justifyContent="center"
        minHeight="70vh"
        p={2}
        sx={{ width:'100%',overflowX: 'hidden' }}
      >
        <Typography variant="h3" marginBottom={10} justifyContent="center">
          Mohon untuk memilih layanan
        </Typography>

        <Grid2 container spacing={5} justifyContent="center">
          <Grid2 item>
            {/* Link untuk navigasi ke halaman karyawan */}
            <Link href="/karyawan/nonpk" passHref>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  width: 500,
                  height: 400,
                  backgroundColor: 'white',
                  borderRadius: '10px',
                  boxShadow: `
                  -0px 4px 20px  rgba(255, 0, 0, 0.25), 
                  4px 0px 20px rgba(36, 172, 233, 0.25) 
                  `,
                }}
              >
                <Box display="flex" flexDirection="column" alignItems="center">
                  <div>
                    <Image
                      src={logo_karyawan}
                      alt="Logo Karyawan"
                      width={150}
                      height={50}
                    />
                  </div>

                  <Typography
                    variant="h2"
                    sx={{
                      fontFamily: 'sans-serif',
                      fontWeight: '650',
                      backgroundImage:
                        'linear-gradient(to right, #24ACE9, #FF0000)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Karyawan<br></br>
                    PPSC
                  </Typography>
                </Box>
              </Button>
            </Link>
          </Grid2>

          <Grid2 item>
            {/* Link untuk navigasi ke halaman umum */}
            <Link href="/umum" passHref>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  width: 500,
                  height: 400,
                  backgroundColor: 'white',
                  borderRadius: '10px',
                  boxShadow: `
                  -0px 4px 20px  rgba(65, 193, 70, 0.25), 
                  4px 0px 20px rgba(36, 172, 233, 0.25)
                  `,
                }}
              >
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Image
                    src={logo_umum}
                    alt="Logo Umum"
                    width={150}
                    height={50}
                  />

                  <Typography
                    variant="h2"
                    sx={{
                      fontFamily: 'sans-serif',
                      fontWeight: '650',
                      backgroundImage:
                        'linear-gradient(to bottom, #24ACE9, #41C146)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Pasien<br></br> Umum
                  </Typography>
                </Box>
              </Button>
            </Link>
          </Grid2>
        </Grid2>
      </Box>
      <Footer />
    </>
  );
}
