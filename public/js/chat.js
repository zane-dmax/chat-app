const socket = io();

socket.on('welcome', (message) => {
    console.log(message);
});

socket.on('message', (message) => {
    console.log(message);
});

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault();

    var txt = e.target.elements.txtBox.value;
    socket.emit('sendMessage', txt);
});