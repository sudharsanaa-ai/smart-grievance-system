const express = require('express');
const cors = require('cors');

const errorHandler = require('./middleware/errorMiddleware');

const app = express();

// CORS — must be first
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || origin.startsWith('http://localhost') || origin.includes('vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}))

// Body parsers
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API is running' });
});

// Root route
app.get("/", (req, res) => {
  res.send("Smart Grievance Backend Running");
});

// API Routes
const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);

// Global Error Handler (must be last)
app.use(errorHandler);

module.exports = app;
