// components/NextQueue.js
import { Box, Grid, Typography, Paper } from '@mui/material';

export default function NextQueue() {
  // Data for the next queue numbers
  const queues = [
    {
      category: 'BPJS Kesehatan (Loket 1)',
      numbers: ['AK-002', 'AU-003', 'AK-004'],
    },
    {
      category: 'BPJS Kesehatan (Loket 2)',
      numbers: ['BK-002', 'BU-003', 'BK-004'],
    },
    {
      category: 'Pasien Umum (Loket 3)',
      numbers: ['C-002', 'C-003', 'C-004'],
    },
    {
      category: 'Asuransi (Loket 4)',
      numbers: ['D-002', 'D-003', 'D-004'],
    },
  ];

  return (
    <Paper elevation={3} sx={{ width: '100%', padding: 3 }}>
      {/* Header */}
      <Box sx={{ backgroundColor: '#1B78C6', padding: 1, marginBottom: 2 }}>
        <Typography
          variant="body1"
          sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}
        >
          Antrian Selanjutnya
        </Typography>
      </Box>

      {/* Queue Sections */}
      <Grid container spacing={2}>
        {queues.map((queue, index) => (
          <Grid item xs={12} key={index}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {/* Queue Category */}
              <Typography
                variant="h6"
                sx={{ fontWeight: 'bold', flexGrow: 1 }}
              >
                {queue.category}
              </Typography>

              {/* Queue Numbers */}
              <Grid container spacing={1} sx={{ maxWidth: '50%' }}>
                {queue.numbers.map((number, numIndex) => (
                  <Grid item key={numIndex}>
                    <Paper
                      elevation={3}
                      sx={{
                        padding: '10px 20px',
                        textAlign: 'center',
                        fontWeight: 'bold',
                      }}
                    >
                      {number}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}
