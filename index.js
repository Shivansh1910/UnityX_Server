const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');
const cors = require('cors');


const PORT = Number(process.env.PORT) || 8000;
const app = express();
const server = http.createServer(app);
const io = new Server({ cors: { origin: '*' }});
io.attach(server);

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const emailToSocketMapping = new Map();

io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.on('join-room', (data) => {
    const { roomId, email } = data;
    
    console.log('USER', email, 'JOINED ROOM', roomId);

    emailToSocketMapping.set(email, socket.id);
    socket.join(roomId);
    socket.broadcast.to(roomId).emit('user-joined', email);
  });
})

server.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));