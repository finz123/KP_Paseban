import { useEffect, useState } from 'react';
import axios from 'axios';
import socket from '@/utils/socket'; // Impor socket dari utils

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://192.168.6.79:3100";

const ServingQueue = () => {
    const [servingData, setServingData] = useState([
        { id: 1, counter: 'BUKA', label: 'Loket 1', status: 'inactive' },
        { id: 2, counter: 'BUKA', label: 'Loket 2', status: 'inactive' },
        { id: 3, counter: 'BUKA', label: 'Loket 3', status: 'inactive' },
        { id: 4, counter: 'BUKA', label: 'Loket 4', status: 'inactive' },
    ]);

    const fetchServingQueueData = async () => {
        try {
            const { data: loketData } = await axios.get(`${BASE_URL}/loket`); // Fetch data loket
            const { data: antreanData } = await axios.patch(`${BASE_URL}/antrean/status/today`); // Fetch data antrean
            
            const processedAntrean = antreanData.filter(queue => queue.status === 'processed');
            
            const updatedServingData = loketData.map(loket => {
                const antreanForLoket = processedAntrean.find(item => item.loket === loket.name);
                return {
                    id: loket.id,
                    label: loket.name,
                    counter: antreanForLoket?.nomorAntrean || (loket.status === 'active' ? 'BUKA' : 'TUTUP'),
                    status: loket.status,
                };
            });
    
            setServingData(updatedServingData); // Perbarui state dengan data terbaru
        } catch (error) {
            console.error('Error fetching serving queue data:', error);
        }
    };
    

    useEffect(() => {
        // Event listener untuk update real-time loket
        socket.on('servingQueueUpdate', (updatedData) => {
            console.log('Update real-time diterima:', updatedData);
            setServingData((prev) =>
                prev.map((loket) =>
                    loket.id === updatedData.id
                        ? { ...loket, counter: updatedData.counter, status: updatedData.status }
                        : loket
                )
            );
        });

        // Fetch initial data
        fetchServingQueueData();

        // Polling setiap 2 detik sebagai fallback
        const intervalId = setInterval(fetchServingQueueData, 2000);

        // Cleanup interval dan listener saat unmount
        return () => {
            socket.off('servingQueueUpdate'); // Matikan listener saat unmount
            clearInterval(intervalId);
        };
    }, []);

    return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-green-700">
            <h2 className="text-3xl font-bold text-blue-700 mb-4 text-center">Loket Antrian yang Sedang Melayani</h2>
            <div className="grid grid-cols-2 gap-6">
                {servingData.map(({ id, label, counter, status }) => (
                    <div
                        key={id}
                        className={`p-6 rounded-lg text-lg font-bold ${
                            status === 'active' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                        }`}
                    >
                        <p className="text-2xl font-bold">{label}</p>
                        <div className="flex gap-4 mt-4 justify-center font-bold">
                            <span
                                className={`p-4 rounded-lg shadow text-2xl ${
                                    status === 'active' || status === 'processed'
                                        ? 'bg-white text-green-700'
                                        : 'bg-white text-gray-700'
                                }`}
                            >
                                {counter}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    ); 
};

export default ServingQueue;