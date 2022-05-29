import {Component, OnInit, ViewChild} from '@angular/core';
import {LoginUser} from "../../../shared/api/generated";
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../../../shared/services/auth.service";

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent implements OnInit {
  loginUser: LoginUser = {username: '', password: ''};
  passwordCheck: String = "";

  @ViewChild('register')
    // @ts-ignore
  myForm: NgForm;

  constructor(private authService: AuthService, private router: Router) {
  }

  // @ts-ignore
  errorMessage: String | null;

  ngOnInit(): void {

  }

  //TODO Nog kijken naar 4.4.1 F

  async onSubmit(): Promise<void> {
    if (this.passwordCheck !== this.loginUser.password) {
      this.errorMessage = "The two passwords do not match";
    } else {
      await this.authService.asyncRegister(this.loginUser.username, this.loginUser.password).then(data => {
        if (data == undefined) {
          this.errorMessage = this.authService.getErrorMessage();
          return undefined;
        }
        this.router.navigate(["/login"]);
        // this.authService.setErrorMessage(null);
        return
      });
    }

    console.log(this.errorMessage);
  }
}
