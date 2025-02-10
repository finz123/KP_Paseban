//src\app\components\kiosk\loket\TombolAksi.js
import React from "react";
import { Grid, Button, Box } from "@mui/material";

const TombolAksi = ({
  handleCallQueue,
  handlePendingQueue,
  handleStartService,
  handleCompleteService,
  handleRecallQueue,
  handleCompleteKIA,
  isLoketSelected,
  isCallEnabled,
  isStartEnabled,
  isCompleteEnabled,
  isAllButtonsDisabled,
}) => (
  <Box
    sx={{
      marginTop: '20px', // Jarak antara tombol-tombol dengan elemen di atasnya
    }}
  >
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Button
          variant="contained"
          color="success"
          fullWidth
          onClick={handleCallQueue}
          disabled={!isLoketSelected || !isCallEnabled || isAllButtonsDisabled} // Sesuaikan state
          sx={{
            height: '60px', // Tinggi tombol
            fontSize: '16px', // Ukuran font tombol
            fontWeight: 'bold', // Menebalkan teks
          }}
        >
          Panggil Nomor
        </Button>
      </Grid>
      <Grid item xs={6}>
        <Button
          variant="contained"
          color="success"
          fullWidth
          onClick={handlePendingQueue}
          disabled={!isLoketSelected || isAllButtonsDisabled} // Nonaktifkan jika loket belum dipilih
          sx={{
            height: '60px', // Tinggi tombol
            fontSize: '16px', // Ukuran font tombol
            fontWeight: 'bold', // Menebalkan teks
          }}
        >
          Pending
        </Button>
      </Grid>
      <Grid item xs={6}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleStartService}
          disabled={!isLoketSelected || !isStartEnabled || isAllButtonsDisabled} // Nonaktifkan jika loket belum dipilih
          sx={{
            height: '60px', // Tinggi tombol
            fontSize: '16px', // Ukuran font tombol
            fontWeight: 'bold', // Menebalkan teks
          }}
        >
          Mulai Layanan
        </Button>
      </Grid>
      <Grid item xs={6}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleCompleteService}
          disabled={!isLoketSelected || !isCompleteEnabled } // Nonaktifkan jika loket belum dipilih
          sx={{
            height: '60px', // Tinggi tombol
            fontSize: '16px', // Ukuran font tombol
            fontWeight: 'bold', // Menebalkan teks
          }}
        >
          Selesaikan Layanan
        </Button>
      </Grid>
      <Grid item xs={6}>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          onClick={handleRecallQueue}
          disabled={!isLoketSelected || isAllButtonsDisabled} // Nonaktifkan jika loket belum dipilih
          sx={{
            height: '60px', // Tinggi tombol
            fontSize: '16px', // Ukuran font tombol
            fontWeight: 'bold', // Menebalkan teks
          }}
        >
          Panggil Ulang
        </Button>
      </Grid>
      <Grid item xs={6}>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          onClick={handleCompleteKIA}
          disabled={!isLoketSelected || isAllButtonsDisabled} // Nonaktifkan jika loket belum dipilih
          sx={{
            height: '60px', // Tinggi tombol
            fontSize: '16px', // Ukuran font tombol
            fontWeight: 'bold', // Menebalkan teks
          }}
        >
          Pasien KIA
        </Button>
      </Grid>
    </Grid>
  </Box>
);

export default TombolAksi;
