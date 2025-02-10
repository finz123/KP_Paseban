// components/Header.js
import { Box } from '@mui/material';
import Image from 'next/image'; // Impor komponen Image dari Next.js
import LiveClock from './LiveClock'; // Impor komponen LiveClock
import logo from '../../../../public/images/logo.png'; // Path relatif dari folder public

const Header = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 3,
        width: '100%',
        position: 'relative',
        backgroundColor: 'white', // Warna latar belakang header (opsional)
      }}
    >
      {/* Atur box untuk logo */}
      <Box
        sx={{
          flex: '0 0 auto',
          paddingRight: 2,
          marginLeft: '20px', // Tambahkan margin kiri untuk menggeser logo lebih ke kanan
        }}
      >
        <Image
          src={logo}
          alt="Logo"
          width={250} // Sesuaikan ukuran jika perlu
          height={250}
        />
      </Box>

      {/* Atur box untuk LiveClock */}
      <Box
        sx={{
          flex: '1 1 auto', // Memastikan LiveClock berada di tengah
          display: 'center',
          justifyContent: 'center',
        }}
      >
        <LiveClock />
      </Box>
    </Box>
  );
};

export default Header;
