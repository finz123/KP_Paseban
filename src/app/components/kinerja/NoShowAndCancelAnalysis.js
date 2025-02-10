//src\app\components\kinerja\NoShowAndCancelAnalysis.js
import { useEffect, useState } from 'react';
import axios from 'axios';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3100";

export default function CompletedAndCancelAnalysis() {
  const [completedCount, setCompletedCount] = useState(0);
  const [cancelCount, setCancelCount] = useState(0);

  useEffect(() => {
    const fetchCompletedAndCancel = async () => {
      try {
        const response = await axios.get("/antrean/list"); // Gunakan path relatif
        const data = response.data;

        // Hitung antrean selesai
        const completed = data.filter((item) => item.complete_stamp !== null).length;

        // Hitung antrean yang dibatalkan
        const cancel = data.filter((item) => item.cancel_stamp !== null).length;

        setCompletedCount(completed);
        setCancelCount(cancel);
      } catch (error) {
        console.error('Error fetching completed and cancel counts:', error);
      }
    };

    fetchCompletedAndCancel();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <div className="flex items-center space-x-4">
        {/* Ikon */}
        <div className="flex-shrink-0 bg-green-100 p-3 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-green-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m0 0v1a3 3 0 006 0v-1m-6-2a3 3 0 00-6 0v1m0 0a3 3 0 006 0v-1z"
            />
          </svg>
        </div>
        {/* Judul */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Analisis Penyelesaian dan Pembatalan</h2>
          <p className="text-sm text-gray-500">Jumlah antrean yang selesai atau dibatalkan.</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        {/* Selesai */}
        <div className="bg-green-50 p-4 rounded-lg shadow-md text-center">
          <p className="text-sm font-medium text-gray-600">Jumlah Selesai</p>
          <p className="text-3xl font-bold text-green-600">{completedCount}</p>
        </div>
        {/* Pembatalan */}
        <div className="bg-red-50 p-4 rounded-lg shadow-md text-center">
          <p className="text-sm font-medium text-gray-600">Jumlah Pembatalan</p>
          <p className="text-3xl font-bold text-red-600">{cancelCount}</p>
        </div>
      </div>
    </div>
  );
}