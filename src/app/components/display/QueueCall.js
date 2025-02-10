import { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import socket from '@/utils/socket'; // Import koneksi global

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://192.168.6.79:3100";
  
const QueueCall = () => {
  const [loading, setLoading] = useState(true);
  const [queueData, setQueueData] = useState({ queueNumber: null, counter: null });
  const [isAnnouncing, setIsAnnouncing] = useState(false);
  const lastProcessedQueue = useRef(null); // Tambahkan referensi untuk melacak antrean terakhir yang diproses

  const announceQueue = (queueNumber, counter) => {
    if (!queueNumber || !counter) {
      console.warn('Nomor antrian atau loket tidak tersedia untuk diumumkan.');
      return;
    }

    if (!window.speechSynthesis) {
      console.warn('Web Speech API is not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel();

    const spelledOutQueue = queueNumber.split('').filter((char) => char !== '-').join('  ');
    const message = `Nomor antrian ${spelledOutQueue}, dipersilahkan menuju ke ${counter}`;

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = 'id-ID';
    utterance.rate = 1;

    setIsAnnouncing(true);

    utterance.onend = () => setIsAnnouncing(false);

    window.speechSynthesis.speak(utterance);
  };

  const fetchQueueCallData = useCallback(async () => {
    try {
      const response = await axios.patch(`${BASE_URL}/antrean/status/today`);
      const data = response.data;
  
      const nextQueue = data
        .filter((queue) => queue.status === 'called' || queue.status === 'recalled')
        .sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt))[0];
  
      if (!nextQueue) {
        console.log('Tidak ada antrean baru untuk diproses.');
        return;
      }
  
      const queueKey = `${nextQueue.nomorAntrean}-${nextQueue.status}`;
  
      // Cegah pemrosesan ulang antrean yang sama kecuali statusnya berubah
      if (lastProcessedQueue.current === queueKey) {
        console.log(`Antrean ${queueKey} sudah diproses sebelumnya. Menunggu antrean baru.`);
        return;
      }
  
      console.log(
        nextQueue.status === 'recalled'
          ? `Memanggil ulang antrean recalled: ${nextQueue.nomorAntrean}`
          : `Memanggil antrean baru: ${nextQueue.nomorAntrean}`
      );
  
      lastProcessedQueue.current = queueKey; // Perbarui antrean terakhir yang diproses
  
      setQueueData({
        queueNumber: nextQueue.nomorAntrean,
        counter: nextQueue.loket,
      });
  
      await announceQueue(nextQueue.nomorAntrean, nextQueue.loket);
    } catch (error) {
      console.error('Error fetching queue data:', error);
    } finally {
      setLoading(false);
    }
  }, []); // Tambahkan dependensi jika ada variabel state di dalam `fetchQueueCallData`
  
  useEffect(() => {
    fetchQueueCallData();
  
    const interval = setInterval(fetchQueueCallData, 10000);
    return () => clearInterval(interval);
  }, [fetchQueueCallData]); // Tambahkan `fetchQueueCallData` ke dalam daftar dependensi
  
  return (
    <div className="h-full bg-blue-700 p-6 rounded-lg shadow-lg flex flex-col justify-center items-center">
      <h2 className="text-3xl font-bold text-white mb-4">Pemanggilan Antrian</h2>
      <p className="text-3xl font-bold text-white">Nomor Antrian</p>
      <div
        className="number text-6xl my-14"
        style={{ animation: 'zoom-in-out 2s infinite' }}
      >
        {loading ? 'Memuat...' : queueData.queueNumber || '...'}
      </div>
      <p className="text-3xl font-bold text-white">
        {loading ? 'Memuat...' : queueData.counter || 'Loket Tidak Diketahui'}
      </p>
      <style jsx>{`
        @keyframes zoom-in-out {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default QueueCall;