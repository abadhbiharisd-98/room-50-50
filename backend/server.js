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

// Base Health Check & Welcome Route
app.get('/', (req, res) => {
  if (req.accepts('html')) {
    return res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>RoomMates - Backend API</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
          body { background: #0F172A; color: #F8FAFC; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; }
          .card { background: #1E293B; border: 1px solid #334155; border-radius: 20px; padding: 40px; max-width: 540px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
          .badge { display: inline-block; background: rgba(16, 185, 129, 0.2); color: #34D399; font-weight: 700; font-size: 13px; padding: 6px 14px; border-radius: 20px; border: 1px solid rgba(16, 185, 129, 0.4); margin-bottom: 20px; }
          h1 { font-size: 28px; font-weight: 800; margin-bottom: 12px; }
          p { color: #94A3B8; font-size: 15px; line-height: 1.6; margin-bottom: 25px; }
          .btn { display: inline-flex; align-items: center; justify-content: center; gap: 10px; background: #2563EB; color: #FFFFFF; text-decoration: none; font-weight: 700; font-size: 16px; padding: 14px 28px; border-radius: 12px; transition: all 0.2s; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4); }
          .btn:hover { background: #1D4ED8; transform: translateY(-2px); }
          .info-box { background: #0F172A; border-radius: 12px; padding: 15px; margin-top: 25px; text-align: left; font-size: 13px; color: #CBD5E1; }
          .info-box span { color: #38BDF8; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="badge">● BACKEND API ONLINE (PORT 5000)</div>
          <h1>RoomMates Server Ready</h1>
          <p>Ye aapka <b>Backend REST API Server</b> hai jo MongoDB aur Socket.IO ke sath chal raha hai.</p>
          <p>Apna <b>Frontend Mobile App Dashboard</b> dekhne ke liye neeche button dabayein:</p>
          <a class="btn" href="http://localhost:8081" target="_blank">
            📱 Open RoomMates Mobile App UI
          </a>
          <div class="info-box">
            <div>• <b>Frontend UI:</b> <span>http://localhost:8081</span></div>
            <div>• <b>Backend API:</b> <span>http://localhost:5000</span></div>
            <div>• <b>Database:</b> <span>MongoDB Connected</span></div>
          </div>
        </div>
      </body>
      </html>
    `);
  }

  res.json({
    status: 'online',
    app: 'RoomMates - Expense Splitter API',
    version: '1.0.0',
    frontendUrl: 'http://localhost:8081',
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

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`🚀 RoomMates Server running on port ${PORT}`);
  console.log(`📡 Socket.IO real-time ready on port ${PORT}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}`);
});

