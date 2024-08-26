var createError = require('http-errors');
var express = require('express');
require("dotenv").config();
const { Server } = require("socket.io");
var cookieParser = require('cookie-parser');
const http = require('http');
const cors = require('cors');
const patientRoutes = require('./routes/patientRoutes')
const userRoutes = require('./routes/userRoutes')
const chatHandler = require('./socketHandler/chatHandler');

const morgan = require('morgan');
require("dotenv").config();

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  path: '/socket.io',
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('New client connected');
  const { patientId, userEmail } = socket.handshake.query;
  chatHandler(io, socket, patientId, userEmail);
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use('/api', patientRoutes);
app.use('/api', userRoutes);

app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'; connect-src 'self' ws://localhost:8000");
  next();
});


app.use(function(req, res, next) {
  next(createError(404));
});


server.listen(8000, () => {
  console.log('Server is running on port 8000');
})

