import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import happens from 'happens';
import gsap from 'gsap';

const alphabet = ['A','B', 'C', 'D', "E", 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q']

export default class Cell {
  private state: number = 0;
  private sprite: Container;
  private size: number = 0;
  private position: string;
  private finalLetter: string = '';
  private text: Text;
  public on: Function;
  public emit: Function;
  private animation: {
    progress: number
  }

  constructor(container: Container, size: number, position: string) {
    this.position = position;
    this.size = size;
    this.animation = {
      progress: 0
    }
    const style = new TextStyle({
      fontFamily: "HelveticaNeueBold",
      fontSize: 75,
      fill: 0xFFFFFF
    });
    this.sprite = new Container();
    this.text = new Text('', style);
    this.text.anchor.set(0.5);
    const graphics = new Graphics();
    graphics.beginFill(0xFF0000);
    graphics.alpha = 0;
    graphics.drawRect(-size / 2, -size / 2, size, size);
    this.sprite.addChild(graphics);
    this.sprite.addChild(this.text)
    this.sprite.buttonMode = true;
    this.sprite.interactive = true;
    this.onClick = this.onClick.bind(this);
    this.sprite.on('mousedown', this.onClick).on('touchstart', this.onClick);
    container.addChild(this.sprite);
    happens(this);
  }

  onClick(){
    if (this.state === 1) {
      gsap.killTweensOf(this.animation);
      this.text.text = this.finalLetter;
      this.emit('click', this);
    }
  }

  update(state: number, finalLetter: string) {
    if (this.state !== state) {
      this.state = state;
      if (state === 1) {
        this.finalLetter = finalLetter;
        this.show(finalLetter);
      } else {
        this.finalLetter = finalLetter;
        this.hide();
      }
    }
  }

  show(finalLetter: string) {
    // gsap.fromTo(this.sprite, { scale: 0 }, { duration: 1, scale: 1, ease: 'expo.out' })
    gsap.fromTo(this.animation, {progress: 0.5}, {
      duration: 0.7,
      progress: 1,
      ease: 'power4.out',
      onUpdate: () => {
        this.sprite.scale.set(this.animation.progress);
        const index = Math.floor(Math.random() * alphabet.length);
        if (this.animation.progress >= 0.99) {
          this.text.text = finalLetter;
        } else {
          this.text.text = alphabet[index];
        }
      }
    })
  }
  hide() {
    gsap.killTweensOf(this.animation);
    this.text.text = this.finalLetter;
    gsap.to(this.animation, {
      duration: 0.5,
      progress: 0,
      ease: 'expo.out',
      onUpdate: () => {
        this.sprite.scale.set(this.animation.progress);
      }
    })
    // gsap.to(this.sprite, { duration: 0.5, scale: 0, ease: 'expo.out' })
  }

  get gridPosition(): any {
    const parsed = this.position.split(':');
    return {
      column: parsed[0],
      row:parsed[1]
    }
  }

  set x(value: number) {
    this.sprite.x = value + this.size / 2;
  }

  set y(value: number) {
    this.sprite.y = value + this.size / 2
  }
}
