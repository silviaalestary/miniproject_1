const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const http = require('http');
const authRoutes = require('./src/routes/authRoutes');
const kapalRoutes = require('./src/routes/kapalRoutes');
const websocketHandler = require('./src/websocket/websocketHandler');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/kapal', kapalRoutes);

// WebSocket handler
websocketHandler(wss);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});