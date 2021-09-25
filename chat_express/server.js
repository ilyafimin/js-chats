const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const formatMessage = require('./utils/message');
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');

const PORT = 5000 || process.env.PORT;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set static
app.use(express.static(path.join(__dirname, 'public')))

//Run when user is connecting
io.on('connection', (socket) => {

    socket.on('joinRoom', ({username, room}) => {

        let User = userJoin(socket.id, username, room);

        socket.join(User.room);

        //Broadcast when a user connects
        socket.broadcast
            .to(User.room)
            .emit('message', formatMessage('Bot', `${User.username} has joined the chat`));  

        io.to(User.room).emit('roomUsers', {
            room: User.room,
            users: getRoomUsers(User.room)
        });
    })

    //Runs when user disconnects
    socket.on('chatMessage', (message) => {

        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, message));
    })
    //Disconnect user
    socket.on('disconnect', () => {

        const user = userLeave(socket.id);

        if(user) {
            io.to(user.room).emit('message', formatMessage('Bot', `A ${user.username} has left the chat`));
        }
    })


})


server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
