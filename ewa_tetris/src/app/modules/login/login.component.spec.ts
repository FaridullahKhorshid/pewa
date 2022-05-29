import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
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

  it('should redirect to create account', () => {
    const button = document.querySelector("button");
    button?.click();
    fixture.detectChanges();
    expect(window.location.pathname).toEqual('/login/create');
  });
});
