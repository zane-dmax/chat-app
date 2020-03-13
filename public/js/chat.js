const socket = io();

socket.on('welcome', (message) => {
    console.log(message);
});

socket.on('message', (message) => {
    console.log(message);
});

const $form = document.querySelector('#message-form');
const $input = document.querySelector('input');
const $button = document.querySelector('button');


$form.addEventListener('submit', (e) => {
    e.preventDefault();

    $button.setAttribute('disabled','disabled');

    socket.emit('sendMessage', $input.value, (message) => {
        $button.removeAttribute('disabled');
        $input.value = '';
        $input.focus();
        console.log('Message received', message);
    });
});