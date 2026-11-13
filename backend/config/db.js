const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/roommates';
    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Server ko crash nahi karenge agar local DB nahi chal raha ho
    console.log('⚠️ Running without database connection. Connect MongoDB Atlas URI in backend/.env');
  }
};

module.exports = connectDB;
