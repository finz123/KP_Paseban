import { useState, useEffect } from 'react';
import debounce from 'lodash.debounce';

export default function DateFilter({ onFilter }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Set default tanggal saat komponen pertama kali di-mount
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-CA'); // Format: YYYY-MM-DD
    setStartDate(formattedDate);
    setEndDate(formattedDate);
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      const debouncedFilter = debounce(() => {
        if (onFilter) {
          onFilter({ startDate, endDate });
        }
      }, 300); // Delay 300ms

      debouncedFilter();

      // Bersihkan debounce saat komponen unmount
      return () => debouncedFilter.cancel();
    }
  }, [startDate, endDate, onFilter]); // Dependensi yang benar

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-[#00796b] mb-4">Filter Berdasarkan Tanggal</h2>
      <div className="flex items-center gap-4">
        {/* Input Tanggal Mulai */}
        <div className="flex items-center gap-2">
          <svg
            className="h-5 w-5 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path d="M3 8h18M16 2v4M8 2v4M3 22h18c1 0 2-1 2-2V8c0-1-1-2-2-2H3c-1 0-2 1-2 2v12c0 1 1 2 2 2z" />
          </svg>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Input Tanggal Sampai */}
        <div className="flex items-center gap-2">
          <svg
            className="h-5 w-5 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path d="M3 8h18M16 2v4M8 2v4M3 22h18c1 0 2-1 2-2V8c0-1-1-2-2-2H3c-1 0-2 1-2 2v12c0 1 1 2 2 2z" />
          </svg>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}
