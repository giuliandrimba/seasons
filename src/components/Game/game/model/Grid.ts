import happens from 'happens';

export interface GridOptions {
  columns: number;
  rows: number;
}

export default class Grid {
  private grid: Array<Array<number>> = []
  private cells: Array<{row: number, column: number}>;
  private difficulty: number = 1
  private options: GridOptions;
  private intervals: any;
  private emit: Function;
  constructor(options: GridOptions) {

    this.start = this.start.bind(this);
    this.increaseDifficulty = this.increaseDifficulty.bind(this);
    this.clear = this.clear.bind(this);

    this.options = options;
    this.intervals = [];
    this.cells = [];
    for (let c = 0; c < options.columns; c++) {
      this.grid[c] = [];
      for (let r = 0; r < options.rows; r++) {
        this.grid[c][r] = 0;
      }
    }
    happens(this);
    // this.increaseDifficulty();
  }

  increaseDifficulty() {
    const interval = setInterval(this.start, 2000 / this.difficulty, this.intervals.length);
    this.intervals.push(interval);
  }

  start(level: number) {
    const rndColumn = Math.floor(Math.random() * this.options.columns)
    const rndRow = Math.floor(Math.random() * this.options.columns)
    if (!this.cells[level]) {
      this.cells[level] = {
        row: rndRow,
        column: rndColumn,
      }
    } else {
      this.grid[this.cells[level].column][this.cells[level].row] = 0;
      this.cells[level].row = rndRow;
      this.cells[level].column = rndColumn;
    }
    this.grid[this.cells[level].column][this.cells[level].row] = 1;
    this.emit('update', this.output())
  }

  clear() {
    this.intervals.forEach((interval: any) => {
      clearInterval(interval);
    })
  }

  get columns() {
    return this.options.columns;
  }

  get rows() {
    return this.options.rows;
  }

  output() {
    return this.grid;
  }
}
