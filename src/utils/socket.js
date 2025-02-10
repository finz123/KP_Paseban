//src\utils\socket.js
import { io } from 'socket.io-client';


const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3100", {
  reconnection: true,          // Reconnect otomatis jika terputus
  reconnectionAttempts: 5,     // Maksimal percobaan reconnect
  reconnectionDelay: 3000,     // Jeda antar reconnect
  pingTimeout: 20000,          // Timeout koneksi (20 detik)
  pingInterval: 5000,          // Interval ping ke server
  transports: ["websocket", "polling"], // WebSocket + Polling sebagai fallback
}); 

export default socket;
