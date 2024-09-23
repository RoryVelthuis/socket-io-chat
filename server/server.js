const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors'); // Import the CORS package
const e = require('express');

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

const users = {}; // Store the connected users

function logAllCurrentUsers() {
  console.log(`Current users (${Object.keys(users).length}):`);
  for (const [id, user] of Object.entries(users)) {
    console.log(`[ ${id} ]: ${user.name}`);
  }
}

function emitUserList() {
  io.emit('userList', Object.values(users));
}

// When a client connects
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Store the connected user
  users[socket.id] = { id: socket.id, name: `User-${socket.id}` };

  // Send a welcome message to the newly connected client
  socket.emit('welcome', { message: ` User [ ${socket.id} ] joined. Welcome! `, playerId: socket.id });

  // Emit the updated user list to all clients
  emitUserList();

  // Log the current user list
  logAllCurrentUsers();


  // Listen to name change requests from this client
  socket.on('changeName', (newName) => {
      console.log(`User [ ${socket.id} ] changed name to: ${newName}`);
      users[socket.id].name = newName;
      socket.emit('nameChanged', { playerId: socket.id, name: newName });
      emitUserList();
      logAllCurrentUsers();
  });

  // Listen to chat messages from this client
  socket.on('chatMessage', (message) => {
    let timestamp = new Date().toISOString(); // Generate the current timestamp
    console.log(`Message from: [ ${socket.id} ]: ${message}`);
    io.emit('chatMessage', { playerId: socket.id, message: message, time: timestamp });
  });

  // Listen to private messages from this client
  socket.on('privateMessage', ({ to, message }) => {
    let timestamp = new Date().toISOString(); // Generate the current timestamp
    io.to(to).emit('privateMessage', { playerId: socket.id, message: message, time: timestamp });
});

  // Broadcast a global message to all clients when someone disconnects
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
    io.emit('playerDisconnected', { playerId: socket.id });
    delete users[socket.id]; // Remove the user from the users list
    logAllCurrentUsers();
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
