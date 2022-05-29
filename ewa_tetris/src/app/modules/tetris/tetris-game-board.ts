import {Board} from "../../models/board/board";
import {Shape} from "../../models/shape/shape";
import {TetrisGame} from "./tetris-game";
import {clone} from "chart.js/helpers";
import {TetrisSocket} from "../../shared/classes/socket/tetris-socket";

export class TetrisGameBoard {

  private canvas: any;
  private context: any;

  private board: Board;
  public activeShape: Shape;
  public nextShape: Shape;

  private dropCounter: number;
  private dropInterval: number;
  public lastTime: number;
  public level: number;
  public points: number;
  private totalBurnedRows: number;

  private shapeCanvas: any;
  private shapeContext: any;

  // private highScore: number;
  private game: TetrisGame;
  public inGame: boolean = false;
  private tetrisSocket: TetrisSocket | null;
  isPlayer: boolean = true;

  constructor(canvas: any, shapeCanvas: any, tetrisSocket: TetrisSocket | null = null, isPlayer: boolean = true) {

    this.board = new Board(Board.COLS, Board.ROWS);
    this.dropInterval = 1000; // 1000 ms = 1 sec
    this.dropCounter = 0;
    this.lastTime = 0;
    this.level = 1;
    this.points = 0;
    this.totalBurnedRows = 0;
    this.isPlayer = isPlayer;

    if (this.isPlayer) {
      this.activeShape = Shape.getRandomShape();
      this.nextShape = Shape.getRandomShape();
    } else {
      this.activeShape = new Shape([]);
      this.nextShape = new Shape([]);
    }

    this.game = new TetrisGame();

    // canvas
    this.canvas = canvas;
    this.shapeCanvas = shapeCanvas;

    this.context = this.canvas.getContext('2d');
    this.context.scale(Board.BLOCK_SIZE, Board.BLOCK_SIZE);

    this.shapeContext = this.shapeCanvas.getContext('2d');
    this.shapeContext.scale(Board.BLOCK_SIZE, Board.BLOCK_SIZE);

    // socket
    this.tetrisSocket = tetrisSocket;

    if (this.tetrisSocket) {
      this.tetrisSocket.onBoardUpdated(this);
      this.tetrisSocket.onMove(this);
    }

    // needed to draw the game board
    this.repaint();
  }

  public replay() {
    this.board = new Board(Board.COLS, Board.ROWS);
    this.level = 1;
    this.points = 0;
    this.lastTime = 0;
    this.nextShape = Shape.getRandomShape();
    this.activeShape = Shape.getRandomShape();
    this.repaint();
    this.play();
  }

  public play() {

    this.updateBoardToOpponent();

    this.inGame = !this.inGame;
    this.gameLoop();
  }

  gameLoop = (time = 0) => {
    if (!this.inGame) {
      return;
    }

    this.repaint();

    const delta = time - this.lastTime;
    this.lastTime = time;
    this.dropCounter += delta;

    if (this.dropCounter > this.dropInterval) {
      this.activeShape.drop();
      if (this.collides()) {
        this.activeShape.up();
        this.board.addToBoard(this.activeShape);
        if (this.hitTop()) {

          this.inGame = false;

          if (this.isPlayer && this.tetrisSocket) {
            this.tetrisSocket.updatePoints(this.points, this.level, !this.inGame);
          }

          return;
        }
        let burnedRows = this.board.burnRows();
        if (burnedRows > 0) {
          this.totalBurnedRows += burnedRows;
          this.addPoints(burnedRows);
        }

        this.activeShape = this.nextShape;

        if (this.isPlayer) {
          this.nextShape = Shape.getRandomShape();
        }
      }

      this.updateBoardToOpponent();
      this.dropCounter = 0;
    }

    requestAnimationFrame(this.gameLoop);
  }

  drawShape(shape: Shape): void {
    const matrix = shape.getMatrix();
    const coords = shape.getCoordinates();

    matrix.forEach((row, x) => {
      row.forEach((val, y) => {
        if (val > 0) {
          this.context.fillStyle = this.game.getColor(val, this.level);
          this.context.fillRect(y + coords[1], x + coords[0], 1, 1);
        }
      });
    });
  }

  collides(): boolean {
    const shapeMatrix = this.activeShape.getMatrix();
    const shapeCoords = this.activeShape.getCoordinates();
    const boardMatrix = this.board.getBoard();
    for (let y = 0; y < shapeMatrix.length; y++) {
      for (let x = 0; x < shapeMatrix[y].length; x++) {
        if (shapeMatrix[y][x] !== 0 &&
          (boardMatrix[y + shapeCoords[0]] !== undefined &&
            boardMatrix[y + shapeCoords[0]][x + shapeCoords[1]]) !== 0) {
          // collission
          return true;
        }
      }
    }
    return false;
  }

  hitTop(): boolean {
    return this.activeShape.getCoordinates()[0] == 0;
  }

  hitLeft(): boolean {
    return this.activeShape.getCoordinates()[1] == 0;
  }

  hitRight(): boolean {
    return (this.activeShape.getCoordinates()[1] + this.activeShape.getMatrix()[1].length) == this.board.width;
  }

  rotateShape(clockwise: boolean): void {
    let offset = 1;
    const startPos = clone(this.activeShape.getCoordinates());
    const startMatrix = clone(this.activeShape.getMatrix());
    this.rotateShapeMatrix(clockwise);
    while (this.collides()) {
      if (offset > 0) {
        for (let i = 0; i < offset; i++) {
          this.activeShape.right();
        }
        offset = -offset;
        offset -= 1;
        if (offset <= -(this.activeShape.getMatrix()[0].length)) {
          this.activeShape.setCoordinates(startPos);
          this.activeShape.setMatrix(startMatrix);
          return;
        }
      } else {
        for (let i = 0; i > offset; i--) {
          this.activeShape.left();
        }
        offset = -offset;
        offset += 1;
        if (offset >= this.activeShape.getMatrix()[0].length) {
          this.activeShape.setCoordinates(startPos);
          this.activeShape.setMatrix(startMatrix);
          return;
        }
      }
    }


  }

  rotateShapeMatrix(clockwise: boolean = true): number[][] {
    let matrix = this.activeShape.getMatrix();

    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x <= y; x++) {

        [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
      }
    }

    if (clockwise) {
      matrix.forEach(row => row.reverse());
    } else {
      matrix.reverse();
    }

    this.activeShape.setMatrix(matrix);

    return matrix;
  }

  public repaint() {

    this.clearBoard();
    this.drawBackground();
    this.drawBoard();
    this.drawShape(this.activeShape);
    this.drawNextShape(this.nextShape);
  }

  clearBoard(): void {
    this.context.clearRect(0, 0, this.canvas.height, this.canvas.width);
  }

  drawBackground(): void {
    this.context.fillStyle = 'transparent';
    this.context.fillRect(0, 0, this.canvas.height, this.canvas.width);
    this.shapeContext.fillStyle = 'transparent';
    this.shapeContext.fillRect(0, 0, this.shapeCanvas.height, this.shapeCanvas.width);
  }

  drawBoard(): void {
    const matrix = this.board.getBoard();
    matrix.forEach((row: any[], y: any) => {
      row.forEach((val, x) => {
        if (val !== 0) {
          this.context.fillStyle = this.game.getColor(val, this.level);
          this.context.fillRect(x, y, 1, 1);
        }
      });
    });
  }

  drawNextShape(shape: Shape): void {

    this.shapeContext.clearRect(0, 0, this.canvas.height, this.canvas.width);

    const matrix = shape.getMatrix();
    matrix.forEach((row, x) => {
      row.forEach((val, y) => {
        if (val == 1) {
          this.shapeContext.fillStyle = this.game.getColor(val, this.level);
          this.shapeContext.fillRect(y + 1.5, x + 1.5, 1, 1);
        }
        if (val == 2) {
          this.shapeContext.fillStyle = this.game.getColor(val, this.level);
          this.shapeContext.fillRect(y, x + 0.5, 1, 1);
        }
        if (val >= 3) {
          this.shapeContext.fillStyle = this.game.getColor(val, this.level);
          this.shapeContext.fillRect(y + 1, x + 1, 1, 1);
        }
      });
    });
  }

  calculateLevel(): void {
    if (this.totalBurnedRows >= (((this.level - 1) * 10) + 10)) {
      this.level++;
      this.dropInterval -= 150;
    }
  }

  public addPoints(rowsDestroyed: number) {
    switch (rowsDestroyed) {
      case 1: {
        this.points = this.points + (40 * this.level)
        break;
      }
      case 2: {
        this.points = this.points + (100 * this.level)
        break;
      }
      case 3: {
        this.points = this.points + (300 * this.level)
        break;
      }
      default: {
        this.points = this.points + (1200 * this.level)
      }
    }

    this.calculateLevel();

    if (this.isPlayer && this.tetrisSocket) {
      this.tetrisSocket.updatePoints(this.points, this.level, !this.inGame);
    }
  }

  // controls for the game
  public goRight() {
    this.activeShape.right();
    if (this.collides()) {
      this.activeShape.left();
    }
    this.updateBoardToOpponent();
  }

  public goLeft() {
    this.activeShape.left();
    if (this.collides()) {
      this.activeShape.right();
    }
    this.updateBoardToOpponent();
  }

  public goDown() {
    this.activeShape.drop();
    if (this.collides()) {
      this.activeShape.up();
    }
    this.updateBoardToOpponent();
  }

  public rotateClockWise() {
    this.rotateShape(true);
    this.updateBoardToOpponent();
  }

  public rotateCounterWise() {
    this.rotateShape(false);
    this.updateBoardToOpponent();
  }

  public updateBoardToOpponent() {
    if (this.isPlayer && this.tetrisSocket) {
      this.tetrisSocket.updateBoard(this.activeShape, this.nextShape, this.board.getBoard());
    }
  }

  // @ts-ignore
  public updateBoard({activeShape, nextShape, board}) {

    if (!this.isPlayer) {

      this.activeShape = new Shape(activeShape.matrix);
      this.activeShape.setCoordinates(activeShape.coordinates);
      this.activeShape.setId(activeShape.id);

      if (nextShape != null) {
        this.nextShape = new Shape(nextShape.matrix);
        this.nextShape.setCoordinates(nextShape.coordinates);
        this.nextShape.setId(nextShape.id);
      }

      this.board.setBoard(board);

      this.repaint();
    }
  }
}
