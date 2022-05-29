import {User} from "../models/user";

export = (io, socket, roomHelper) => {

    const joinGame = (data) => {

        // console.log(data.username);

        if (data.username !== null && data.username.length > 0) {

            console.log(data.room);

            let users = roomHelper.getRoomUsers(data.room);
            let opponent = (users[0] != undefined ? users[0] : false);
            let user = new User();

            user.id = socket.id;
            user.username = data.username;
            user.room = data.room;
            user.player = true;
            user.opponentId = (opponent ? opponent.id : null);

            roomHelper.userJoin(user);

            if (opponent) {
                opponent.opponentId = user.id;
            }

            socket.join(user.room);
        }
    }

    const startGame = () => {

        console.log(socket.id);

        let user = roomHelper.findUser(socket.id);

        io.in(user.room).emit('game-started', {
            room: user.room,
            users: roomHelper.getRoomUsers(user.room)
        });
    }

    const makeMove = (move) => {

        let user = roomHelper.findUser(socket.id);

        socket.to(user.room).emit('made-move', {
            move: move,
            room: user.room,
            users: roomHelper.getRoomUsers(user.room)
        });
    }

    const updateShapes = (shapeData) => {

        let user = roomHelper.findUser(socket.id);

        if (user) {
            socket.to(user.room).emit('shapes-updated', {
                activeShape: shapeData.active_shape,
                nextShape: shapeData.next_shape,
                board: shapeData.board,
                room: user.room,
                users: roomHelper.getRoomUsers(user.room)
            });
        }
    }

    const updatePoints = (pointsData) => {

        console.log(pointsData);

        let user = roomHelper.findUser(socket.id);

        if (user) {
            socket.to(user.room).emit('points-updated', {
                points: pointsData.points,
                isDead: pointsData.isDead,
                level: pointsData.level,
                room: user.room,
                users: roomHelper.getRoomUsers(user.room)
            });
        }
    }

    const updateResults = (data) => {

        console.log(data);

        let user = roomHelper.findUser(socket.id);

        if (user) {
            socket.to(user.room).emit('results-updated', {
                opponentWon: data.opponentWon,
                room: user.room,
                users: roomHelper.getRoomUsers(user.room)
            });
        }
    }

    socket.on('join-game', joinGame);
    socket.on('start-game', startGame);
    socket.on('make-move', makeMove);
    socket.on('update-shapes', updateShapes);
    socket.on('update-points', updatePoints);
    socket.on('update-results', updateResults);
}