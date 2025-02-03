const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { spawn } = require('child_process');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

let users = {};  // To store connected users

function generateUsername() {
    return 'User' + Math.floor(Math.random() * 1000);
}

function getBotResponse(message, callback) {
    const llama = spawn('../llama.cpp/build/bin/llama-cli', ['-m', '../llama.cpp/models/ggml-model-f16.gguf', '--prompt', message]);

    let response = '';
    llama.stdout.on('data', (data) => {
        response += data.toString();
    });

    llama.stderr.on('data', (data) => {
        console.error(`LLAMA error: ${data}`);
    });

    llama.on('close', (code) => {
        callback(response.trim() || "Sorry, I couldn't process that.");
    });
}

// Handle messages
function handleMessage(sender, message, recipient = null) {
    if (recipient === "@bot") {
        getBotResponse(message, (botReply) => {
            io.to(users[sender]).emit('chat message', { user: 'LLAMA Bot', text: botReply });
        });
    } else if (recipient && users[recipient]) {
        io.to(users[recipient]).emit('chat message', { user: sender, text: message });
    } else {
        io.emit('chat message', { user: sender, text: message });
    }
}

io.on('connection', (socket) => {
    const username = generateUsername();
    users[username] = socket.id;

    console.log(`${username} connected:`, socket.id);
    socket.emit('assign username', username);
    io.emit('update users', Object.keys(users));  // Send updated user list

    socket.on('chat message', ({ message, recipient }) => {
        handleMessage(username, message, recipient);
    });

    socket.on('disconnect', () => {
        delete users[username];
        io.emit('update users', Object.keys(users));  // Update user list on disconnect
        console.log(`${username} disconnected:`, socket.id);
    });
});

server.listen(3000, () => {
    console.log('Server listening on http://localhost:3000');
});
