import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  public openNav: boolean = false;

  get isLoggedIn(): boolean {
    return this.authService.getToken() != null;
  }

  get userName(): String | null {
    return this.authService.getCurrentUserName();
  }

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
  }

  public openNavBar() {
    this.openNav = !this.openNav;
  }
}
