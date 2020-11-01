import { DisplacementFilter } from '@pixi/filter-displacement';
import { Container, Sprite, Texture, WRAP_MODES } from 'pixi.js';
import gsap from 'gsap';

const FACTOR = 2000;

export default class Background {
  private images:Array<Sprite> = [];
  private filter: any;
  private displacementSprite;
  private index: number = 0;
  constructor(container: Container, assets: Array<Texture>) {
    this.progress = this.progress.bind(this);
    this.nextLevel = this.nextLevel.bind(this);
    this.complete = this.complete.bind(this);
    this.displacementSprite = Sprite.from('/backgrounds/displacement.jpg');
    this.displacementSprite.texture.baseTexture.wrapMode = WRAP_MODES.REPEAT;
    this.filter = new DisplacementFilter(this.displacementSprite);
    this.filter.scale.x = 0;
    this.filter.scale.y = 0;
    container.addChild(this.displacementSprite);
    assets.forEach(asset => {
      const s = new Sprite(asset);
      s.filters = [this.filter];
      s.alpha = 0;
      this.images.push(s);
      container.addChild(s);
    })
  }

  intro(cb: any) {
    gsap.to(this.images[0], { duration: 0.5, alpha: 1 })
    gsap.to(this.filter.scale, { duration: 2, ease: 'expo.out', x: FACTOR, y: FACTOR, onComplete: cb });
  }

  progress(value: number) {
    gsap.to(this.filter.scale, { duration: 1, ease: 'power4.out', x: FACTOR - (FACTOR * value), y: FACTOR - (FACTOR * value) });
  }

  complete() {
    gsap.to(this.filter.scale, { duration: 3, x: 0, y: 0, ease: 'power4.out' });
  }

  nextLevel(index: number) {

  }

  resize() {

  }
}
