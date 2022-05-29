import {User} from "../models/user";

const users = [];

export class RoomHelper {

    // User joins the room
    public userJoin(user: User) {

        const index = users.findIndex(u => u.username === user.username && user.room == u.room);

        if (index == -1) {
            users.push(user);
        }

        return user;
    }

    // User leaves the room
    public userLeave(id) {
        const index = users.findIndex(user => user.id === id);

        if (index !== -1) {
            return users.splice(index, 1)[0];
        }
    }

    // Find current user
    public findUser(id) {
        return users.find(user => user.id === id);
    }

    // Find current user
    public findUserByUsername(username, room) {
        return users.find(user => user.username === username && user.room == room);
    }

    public getGameOpponent() {
        let rooms = users.filter(user => user.player === true && !user.opponentId)
        return (rooms[0] !== undefined ? rooms[0] : false);
    }

    // Get room users
    public static findAllUsers(room) {
        return users.filter(user => user.room === room);
    }

    // Get room users
    public getRoomUsers(room) {
        return users.filter(user => user.room === room);
    }

    // Get users
    public getUsers() {
        return users;
    }
}