// import { text } from "express"

const socket = io()
const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

const name = prompt('Please enter a name:')
appendMessage('You joined.', '')
socket.emit('new-user', name)

socket.on('chat-message', data => {
    appendMessage(`${data.name}: ${data.message}`, 'left')
})

socket.on('user-connected', name => {
    appendMessage(`${name} joined.`, '')
})

socket.on('user-disconnected', name => {
    appendMessage(`${name} left.`, '')
})

messageForm.addEventListener('submit', e =>{
    e.preventDefault()
    const message = messageInput.value
    appendMessage(`You: ${message}`, 'right')
    socket.emit('send-chat-message', message)
    messageInput.value = ''
})

function appendMessage(message, message_type) {
    const messageElement = document.createElement('div')
    messageElement.innerText = message
    messageElement.setAttribute('class', 'message ' + message_type)
    messageContainer.append(messageElement)
    updateScroll()
}

function updateScroll(){
    messageContainer.scrollTop = messageContainer.scrollHeight;
}