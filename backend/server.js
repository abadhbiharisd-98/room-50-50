require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const setupSocket = require('./sockets/socketHandler');

// Routes
const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const reportRoutes = require('./routes/reportRoutes');
const settlementRoutes = require('./routes/settlementRoutes');

const app = express();
const server = http.createServer(app);

// Socket.IO with CORS enabled
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Attach io to express app so controllers can emit events
app.set('io', io);

// Setup Socket.IO connection logic
setupSocket(io);

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Base Health Check Route
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    app: 'RoomMates - Expense Splitter API',
    version: '1.0.0',
    documentation: 'See README.md for endpoint specifications',
  });
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/settlements', settlementRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 RoomMates Server running on port ${PORT}`);
  console.log(`📡 Socket.IO real-time ready on port ${PORT}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}`);
});
