import {io, Socket} from "socket.io-client";
import {environment} from "../../../../environments/environment";
import {Message} from "./message";
import {ChatComponent} from "../../components/chat/chat.component";

export class chatSocket {

  // init sockets
  private socket: Socket;

  public constructor(username: String) {
    this.socket = io(environment.socketUrl);

    // user join the public chat
    this.socket.emit("join-chat", {'username': username}, (response: any) => {
      // console.log(response.status); // ok
    });
  }

  // connect to the socket server
  public connect() {
    this.socket = io(environment.socketUrl);
  }

  // disconnect from the socket server
  public disconnect() {
    this.socket.disconnect();
  }

  // send messages to other users
  public sendMessage(message: Message) {
    this.socket.emit("send-message", message, (response: any) => {
    });
  }

  // listen to chat messages from other users
  public onMessage(chatComponent: ChatComponent) {
    this.socket.on("message", (data) => {
      chatComponent.processMessage(data);
    });
  }
}
