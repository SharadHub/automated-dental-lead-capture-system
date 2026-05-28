require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// API routes
app.use('/api', routes);

// Socket.io for real-time notifications
io.on('connection', (socket) => {
  console.log('Admin connected:', socket.id);

  socket.on('join_admin', () => {
    socket.join('admin_room');
  });

  socket.on('disconnect', () => {
    console.log('Admin disconnected:', socket.id);
  });
});

// Make io accessible to controllers
app.set('io', io);

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Scheduled email reader (every 15 minutes)
if (process.env.IMAP_USER && process.env.IMAP_PASS) {
  const { fetchNewEmails } = require('./services/emailReader.service');
  setInterval(async () => {
    try {
      const emails = await fetchNewEmails();
      if (emails.length) console.log(`Processed ${emails.length} new emails`);
    } catch (err) {
      console.error('Email reader error:', err.message);
    }
  }, 15 * 60 * 1000);
}

module.exports = { app, io };
