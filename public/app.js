import io from "socket.io";

// Replace 'http' with 'ws' to indicate WebSocket protocol
const socket = io('ws://chatroom-exgl.onrender.com');


//activity = when user types 
const activity = document.querySelector('.activity')
const msgInput = document.querySelector('#message')
const nameInput = document.querySelector('#name')
const chatRoom = document.querySelector('#room')
const userList = document.querySelector('.user-list')
const roomList = document.querySelector('.room-list')
const chatDisplay = document.querySelector('.chat-display')




function sendMessage(e){
    e.preventDefault()
    if (nameInput.value && msgInput.value && chatRoom.value){
        socket.emit('message', {
            name: nameInput.value,
            text: msgInput.value

        } )
        msgInput.value = ""
    }
    msgInput.focus()
}

function enterRoom(e){
    e.preventDefault()
    if (nameInput.value && chatRoom.value){
        socket.emit('enterRoom', {
            name: nameInput.value,
            room: chatRoom.value
        })
    }
}

document.querySelector('.form-message')
.addEventListener('submit', sendMessage);

document.querySelector('.form-join')
.addEventListener('submit', enterRoom);

//add event listener to when user is typing. and display the information. 
msgInput.addEventListener('keypress', ()=>{
    socket.emit('activity', nameInput.value)
})

//listen for messages 

socket.on('message', (data)=>{
    activity.textContent = ""

    //destructure data that is inputted
    const {name, text, time} = data

    const li = document.createElement('li')
    li.className = 'post'
    if (name === nameInput.value) li.className = 'post post--left'
    if (name !== nameInput.value && name !== 'Admin') li.className = 'post post--right'
    if (name !== 'Admin'){
        li.innerHTML = `<div class="post__header ${name ===
             nameInput.value 
             ? 'post__header--user' 
             : 'post__header--reply'
        }">
        <span class = "post__header--name">${name}</span>
        <span class = "post__header--time">${time}</span>
        </div>
        <div class = "post__text">${text}</div>`
    } else{
        li.innerHTML = `<div class="post__text">${text}</div>`
    }
    document.querySelector('.chat-display').appendChild(li)

    //scroll when more messages are inputted in room
    chatDisplay.scrollTop = chatDisplay.scrollHeight
})



//set timer to get rid of infinite activity message display

let activityTimer
socket.on("activity", (name)=>{
    activity.textContent = `${name} is typing...`
    //clear after 1 seconds
    clearTimeout(activityTimer)
    activityTimer = setTimeout(()=>{
        activity.textContent = ""
    },1000)
})


socket.on("userList", ({users})=>{
    showUsers(users)
})

socket.on("roomList", ({rooms})=>{
    CurrentCommonRooms(rooms)
})

//shows users
function showUsers(users){
    userList.textContent = ''
    if (users){
        userList.innerHTML = `<em>users in ${chatRoom.value}: </em>`
        users.forEach((user, i) =>{
            userList.textContent += ` ${user.name}`
            //adds comma after each user more readable on page ↓↓↓↓
            if (users.length > 1 && i !== users.length -1){
                userList.textContent += ","
            }
        })
    }
}


//shows commonrooms
function CurrentCommonRooms(rooms){
    roomList.textContent = ''
    if (rooms){
        roomList.innerHTML = '<em>Active Common Rooms: </em>'
        rooms.forEach((room, i) =>{
            roomList.textContent += ` ${room}`
            //adds comma after each room more readable on page ↓↓↓↓
            if (rooms.length > 1 && i !== rooms.length -1){
                roomList.textContent += ","
            }
        })
    }
}