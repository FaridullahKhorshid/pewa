import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ChatComponent} from './chat.component';
import {AuthService} from "../../services/auth.service";
import {HttpClientModule} from "@angular/common/http";
import {Message} from "../../classes/socket/message";

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatComponent],
      providers: [AuthService],
      imports: [HttpClientModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the chat container and messages div', () => {
    const chatContainer = document.getElementById('chat');
    expect(chatContainer !== null);
    expect(chatContainer?.innerHTML).toContain('messages');
  });

  it('should have the messages form', () => {
    const formDiv = document.querySelector('.message-form');
    expect(formDiv !== null);
    expect(formDiv?.innerHTML).toContain('input');
    expect(formDiv?.innerHTML).toContain('button');
  });

  it('should have the list of messages', () => {
    let messages = component.messages;
    messages.push({text: 'test', type: "message", user: {username: 'test user'}})
    expect(messages.length > 0);
  });

  it('should update the list of messages', () => {

    let messages = component.messages.length;
    let message: Message = {text: 'test', type: "message", user: {username: 'test user'}};
    component.processMessage(message);
    expect(component.messages.length > messages);
  });
});
