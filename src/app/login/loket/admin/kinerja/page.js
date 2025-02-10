//src\app\login\loket\admin\kinerja\page.js
'use client';

import { useState, useEffect } from 'react';
import WaitTimeAnalysis from '@/app/components/kinerja/WaitTimeAnalyis';
import ServiceTimeAnalysis from '@/app/components/kinerja/ServiceTimaAnalysis';
import NoShowAndCancelAnalysis from '@/app/components/kinerja/NoShowAndCancelAnalysis';
import VolumeAnalysis from '@/app/components/kinerja/VolumeAnalysis';
import LoketPerformance from '@/app/components/kinerja/LoketPerformance';
import DateFilter from '@/app/components/kinerja/DataFilter';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

export default function KinerjaPage() {
  const [filter, setFilter] = useState(null);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [greeting, setGreeting] = useState('');
  const router = useRouter();

  const handleFilter = (filter) => {
    setFilter(filter);
  };

  // **1. Fetch Data User dari `/me`**
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3100';
  
      if (!token) {
        console.warn('Token tidak ditemukan. Redirecting to login...');
        router.push('/login');
        return;
      }
  
      try {
        // Initial fetch to /me
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: { 'x-token': token, 'Content-Type': 'application/json' },
        });
  
        if (response.ok) {
          const data = await response.json();
          setUsername(data.username);
          setRole(data.role);
          return;
        }
  
        // Handle expired token or other errors
        if (response.status === 401 || response.status === 403) {
          console.log('Token expired. Attempting to refresh...');
  
          const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
          });
  
          if (!refreshResponse.ok) {
            throw new Error('Refresh token invalid or expired');
          }
  
          const refreshData = await refreshResponse.json();
          localStorage.setItem('token', refreshData.accessToken);
  
          // Retry the /me request with the new token
          const retryResponse = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: { 'x-token': refreshData.accessToken, 'Content-Type': 'application/json' },
          });
  
          if (retryResponse.ok) {
            const retryData = await retryResponse.json();
            setUsername(retryData.username);
            setRole(retryData.role);
          } else {
            throw new Error(`Retry failed with status ${retryResponse.status}`);
          }
        } else {
          throw new Error(`Unexpected response status: ${response.status}`);
        }
      } catch (error) {
        console.error('Error during user data fetch:', error.message);
        router.push('/login');
      }
    };
  
    fetchUserData();
  }, [router]);
  

  // **2. Update Greeting**
  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      setGreeting(
        hour < 10
          ? 'Selamat Pagi'
          : hour < 15
          ? 'Selamat Siang'
          : hour < 18
          ? 'Selamat Sore'
          : 'Selamat Malam'
      );
    };
    updateGreeting();
    const intervalId = setInterval(updateGreeting, 60000);
    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white p-8">
      <div className="space-y-12">
        {/* Header */}
        <div className="bg-white text-[#00796b] p-8 rounded-lg shadow-lg relative">
          <h1 className="text-4xl font-bold">Kinerja Pelayanan</h1>
          <p className="text-lg mt-2">
            Analisis dan laporan kinerja pelayanan berdasarkan data antrean.
          </p>

          {/* Tombol Kembali */}
          <button
            onClick={() => window.location.href = '/login/loket'}
            className="absolute top-4 right-4 bg-[#00796b] text-white font-medium rounded-full px-6 py-3 flex items-center gap-2 shadow-lg hover:bg-[#005f56] transition duration-300"
          >
            <ArrowBackIcon style={{ fontSize: '1.5rem' }} /> {/* Ikon Material UI */}
            Kembali
          </button>
        </div>

        {/* Filter */}
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-[#00796b]">
          <DateFilter onFilter={handleFilter} />
        </div>

        {/* Analisis */}
        {filter ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Analisis Waktu Tunggu */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <WaitTimeAnalysis filter={filter} />
            </div>

            {/* Analisis Penyelesaian dan Pembatalan */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <NoShowAndCancelAnalysis filter={filter} />
            </div>

            {/* Analisis Waktu Pelayanan */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <ServiceTimeAnalysis filter={filter} />
            </div>

            {/* Volume Layanan */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 col-span-3">
              <VolumeAnalysis filter={filter} />
            </div>

            {/* Performa Loket */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 col-span-3">
              <LoketPerformance filter={filter} />
            </div>
          </div>
        ) : (
          <div className="text-center mt-12">
            <p className="text-gray-500 text-lg">Terapkan filter untuk melihat data.</p>
          </div>
        )}
      </div>
      <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-indigo-50 to-white p-8"
    >
    </motion.div>

    </div>
  );
}