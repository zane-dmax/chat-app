const socket = io();

const $form = document.querySelector('#message-form');
const $input = document.querySelector('input');
const $button = document.querySelector('button');
const $messages = document.querySelector('#messages');

const tplMessage = document.querySelector('#tplMessage').innerHTML;

const {username, room} = Qs.parse(location.search, { ignoreQueryPrefix: true })

socket.on('message', (message) => {
    console.log(message);
    const html = Mustache.render(tplMessage, {
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend', html);
});

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

socket.emit('join', { username, room })