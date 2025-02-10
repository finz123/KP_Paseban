//src\app\components\kinerja\ServiceTimaAnalysis.js
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ClockIcon } from '@heroicons/react/24/outline'; // Import ClockIcon

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3100";

export default function ServiceTimeAnalysis() {
  const [averageServiceTime, setAverageServiceTime] = useState(null);

  useEffect(() => {
    const fetchServiceTime = async () => {
      try {
        const response = await axios.get('/antrean/list');
        const data = response.data;

        const serviceTimes = data
          .filter(item => item.called_stamp && item.complete_stamp)
          .map(item => {
            const serviceTime =
              (new Date(item.complete_stamp) - new Date(item.called_stamp)) / 60000;
            return serviceTime;
          });

        const avgServiceTime =
          serviceTimes.reduce((acc, time) => acc + time, 0) / serviceTimes.length;

        setAverageServiceTime(avgServiceTime.toFixed(2)); // Menampilkan 2 angka desimal
      } catch (error) {
        console.error('Error fetching service time:', error);
      }
    };

    fetchServiceTime();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <div className="flex items-center space-x-4">
        {/* Ikon Clock */}
        <div className="flex-shrink-0 bg-green-100 p-3 rounded-full">
          <ClockIcon className="h-8 w-8 text-green-600" />
        </div>
        {/* Judul */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Analisis Waktu Pelayanan</h2>
          <p className="text-sm text-gray-500">Rata-rata waktu pelayanan yang diberikan kepada pelanggan.</p>
        </div>
      </div>

      <div className="mt-6 text-center">
        {averageServiceTime !== null ? (
          <p className="text-4xl font-bold text-green-600">
            {averageServiceTime} <span className="text-lg text-gray-700">menit</span>
          </p>
        ) : (
          <div className="text-gray-500 animate-pulse">Menghitung rata-rata waktu pelayanan...</div>
        )}
      </div>
    </div>
  );
}