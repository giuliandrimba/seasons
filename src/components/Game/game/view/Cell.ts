import { Container, Graphics } from 'pixi.js';
import happens from 'happens';

const square = (width: number, height: number, color: number) => {
  const rect = new Container();
  const graphics = new Graphics();
  graphics.beginFill(color);
  graphics.drawRect(0, 0, width, height);
  rect.addChild(graphics);
  return rect;
}

export default class Cell {
  private state: number = 0;
  private sprite: Container;
  private position: string;
  public on: Function;
  public emit: Function;

  constructor(container: Container, size: number, position: string) {
    this.position = position;
    this.sprite = square(size, size, 0xFFFFFF);
    this.sprite.buttonMode = true;
    this.sprite.interactive = true;
    this.onClick = this.onClick.bind(this);
    this.sprite.on('mousedown', this.onClick).on('touchstart', this.onClick);
    container.addChild(this.sprite);
    this.sprite.alpha = 0;
    happens(this);
  }

  onClick(){
    if (this.state === 1) {
      this.emit('click', this);
    }
  }

  update(state: number) {
    if (this.state !== state) {
      this.state = state;
      this.sprite.alpha = state;
    }
  }

  get gridPosition(): any {
    const parsed = this.position.split(':');
    return {
      column: parsed[0],
      row:parsed[1]
    }
  }

  set x(value: number) {
    this.sprite.x = value;
  }

  set y(value: number) {
    this.sprite.y = value;
  }
}
