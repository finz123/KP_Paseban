const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); 
const cors = require('cors');
require('dotenv').config();

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const antreanRoutes = require('./routes/antreanRoutes');
const loketRoutes = require('./routes/loketRoutes');
const resetLogsRoutes = require('./routes/resetLogsRoutes');
const resetRoutes = require('./routes/resetRoutes');


// Middleware
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost","http://192.168.6.79"); // Origin frontend
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
  });
  

// Middleware
const corsOptions = {
    origin: ["http://localhost","http://192.168.6.79" ,"http://localhost:3200","http://192.168.6.79:3200"], // Tambahkan semua variasi origin
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  };
  
  app.use((req, res, next) => {
    console.log("Request Origin:", req.headers.origin); // Log origin dari request
    next();
  });
  
  app.use(cors(corsOptions));
    
  // Handle preflight OPTIONS request
app.options("*", cors(corsOptions)); // Tangkap OPTIONS request


  app.use(bodyParser.json());
app.use(cookieParser());

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use('/antrean', antreanRoutes);
app.use('/loket', loketRoutes);
app.use('/reset-logs', resetLogsRoutes);
app.use('/reset', resetRoutes);



// Error handling middleware
app.use(errorHandler);

module.exports = app; // Ekspor app
