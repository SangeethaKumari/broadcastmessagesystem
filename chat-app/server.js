const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

// Function to generate random usernames
function generateUsername() {
    return 'User' + Math.floor(Math.random() * 1000);
}

io.on('connection', (socket) => {
    const username = generateUsername();
    console.log(`${username} connected:`, socket.id);

    // Send the assigned username to the client
    socket.emit('assign username', username);

    socket.on('chat message', (msg) => {
        socket.broadcast.emit('chat message', { user: username, text: msg }); // Send with username
    });

    socket.on('disconnect', () => {
        console.log(`${username} disconnected:`, socket.id);
    });
});

server.listen(3000, () => {
    console.log('Server listening on http://localhost:3000');
});
