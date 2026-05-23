require('dotenv').config();

// Verify key environment variables are set (warn if missing)
const requiredEnvs = ['MONGO_URI', 'JWT_SECRET', 'EMAIL_USER', 'EMAIL_PASS'];
const missingEnvs = requiredEnvs.filter(env => !process.env[env]);
if (missingEnvs.length > 0) {
  console.warn('\n========================================================================');
  console.warn(`WARNING: Missing environment variables: ${missingEnvs.join(', ')}`);
  console.warn('Some features (like DB connection or emails) may fail to work.');
  console.warn('Please define these environment variables in your Render environment setup.');
  console.warn('========================================================================\n');
}

const http = require('http');
const app = require('./src/app');
const { Server } = require('socket.io');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Socket.io initialization
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || origin.startsWith('http://localhost') || origin.includes('vercel.app')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
  },
});

// Make io accessible in controllers
app.set('io', io);

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Connect to DB and start server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('DB Connection Failed:', err.message);
  process.exit(1);
});
