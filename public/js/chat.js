const socket = io();

const $form = document.querySelector('#message-form');
const $input = document.querySelector('input');
const $button = document.querySelector('button');
const $roomTitle = document.querySelector('h2');
const $sidebarUsers = document.querySelector('#sidebar-users');
const $messages = document.querySelector('#messages');

const tplMessage = document.querySelector('#tplMessage').innerHTML;

const {username, room} = Qs.parse(location.search, { ignoreQueryPrefix: true })

$roomTitle.innerHTML = room;

socket.on('message', (message) => {
    console.log(message);
    const html = Mustache.render(tplMessage, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend', html);
});

socket.on('userList', (userList) => {
    $sidebarUsers.innerHTML = userList;
})

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