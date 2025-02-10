//src\app\components\kinerja\LoketPerformance.js
import { useEffect, useState } from 'react';
import axios from 'axios';
import { PresentationChartBarIcon } from '@heroicons/react/24/outline'; // Import Heroicons

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3100";

export default function LoketPerformance({ filter }) {
  const [loketPerformance, setLoketPerformance] = useState([]);

  useEffect(() => {
    const fetchLoketPerformance = async () => {
      try {
        const response = await axios.get("/antrean/list"); // Gunakan path relatif
        const data = response.data;

        // Filter berdasarkan tanggal jika ada filter
        const filteredData = filter
          ? data.filter((item) => {
              const date = new Date(item.waiting_stamp).toLocaleDateString('en-CA');
              return date >= filter.startDate && date <= filter.endDate;
            })
          : data;

        // Hitung rata-rata waktu pelayanan per loket
        const loketData = filteredData.reduce((acc, curr) => {
          if (curr.called_stamp && curr.complete_stamp) {
            const serviceTime =
              (new Date(curr.complete_stamp) - new Date(curr.called_stamp)) / 60000; // Dalam menit

            if (!acc[curr.loket]) acc[curr.loket] = { total: 0, count: 0 };
            acc[curr.loket].total += serviceTime;
            acc[curr.loket].count += 1;
          }
          return acc;
        }, {});

        const performance = Object.keys(loketData).map((loket) => ({
          loket,
          avgServiceTime: (loketData[loket].total / loketData[loket].count).toFixed(2), // 2 desimal
        }));

        setLoketPerformance(performance);
      } catch (error) {
        console.error('Error fetching loket performance:', error);
      }
    };

    fetchLoketPerformance();
  }, [filter]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <div className="flex items-center space-x-3 mb-4">
        {/* Header dengan Ikon */}
        <PresentationChartBarIcon className="h-10 w-10 text-green-600" />
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Performa Loket</h2>
          <p className="text-sm text-gray-500">Rata-rata waktu pelayanan per loket.</p>
        </div>
      </div>

      {/* Data Performa Loket */}
      <div>
        {loketPerformance.length > 0 ? (
          <ul className="space-y-3">
            {loketPerformance.map(({ loket, avgServiceTime }) => (
              <li
                key={loket}
                className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-md shadow-sm"
              >
                <span className="text-gray-800 font-medium">{loket}</span>
                <span className="text-green-600 font-bold">
                  {avgServiceTime} menit
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Tidak ada data untuk rentang tanggal yang dipilih.</p>
        )}
      </div>
    </div>
  );
}