import {User} from "./user";

export class Message {
    public text: string;
    public type: 'message' | 'typing' | 'welcome' = "message";
    public user: User;
}