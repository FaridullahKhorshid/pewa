import {createServer} from "http";
import {Server, Socket} from "socket.io";
import {RoomHelper} from "./sockets/room-helper";

const cors = require("cors");
const express = require('express');


const roomHelper = new RoomHelper();
const tetrisGame = require("./sockets/tetris-game");
const chat = require("./sockets/chat");

const corsOptions = {
    origin: ["https://tetris.faridullah.com", 'http://localhost:4200'],
    // origin: "*",
    methods: ["GET", "POST"]
}

const app = express();
app.use(cors(corsOptions));

const httpServer = createServer(app);
const io = new Server(httpServer, {
    allowEIO3: true,
    cors: corsOptions
});


io.on("connection", (socket: Socket) => {

    tetrisGame(io, socket, roomHelper);
    chat(io, socket, roomHelper);

    console.log('connected...  ' + socket.id);

    // Runs when client disconnects
    socket.on('disconnect', () => {

        const user = roomHelper.userLeave(socket.id);

        if (user) {
            if (user.room == 'chat') {
                roomHelper.getRoomUsers(user.room).forEach((u) => {
                    u.room = null;
                });
            }
        }
    });
});

httpServer.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running ${process.env.PORT || 3000}`);
});
