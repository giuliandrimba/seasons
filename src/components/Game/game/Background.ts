import { DisplacementFilter } from '@pixi/filter-displacement';
import { Container, Sprite, Texture, WRAP_MODES } from 'pixi.js';
import gsap from 'gsap';
import resize from '@doublepi/resize';

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
      s.width = window.innerWidth;
      s.height = window.innerHeight;
      s.alpha = 0;
      this.images.push(s);
      container.addChild(s);
    })
    this.resize();
  }

  intro(cb: any) {
    gsap.to(this.images[0], { duration: 0.5, alpha: 1 })
    gsap.to(this.filter.scale, { duration: 2, ease: 'expo.out', x: FACTOR, y: FACTOR });
    setTimeout(cb, 1);
  }

  progress(value: number) {
    gsap.to(this.filter.scale, { duration: 1, ease: 'power4.out', x: FACTOR - (FACTOR * value), y: FACTOR - (FACTOR * value) });
  }

  complete(index: number, cb: any) {
    gsap.to(this.filter.scale, { duration: 3, x: 0, y: 0, ease: 'power4.out', onComplete: cb });
    gsap.to(this.images[this.index], { duration: 1, alpha: 0, delay: 3 })
    gsap.to(this.filter.scale, { duration: 2, ease: 'expo.out', x: FACTOR, y: FACTOR, delay: 3 });
    this.index = this.index < 3 ? this.index + 1 : this.index = 0;
    gsap.to(this.images[this.index], { duration: 1, alpha: 1, delay: 3 })
  }

  nextLevel(index: number) {
    gsap.to(this.images[this.index], { duration: 1, alpha: 0 })
    gsap.to(this.filter.scale, { duration: 2, ease: 'expo.out', x: FACTOR, y: FACTOR });
    gsap.to(this.images[this.index], { duration: 1, alpha: 1 })
  }

  resize() {
    const size = resize(1920, 1080, window.innerWidth, window.innerHeight);
    this.images.forEach(s => {
      s.width = size.width;
      s.height = size.height;
    })
  }
}
