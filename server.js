// const express = require('express');
// // Create the app
// const app = express();

// // Set up the server
// const server = app.listen(5500, listen);

// // This call back just tells us that the server has started
// function listen() {
//   var host = server.address().address;
//   var port = server.address().port;
//   console.log('Example app listening at http://' + host + ':' + port);
// }

// app.use(express.static(__dirname));

// const  io = require('socket.io').listen(server);
// note:  I replaced const io = ...... line with the one above

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname));
app.get('/', function(req, res,next) {
    res.sendFile(__dirname + '/index.html')
})

server.listen(3000)

const users = {}

io.on('connection', socket => {
    console.log('New user.')
    socket.on('new-user', name => {
        users[socket.id] = name
        socket.broadcast.emit('user-connected', name)
    })
    socket.on('send-chat-message', message => {
        socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
    })
    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id])
        delete users[socket.id]
    })
})