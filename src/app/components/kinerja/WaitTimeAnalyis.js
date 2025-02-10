//src\app\components\kinerja\WaitTimeAnalyis.js
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ClockIcon } from '@heroicons/react/24/outline';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3100";

export default function WaitTimeAnalysis() {
  const [averageWaitTime, setAverageWaitTime] = useState(null);

  useEffect(() => {
    const fetchWaitTime = async () => {
      try {
        const response = await axios.get('/antrean/list');
        const data = response.data;

        const waitTimes = data
          .filter(item => item.waiting_stamp && item.called_stamp)
          .map(item => {
            const waitingTime =
              (new Date(item.called_stamp) - new Date(item.waiting_stamp)) / 60000;
            return waitingTime;
          });

        const avgWaitTime =
          waitTimes.reduce((acc, time) => acc + time, 0) / waitTimes.length;

        setAverageWaitTime(avgWaitTime.toFixed(2)); // Menampilkan 2 angka desimal
      } catch (error) {
        console.error('Error fetching wait time:', error);
      }
    };

    fetchWaitTime();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <div className="flex items-center space-x-4">
        {/* Ikon */}
        <div className="flex-shrink-0 bg-indigo-100 p-3 rounded-full">
          <ClockIcon className="h-8 w-8 text-indigo-600" />
        </div>
        {/* Judul */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Analisis Waktu Tunggu</h2>
          <p className="text-sm text-gray-500">Rata-rata waktu pelanggan menunggu layanan.</p>
        </div>
      </div>

      <div className="mt-6 text-center">
        {averageWaitTime !== null ? (
          <p className="text-4xl font-bold text-indigo-600">
            {averageWaitTime} <span className="text-lg text-gray-700">menit</span>
          </p>
        ) : (
          <div className="text-gray-500 animate-pulse">Menghitung rata-rata waktu tunggu...</div>
        )}
      </div>
    </div>
  );
}