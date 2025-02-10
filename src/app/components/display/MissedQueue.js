import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import socket from '@/utils/socket'; // Import koneksi global

const MissQueue = () => {
  const [missedQueues, setMissedQueues] = useState([]);
  const scrollSpeed = 0.5;
  const missedRef = useRef(null);

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://192.168.6.79:3100";

    const fetchMissedQueueData = async () => {
      try {
        const response = await axios.patch(`${BASE_URL}/antrean/status/today`);
        const data = response.data;
 
        // Tentukan awal dan akhir hari ini
        const startOfDay = new Date().setHours(0, 0, 0, 0); // 00:00:00 waktu lokal
        const endOfDay = new Date().setHours(23, 59, 59, 999); // 23:59:59 waktu lokal
  
       // Filter antrean dengan status `pending` dan no_show_stamp hari ini
          const filteredAndSortedData = data
          .filter(queue =>
            queue.status === 'pending' &&
            queue.no_show_stamp &&
            new Date(queue.no_show_stamp).getTime() >= startOfDay &&
            new Date(queue.no_show_stamp).getTime() <= endOfDay &&
            queue.complete_stamp === null // Pastikan antrean belum pernah selesai
          )
          .sort((a, b) => new Date(a.called_stamp) - new Date(b.called_stamp)); // Urutkan berdasarkan called_stamp

        setMissedQueues(filteredAndSortedData);
      } catch (error) {
        console.error('Error fetching missed queue data:', error.message);
      }
      };
  
      useEffect(() => {
        // Polling untuk memperbarui data setiap 60 detik
        const intervalId = setInterval(() => {
          fetchMissedQueueData(); // Memanggil API secara berkala
        }, 30000); // Interval 60 detik
      
        // Listener socket untuk menerima pembaruan real-time
        socket.on('queueMissedUpdate', (updatedQueue) => {
          console.log('Real-time update received:', updatedQueue);
          setMissedQueues((prev) => [...prev, updatedQueue]);
        });
      
        // Cleanup listener dan interval saat komponen di-unmount
        return () => {
          clearInterval(intervalId); // Hentikan polling
          socket.off('queueMissedUpdate'); // Hapus listener socket
        };
      }, []);

    useEffect(() => {
      // Event listener untuk update real-time
      socket.on('queueMissedUpdate', (updatedQueue) => {
        console.log('Update real-time diterima:', updatedQueue);
        setMissedQueues((prev) => [...prev, updatedQueue]);
      });
  
      fetchMissedQueueData();
  
      // Cleanup event listener
      return () => {
        socket.off('queueMissedUpdate');
      };
    }, []);
  

  const scrollAndReset = (ref) => {
    if (!ref.current) return;

    const scroll = () => {
      const maxScroll = ref.current.scrollHeight - ref.current.clientHeight;
      if (ref.current.scrollTop < maxScroll) {
        ref.current.scrollBy({ top: scrollSpeed, behavior: 'smooth' });
        requestAnimationFrame(scroll);
      } else {
        setTimeout(() => {
          ref.current.scrollTo({ top: 0, behavior: 'smooth' });
          setTimeout(() => requestAnimationFrame(scroll), 3000);
        }, 2000);
      }
    };

    requestAnimationFrame(scroll);
  };

  useEffect(() => {
    scrollAndReset(missedRef);
  }, [missedQueues]);

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Waktu Tidak Tersedia';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // Jumlah antrean terlewati
  const count = missedQueues.length;

  return (
    <div className="bg-white p-4 shadow-lg border border-red-700 w-full h-full flex flex-col">
      {/* Header */}
      <div className="w-full mb-9">
        <h2 className="text-3xl font-bold text-red-700 mb-4 text-center">
          Antrian Terlewati <span className="text-lg font-medium">({count} Antrian)</span>
        </h2>
      </div>

      {/* Missed Queue Section */}
      <div
        className="p-4 bg-red-700 text-white rounded-lg shadow overflow-y-auto scrollbar-hide"
        style={{ maxHeight: '330px' }}
        ref={missedRef}
      >
        {missedQueues.length > 0 ? (
          missedQueues.map((queue, index) => (
            <div
              key={index}
              className="bg-white text-red-700 rounded-md p-4 mb-2 shadow flex flex-col gap-2"
            >
              <div className="flex justify-between items-center">
                <span className="text-3xl font-bold">{queue.nomorAntrean}</span>
                <span className="text-3xl font-bold">{queue.loket || 'Loket Tidak Diketahui'}</span>
                <span className="text-2xl">Terakhir Dipanggil: {formatTime(queue.called_stamp)}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white text-red-700 rounded-md p-4 shadow text-center text-xl font-bold">
            Tidak Ada Antrian Terlewati
          </div>
        )}
      </div>
    </div>
  );
};

export default MissQueue;
