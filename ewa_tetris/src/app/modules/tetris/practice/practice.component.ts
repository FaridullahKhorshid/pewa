import {Component, HostListener, OnInit} from '@angular/core';
import {TetrisGameBoard} from "../tetris-game-board";
import {Game, GameService, GameUser} from "../../../shared/api/generated";
import {AuthService} from "../../../shared/services/auth.service";
import {ActivatedRoute, Params, Router} from "@angular/router";

@Component({
  selector: 'app-practice',
  templateUrl: './practice.component.html',
  styleUrls: ['./practice.component.scss']
})
export class PracticeComponent implements OnInit {

  public playerBoard!: TetrisGameBoard;
  private game!: Game;
  public scoreSaved: boolean = false;

  constructor(
    private authService: AuthService,
    private gameService: GameService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    // this.width = Board.COLS * Board.BLOCK_SIZE;
    // this.height = Board.ROWS * Board.BLOCK_SIZE;
  }

  async ngOnInit(): Promise<void> {

    await this.route.params.subscribe(async (params: Params) => {
      this.getGame(params.id);



      let playerCanvas = document.getElementById('player_board');
      let playerShapeCanvas = document.getElementById('player_next_shape');
      this.playerBoard = new TetrisGameBoard(playerCanvas, playerShapeCanvas);
    });
  }

  play() {
    this.playerBoard.play();
  }

  replay() {
    this.playerBoard.replay();
  }

  saveScore() {

    if (!this.scoreSaved) {
      let userid = this.authService.getUserId()
      let gameUser: GameUser = {id: 0, userId: userid, gameId: this.game.id, score: this.playerBoard.points}

      this.gameService.finishGame(this.game.id).subscribe((game: Game) => {
        this.game = game;
      });

      this.gameService.updateExistingGame(gameUser).subscribe(async (game: Game) => {
        this.game = game;
        console.log(game);
      }, async error => {
        alert("Something went wrong saving score!");
        await this.router.navigate(['tetris']);
      });

    }

    return "Score saved!";
  }

  async getGame(id: number) {

    await this.gameService.getGameById(id).subscribe(async (game: Game) => {
      this.game = game;

      console.log(this.game);

      if (this.game.gameFinished) {
        alert("This game is already played!");
        await this.router.navigate(['tetris']);
        return;
      }

    }, ( error => {

      // console.log(error.error.message)
      // // return;
      alert(error.error.message)
      this.router.navigate(['tetris']);
    }));

    // if (this.game && this.game.id > 0)return;
    //
    // await this.router.navigate(['tetris']);
  }

  // controls for the game
  @HostListener('window:keydown.ArrowRight', ['$event'])
  goRight(e?: any) {
    this.preventDefault(e);
    this.playerBoard.goRight();
  }

  @HostListener('window:keydown.ArrowLeft', ['$event'])
  goLeft(e?: any) {
    this.preventDefault(e);
    this.playerBoard.goLeft();
  }

  @HostListener('window:keydown.ArrowDown', ['$event'])
  goDown(e?: any) {
    this.preventDefault(e);
    this.playerBoard.goDown();
  }

  @HostListener('window:keydown.X', ['$event'])
  rotateClockWise(e?: any) {
    this.preventDefault(e);
    this.playerBoard.rotateClockWise();
  }

  @HostListener('window:keydown.Z', ['$event'])
  rotateCounterWise(e?: any) {
    this.preventDefault(e);
    this.playerBoard.rotateCounterWise();
  }

  preventDefault(e?: any) {
    if (e) {
      e.preventDefault();
    }
  }
}
