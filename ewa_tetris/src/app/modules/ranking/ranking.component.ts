import {Component, OnInit} from '@angular/core';
import {DataService, Game, GameService, User} from "../../shared/api/generated";
import {AuthService} from "../../shared/services/auth.service";

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit {

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

    this.dataService.getTopPlayer(100).subscribe((users: User[]) => {

      console.log(users);

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
