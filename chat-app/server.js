const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { spawn } = require('child_process'); // For running LLAMA model locally

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

// Function to generate random usernames
function generateUsername() {
    return 'User' + Math.floor(Math.random() * 1000);
}

// Function to get response from LLAMA model
function getBotResponse(message, callback) {
    //const llama = spawn('./llama_model', ['--prompt', message]);
    //const llama = spawn('../llama.cpp/build/bin/llama-cli', ['--prompt', message]);
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

io.on('connection', (socket) => {
    const username = generateUsername();
    console.log(`${username} connected:`, socket.id);

    // Send the assigned username to the client
    socket.emit('assign username', username);

    socket.on('chat message', (msg) => {
        socket.broadcast.emit('chat message', { user: username, text: msg }); // Send to all clients except sender

        // Trigger LLAMA bot response if message starts with @bot
        if (msg.toLowerCase().startsWith('@bot')) {
            getBotResponse(msg.replace('@bot', '').trim(), (botReply) => {
                io.emit('chat message', { user: 'LLAMA Bot', text: botReply });
            });
        }
    });

    socket.on('disconnect', () => {
        console.log(`${username} disconnected:`, socket.id);
    });
});

server.listen(3000, () => {
    console.log('Server listening on http://localhost:3000');
});