import { BLEND_MODES, Container, Graphics, Sprite, Text, TextStyle, WRAP_MODES } from 'pixi.js';
import happens from 'happens';
import gsap from 'gsap';
import alphabet from '../../../../library/alphabet';
import images from '../images';

export default class Cell {
  private state: number = 0;
  private sprite: Container;
  private size: number = 0;
  private position: string;
  private finalLetter: string = '';
  private text: Text;
  public on: Function;
  public emit: Function;
  private graphics: any;
  private animation: {
    progress: number;
  };

  constructor(container: Container, size: number, position: string) {
    this.onClick = this.onClick.bind(this);

    this.position = position;
    this.size = size;
    this.animation = {
      progress: 0,
    };

    this.sprite = new Container();
    this.sprite.buttonMode = true;
    this.sprite.interactive = true;
    container.addChild(this.sprite);

    this.createType();
    this.createHitSquare();

    this.sprite.on('mousedown', this.onClick).on('touchstart', this.onClick);
    happens(this);
  }

  createType() {
    const style = new TextStyle({
      fontFamily: 'HelveticaNeueBold',
      fontSize: 75,
      fill: 0xffffff,
    });
    this.text = new Text('', style);
    this.text.anchor.set(0.5);
    this.sprite.addChild(this.text);
  }

  createHitSquare() {
    this.graphics = Sprite.from(images.displacement);
    this.graphics.width = this.size;
    this.graphics.height = this.size;
    this.graphics.alpha = 0;
    this.graphics.anchor.set(0.5);
    this.graphics.texture.baseTexture.wrapMode = WRAP_MODES.REPEAT;
    this.graphics.blendMode = BLEND_MODES.ADD;
    this.sprite.addChild(this.graphics);
  }

  onClick() {
    if (this.state === 1) {
      gsap.killTweensOf(this.animation);
      this.text.text = this.finalLetter;
      this.graphics.alpha = 0.8;
      gsap.killTweensOf(this.graphics);
      gsap.to(this.graphics, { duration: 0.15, alpha: 0, delay: 0.4 });
      this.emit('click', this);
    }
  }

  update(state: number, finalLetter: string) {
    this.finalLetter = finalLetter;
    if (this.state !== state) {
      this.state = state;
      if (state === 1) {
        this.show(finalLetter);
      } else {
        this.hide();
      }
    }
  }

  show(finalLetter: string) {
    gsap.fromTo(
      this.animation,
      { progress: 0.5 },
      {
        duration: 0.7,
        progress: 1,
        ease: 'power4.out',
        onUpdate: () => {
          this.text.scale.set(this.animation.progress);
          const index = Math.floor(Math.random() * alphabet.length);
          if (this.animation.progress >= 0.99) {
            this.text.text = finalLetter;
          } else {
            this.text.text = alphabet[index];
          }
        },
      }
    );
  }

  hide() {
    gsap.killTweensOf(this.animation);
    this.text.text = this.finalLetter;
    gsap.to(this.animation, {
      duration: 0.5,
      progress: 0,
      ease: 'expo.out',
      onUpdate: () => {
        this.text.scale.set(this.animation.progress);
      },
    });
  }

  get gridPosition(): any {
    const parsed = this.position.split(':');
    return {
      column: parsed[0],
      row: parsed[1],
    };
  }

  set x(value: number) {
    this.sprite.x = value + this.size / 2;
  }

  set y(value: number) {
    this.sprite.y = value + this.size / 2;
  }
}
