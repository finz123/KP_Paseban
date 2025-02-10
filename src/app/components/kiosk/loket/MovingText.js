// src\app\components\kiosk\loket\MovingText.js
import React from 'react';
import { styled } from '@mui/system';
import { Typography } from '@mui/material';

const StyledMovingText = styled(Typography)({
  whiteSpace: 'nowrap',
  display: 'inline-block',
  animation: 'marquee 15s linear infinite',
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: 'green',
  padding: '5px 0',
  margin: '0',
  textAlign: 'center',
  overflow: 'hidden',
  position: 'relative',
  width: '100%',
  '@keyframes marquee': {
    '0%': { transform: 'translateX(100%)' },
    '100%': { transform: 'translateX(-100%)' }
  },
});

export default function MovingText({ greeting, username }) {
  return (
    <StyledMovingText>
      {greeting}, {username ? username.toUpperCase() : ''}! Selamat datang di Aplikasi Klinik Pratama Paseban, Salam Sehat 🙏🏼
    </StyledMovingText>
  );
}
