import { Container, Graphics } from 'pixi.js';
import Grid from '../model/Grid';

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
  private gridModel: Grid;
  private width: number;
  private height: number;
  private color: number;
  constructor(stage: Container, gridModel: Grid, theme: any) {
    this.gridModel = gridModel;
    this.color = theme.color.white.replace('#', '0x')
    this.width = this.gridModel.columns * CELL_SIZE;
    this.height = this.gridModel.rows * CELL_SIZE;
    this.container = new Container();
    this.container.x = window.innerWidth / 2 - this.width / 2
    this.container.y = window.innerHeight / 2 - this.height / 2
    stage.addChild(this.container);
    this.buildGrid();
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
  }
}
