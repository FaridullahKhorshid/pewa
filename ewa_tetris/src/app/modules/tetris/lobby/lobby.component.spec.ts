import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LobbyComponent } from './lobby.component';

describe('LobbyComponent', () => {
  let component: LobbyComponent;
  let fixture: ComponentFixture<LobbyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LobbyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LobbyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show header', () => {
    const header = document.querySelector('h1');
    expect(header?.innerHTML).toContain('Play tetris online');
  });

  it('should let a player join', () => {
    const button = document.getElementById('joinButton');
    button?.click();
    fixture.detectChanges();
    expect(window.location.pathname).toContain('/play/');
  });

  it('should let a player create a game', () => {
    const button = document.getElementById('createButton');
    button?.click();
    fixture.detectChanges();
    expect(window.location.pathname).toContain('/tetris/create');
  });
});
