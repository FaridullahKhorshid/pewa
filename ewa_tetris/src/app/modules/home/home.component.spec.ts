import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {HomeComponent} from './home.component';
import {GameService} from "../../shared/api/generated";
import {AuthService} from "../../shared/services/auth.service";

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [GameService, AuthService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to game', () => {
    const button = document.getElementById('playButton');
    button?.click();
    fixture.detectChanges();
    expect(window.location.pathname).toEqual('/#/tetris');
  });

  it('should redirect to practice game', () => {
    const button = document.getElementById('practiceButton');
    button?.click();
    fixture.detectChanges();
    expect(window.location.pathname).toEqual('/#/single_tetris');
  });

  it('should show title', () => {
    const header = document.querySelector('h1');
    expect(header?.innerHTML).toContain('Tetris Space');
  });

  it('should show top plays', () => {
    const header = document.querySelector('h2');
    expect(header?.innerHTML).toContain('Top Plays');
  });
});
