const socket = io();

const chatFrame = document.querySelector('#chat-form');
let chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//Get message from URL
let {username, room} = Qs.parse(location.search, {
  ignoreQueryPrefix: true
})

socket.emit('joinRoom', { username, room});

socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});


socket.on('message', (message) => {

  outputMessage(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;

})

chatFrame.addEventListener('submit', (event) => {
  event.preventDefault();
  let message = event.target.elements.msg.value;

  socket.emit('chatMessage', message);

  //Clear input
  event.target.elements.msg.value = '';
  event.target.elements.msg.focus();

})

//Create DOM Element

function outputMessage(message) {
  let div = document.createElement('div');
  div.classList.add('message');

  div.innerHTML = `
   <div class="message">
  		<p class="meta">${message.user} <span>${message.time}</span></p>
  			<p class="text">
  					${message.text}
  			</p>
  	</div>
  `
  chatMessages.append(div);

}


// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});