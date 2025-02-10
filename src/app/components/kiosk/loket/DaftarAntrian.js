import React from 'react';
import { Button, Card, Typography, List, ListItem, ListItemText, MenuItem, Select } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import Swal from 'sweetalert2';

const DaftarAntrian = ({
  isFetching,
  pendingQueues,
  calledQueues,
  isViewingPending,
  handleCancelAllPendingQueues,
  setIsViewingPending,
  handlePendingItemClick,
  handleCalledItemClick,
  setSelectedQueue, // Tambahkan prop ini untuk menyimpan nomor yang dipilih
  selectedQueue,    // Tambahkan prop ini untuk mengetahui nomor yang dipilih
  isLoketSelected, // Tambahkan properti ini
}) => {
  const handleDeleteClick = () => {
    Swal.fire({
      title: 'Konfirmasi Hapus',
      text: 'Apakah Anda yakin ingin menghapus semua antrian?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e53935',
      cancelButtonColor: '#1976d2',
      confirmButtonText: 'Hapus',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        handleCancelAllPendingQueues(); // Lanjutkan dengan aksi penghapusan jika dikonfirmasi
      }
    });
  };

  return (
    <Card style={{ padding: 20, maxHeight: '600px', overflow: 'hidden', width: '100%', boxSizing: 'border-box', position: 'relative' }}>
      <Typography variant="h6" gutterBottom>Daftar Antrian</Typography>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', marginTop: '10px' }}>
        <Button
          variant="contained"
          color="error"
          fullWidth
          startIcon={<DeleteIcon />}
          style={{ height: '60px', fontSize: '1.1rem', flex: '1', backgroundColor: '#e53935' }}
          onClick={handleDeleteClick} // Panggil fungsi Swal untuk konfirmasi
          disabled={!isLoketSelected} // Nonaktifkan jika loket belum dipilih
        >
          Hapus Antrian
        </Button>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          startIcon={<RefreshIcon />}
          style={{ height: '60px', fontSize: '1.1rem', flex: '1', backgroundColor: '#1976d2' }}
          onClick={() => window.location.reload()}
          disabled={!isLoketSelected} // Nonaktifkan jika loket belum dipilih
        >
          Refresh
        </Button>
      </div>
      <Select
        value={isViewingPending ? 'pending' : 'called'}
        onChange={(e) => setIsViewingPending(e.target.value === 'pending')}
        fullWidth
        style={{ marginBottom: '20px' }}
        disabled={!isLoketSelected} // Nonaktifkan jika loket belum dipilih
      >
        <MenuItem value="pending">Daftar Pending</MenuItem>
        <MenuItem value="called">Daftar Called, Recalled and Processed</MenuItem>
      </Select>
      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {isFetching && <div>Loading...</div>}
        <List>
          {(isViewingPending ? pendingQueues : calledQueues).length > 0 ? (
            (isViewingPending ? pendingQueues : calledQueues).map((queue, index) => (
              <ListItem
                key={index}
                button
                onClick={() => isLoketSelected && setSelectedQueue(queue.nomorAntrean)} // Simpan nomor yang dipilih ke state
                disabled={!isLoketSelected} // Nonaktifkan list item jika loket belum dipilih
                style={{
                  border: '1px solid #ddd',
                  marginBottom: 10,
                  borderRadius: 8,
                  backgroundColor: queue.nomorAntrean === selectedQueue ? '#e3f2fd' : '#fff', // Sorot nomor yang dipilih
                  color: isLoketSelected ? '#3f51b5' : '#ccc', // Ubah warna teks jika tidak aktif
                  pointerEvents: isLoketSelected ? 'auto' : 'none', // Cegah klik jika tidak aktif
                  transition: 'filter 0.3s, opacity 0.3s', // Animasi untuk perubahan efek
                }}
              >
                <ListItemText
                  primary={
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: isLoketSelected ? 'pointer' : 'default', // Tambahkan cursor pointer jika aktif
                      }}
                    >
                      <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                        {queue.nomorAntrean}
                      </span>
                      <span style={{ fontSize: '1rem', color: '#4caf50' }}>
                        {queue.status?.toUpperCase() || 'Status Tidak Diketahui'}
                      </span>
                      <span style={{ fontSize: '1rem', color: 'gray' }}>
                        {queue.loket || 'Tidak Diketahui'}
                      </span>
                    </div>
                  }
                />
              </ListItem>
            ))
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '20px',
                fontWeight: 'bold',
                fontSize: '1.2rem',
                color: '#f44336',
              }}
            >
              {isViewingPending
                ? 'Tidak Ada Antrian Pending'
                : 'Tidak Ada Antrian Called/Recalled'}
            </div>
          )}
        </List>
      </div>
    </Card>
  );
};

export default DaftarAntrian;
