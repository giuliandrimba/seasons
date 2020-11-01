import * as PIXI from 'pixi.js'
import images from './images';
import Grid from './model/Grid';
import GridView from './view/GridView';
import happens from 'happens';
import FontFaceObserver from 'fontfaceobserver';
import Background from './Background';

const square = (width: number, height: number, color: number) => {
  const rect = new PIXI.Container();
  const graphics = new PIXI.Graphics();
  graphics.beginFill(color);
  graphics.alpha = 0;
  graphics.drawRect(0, 0, width, height);
  rect.addChild(graphics);
  return rect;
}

export default class WhackAMole {
  private canvas: HTMLCanvasElement;
  private pixi: PIXI.Application;
  private loader: PIXI.Loader;
  private sprites: any;
  private theme: any;
  private grid: Grid;
  private gridView: GridView;
  private background: Background;
  private loaded: boolean = false;
  private gridContainer: any;
  constructor(canvas: any, theme: any) {
    happens(this);
    this.loader = PIXI.Loader.shared;
    this.canvas = canvas;
    this.theme = theme;
    this.grid = new Grid({
      columns: 4,
      rows: 3
    })
    this.init();
  }

  init() {
    this.pixi = new PIXI.Application({ resolution: 2, width: window.innerWidth, height: innerHeight, view: this.canvas, backgroundColor: this.theme.color.darkGray.replace('#', '0x')});
    this.sprites = [];
    this.gridContainer = square(window.innerWidth, window.innerHeight, 0xFFFFFF)
    this.preloadAssets().then(() => {
      this.loaded = true;
      this.background = new Background(this.pixi.stage, this.sprites);
      this.gridView = new GridView(this.gridContainer, this.grid, this.theme);
      this.pixi.stage.addChild(this.gridContainer);
      this.gridView.on('progress', this.background.progress);
      this.gridView.on('complete', (index: number) => {
        this.background.complete(index, () => {
          this.gridView.nextLevel();
        })
      });
      this.background.intro(() => {
        this.gridView.intro();
      })
    })
  }

  preloadAssets(): Promise<any> {
    return new Promise(resolve => {
      const font = new FontFaceObserver('HelveticaNeueBold');
      for (let [key, value] of Object.entries(images)) {
        this.loader.add(key, value);
      }
      this.loader.load((loader: PIXI.Loader, resources: any) => {
        for (let [key, value] of Object.entries(resources)) {
          this.sprites.push(resources[key].texture);
        }
        font.load().then(function () {
          resolve();
        }, function () {
          console.log('Font is not available');
        });
      })
    })
  }

  resize() {
    if (this.loaded) {
      this.pixi.renderer.resize(window.innerWidth, window.innerHeight);
      this.gridView.resize();
      this.background.resize();
    }
  }
}
