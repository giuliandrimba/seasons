import * as PIXI from 'pixi.js'
import images from './images';
import Grid from './model/Grid';
import GridView from './view/GridView';
import happens from 'happens';
import FontFaceObserver from 'fontfaceobserver';
import Background from './Background';

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
    this.preloadAssets().then(() => {
      this.loaded = true;
      this.background = new Background(this.pixi.stage, this.sprites);
      this.gridView = new GridView(this.pixi.stage, this.grid, this.theme);
      this.gridView.on('progress', this.background.progress);
      this.gridView.on('next:level', this.background.nextLevel);
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
