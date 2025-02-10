import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100vw', // Adjusted to ensure it matches viewport width
        textAlign: 'center',
        backgroundColor: '#07579A', 
        padding: 2,
        boxShadow: '0 -1px 5px rgba(0,0,0,0.1)',
        overflowX: 'hidden', // Ensure no overflow from footer itself
      }}
    >
      <Typography variant="body2" color="white">
        © Klinik Pratama 2024 - SIRS Development Team
      </Typography>
    </Box>
  );
};

export default Footer;
