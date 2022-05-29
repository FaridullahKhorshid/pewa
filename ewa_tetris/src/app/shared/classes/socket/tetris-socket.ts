import {io, Socket} from "socket.io-client";
import {environment} from "../../../../environments/environment";
import {Shape} from "../../../models/shape/shape";
import {TetrisGameBoard} from "../../../modules/tetris/tetris-game-board";
import {TetrisComponent} from "../../../modules/tetris/tetris.component";

export class TetrisSocket {

  private socket: Socket;
  private tetrisComponent: TetrisComponent;

  public constructor(tetrisComponent: TetrisComponent, gameId: number) {

    this.tetrisComponent = tetrisComponent;
    this.socket = io(environment.socketUrl);

    const randomIndex = Math.floor(Math.random() * 100);
    const data = {'room': 'tetris-' + gameId, 'username': 'User-' + randomIndex};

    this.socket.emit("join-game", data, (response: any) => {
      // console.log(response.status); // ok
    });
  }

  public connect() {
    this.socket = io(environment.socketUrl);
  }

  public disconnect() {
    this.socket.disconnect();
  }

  // start game if you are ready
  public startGame() {

    this.socket.emit("start-game", null, (response: any) => {
      // console.log(response.status); // ok
    });
  }

  // listen if game is started
  public onGameStarted() {
    this.socket.on("game-started", (data) => {
      this.tetrisComponent.gameStarted();
    });
  }

  // update shapes: next shape and active shape
  public updateBoard(activeShape: Shape, nextShape: Shape, board: number[][]) {
    this.socket.emit("update-shapes", {
      "active_shape": activeShape,
      'next_shape': nextShape,
      'board': board
    }, (response: any) => {
      // console.log(response.status); // ok
    });

    this.tetrisComponent.calcWinner();
  }

  // check if shapes ware updated: next shape and active shape
  public onBoardUpdated(tetrisGameBoard: TetrisGameBoard) {
    this.socket.on("shapes-updated", (data) => {
      tetrisGameBoard.updateBoard(data);
    });
  }

  // update points and check who won
  public updatePoints(points: number, level: number, isDead: boolean = false) {
    this.tetrisComponent.playerPoints = points;
    this.tetrisComponent.playerLevel = level;
    this.tetrisComponent.playerIsDead = isDead;

    this.socket.emit("update-points", {"points": points, 'level': level, 'isDead': isDead}, (response: any) => {
      console.log(response.status); // ok
    });
  }

  // listen to point updates
  public onPointsUpdated() {
    this.socket.on("points-updated", (data) => {
      this.tetrisComponent.pointUpdated(data);
    });
  }

  // update points and check who won
  public updateResults(opponentWon: boolean | null) {

    this.socket.emit("update-results", {"opponentWon": opponentWon}, (response: any) => {
      // console.log(response.status); // ok
    });
  }

  // listen to point updates
  public onResultsUpdated() {
    this.socket.on("results-updated", (data) => {
      this.tetrisComponent.resultsUpdated(data);
    });
  }

  // make move as a player
  public move(move: 'goLeft' | 'goRight' | 'goDown' | 'rotateClockWise' | 'rotateCounterWise') {
    this.socket.emit("make-move", move, (response: any) => {
      // console.log(response.status); // ok
    });
  }

  // listen to moves of the opponent
  public onMove(tetrisGameBoard: TetrisGameBoard) {
    if (!tetrisGameBoard.isPlayer) {
      this.socket.on("made-move", ({move}) => {
        // @ts-ignore ... calling method of the class the dynamically
        tetrisGameBoard[move]();
        // tetrisGameBoard.goLeft();
      });
    }
  }
}
