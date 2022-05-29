import {Component, EventEmitter, HostListener, OnInit, Output} from '@angular/core';
import {chatSocket} from "../../classes/socket/chat-socket";
import {Message} from "../../classes/socket/message";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  private chatSocket!: chatSocket;
  public message: Message = {text: '', user: {username: ''}, type: "message"};
  public messages: Message[] = [];
  public isLoggedIn = this.authService.getToken() != null;
  public username!: String;
  public typingUsername: String = "";
  private intervalId: number = 0;

  @Output()
  public toggleChatEvent = new EventEmitter();

  constructor(
    private authService: AuthService
  ) {

    let username = this.authService.getCurrentUserName();

    if (username != null) {
      this.username = username;
    }
  }

  ngOnInit(): void {
    if (!this.isLoggedIn) return;

    this.chatSocket = new chatSocket(this.username);
    this.chatSocket.onMessage(this);
  }


  toggleChat(): void {
    this.toggleChatEvent.next();
  }

  @HostListener('window:keydown', ['$event'])
  public typingMessage(e: KeyboardEvent) {

    if (!this.isLoggedIn) return;

    if (e.key == "Enter") {
      this.sendMessage();
      return;
    }

    const msg = {...this.message};
    msg.user.username = this.username;
    msg.type = 'typing';

    this.chatSocket.sendMessage(msg);
  }

  public sendMessage() {

    if (!this.isLoggedIn) return;

    if (this.message.text != '') {

      this.message.user.username = this.username;

      const msg = {...this.message};
      this.messages.push(msg);
      this.chatSocket.sendMessage(this.message);
      this.message.text = "";
    }

  }

  processMessage(message: Message) {

    console.log(message.type);

    if (message.type == 'typing') {
      this.typingUsername = message.user.username;

      if (this.intervalId > 0) {
        clearInterval(this.intervalId);
      }

      this.intervalId = setInterval(() => {
        this.typingUsername = '';
      }, 300);

    } else {
      this.messages.push(message);
    }

  }


}
