/*
Works */
var express = require('express');
var PORT = process.env.PORT || 3000
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname));
app.get('/', function(req, res,next) {
    res.sendFile(__dirname + '/index.html')
})

server.listen(PORT, () => console.log(`Listening on ${PORT}`))
/**/

//might not work
// const express = require('express')
// const PORT = process.env.PORT || 3000
// const INDEX = '/index.html'

// const server = express()
//     .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
//     .listen(PORT, () => console.log(`Listening on ${PORT}`));
// server.use(express.static(__dirname));
// const io = require('socket.io')(server)

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