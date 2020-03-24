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
        socket.username = username;

        var strUsers = '';
        const socks = Object.keys(io.sockets.adapter.rooms[room].sockets)
        socks.forEach(socketid => strUsers = strUsers + io.sockets.sockets[socketid].username + '\r\n')
        console.log(strUsers)

        socket.emit('message', generateMessage('Admin',`Welcome ${username}`));
        socket.broadcast.to(room).emit('message', generateMessage('Admin',`${username} has joined`));
    });

    socket.on('sendMessage', (message,callback) => {
        console.log(Object.keys(socket.rooms)[0])
        io.to(Object.keys(socket.rooms)[0]).emit('message', generateMessage(socket.username,message));
        callback('Got it!');
    });

    socket.on('disconnect', () => {
        const room = Object.keys(socket.rooms)[0];
        io.to(room).emit('message','User disconnected');
        socket.leave(room);

        var strUsers = '';
        const socks = Object.keys(io.sockets.adapter.rooms[room].sockets)
        socks.forEach(socketid => strUsers = strUsers + io.sockets.sockets[socketid].username + '\r\n')
        console.log(strUsers)
        io.to(room).emit('userList',strUsers);
    });
});

server.listen(port, () => {
    console.log(`Server up on port ${port}`);
});