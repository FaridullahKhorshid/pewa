import {Component, OnInit} from '@angular/core';
import {DataService, Game} from "../../shared/api/generated";
import {AuthService} from "../../shared/services/auth.service";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  public games: Game[] = [];

  public userId = this.authService.getUserId();
  public username = this.authService.getCurrentUserName();
  public totalGames = this.authService.getUserId();
  public totalPoints = this.authService.getUserId();


  constructor(
    private dataService: DataService,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.dataService.getUserGames(this.userId).subscribe((games: Game[]) => {
      this.games = games;
      this.totalGames = this.games.length

      this.totalPoints = this.games.reduce((prev, next) => prev + this.getScore(next), 0);
    });
  }

  getScore(game: Game) {
    if (!game.users) return 0;
    return game.users.filter(u => u.userId == this.userId)[0].score;
  }

  isMultiPlayer(game: Game) {
    if (!game.users) return false;
    return game.users.length > 1;
  }
}
