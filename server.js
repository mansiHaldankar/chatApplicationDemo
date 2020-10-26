const http = require('http');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
app.set('port', PORT);

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});

const server = http.createServer(app);
const io = require('socket.io').listen(server);

io.on('connection', socket => {
    console.log("new connection   " + socket.id);
    socket.on('join', (data) => {
        socket.join(data.room);
        console.log(data.user + "  Joined the roomsss " + data.room);
        socket.to(data.room).emit("newUserJoined", { user: data.user, room: data.room, message: `has joined the room ${data.room}` }); //
    });

    socket.on('leave', (data) => {
        console.log(data.user + "  Left the room " + data.room);
        socket.to(data.room).emit("leftRoom", { user: data.user, room: data.room, message: `has left the room ${data.room}` });
        socket.leave(data.room);
    });

    socket.on('message', (data) => {
        console.log(data);
        io.in(data.room).emit('newMsg', { user: data.user, message: data.message });
        socket.to(data.room).emit('newMsgNotification', { user: data.user, message: data.message });
    });
});

server.listen(PORT, () => {
    console.log("server started");
});
