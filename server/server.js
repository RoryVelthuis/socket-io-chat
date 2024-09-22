const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors'); // Import the CORS package

const app = express();
const server = http.createServer(app);

// Apply CORS middleware
app.use(cors({
  origin: 'http://localhost:5173',  // Allow only this specific frontend origin
  methods: ['GET', 'POST'],
}));

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',  // Same origin for Socket.io
    methods: ['GET', 'POST'],
  }
});

// When a client connects
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Send a welcome message to the newly connected client
  socket.emit('welcome', { message: 'Welcome to the game!', playerId: socket.id });

  // Listen to chat messages from this client
  socket.on('chatMessage', (data) => {
    let timestamp = new Date().toISOString(); // Generate the current timestamp
    let message = data.message;
    console.log(`Message from: [ ${socket.id} ]: ${message}`);
    io.emit('chatMessage', { playerId: socket.id, message: message, timestamp: timestamp });
  });

  // Listen to private messages from this client
  socket.on('privateMessage', ({ to, message }) => {
    let timestamp = new Date().toISOString(); // Generate the current timestamp
    io.to(to).emit('privateMessage', { playerId: socket.id, message: message, timestamp: timestamp });
});

  // Broadcast a global message to all clients when someone disconnects
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
    io.emit('playerDisconnected', { playerId: socket.id });
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
