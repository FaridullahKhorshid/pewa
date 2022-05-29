import {Shape} from '../shape/shape';

export class Board {

    public static COLS = 15;
    public static ROWS = 25;
    public static BLOCK_SIZE = 20;

    /** Two-dimensional matrix representation of the board */
    private board: number[][];
    private shapes: Shape[] = [];

    public constructor(public width: number, public height: number) {
        this.board = [];

        for (let i = 0; i < this.height; i++) {
            this.board[i] = [];
            for (let j = 0; j < this.width; j++) {
                this.board[i][j] = 0;
            }
        }
    }

    public getBoard(): number[][] {
        return this.board;
    }

    public setBoard(board: number[][]): number[][] {
        return this.board = board;
    }

    public getShapes(): Shape[] {
        return this.shapes;
    }


    /** Returns the number of burned rows */
    public burnRows(): number {
        let burnedCount = 0;

        outer: for (let i = this.height - 1; i >= 0; i--) {
            for (let j = 0; j < this.width; j++) {
                if (this.board[i][j] === 0) {
                    continue outer;
                }
            }

            burnedCount += 1;
            const row = this.board.splice(i, 1)[0].fill(0);
            this.board.unshift(row);
            i++;
        }
        return burnedCount;
    }

    public addToBoard(shape: Shape): void {
        this.shapes.push(shape);
        shape.getMatrix().forEach((row, x) => {
            row.forEach((val, y) => {
                if (val > 0) {
                    this.board[shape.getCoordinates()[0] + x][y + shape.getCoordinates()[1]] = val;
                }
            });
        });
    }
}
