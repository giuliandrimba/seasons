import happens from 'happens';

export interface GridOptions {
  columns: number;
  rows: number;
}

export default class GridModel {
  private grid: Array<Array<number>> = [];
  private cell: { row: number; column: number };
  private options: GridOptions;
  private interval: any;
  private emit: Function;
  constructor(options: GridOptions) {
    this.start = this.start.bind(this);
    this.clear = this.clear.bind(this);

    this.options = options;
    for (let c = 0; c < options.columns; c++) {
      this.grid[c] = [];
      for (let r = 0; r < options.rows; r++) {
        this.grid[c][r] = 0;
      }
    }
    happens(this);
  }

  start() {
    let rndColumn = Math.floor(Math.random() * this.options.columns);
    let rndRow = Math.floor(Math.random() * this.options.rows);
    if (!this.cell) {
      this.cell = {
        row: rndRow,
        column: rndColumn,
      };
    } else {
      this.grid[this.cell.column][this.cell.row] = 0;
      this.cell.row = rndRow;
      this.cell.column = rndColumn;
    }
    this.grid[this.cell.column][this.cell.row] = 1;
    this.emit('update', this.output());
    this.interval = setTimeout(this.start, 700 + Math.random() * 500);
  }

  setState(position: any, state: number) {
    this.grid[position.column][position.row] = 0;
    this.emit('clicked', this.output());
  }

  clear() {
    clearInterval(this.interval);
  }

  public iterate(cb: Function) {
    for (let col = 0; col < this.columns; col++) {
      for (let row = 0; row < this.rows; row++) {
        cb(col, row);
      }
    }
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
