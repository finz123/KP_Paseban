import React, { useEffect, useState } from 'react';

const MarqueeFooter = () => {
  const messages = [
    "Selamat datang, silahkan menunggu panggilan antrian. Terima Kasih.",
    "@Display Klinik Pratama Paseban 2024 - SIRS Developer Team"
    ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length); // Cycle through messages
    }, 15000); // Change message every 10 seconds

    return () => clearInterval(interval); // Clean up interval on unmount
  }, [messages.length]);

  return (
    <footer className="bg-blue-700 text-white p-2 mt-4">
      <marquee behavior="scroll" direction="left" className="font-bold text-1xl">
        {messages[currentMessageIndex]}
      </marquee>
      </footer>
  );
};

export default MarqueeFooter;