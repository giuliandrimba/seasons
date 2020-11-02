import * as PIXI from 'pixi.js';
import images from './images';
import Grid from './model/GridModel';
import GridView from './view/GridView';
import happens from 'happens';
import FontFaceObserver from 'fontfaceobserver';
import Background from './Background';
import Square from './view/Square';

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
  private preloader: PIXI.Text;
  constructor(canvas: any, theme: any) {
    happens(this);
    this.loader = PIXI.Loader.shared;
    this.canvas = canvas;
    this.theme = theme;
    this.grid = new Grid({
      columns: 4,
      rows: 3,
    });
    const font = new FontFaceObserver('HelveticaNeueBold');
    font.load().then(this.init.bind(this));
  }

  createPreloader() {
    this.preloader = new PIXI.Text('Loading...', {
      fontFamily: 'HelveticaNeueBold',
      fontSize: 16,
      letterSpacing: 3,
      fill: 0xffffff,
    });
    this.preloader.anchor.set(0.5);
    this.preloader.y = window.innerHeight / 2;
    this.preloader.x = window.innerWidth / 2;
    this.pixi.stage.addChild(this.preloader);
  }

  init() {
    this.pixi = new PIXI.Application({
      forceCanvas: true,
      resolution: 2,
      width: window.innerWidth,
      height: innerHeight,
      view: this.canvas,
      backgroundColor: this.theme.color.darkGray.replace('#', '0x'),
    });
    this.sprites = [];
    this.gridContainer = new Square(window.innerWidth, window.innerHeight, 0xffffff);
    this.gridContainer.graphics.alpha = 0;
    this.createPreloader();
    this.preloadAssets().then(() => {
      this.loaded = true;
      this.preloader.alpha = 0;
      this.background = new Background(this.pixi.stage, this.sprites);
      this.gridView = new GridView(this.gridContainer, this.grid, this.theme);
      this.pixi.stage.addChild(this.gridContainer);
      this.gridView.on('progress', this.background.progress);
      this.gridView.on('complete', (index: number) => {
        this.background.complete(this.gridView.nextLevel);
      });
      this.background.intro(() => {
        this.gridView.intro();
      });
    });
  }

  preloadAssets(): Promise<any> {
    return new Promise((resolve) => {
      const font = new FontFaceObserver('HelveticaNeueBold');
      for (let [key, value] of Object.entries(images)) {
        this.loader.add(key, value);
      }
      this.loader.load((loader: PIXI.Loader, resources: any) => {
        for (let [key, value] of Object.entries(resources)) {
          this.sprites.push(resources[key].texture);
        }
        resolve();
      });
    });
  }

  resize() {
    if (this.loaded) {
      this.pixi.renderer.resize(window.innerWidth, window.innerHeight);
      this.gridView.resize();
      this.background.resize();
    }
  }
}
