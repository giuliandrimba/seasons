import { Container, Graphics, Text } from 'pixi.js';
import { BulgePinchFilter } from '@pixi/filter-bulge-pinch';
import Grid from '../model/GridModel';
import Cell from './Cell';
import Square from './Square';
import happens from 'happens';
import gsap from 'gsap';

const CELL_SIZE = 110;

export default class GridView {
  private container: Container;
  private borders: Container;
  private gridModel: any;
  private width: number;
  private height: number;
  private color: number;
  private cells: Array<Array<Cell>> = [];
  private levels: Array<string> = ['WINTER', 'SPRING', 'SUMMER', 'FALL'];
  private word: string = '';
  private currentLevel: number = -1;
  private currentLetter: string = '';
  private wordIndex: number = 0;
  private filter: any;
  private filterAnimation: {
    center: {
      x: number;
      y: number;
    };
  };
  public on: Function;
  public emit: Function;
  private score: Text;
  constructor(stage: Container, gridModel: Grid, theme: any) {
    happens(this);
    this.clickedCell = this.clickedCell.bind(this);
    this.nextLevel = this.nextLevel.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.update = this.update.bind(this);
    this.clicked = this.clicked.bind(this);

    this.filterAnimation = { center: { x: 0.5, y: 0.5 } };
    this.gridModel = gridModel;
    this.color = theme.color.white.replace('#', '0x');
    this.width = this.gridModel.columns * CELL_SIZE;
    this.height = this.gridModel.rows * CELL_SIZE;
    this.container = new Container();
    this.container.buttonMode = true;
    this.filter = new BulgePinchFilter({ strength: 1, radius: 100 });
    this.container.alpha = 0;
    stage.addChild(this.container);

    this.resize();
    this.buildGrid();
    this.addCells();

    this.gridModel.on('update', this.update);
    this.gridModel.on('clicked', this.clicked);
  }

  onMouseMove(e: any) {
    gsap.to(this.filterAnimation.center, {
      duration: 0.5,
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight,
      onUpdate: () => {
        this.filter.center = [this.filterAnimation.center.x, this.filterAnimation.center.y];
      },
    });
  }

  intro() {
    gsap.to(this.container, {
      duration: 1,
      alpha: 1,
      ease: 'expo.out',
      onComplete: this.nextLevel,
    });
    window.addEventListener('mousemove', this.onMouseMove);
  }

  nextLevel() {
    this.score.text = '';
    this.gridModel.clear();
    this.currentLevel = this.currentLevel < 3 ? this.currentLevel + 1 : (this.currentLevel = 0);
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
    });
  }

  getNextWord(): any {
    const char = this.word.toString().charAt(this.wordIndex);
    this.wordIndex += 1;
    if (this.wordIndex >= this.word.length) {
      false;
    }
    return char;
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
    });
  }

  resize() {
    this.container.x = window.innerWidth / 2 - this.width / 2;
    this.container.y = window.innerHeight / 2 - this.height / 2;
  }

  buildGrid() {
    this.borders = new Container();
    const rect = new Graphics();
    rect.lineStyle(3, this.color);
    rect.drawRect(0, 0, this.width, this.height);
    this.borders.addChild(rect);
    this.container.addChild(this.borders);

    for (let col = 1; col < this.gridModel.columns; col++) {
      const colContainer = new Square(1, this.height, this.color);
      colContainer.x = col * CELL_SIZE;
      colContainer.y = 0;
      this.container.addChild(colContainer);
    }

    for (let row = 1; row < this.gridModel.rows; row++) {
      const colContainer = new Square(this.width, 1, this.color);
      colContainer.y = row * CELL_SIZE;
      colContainer.x = 0;
      this.container.addChild(colContainer);
    }

    this.score = new Text('', {
      fontFamily: 'HelveticaNeueBold',
      fontSize: 16,
      letterSpacing: 3,
      fill: 0xffffff,
    });

    this.score.anchor.set(0.5);
    this.score.y = this.gridModel.rows * CELL_SIZE + 100;
    this.score.x = (this.gridModel.columns * CELL_SIZE) / 2;
    this.container.addChild(this.score);
  }
}
