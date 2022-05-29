export class Shape {
  private static nextId: number = 1;
  private id: number;
  /** The coordinates of the top-left cell of the shape on the board */
  private coordinates: [number, number];

  public constructor(private matrix: number[][]) {
    this.id = Shape.nextId;
    Shape.nextId += 1;
    this.coordinates = [0, 6];
  }

  public getCoordinates(): [number, number] {
    return this.coordinates;
  }

  public setCoordinates(coordinates: [number, number]): void {
    this.coordinates = coordinates;
  }

  public drop(): void {
    this.coordinates[0] = this.coordinates[0] + 1;
  }

  public up(): void {
    this.coordinates[0] = this.coordinates[0] - 1;
  }

  public left(): void {
    this.coordinates[1] = this.coordinates[1] - 1;
  }

  public right(): void {
    this.coordinates[1] = this.coordinates[1] + 1;
  }

  public getMatrix(): number[][] {
    return this.matrix;
  }

  public setMatrix(matrix: number[][]) {
    this.matrix = matrix;
  }

  public getId(): number {
    return this.id;
  }

  public setId(id: number) {
    this.id = id;
  }

  static getRandomShape() {
    const possible = [
      [
        // [0, 0, 0, 0, 0],
        [0, 0, 2, 0, 0],
        [0, 0, 2, 0, 0],
        [0, 0, 2, 0, 0],
        [0, 0, 2, 0, 0],
      ],
      [
        [1, 1],
        [1, 1],
      ],
      [
        [0, 3, 0],
        [0, 3, 0],
        [3, 3, 0],
      ],

      [
        [4, 0, 0],
        [4, 0, 0],
        [4, 4, 0],
      ],

      [
        [4, 4, 0],
        [0, 4, 4],
        [0, 0, 0],
      ],

      [
        [0, 5, 5],
        [5, 5, 0],
        [0, 0, 0],
      ],

      [
        [0, 6, 0],
        [6, 6, 6],
        [0, 0, 0],
      ]
    ];

    const randomIndex = Math.floor(Math.random() * (possible.length));

    return new Shape(possible[randomIndex]);
  }
}
