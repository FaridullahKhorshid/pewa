import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAccountComponent } from './create-account.component';

describe('CreateAccountComponent', () => {
  let component: CreateAccountComponent;
  let fixture: ComponentFixture<CreateAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an email input field', () => {
    const emailInput = document.getElementById('emailInput');
    expect(emailInput !== null);
    expect(emailInput?.innerHTML).toEqual('Username');
  });

  it('should have a password input field', () => {
    const pwInput = document.getElementById('passwordInput');
    expect(pwInput !== null);
    expect(pwInput?.innerHTML).toEqual('Password');
  });

  it('should have a password confirmation field', () => {
    const pwInput = document.getElementById('confirmationInput');
    expect(pwInput !== null);
    expect(pwInput?.innerHTML).toEqual('Confirm your password');
  });

  it('should redirect to create account', () => {
    const button = document.querySelector('button');
    button?.click();
    fixture.detectChanges();
    expect(window.location.pathname).toEqual('/login');
  });
});
