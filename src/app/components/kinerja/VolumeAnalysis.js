//src\app\components\kinerja\VolumeAnalysis.js
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ChartBarIcon } from '@heroicons/react/24/outline'; // Import Heroicons

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3100";

export default function VolumeAnalysis({ filter }) {
  const [volumeData, setVolumeData] = useState([]);
  const [totalAntrean, setTotalAntrean] = useState(0);
  const [category, setCategory] = useState('');

  useEffect(() => {
    const fetchVolumeData = async () => {
      try {
        const response = await axios.get('/antrean/list');
        const data = response.data;

        // Filter data berdasarkan rentang tanggal
        const filteredData = filter
          ? data.filter((item) => {
              const date = new Date(item.waiting_stamp).toLocaleDateString('en-CA');
              return date >= filter.startDate && date <= filter.endDate;
            })
          : data;

        // Tentukan kategori berdasarkan rentang hari
        const start = new Date(filter.startDate);
        const end = new Date(filter.endDate);
        const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)); // Selisih dalam hari

        if (diffDays === 1) {
          setCategory('Harian');
        } else if (diffDays >= 2 && diffDays <= 7) {
          setCategory('Mingguan');
        } else if (diffDays >= 30 && diffDays < 365) {
          setCategory('Bulanan');
        } else if (diffDays >= 365) {
          setCategory('Tahunan');
        } else {
          setCategory(`Rentang Tanggal (${filter.startDate} hingga ${filter.endDate})`);
        }

        // Hitung volume berdasarkan tanggal
        const volumeByDate = filteredData.reduce((acc, curr) => {
          const date = new Date(curr.waiting_stamp).toLocaleDateString('en-CA'); // yyyy-mm-dd
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});

        setVolumeData(Object.entries(volumeByDate)); // Ubah ke array untuk iterasi
        setTotalAntrean(filteredData.length); // Hitung total antrean
      } catch (error) {
        console.error('Error fetching volume data:', error);
      }
    };

    fetchVolumeData();
  }, [filter]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <div className="flex items-center justify-between">
        {/* Header dengan Ikon */}
        <div className="flex items-center space-x-3">
          <ChartBarIcon className="h-10 w-10 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Volume Layanan ({category})</h2>
            <p className="text-sm text-gray-500">Rentang: {filter.startDate} hingga {filter.endDate}</p>
          </div>
        </div>
        {/* Total Antrean */}
        <div className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg shadow">
          <p className="text-sm font-medium">Total Antrean</p>
          <p className="text-xl font-bold">{totalAntrean}</p>
        </div>
      </div>

      {/* Data Volume */}
      <div className="mt-6">
        {volumeData.length > 0 ? (
          <ul className="space-y-3">
            {volumeData.map(([date, count]) => (
              <li key={date} className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-md shadow-sm">
                <span className="text-gray-800 font-medium">{date}</span>
                <span className="text-indigo-600 font-bold">{count} antrean</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 mt-4">Tidak ada data untuk rentang tanggal yang dipilih.</p>
        )}
      </div>
    </div>
  );
}