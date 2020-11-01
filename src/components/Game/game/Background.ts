import { DisplacementFilter } from '@pixi/filter-displacement';
import { Container, Sprite, Texture, WRAP_MODES } from 'pixi.js';
import gsap from 'gsap';

export default class Background {
  private images:Array<Sprite>;
  private filter: any;
  private displacementSprite;
  constructor(container: Container, assets: Array<Texture>) {
    this.progress = this.progress.bind(this);
    this.nextLevel = this.nextLevel.bind(this);
    this.displacementSprite = Sprite.from('/backgrounds/displacement.jpg');
    this.displacementSprite.texture.baseTexture.wrapMode = WRAP_MODES.REPEAT;
    this.filter = new DisplacementFilter(this.displacementSprite);
    this.filter.scale.x = 1000;
    this.filter.scale.y = 1000;
    container.addChild(this.displacementSprite);
    assets.forEach(asset => {
      const s = new Sprite(asset);
      s.filters = [this.filter];
      container.addChild(s);
    })
  }

  progress(value: number) {
    gsap.to(this.filter.scale, { duration: 1, x: 1000 - (1000 * value), y: 1000 - (1000 * value) });
  }

  nextLevel(index: number) {}

  resize() {

  }
}
