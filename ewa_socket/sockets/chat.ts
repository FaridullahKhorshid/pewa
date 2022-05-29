import {User} from "../models/user";
import {Message} from "../models/message";

export = (io, socket, roomHelper) => {

    const room = 'tetris-chat';
    const joinChat = (data) => {

        // check if it's a valid user
        if (data.username !== null && data.username.length > 0) {

            // create user object
            let user = new User();
            user.room = room;
            user.id = socket.id;
            user.username = data.username;
            user.player = false;

            // add user to the room
            roomHelper.userJoin(user);

            // join the room to the sockets
            socket.join(user.room);

            // Welcome current user
            let message = new Message();
            message.user = user;
            message.type = "welcome";
            message.text = "Welcome to tetris chat room!";

            // emits message to the user who joined the chat
            socket.emit('message', message);

            // Broadcast when a user connects
            let msg = new Message();
            msg.user = user;
            msg.text = user.username + " has joined the chat room!";
            msg.type = "welcome";

            // broadcast the message
            socket.broadcast
                .to(user.room)
                .emit('message', msg);
        }
    }

    const sendMessage = (message) => {

        // join room of the user
        socket.join(room);

        // send message
        socket.to(room).emit('message', message);
    }

    // create join-chat function
    socket.on('join-chat', joinChat);

    // create send message function
    socket.on('send-message', sendMessage);
}