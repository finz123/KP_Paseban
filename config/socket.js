let io;

module.exports = {
  init: (server) => {
    const { Server } = require('socket.io');
    io = new Server(server, {
      cors: {
        origin: ["http://localhost:3200" || "http://192.168.6.79:3200"], // IP dan port frontend
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
        credentials: true,
      },
      pingTimeout: 20000, // Timeout yang sama dengan frontend
      pingInterval: 5000, // Interval ping yang sama
      transports: ["websocket", "polling"], // Izinkan polling jika WebSocket gagal
    });
    console.log('Socket.IO initialized');
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.IO belum diinisialisasi!');
    }
    return io;
  },
};
