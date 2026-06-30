const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the current directory
app.use(express.static(__dirname));

const players = {};

io.on('connection', (socket) => {
    console.log('Player connected: ' + socket.id);
    
    // Initialize player object
    players[socket.id] = { x: 0, y: -100, z: 0, rotY: 0 };
    
    // Send existing players to the new player
    socket.emit('currentPlayers', players);
    
    // Broadcast the new player to everyone else
    socket.broadcast.emit('newPlayer', { id: socket.id, player: players[socket.id] });
    
    socket.on('playerMovement', (data) => {
        players[socket.id] = data;
        socket.broadcast.emit('playerMoved', { id: socket.id, ...data });
    });

    socket.on('callElevator', (floorIndex) => {
        socket.broadcast.emit('elevatorCalled', floorIndex);
    });
    
    socket.on('disconnect', () => {
        console.log('Player disconnected: ' + socket.id);
        delete players[socket.id];
        io.emit('playerDisconnected', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Multiplayer Server running at http://localhost:${PORT}`);
    console.log(`If you haven't already, please run: npm install express socket.io`);
});
