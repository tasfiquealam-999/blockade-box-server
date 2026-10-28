const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// গেমের ফাইলগুলো যে ফোল্ডারে আছে বা রুট ডিরেক্টরি থেকে HTML ফাইল দেখানোর জন্য
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Blockade_Box_fixed.html'));
});

io.on('connection', (socket) => {
  console.log('A user connected: ' + socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected: ' + socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});