const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const { generateMessage } = require('./utils/message');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = 3000;

app.use(express.static(path.join(__dirname,'../public')));

io.on('connection', (socket) => {
    console.log('connection established');

    socket.on('join', ({ username, room }) => {
        socket.join(room);

        socket.emit('message', generateMessage(`Welcome ${username}`));
        socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined`));
    });

    socket.on('sendMessage', (message,callback) => {
        console.log(Object.keys(socket.rooms)[0])
        io.to(Object.keys(socket.rooms)[0]).emit('message', generateMessage(message));
        callback('Got it!');
    });

    socket.on('disconnect', () => {
        io.to(Object.keys(socket.rooms)[0]).emit('message','User disconnected');
        socket.leave(Object.keys(socket.rooms)[0]);
    });
});

server.listen(port, () => {
    console.log(`Server up on port ${port}`);
});