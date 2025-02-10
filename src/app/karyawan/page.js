'use client';

import { Box, Grid, Typography, Button } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import BPJS from '../../../public/images/BPJS.png';
import PJPK from '../../../public/images/PJPK.png';
import Footer from '../components/kiosk/footer';
import Header from '../components/kiosk/Header';
import React, { useRef, useState, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import GenerateAntrian from '../components/kiosk/GenerateAntrian';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useNonpk } from '../../context/NonpkContext';
import socket from '@/utils/socket'; // Import koneksi socket

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://192.168.6.79:3100";

const Karyawan = () => {
  const [queueNumber, setQueueNumber] = useState('');
  const componentRef = useRef(null);
  const [selectedService, setSelectedService] = useState('');
  const { nonpk, setNonpk } = useNonpk();
  const router = useRouter();
  const [createdAt, setCreatedAt] = useState('');
  const [waitingStamp, setWaitingStamp] = useState('');

// Koneksi Socket.IO saat komponen dimuat
useEffect(() => {
  socket.on('connect', () => {
    console.log('Terhubung ke server Socket.IO:', socket.id);
  });

  // Cleanup koneksi saat komponen di-unmount
  return () => {
    socket.disconnect();
    console.log('Koneksi Socket.IO diputuskan.');
  };
}, []);

  const createAntreanOtomatis = async (pasienType, serviceType) => {
    try {
      const requestData = {
        pasienType,
        serviceType,
        nonpk: pasienType.toLowerCase() === 'karyawan' ? nonpk : null,
      };
      const response = await axios.post(`${BASE_URL}/antrean/create`, requestData);

      // Emit event ke server bahwa antrean telah dibuat
      socket.emit('queueCreated', { 
        nomorAntrean: response.data.nomorAntrean, 
        pasienType, 
        serviceType 
      });
      
       // Pastikan 'waiting_stamp' diterima dari respons API
    if (response.data.waiting_stamp) {
      setWaitingStamp(response.data.waiting_stamp);
    } else {
      console.error('waiting_stamp tidak ditemukan dalam respons');
    }

      return response.data;
    } catch (error) {
      console.error('Error creating antrean:', error);
      Swal.fire({
        title: 'Gagal!',
        text: 'Terjadi kesalahan saat membuat nomor antrean.',
        icon: 'error',
        confirmButtonText: 'Coba Lagi',
      });
      throw new Error('Gagal mengambil antrean dari server.');
    }
  };

  useEffect(() => {
    if (!nonpk) {
      Swal.fire({
        title: 'NPK Diperlukan',
        text: 'Silakan masukkan NPK terlebih dahulu.',
        icon: 'warning',
        confirmButtonText: 'Kembali',
      }).then(() => router.push('/karyawan/nonpk'));
    }
  }, [nonpk, router]);

  const handleBack = () => {
    setNonpk(''); // Membersihkan nilai NPK
    router.push('/dashboard'); // Navigasi ke halaman dashboard
};

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: () => {
      Swal.fire({
        title: "Berhasil!",
        text: "Nomor antrian Anda telah dicetak.",
        icon: "success",
        timer: 1000,
        buttons: false,
        willClose: () => {
          window.location.href = '/dashboard';
        },
      });
    },
    contentRef: componentRef
  });

  useEffect(() => {
    if (queueNumber && selectedService) {
      handlePrint();
    }
  }, [queueNumber, selectedService, handlePrint]); // Tambahkan handlePrint ke dependency array

  const handleCallQueue = async (pasienType, serviceType) => {
    try {
      setSelectedService(serviceType);
      const antrean = await createAntreanOtomatis(pasienType, serviceType);
      if (antrean && antrean.nomorAntrean) {
        setQueueNumber(antrean.nomorAntrean);
        setCreatedAt(antrean.createdAt);

        // Tampilkan pesan "Mohon tunggu sedang print..."
        Swal.fire({
          title: 'Mohon tunggu...',
          text: 'Sedang mencetak antrean Anda.',
          icon: 'info',
          allowOutsideClick: false,
          showConfirmButton: false,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        setTimeout(() => {
          handlePrint();
          Swal.close(); // Tutup pesan swal sebelum print dimulai
        }, 5000);
      }
    } catch (error) {
      console.error('Gagal mengambil antrean:', error);
    }
  };

  return (
    <>
      <Header />
      <Link href="/dashboard" passHref>
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
        minHeight="60vh"
        p={2}
      >
        <Typography variant="h3" marginBottom={10}>
          Mohon untuk memilih layanan Pembayaran
        </Typography>

        <Grid container spacing={5} justifyContent="center">
          <Grid item>
            <Button
              onClick={() => handleCallQueue('Karyawan', 'BPJS')}
              variant="contained"
              color="primary"
              sx={{
                width: 400,
                height: 400,
                backgroundColor: 'white',
                borderRadius: '10px',
                boxShadow: `
                -0px 4px 20px  rgba(22, 60, 142, 0.25), 
                4px 0px 20px rgba(65, 193, 70, 0.25)  
                `,
              }}
            >
              <Box display="flex" flexDirection="column" alignItems="center">
                <Image
                  src={BPJS}
                  alt="BPJS"
                  width={300}
                  height={300}
                />
              </Box>
            </Button>
          </Grid>

          <Grid item>
            <Button
              onClick={() => handleCallQueue('Karyawan', 'PJPK')}
              variant="contained"
              color="primary"
              sx={{
                width: 400,
                height: 400,
                backgroundColor: 'white',
                borderRadius: '10px',
                boxShadow: `
                -0px 4px 20px  rgba(10, 32, 154, 0.25),
                4px 0px 20px rgba(57, 136, 237, 0.25)
                `,
              }}
            >
              <Box display="flex" flexDirection="column" alignItems="center">
                <Image
                  src={PJPK}
                  alt="PJPK"
                  width={250}
                  height={250}
                />
              </Box>
            </Button>
          </Grid>
        </Grid>

        <div style={{ position: 'absolute', left: '-10000px', top: '-10000px' }}>
          <GenerateAntrian
            ref={componentRef}
            namaSub={selectedService}
            queueNumber={queueNumber}
            location={
              selectedService === 'BPJS' 
              ? 'Loket BPJS' 
              : 'Loket PJPK'
            }
            waitingStamp={waitingStamp}
            strDate={createdAt}
            strTime={createdAt}
          />
        </div>

        <Link href="/karyawan/nonpk" passHref>
          <Button
            variant="outlined"
            onClick={handleBack} // Pastikan handleBack dipanggil
            sx={{
              width: 300,
              height: 100,
              borderColor: 'red',
              color: 'red',
              borderRadius: '10px',
              marginTop: 7,
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
      </Box>
      <Footer />
    </>
  );
};

export default Karyawan;
