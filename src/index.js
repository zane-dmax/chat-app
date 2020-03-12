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

    socket.emit('welcome', `Hello user${count}`);
    count++;
    
    // socket.on('connect', () => {
    //     count++;
    //     io.emit('connect', () => {
            
    //     })
    // })
})

server.listen(port, () => {
    console.log(`Server up on port ${port}`);
})