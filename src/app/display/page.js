'use client'
import QueueCall from '../components/display/QueueCall';
import ServingQueue from '../components/display/ServingQueue';
import MissedQueue from '../components/display/MissedQueue'; // Import MissedQueue
import NextQueue from '../components/display/NextQueue';
import InfoBar from '../components/display/InfoBar';
import MarqueeFooter from '../components/display/MarqueeFooter';

export default function Display() {
  return (
    <div className="bg-white h-screen flex flex-col p-4">
      {/* Kontainer Utama */}
      <div className="w-full mb-4">
        <InfoBar />
      </div>

      {/* Baris pertama: QueueCall, ServingQueue, dan MissedQueue */}
      <div className="flex flex-row gap-4 mb-4">
        <div className="flex-[1] basis-[25%]">
          <QueueCall />
        </div>
        <div className="flex-[1.2] basis-[30%]">
          <ServingQueue />
        </div>
        <div className="flex-[1.8] basis-[45%]">
          <MissedQueue />
        </div>
      </div>

      {/* Baris kedua: NextQueue */}
      <div className="w-full mb-4">
        <NextQueue />
      </div>

      {/* Footer */}
      <MarqueeFooter />
    </div>
  );
}