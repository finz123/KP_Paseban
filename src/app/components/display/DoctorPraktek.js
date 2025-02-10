import { useEffect, useRef, useState } from 'react';
import DoctorCuti from '../display/DoctorCuti';

const DoctorPraktek = () => {
    const tableRef = useRef(null);
    const [showDoctorCuti, setShowDoctorCuti] = useState(false);
    const [loading, setLoading] = useState(true); // State for loading status
    const [doctorData, setDoctorData] = useState([]); // State for holding doctor data

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
              setShowDoctorCuti(true); // Switch to DoctorCuti
              tableRef.current.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll back to top
            }, 1000); // Wait before switching
          }
        }
      }, 100); // Scroll every 100ms
  
      return () => clearInterval(scrollInterval); // Clean up interval
    }, []);
  
    if (showDoctorCuti) {
      return <DoctorCuti />; // Render DoctorCuti if flag is set
    }
        
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-green-600">
        <h2 className="text-2xl font-bold text-green-600 mb-2">Dokter Praktek Hari Ini</h2>
        <div className="scrollable-table overflow-y-auto scrollbar-hide" ref={tableRef} style={{ maxHeight: '220px' }}>
          <table className="w-full text-left table-auto">
            <thead className="sticky top-0 bg-green-600"> {/* Tambahkan sticky di sini */}
              <tr>
                <th className="px-6 py-3 font-bold bg-green-600 text-white text-xl">Nama Dokter</th>
                <th className="px-6 py-3 font-bold bg-green-600 text-white text-xl">Spesialis</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white">
                <td className="border px-6 py-4 text-xl text-green-600 font-bold">Dr. Ahmad</td>
                <td className="border px-6 py-4 text-xl text-green-600 font-bold">Kulit</td>
              </tr>
              <tr className="bg-white">
                <td className="border px-6 py-4 text-xl text-green-600 font-bold">Dr. Dian</td>
                <td className="border px-6 py-4 text-xl text-green-600 font-bold">THT</td>
              </tr>
              <tr className="bg-white">
                <td className="border px-6 py-4 text-xl text-green-600 font-bold">Dr. Siti</td>
                <td className="border px-6 py-4 text-xl text-green-600 font-bold">Gigi</td>
              </tr>
              <tr className="bg-white">
                <td className="border px-6 py-4 text-xl text-green-600 font-bold">Dr. Rina</td>
                <td className="border px-6 py-4 text-xl text-green-600 font-bold">Mata</td>
              </tr>
              {/* Tambahkan lebih banyak dokter praktek jika diperlukan */}
            </tbody>
          </table>
        </div>
      </div>
    );
};

export default DoctorPraktek;
