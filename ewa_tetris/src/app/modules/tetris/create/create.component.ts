import {Component, OnInit} from '@angular/core';
import {Game, GameService, GameUser} from "../../../shared/api/generated";
import {Router} from "@angular/router";
import {AuthService} from "../../../shared/services/auth.service";

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  public game: Game = {"id": 0, userId: 1, title: '', openStatus: true, multiPlayer: true, gameFinished: false}
  public errorMessage: String = '';

  constructor(
    private gameService: GameService,
    private router: Router,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
  }

  public addGame() {

    if (this.game.title == '') {
      this.errorMessage = "Game Title is required";
      return;
    }

    // create new in the backend
    this.gameService.addNewGame(this.game).subscribe(async (games: Game) => {
      this.game = games;

      // update game user to add the user who created the game
      let gameUser: GameUser = {id: 0, userId: this.authService.getUserId(), gameId: this.game.id, score: 0}
      this.gameService.addUserToGame(gameUser).subscribe(async (games: Game) => {
        this.game = games;

        if (this.game.multiPlayer) {
          await this.router.navigate(['tetris/play/' + this.game.id]);
        } else {
          await this.router.navigate(['tetris/practice/' + this.game.id]);
        }

      }, async error => {
        alert("Game is full!");
        await this.router.navigate(['tetris']);
      });

    });
  }
}
