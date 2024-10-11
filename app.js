const express = require('express');
const app = express();
const fs = require('fs');
const { default: mongoose } = require('mongoose');
const router = require('./src/router');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

// Socket.IO setup
const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api', router);

// Socket.IO connection handler
io.on('connection', (socket) => {
    console.log('A user connected');
  
    socket.on('send_message', (message) => {
      io.emit('receive_message', message);
    });
  
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
  

// Database connection
const dbConnection = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/chatapp');
    console.log("DB is connected");
  } catch (error) {
    console.log('DB is not connected');
    console.error(error);
  }
};

dbConnection();

// Basic route for serving HTML file
app.get('/', (req, res) => {
  fs.readFile('./pages/index.html', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error loading page');
    } else {
      res.write(data);
      res.end();
    }
  });
});

// Listen for HTTP and WebSocket connections
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
