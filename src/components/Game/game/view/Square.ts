import { Container, Graphics } from 'pixi.js';

export default class Square extends Container {
  public graphics: Graphics;
  constructor(width: number, height: number, color: number) {
    super();
    this.graphics = new Graphics();
    this.graphics.beginFill(color);
    this.graphics.drawRect(0, 0, width, height);
    this.addChild(this.graphics);
  }
}
