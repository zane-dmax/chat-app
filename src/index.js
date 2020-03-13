const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = 3000;

app.use(express.static(path.join(__dirname,'../public')));

let count = 0;

io.on('connection', (socket) => {
    console.log('connection established');

    socket.emit('welcome', `Welcome user${count}`);
    count++;

    socket.on('sendMessage', (message,callback) => {
        io.emit('message', message);
        callback('Got it!');
    })

    socket.on('disconnect', () => {
        io.emit('message','User disconnected');
    })
})



server.listen(port, () => {
    console.log(`Server up on port ${port}`);
})