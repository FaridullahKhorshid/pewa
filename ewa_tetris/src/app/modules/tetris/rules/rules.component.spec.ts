import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RulesComponent } from './rules.component';

describe('RulesComponent', () => {
  let component: RulesComponent;
  let fixture: ComponentFixture<RulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RulesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the goal of tetris', () => {
    const title = document.querySelector("h1");
    expect(title?.innerHTML).toEqual('The rules');
  });

  it('should have an explanation of the pointsystem', () => {
    const header = document.getElementById('goal');
    expect(header?.innerHTML).toContain('The Goal of Tetris');
  });

  it('should have an explanation of the controls', () => {
    const header = document.getElementById('controls');
    expect(header?.innerHTML).toContain('Controls');
  });

  it('should have an img of tetris game', () => {
    const div = document.querySelector('.image-div');
    expect(div?.innerHTML).toContain('assets/images/tetris-rules.png');
  });
});
