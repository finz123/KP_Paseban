'use client';
import { Box, Grid2, Typography, Button } from '@mui/material';
import Image from 'next/image'; // Impor komponen Image dari Next.js
import kiosk from '../../public/images/kiosk.png';
import monitor from '../../public/images/monitor.png';
import admin from '../../public/images/admin.png';
import Footer from './components/kiosk/footer';
import Header from './components/kiosk/Header';
import { useRouter } from 'next/navigation'; // Import useRouter untuk navigasi

const App = () => {
  const router = useRouter(); // Gunakan useRouter untuk navigasi

  // Fungsi untuk navigasi
  const handleNavigate = (path) => {
    router.push(path); // Menggunakan router.push untuk navigasi
  };

  return (
    <>
      <Header />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="60vh"
        p={2}
      >
        <Typography variant="h3" marginBottom={10} justifyContent="center">
          Mohon untuk memilih layanan
        </Typography>

        <Grid2 container spacing={5} justifyContent="center">
          <Grid2 item>
            {/* Button untuk navigasi ke halaman login */}
            <Button
              onClick={() => handleNavigate('/login')} // Navigasi ke halaman /login
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
                <div>
                  <Image
                    src={admin}
                    alt="admin"
                    width={200}
                    height={150}
                  />
                </div>

                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: 'sans-serif',
                    fontWeight: '650',
                    backgroundImage:
                      'linear-gradient(to right, rgb(33, 150, 243), purple)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Admin
                </Typography>
              </Box>
            </Button>
          </Grid2>

          <Grid2 item>
            {/* Button untuk navigasi ke halaman dashboard */}
            <Button
              onClick={() => handleNavigate('/dashboard')} // Navigasi ke halaman /dashboard
              variant="contained"
              color="primary"
              sx={{
                width: 400,
                height: 400,
                backgroundColor: 'white',
                borderRadius: '10px',
                boxShadow: `
                -0px 4px 20px  rgba(19, 119, 10, 0.25),
                4px 0px 20px rgba(36, 172, 233, 0.25)
                 `,   
              }}
            >
              <Box display="flex" flexDirection="column" alignItems="center">
                <Image
                  src={kiosk}
                  alt="kiosk"
                  width={200}
                  height={150}
                />

                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: 'sans-serif',
                    fontWeight: '650',
                    backgroundImage:
                      'linear-gradient(to right, rgb(33, 150, 243), rgb(0, 255, 0))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Kiosk
                </Typography>
              </Box>
            </Button>
          </Grid2>

          <Grid2 item>
            {/* Button untuk navigasi ke halaman display */}
            <Button
              onClick={() => handleNavigate('/display')} // Navigasi ke halaman /display
              variant="contained"
              color="primary"
              sx={{
                width: 400,
                height: 400,
                backgroundColor: 'white',
                borderRadius: '10px',
                boxShadow: '0px 4px 20px rgba(43, 42, 41, 0.50)',
              }}
            >
              <Box display="flex" flexDirection="column" alignItems="center">
                <div>
                  <Image
                    src={monitor}
                    alt="monitor"
                    width={200}
                    height={150}
                  />
                </div>

                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: 'sans-serif',
                    fontWeight: '650',
                    backgroundColor:'#2B2A29',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Display
                </Typography>
              </Box>
            </Button>
          </Grid2>
        </Grid2>
        
      </Box>
      <Footer />
    </>
  );
}
export default App;
