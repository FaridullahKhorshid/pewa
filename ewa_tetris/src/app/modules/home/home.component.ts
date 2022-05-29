import {Component, OnInit} from '@angular/core';
import {DataService, Game, GameService, User} from "../../shared/api/generated";
import {AuthService} from "../../shared/services/auth.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public games?: Game[];

  public topPlayers: { username: '', id: '', totalScore: '', totalGame: '' }[] = [];

  get isLoggedIn(): boolean {
    return this.authService.getToken() != null;
  }

  constructor(
    private gameServiceApi: GameService,
    private dataService: DataService,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    // this.gameServiceApi.getGames().subscribe((games: Game[]) => {
    //   this.games = games;
    //   console.log(this.games);
    // })
    this.dataService.getTopPlayer(4).subscribe((users: User[]) => {

      users.forEach((user: User) => {

        // @ts-ignore
        let totalScore = user.games.reduce((prev, next) => prev + next.score, 0);

        let player = {
          username: user.username,
          id: user.id,
          totalScore: totalScore,
          totalGame: user.games?.length
        };

        // @ts-ignore
        this.topPlayers.push(player);
      });
    });

  }

}
