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

let player = { x: 0, y: 0 };

io.on('connection', (socket) => {
  console.log('a user connected');
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  
  socket.on('move', (data) => {
    if (data.key === 'ArrowUp') {
        player.y += 1; // Move up
    } 
    if (data.key === 'ArrowDown') {
        player.y -= 1; // Move up
    }
    if (data.key === 'ArrowLeft') {
        player.x -= 1; // Move up
    }
    if (data.key === 'ArrowRight') {
        player.x += 1; // Move up
    }
    io.emit('updatePosition', { x: player.x, y: player.y });
    console.log('move', player);
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
