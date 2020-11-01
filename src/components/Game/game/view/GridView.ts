import { Container, Graphics, Text } from 'pixi.js';
import { BulgePinchFilter } from '@pixi/filter-bulge-pinch';
import Grid from '../model/Grid';
import Cell from './Cell';
import happens from 'happens';
import gsap from 'gsap';

const square = (width: number, height: number, color: number) => {
  const rect = new Container();
  const graphics = new Graphics();
  graphics.beginFill(color);
  graphics.drawRect(0, 0, width, height);
  rect.addChild(graphics);
  return rect;
}

const CELL_SIZE = 110;

export default class GridView {
  private container: Container;
  private borderTop: Container;
  private borderRight: Container;
  private borderBottom: Container;
  private borderLeft: Container;
  private gridModel: any;
  private width: number;
  private height: number;
  private color: number;
  private cells: Array<Array<Cell>> = [];
  private levels: Array<string> = ['WINTER', 'SPRING', 'SUMMER', "FALL"]
  private word: string = '';;
  private currentLevel: number = -1;
  private currentLetter: string = '';
  private wordIndex: number = 0;
  private counter: number = 0;
  private filter :any;
  private filterAnimation: {
    center: {
      x: number,
      y: number,
    },
  }
  public on: Function;
  public emit: Function;
  private score: Text;
  constructor(stage: Container, gridModel: Grid, theme: any) {
    happens(this);
    this.clickedCell = this.clickedCell.bind(this)
    this.nextLevel = this.nextLevel.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
    this.filterAnimation = { center: { x: 0.5, y: 0.5 } }
    this.gridModel = gridModel;
    this.color = theme.color.white.replace('#', '0x')
    this.width = this.gridModel.columns * CELL_SIZE;
    this.height = this.gridModel.rows * CELL_SIZE;
    this.container = new Container();
    this.container.buttonMode = true;
    this.filter = new BulgePinchFilter({ strength: 1, radius: 100 })
    // stage.filters = [this.filter];
    this.resize();
    this.container.alpha = 0;
    stage.addChild(this.container);
    this.buildGrid();
    this.addCells();
    this.update = this.update.bind(this);
    this.clicked = this.clicked.bind(this);
    this.gridModel.on('update', this.update);
    this.gridModel.on('clicked', this.clicked);
  }

  buildGrid() {
    this.borderTop = square(this.width, 3, this.color);
    this.borderTop.x = 0;
    this.borderTop.y = 0;
    this.container.addChild(this.borderTop);

    this.borderRight = square(3, this.height, this.color);
    this.borderRight.x = this.width;
    this.borderRight.y = 0;
    this.container.addChild(this.borderRight);

    this.borderBottom = square(this.width, 3, this.color);
    this.borderBottom.x = 0;
    this.borderBottom.y = this.height;
    this.container.addChild(this.borderBottom);

    this.borderLeft = square(3, this.height, this.color);
    this.borderLeft.x = 0;
    this.borderLeft.y = 0;
    this.container.addChild(this.borderLeft);

    for (let col = 1; col < this.gridModel.columns; col++) {
      const colContainer = square(1, this.height, this.color);
      colContainer.x = col * CELL_SIZE;
      colContainer.y = 0;
      this.container.addChild(colContainer)
    }

    for (let row = 1; row < this.gridModel.rows; row++) {
      const colContainer = square(this.width, 1, this.color);
      colContainer.y = row * CELL_SIZE;
      colContainer.x = 0;
      this.container.addChild(colContainer)
    }

    this.score = new Text('', {
      fontFamily: "HelveticaNeueBold",
      fontSize: 16,
      letterSpacing: 3,
      fill: 0xFFFFFF
    })

    this.score.anchor.set(0.5);
    this.score.y = this.gridModel.rows * CELL_SIZE + 100;
    this.score.x = (this.gridModel.columns * CELL_SIZE) / 2;
    this.container.addChild(this.score);
  }

  onMouseMove(e: any) {

    const x = e.clientX;
    const y = e.clientY;

    gsap.to(this.filterAnimation.center, {
      duration: 0.5,
      x: x / window.innerWidth,
      y: y / window.innerHeight,
      onUpdate: () => {
        this.filter.center = [this.filterAnimation.center.x, this.filterAnimation.center.y]
      }
    })
  }

  intro() {
    gsap.to(this.container, { duration: 1, alpha: 1, ease: 'expo.out', onComplete: this.nextLevel})
    window.addEventListener('mousemove', this.onMouseMove);
  }

  nextLevel() {
    this.gridModel.clear();
    this.currentLevel = this.currentLevel < 3 ? this.currentLevel + 1 : this.currentLevel = 0;
    this.word = this.levels[this.currentLevel];
    this.wordIndex = 0;
    this.currentLetter = this.getNextWord();
    this.gridModel.start();
  }

  clicked(grid: any) {
    const next = this.word.toString().charAt(this.wordIndex);
    if (!next.length) {
      this.updateState(grid);
      this.stop();
      this.emit('complete');
      this.score.text = this.word;
      return;
    }
    this.updateState(grid);
    this.score.text = this.word.substring(0, this.wordIndex);
    this.currentLetter = this.getNextWord();
    this.emit('progress', this.wordIndex / (this.word.length - 1) / 1.5);
  }

  update(grid: any) {
    this.updateState(grid);
  }

  stop() {
    this.gridModel.clear();
  }

  updateState(grid: any) {
    this.gridModel.iterate((col: number, row: number) => {
      this.cells[col][row].update(grid[col][row], this.currentLetter);
    })
  }

  getNextWord(): any {
    const char = this.word.toString().charAt(this.wordIndex);
    this.wordIndex += 1;
    if (this.wordIndex >= this.word.length) {
      false;
    }
    return char;
  }

  checkLevel() {
    this.counter += 1;
    if (this.counter % 10 === 0 && this.counter <= 10) {
      this.gridModel.increaseDifficulty();
    }
    if (this.counter === 20) {
      this.gridModel.clear();
    }
  }

  clickedCell(cell: Cell) {
    this.gridModel.setState(cell.gridPosition, 0);
  }

  addCells() {
    this.gridModel.iterate((col: number, row: number) => {
      if (!this.cells[col]) {
        this.cells[col] = [];
      }
      if (!this.cells[row]) {
        this.cells[row] = [];
      }

      const c = new Cell(this.container, CELL_SIZE, `${col}:${row}`);
      c.on('click', this.clickedCell);
      c.x = col * CELL_SIZE;
      c.y = row * CELL_SIZE;
      this.cells[col][row] = c;
    })
  }

  resize() {
    this.container.x = window.innerWidth / 2 - this.width / 2
    this.container.y = window.innerHeight / 2 - this.height / 2
  }
}
