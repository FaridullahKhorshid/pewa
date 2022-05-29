import {Component, OnInit, ViewChild} from '@angular/core';
import {LoginUser} from "../../shared/api/generated";
import {NgForm} from "@angular/forms";
import {AuthService} from "../../shared/services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginUser: LoginUser = {username: '', password: ''};

  @ViewChild('login')
    // @ts-ignore
  myForm: NgForm;

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {
  }

  get token(): String | null {
    return this.authService.getToken()
  };

  // @ts-ignore
  errorMessage: String | null;

  ngOnInit(): void {
    this.route.queryParams.subscribe(async (params) => {

      if (params.signOut == 1) {
        this.authService.signOut();
        await this.router.navigate(["/login"]);
      }
    })
  }

  async onSubmit(): Promise<void> {
    console.log("doe ik wat?")
    await this.authService.asyncSignIn(this.loginUser.username, this.loginUser.password).catch(data => {
      console.log(data)
      this.errorMessage = this.authService.getErrorMessage();
    });

    if (this.token != null) {
      await this.router.navigate(["/"]);
    }
  }

}
