'use client';
import { Box, Grid, Typography, Button } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import BPJS from '../../../public/images/BPJS.png';
import asuransi from '../../../public/images/asuransi.png';
import layanan_umum from '../../../public/images/layanan_umum.png';
import Footer from '../components/kiosk/footer';
import Header from '../components/kiosk/Header';
import { useRef, useEffect, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import GenerateAntrian from '../components/kiosk/GenerateAntrian';
import Swal from 'sweetalert2';
import axios from 'axios';
import socket from '@/utils/socket';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://192.168.6.79:3100";

const Umum = () => {
  const [queueNumber, setQueueNumber] = useState('');
  const videoRef = useRef(null);
  const componentRef = useRef();
  const [selectedService, setSelectedService] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [waitingStamp, setWaitingStamp] = useState('');

  // Fungsi untuk membuat antrean otomatis dengan API
  const createAntreanOtomatis = async (pasienType, serviceType) => {
    try {
      // Panggilan API tanpa parameter NPK untuk pasien umum
      const response = await axios.post(`${BASE_URL}/antrean/create`, {
        pasienType,
        serviceType,
      });
      const data = response.data;
      // Emit ke server bahwa antrean berhasil dibuat
      socket.emit('queueCreated', { 
        nomorAntrean: data.nomorAntrean, 
        pasienType, 
        serviceType 
      });

       // Pastikan 'waiting_stamp' diterima dari respons API
    if (data.waiting_stamp) {
      setWaitingStamp(data.waiting_stamp);
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


  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const photoDataBase64 = canvas.toDataURL('image/jpeg');
    downloadPhoto(photoDataBase64);
  };

  const downloadPhoto = (photoData) => {
    const link = document.createElement('a');
    link.href = photoData;
    link.download = `KP_${new Date().toISOString()}.png`;
    link.click();
  };

  useEffect(() => {
    if (typeof window !== "undefined" && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((error) => {
          console.error('Error accessing webcam:', error);
        });
    }
  }, []);

  useEffect(() => {
    // Koneksi Socket.IO saat komponen dimuat
    socket.on('connect', () => {
      console.log('Terhubung ke server Socket.IO:', socket.id);
    });

    // Cleanup koneksi saat komponen di-unmount
    return () => {
      socket.disconnect();
      console.log('Koneksi Socket.IO diputuskan.');
    };
  }, []);
  
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
  });

  useEffect(() => {
    if (queueNumber && selectedService) {
      handlePrint();
    }
  }, [queueNumber, selectedService, handlePrint]);

  const handleCallQueue = async (pasienType, serviceType) => {
    try {
      //capturePhoto();
      setSelectedService(serviceType);
      const antrean = await createAntreanOtomatis(pasienType, serviceType);
      if (antrean && antrean.nomorAntrean) {
        setQueueNumber(antrean.nomorAntrean);
        setCreatedAt(antrean.createdAt);
        setTimeout(() => handlePrint(), 500);
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
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="10vh" p={2}>
        <Typography variant="h3" marginBottom={10}>
          Mohon untuk memilih layanan Pembayaran
        </Typography>

        <video ref={videoRef} autoPlay style={{ display: 'none' }} />

        <Grid container spacing={5} justifyContent="center">
          <Grid item>
            <Button
              onClick={() => handleCallQueue('Umum', 'BPJS')}
              variant="contained"
              sx={{
                width: 400,
                height: 400,
                backgroundColor: 'white',
                borderRadius: '10px',
                boxShadow: `
                  -0px 4px 20px rgba(22, 60, 142, 0.25),
                  4px 0px 20px rgba(65, 193, 70, 0.25)
                `,
              }}
            >
              <Box display="flex" flexDirection="column" alignItems="center">
                <Image src={BPJS} alt="BPJS" width={300} height={300} />
              </Box>
            </Button>
          </Grid>
          <Grid item>
            <Button
              onClick={() => handleCallQueue('Umum', 'ASURANSI')}
              variant="contained"
              sx={{
                width: 400,
                height: 400,
                backgroundColor: 'white',
                borderRadius: '10px',
                boxShadow: `
                  -0px 4px 20px rgba(19, 119, 10, 0.25),
                  4px 0px 20px rgba(36, 172, 233, 0.25)
                `,
              }}
            >
              <Box display="flex" flexDirection="column" alignItems="center">
                <Image src={asuransi} alt="asuransi" width={200} height={150} />
                <Typography variant="h4" sx={{
                  fontFamily: 'sans-serif',
                  fontWeight: '650',
                  backgroundImage: 'linear-gradient(to right, rgb(33, 150, 243), rgb(0, 255, 0))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>Asuransi</Typography>
              </Box>
            </Button>
          </Grid>
          <Grid item>
            <Button
              onClick={() => handleCallQueue('Umum', 'UMUM')}
              variant="contained"
              sx={{
                width: 400,
                height: 400,
                backgroundColor: 'white',
                borderRadius: '10px',
                boxShadow: '0px 4px 20px rgba(43, 42, 41, 0.50)',
              }}
            >
              <Box display="flex" flexDirection="column" alignItems="center">
                <Image src={layanan_umum} alt="Layanan Umum" width={200} height={150} />
                <Typography variant="h4" sx={{
                  fontFamily: 'sans-serif',
                  fontWeight: '650',
                  backgroundColor:'#2B2A29',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>Layanan Umum</Typography>
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
                : selectedService === 'ASURANSI'
                ? 'Loket Asuransi'
                : 'Loket Layanan Umum'
            }
            waitingStamp={waitingStamp}
            strDate=''
            strTime=''
          />
        </div>

        <Link href="/dashboard" passHref>
          <Button variant="outlined" sx={{
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
          }}>
            Kembali
          </Button>
        </Link>
      </Box>
      <Footer />
    </>
  );
};

export default Umum;
