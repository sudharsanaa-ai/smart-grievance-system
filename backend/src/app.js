const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const hpp = require('hpp');
const errorHandler = require('./middleware/errorMiddleware');

const app = express();

// Trust proxy for rate limiting (needed for Render/Vercel)
app.set('trust proxy', 1);

// Middleware
app.use(cors({
  origin: [
    'https://smart-grievance-system-delta.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true
}));
app.use(express.json({ limit: '10kb' })); 
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Set security HTTP headers
app.use(helmet());

// Limit requests from same API (Disabled for debugging)
// const limiter = rateLimit({ ... });
// app.use('/api', limiter);



// Prevent HTTP parameter pollution
app.use(hpp());

// Basic route to test server
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API is running' });
});

// API Routes
const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
