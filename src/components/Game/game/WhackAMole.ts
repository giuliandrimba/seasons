import * as PIXI from 'pixi.js'
import images from './images';
import Grid from './model/Grid';
import GridView from './view/GridView';

export default class WhackAMole {
  private canvas: HTMLCanvasElement;
  private pixi: PIXI.Application;
  private loader: PIXI.Loader;
  private sprites: any;
  private theme: any;
  private grid: Grid;
  private gridView: GridView;
  constructor(canvas: any, theme: any) {
    this.loader = PIXI.Loader.shared;
    this.canvas = canvas;
    this.theme = theme;
    this.grid = new Grid({
      columns: 3,
      rows: 3
    })
    this.init();
  }

  init() {
    this.pixi = new PIXI.Application({ width: window.innerWidth, height: innerHeight, view: this.canvas, backgroundColor: this.theme.color.darkGray.replace('#', '0x')});
    this.sprites = {};
    this.preloadAssets().then(() => {
      this.gridView = new GridView(this.pixi.stage, this.grid, this.theme);
    })
  }

  preloadAssets(): Promise<any> {
    return new Promise(resolve => {
      for (let [key, value] of Object.entries(images)) {
        this.loader.add(key, value);
      }
      this.loader.load((loader: PIXI.Loader, resources: any) => {
        for (let [key, value] of Object.entries(resources)) {
          this.sprites[key] = new PIXI.Sprite(resources[key].texture);
        }
        resolve();
      })
    })
  }
}
