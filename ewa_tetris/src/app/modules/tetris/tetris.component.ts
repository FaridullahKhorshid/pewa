import {Component, HostListener, OnInit} from '@angular/core';
import {TetrisGameBoard} from "./tetris-game-board";
import {TetrisSocket} from "../../shared/classes/socket/tetris-socket";
import {ModalComponent} from "../../shared/components/modal/modal.component";
import {MdbModalRef, MdbModalService} from "mdb-angular-ui-kit/modal";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Game, GameService, GameUser} from "../../shared/api/generated";
import {AuthService} from "../../shared/services/auth.service";

@Component({
  selector: 'app-tetris',
  templateUrl: './tetris.component.html',
  styleUrls: ['./tetris.component.scss'],
})

export class TetrisComponent implements OnInit {

  public inGame: boolean = false;
  public game!: Game;

  public playerBoard!: TetrisGameBoard;
  public opponentBoard!: TetrisGameBoard;
  private tetrisSocket!: TetrisSocket;

  public playerLevel: number = 1;
  public playerPoints: number = 0;
  public playerIsDead: boolean = false;

  public opponentLevel: number = 1;
  public opponentPoints: number = 0;
  public opponentIsDead: boolean = false;

  private modalRef?: MdbModalRef<ModalComponent>;

  public winner: null | boolean | undefined = undefined;
  public finished: boolean = false;

  constructor(
    private modalService: MdbModalService,
    private route: ActivatedRoute,
    private router: Router,
    private gameService: GameService,
    private authService: AuthService
  ) {
    // this.width = Board.COLS * Board.BLOCK_SIZE;
    // this.height = Board.ROWS * Board.BLOCK_SIZE;
  }

  ngOnInit(): void {

    this.route.params.subscribe((params: Params) => {

      this.getGame(params.id);

      this.tetrisSocket = new TetrisSocket(this, params.id);

      let playerCanvas = document.getElementById('player_board');
      let playerShapeCanvas = document.getElementById('player_next_shape');
      this.playerBoard = new TetrisGameBoard(playerCanvas, playerShapeCanvas, this.tetrisSocket);

      let opponentCanvas = document.getElementById('opponent_board');
      let opponentShapeCanvas = document.getElementById('opponent_next_shape');
      this.opponentBoard = new TetrisGameBoard(opponentCanvas, opponentShapeCanvas, this.tetrisSocket, false);

      this.tetrisSocket.onGameStarted();
      this.tetrisSocket.onPointsUpdated();
      this.tetrisSocket.onResultsUpdated();
    });
  }

  async getGame(id: number) {

    if (!this.authService.isLoggedIn()) return;

    let userid = this.authService.getUserId();

    await this.gameService.getGameById(id).subscribe(async (game: Game) => {
      this.game = game;

      if (this.game.gameFinished) {
        alert("This game is already played!");
        await this.router.navigate(['tetris']);
        return;
      }

      let gameUsers = this.game.users;
      let gameUser: GameUser = {id: 0, userId: userid, gameId: this.game.id, score: 0}

      if (!gameUsers || gameUsers.length == 0) {
        this.updateGame(gameUser);
      } else {

        let oldGameUser = gameUsers.filter(g => g.userId == userid);
        if (oldGameUser.length == 0) {

          if (gameUsers.length >= 2) {
            alert("Game is full!");
            await this.router.navigate(['tetris']);
            return;
          }

          this.updateGame(gameUser);
        }
      }

    }, (async error => {

      console.log(error.error.message)
      // return;
      alert(error.error.message)
      await this.router.navigate(['tetris']);
    }));

    // if (this.game && this.game.id > 0) return;

    // await this.router.navigate(['tetris']);
  }

  public updateGame(gameUser: GameUser) {


    this.gameService.addUserToGame(gameUser).subscribe((games: Game) => {
      this.game = games;
    }, async error => {
      alert("Game is full!");
      await this.router.navigate(['tetris']);
    });
  }

  gameStarted() {
    this.playerBoard.play();
    this.inGame = !this.inGame;
    if (this.inGame) {
      const bodyElement = document.body;
      // bodyElement.classList.add('game-started');
    }
  }

  // @ts-ignore
  public pointUpdated({points, level, isDead}) {
    this.opponentPoints = points;
    this.opponentLevel = level;
    this.opponentIsDead = isDead;

    this.opponentBoard.inGame = isDead;

    this.calcWinner();
  }

  // @ts-ignore
  public resultsUpdated({opponentWon}) {
    this.playerBoard.points += 100;
    this.showWinner(opponentWon);
  }

  showWinner(won: boolean | null) {

    if (this.finished) return;

    this.opponentBoard.inGame = false;
    this.playerBoard.inGame = false;

    let userid = this.authService.getUserId()
    let gameUser: GameUser = {id: 0, userId: userid, gameId: this.game.id, score: this.playerPoints}

    this.gameService.updateExistingGame(gameUser).subscribe((games: Game) => {
      this.game = games;
    }, async error => {
      alert("Something went wrong saving score!");
      await this.router.navigate(['tetris']);
    });

    this.gameService.finishGame(this.game.id).subscribe((game: Game) => {
      this.game = game;
    });

    this.winner = won;
    this.finished = true;
  }

  public calcWinner() {

    if (this.opponentIsDead && this.playerPoints < this.opponentPoints) return;

    if (this.opponentIsDead && this.playerPoints > this.opponentPoints) {
      this.showWinner(true);
      return;
    }

    if (this.playerIsDead && this.playerPoints > this.opponentPoints) return;

    if (this.playerIsDead && this.playerPoints < this.opponentPoints) {
      this.showWinner(false);
      return;
    }

    if (this.playerIsDead && this.opponentIsDead) {

      if (this.opponentPoints == this.playerPoints) {
        this.showWinner(null);
        return;
      }

      if (this.opponentPoints > this.playerPoints) {
        this.showWinner(false);
        return;
      }

      if (this.opponentPoints < this.playerPoints) {
        this.showWinner(true);
        return;
      }
    }
  }

  public surrender() {
    this.tetrisSocket.updateResults(true);
    this.showWinner(false);
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

  public playGame() {

    if (this.tetrisSocket != undefined) {
      this.tetrisSocket.startGame();
    }
  }
}
