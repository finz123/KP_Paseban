//src\app\components\display\NextQueue.js
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client'; // Import Socket.IO client

const NextQueue = () => {
  const [queues, setQueues] = useState({
    KB: [],
    UB: [],
    KP: [],
    UA: [],
    UU: [],
    missed: [] // Tambahkan kategori baru untuk antrean terlewati (pending)

  });

  // Scroll speed control (adjust this value to change speed)
  const scrollSpeed = 0.5; // Adjust this value for speed control

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://192.168.6.79:3100";


  // References for each queue section to handle auto-scroll
  const kbRef = useRef(null);
  const ubRef = useRef(null);
  const kpRef = useRef(null);
  const uaRef = useRef(null);
  const uuRef = useRef(null);
  const missedRef = useRef(null); // Reference for the "missed" queue section

  // Get today's date in YYYY-MM-DD format for accurate comparison
  const today = new Date().toLocaleDateString('en-CA'); // 'YYYY-MM-DD'
  
 // Socket.IO setup
 useEffect(() => {
  const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://192.168.6.79:3100');

  // Listen for "queueUpdate" event
  socket.on('queueUpdate', (updatedQueue) => {
    console.log('Update real-time diterima:', updatedQueue);
  
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));
  
    // Validasi timestamp sebelum menambahkan antrean
    const queueTime = new Date(updatedQueue.waiting_stamp).getTime();
    if (queueTime >= startOfDay.getTime() && queueTime <= endOfDay.getTime()) {
      setQueues((prev) => {
        const prefix = updatedQueue.nomorAntrean.slice(0, 2); // Ambil prefix: KB, UB, KP, UA, UU
        return {
          ...prev,
          [prefix]: [...prev[prefix], updatedQueue],
        };
      });
    }
  });
  
  // Cleanup socket connection on component unmount
  return () => {
    socket.disconnect();
    console.log('Koneksi Socket.IO ditutup.');
  };
}, []);

// Fetch data from API and categorize it based on status "waiting" and nomorAntrean prefix for today's date
useEffect(() => {
  const fetchQueueData = async () => {
    try {
      const response = await axios.patch(`${BASE_URL}/antrean/status/today`);
      const data = response.data;
  
      console.log('Data fetched from API:', data);
  
      // Get start and end timestamps for today
      const startOfDay = new Date().setHours(0, 0, 0, 0); // 00:00:00
      const endOfDay = new Date().setHours(23, 59, 59, 999); // 23:59:59
  
      // Filter data by nomorAntrean prefix, status, and timestamp range
      const categorizedData = {
        KB: data.filter(queue =>
          queue.nomorAntrean.startsWith('KB') &&
          queue.status === 'waiting' &&
          new Date(queue.waiting_stamp).getTime() >= startOfDay &&
          new Date(queue.waiting_stamp).getTime() <= endOfDay
        ),
        UB: data.filter(queue =>
          queue.nomorAntrean.startsWith('UB') &&
          queue.status === 'waiting' &&
          new Date(queue.waiting_stamp).getTime() >= startOfDay &&
          new Date(queue.waiting_stamp).getTime() <= endOfDay
        ),
        KP: data.filter(queue =>
          queue.nomorAntrean.startsWith('KP') &&
          queue.status === 'waiting' &&
          new Date(queue.waiting_stamp).getTime() >= startOfDay &&
          new Date(queue.waiting_stamp).getTime() <= endOfDay
        ),
        UA: data.filter(queue =>
          queue.nomorAntrean.startsWith('UA') &&
          queue.status === 'waiting' &&
          new Date(queue.waiting_stamp).getTime() >= startOfDay &&
          new Date(queue.waiting_stamp).getTime() <= endOfDay
        ),
        UU: data.filter(queue =>
          queue.nomorAntrean.startsWith('UU') &&
          queue.status === 'waiting' &&
          new Date(queue.waiting_stamp).getTime() >= startOfDay &&
          new Date(queue.waiting_stamp).getTime() <= endOfDay
        ),
        missed: data.filter(queue =>
          ['KB', 'UB', 'KP', 'UA', 'UU'].some(prefix => queue.nomorAntrean.startsWith(prefix)) &&
          queue.status === 'pending' &&
          new Date(queue.waiting_stamp).getTime() >= startOfDay &&
          new Date(queue.waiting_stamp).getTime() <= endOfDay
        ),
      };
  
      console.log('Filtered Data:', categorizedData);
      setQueues(categorizedData);
    } catch (error) {
      console.error('Error fetching queue data:', error.message);
    }
  };
  
  // Call fetchQueueData initially and set it to run every 10 seconds
  fetchQueueData();
  const intervalId = setInterval(fetchQueueData, 10000); // Fetch every 3 seconds

  // Clean up interval on component unmount
  return () => clearInterval(intervalId);
}, []);


  // Function to handle auto-scrolling and reset to the top
  const scrollAndReset = (ref) => {
    if (!ref.current) return;

    const scroll = () => {
      const maxScroll = ref.current.scrollHeight - ref.current.clientHeight;

      if (ref.current.scrollTop < maxScroll) {
        ref.current.scrollBy({ top: scrollSpeed, behavior: 'smooth' }); // Use scrollSpeed here
        requestAnimationFrame(scroll);
      } else {
        // Scroll to top with a 2-second delay before restarting
        setTimeout(() => {
          ref.current.scrollTo({ top: 0, behavior: 'smooth' });
          setTimeout(() => requestAnimationFrame(scroll), 3000); // Wait 2 seconds before restarting the scroll
        }, 2000); // Delay before resetting scroll position
      }
    };

    requestAnimationFrame(scroll);
  };

  // Initialize scrolling for each ref when component mounts
  useEffect(() => {
    scrollAndReset(kbRef);
    scrollAndReset(ubRef);
    scrollAndReset(kpRef);
    scrollAndReset(uaRef);
    scrollAndReset(uuRef);
    scrollAndReset(missedRef); // Add auto-scroll for the "missed" queue
  }, [queues]);

  // Function to render a section for each queue category
  const QueueSection = ({ title, queues, innerRef, bgColor, textColor, count }) => (
    <div className={`p-4 flex-1 min-w-0 ${bgColor}`}>
     <p className="text-2xl font-bold mb-2 text-white">
      {title}{' '}
      <span
        className="text-lg font-semibold"
        style={{
          fontSize: '1.4rem', // Perbesar ukuran teks dalam kurung
          color: 'white', // Gunakan warna putih terang
        }}
      >
        ({count} Antrian)
      </span>
    </p>
      <div
        className="scrollable-table overflow-y-auto flex-grow scrollbar-hide"
        ref={innerRef}
        style={{ maxHeight: '115px' }}
      >
        <div className="flex flex-col gap-2 mt-4 font-bold">
          {queues.length > 0 ? (
            queues.map((queue, index) => (
              <span key={index} className={`bg-white ${textColor} text-3xl p-2 shadow text-center font-bold`}>
                {queue.nomorAntrean}
              </span>
            ))
          ) : (
            <span className={`bg-white ${textColor} p-2 shadow text-center font-bold text-2xl`}>
              Belum Ada Antrian
            </span>
          )}
        </div>
      </div>
    </div>
  );
  


// Fungsi untuk membagi array menjadi beberapa grup
const chunkArray = (array, chunkSize) => {
  if (!array || chunkSize <= 0) return [];
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
};

// Bagi data antrean missed ke dalam 3 grup
const missedChunks = chunkArray(queues.missed, Math.ceil(queues.missed.length / 3)); // Dibagi menjadi 3 grup


{/* Gabungkan dan Urutkan BPJS Karyawan dan Umum */}
const mergedQueues = [...queues.KB, ...queues.UB].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

return (
  <div className="bg-white p-4 shadow-lg border border-green-700 w-full">
    {/* Bagian Header Antrian Selanjutnya */}
    <div className="w-full mb-4">
      <h2 className="text-3xl font-bold text-green-700 text-center">
        Antrian Selanjutnya
      </h2>
    </div>

    {/* Bagian Kotak-Kotak Antrian */}
    <div className="flex w-full gap-4 flex-wrap justify-center">
  {/* Gabungkan Antrian dalam Satu QueueSection */}
  <QueueSection
    title="BPJS"
    queues={mergedQueues}
    innerRef={kbRef}
    bgColor="bg-green-700"
    textColor="text-green-700"
    count={mergedQueues.length} // Tambahkan jumlah antrean
  />
  {/* Karyawan PJPK */}
  <QueueSection
    title="PJPK"
    queues={queues.KP}
    innerRef={kpRef}
    bgColor="bg-green-700"
    textColor="text-green-700"
    count={queues.KP.length} // Tambahkan jumlah antrean
  />
  {/* Umum ASURANSI */}
  <QueueSection
    title="ASURANSI"
    queues={queues.UA}
    innerRef={uaRef}
    bgColor="bg-green-700"
    textColor="text-green-700"
    count={queues.UA.length} // Tambahkan jumlah antrean
  />
  {/* Umum UMUM */}
  <QueueSection
    title="UMUM"
    queues={queues.UU}
    innerRef={uuRef}
    bgColor="bg-green-700"
    textColor="text-green-700"
    count={queues.UU.length} // Tambahkan jumlah antrean
  />
</div>
  </div>
);
};

export default NextQueue;