// components/ServingQueueTable.js
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
  } from '@mui/material';
  
  export default function ServingQueueTable() {
    // Data for the table
    const rows = [
      { queueNumber: 'AU-01', loket: 'Loket 1' },
      { queueNumber: 'BK-01', loket: 'Loket 2' },
      { queueNumber: 'CU-01', loket: 'Loket 3' },
      { queueNumber: 'DK-01', loket: 'Loket 4' },
    ];
  
    return (
      <TableContainer component={Paper} sx={{ maxWidth: 700 }}>
        {/* Table Header */}
        <Box sx={{ backgroundColor: '#007bff', padding: 1 }}>
          <Typography
            variant="body1"
            sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}
          >
            Loket Antrian yang Sedang Melayani
          </Typography>
        </Box>
  
        {/* Table Structure */}
        <Table>
          {/* Table Head */}
          <TableHead>
            <TableRow>
              <TableCell
                sx={{ backgroundColor: '#f5c146', fontWeight: 'bold', textAlign:'center' }}
              >
                Nomor Antrian
              </TableCell>
              <TableCell
                sx={{ backgroundColor: '#f5c146', fontWeight: 'bold', textAlign:'center' }}
                align="right"
              >
                Loket
              </TableCell>
            </TableRow>
          </TableHead>
  
          {/* Table Body */}
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell align="center">{row.queueNumber}</TableCell>
                <TableCell align="center">{row.loket}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
  