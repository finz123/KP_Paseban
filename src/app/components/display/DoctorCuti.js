import { useEffect, useRef, useState } from 'react';
import DoctorPraktek from '../display/DoctorPraktek';

const DoctorCuti = () => {
    const tableRef = useRef(null);
    const [showDoctorPraktek, setShowDoctorPraktek] = useState(false);
    const [doctorData, setDoctorData] = useState([]); // State for holding doctor data
    const [loading, setLoading] = useState(true); // State for loading status

    useEffect(() => {
      const scrollInterval = setInterval(() => {
        if (tableRef.current) {
          tableRef.current.scrollBy({
            top: 1,
            behavior: 'smooth',
          });
  
          // Check if scrolled to the bottom
          if (
            tableRef.current.scrollTop + tableRef.current.clientHeight >=
            tableRef.current.scrollHeight
          ) {
            clearInterval(scrollInterval); // Stop scrolling
            setTimeout(() => {
              setShowDoctorPraktek(true); // Switch to DoctorPraktek
              tableRef.current.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll back to top
            }, 1000); // Wait before switching
          }
        }
      }, 100); // Scroll every 100ms
  
      return () => clearInterval(scrollInterval); // Clean up interval
    }, []);
  
    if (showDoctorPraktek) {
      return <DoctorPraktek />; // Render DoctorPraktek if flag is set
    }
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border border-red-custom">
      <h2 className="text-2xl font-bold text-red-custom mb-2">Dokter Cuti Hari Ini</h2>
      <div className="scrollable-table overflow-y-auto scrollbar-hide" ref={tableRef} style={{ maxHeight: '220px' }}>
        <table className="w-full text-left table-auto">
          <thead className="sticky top-0 bg-red-600"> {/* Tambahkan sticky di sini */}
            <tr>
              <th className="px-6 py-3 font-bold text-white text-xl">Nama Dokter</th>
              <th className="px-6 py-3 font-bold text-white text-xl">Spesialis</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white">
              <td className="border px-6 py-4 text-xl text-red-custom font-bold">Dr. Andi</td>
              <td className="border px-6 py-4 text-xl text-red-custom font-bold">Kardiologi</td>
            </tr>
            <tr className="bg-white">
              <td className="border px-6 py-4 text-xl text-red-custom font-bold">Dr. Budi</td>
              <td className="border px-6 py-4 text-xl text-red-custom font-bold">Bedah Umum</td>
            </tr>
            <tr className="bg-white">
              <td className="border px-6 py-4 text-xl text-red-custom font-bold">Dr. Chandra</td>
              <td className="border px-6 py-4 text-xl text-red-custom font-bold">Anak</td>
            </tr>
            <tr className="bg-white">
              <td className="border px-6 py-4 text-xl text-red-custom font-bold">Dr. Dedi</td>
              <td className="border px-6 py-4 text-xl text-red-custom font-bold">Mata</td>
            </tr>
            <tr className="bg-white">
              <td className="border px-6 py-4 text-xl text-red-custom font-bold">Dr. Chandra</td>
              <td className="border px-6 py-4 text-xl text-red-custom font-bold">Anak</td>
            </tr>
            <tr className="bg-white">
              <td className="border px-6 py-4 text-xl text-red-custom font-bold">Dr. Dedi</td>
              <td className="border px-6 py-4 text-xl text-red-custom font-bold">Mata</td>
            </tr>
            <tr className="bg-white">
              <td className="border px-6 py-4 text-xl text-red-custom font-bold">Dr. Chandra</td>
              <td className="border px-6 py-4 text-xl text-red-custom font-bold">Anak</td>
            </tr>
            <tr className="bg-white">
              <td className="border px-6 py-4 text-xl text-red-custom font-bold">Dr. Dedi</td>
              <td className="border px-6 py-4 text-xl text-red-custom font-bold">Mata</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorCuti;
