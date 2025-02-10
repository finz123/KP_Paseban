import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import logo from '../../../../public/images/logo.png'

const InfoBar = () => {
  const [time, setTime] = useState(null);

  useEffect(() => {
    const updateClock = () => {
      setTime(new Date());
    };
    const timerId = setInterval(updateClock, 1000);
    return () => clearInterval(timerId);
  }, []);

  if (!time) {
    return null;
  }

  return (
    <div className="w-full h-full bg-white p-4 rounded-lg shadow-lg text-green-700 flex items-center justify-between + border border-green-700">
          {/* Jam dan Tanggal (diatur secara vertikal) */}
          <div className="flex flex-col items-center">
        <div className="text-2xl font-bold">
          {time.toLocaleTimeString()}
        </div>
        <div className="text-2xl">
          {time.toLocaleDateString()}
        </div>
      </div>

          {/* Nama Layanan */}
          <div className="text-3xl font-bold text-center whitespace-pre-line">
        Klinik{'\n'}Pratama
        </div>


            {/* Logo */}
        <div className="flex items-center">
        <Image
          src={logo}
          alt="Logo"
          width={250} // Sesuaikan ukuran jika perlu
          height={250}
        />

        </div>


    </div>
  );
};

export default InfoBar;