import { Store } from '../stores/store';
import { MPXLTools } from './MPXLTools';
import { MPXLMouseHandlers } from './MPXLMouseHandlers';

import p5 = require('p5');

export interface MPXLSketch extends p5 {
  loadImageData: (filePath: string) => any;
  newPropsHandler: (props: any) => any;
  drawingContext: CanvasRenderingContext2D;
}

export class P5Sketch {
  public store: Store;
  public tools: MPXLTools;
  public mouseHandlers: MPXLMouseHandlers;

  constructor(store: Store) {
    this.store = store;
    this.tools = new MPXLTools(store);
    this.mouseHandlers = new MPXLMouseHandlers(store);
  }

  public sketch = (p: MPXLSketch) => {
    this.tools.init(p);
    this.mouseHandlers.init(p);
    let imgCopy: any;

    p.setup = () => {
      p.createCanvas(600, 600, p.P2D);
    };

    p.loadImageData = (filePath: string) => {
      this.store.resetPixels();
      p.loadImage(`file:///${filePath}`, (img: any) => {
        imgCopy = img.get();

        if (imgCopy.width > 600) {
          imgCopy.resize(600, 0);
        }

        if (imgCopy.height > 600) {
          imgCopy.resize(0, 600);
        }

        p.resizeCanvas(imgCopy.width, imgCopy.height);
        p.updatePixels();
        this.store.setImageLoaded();
        this.store.resetTool();
      });
    };

    p.newPropsHandler = async function(props: any) {
      if (props.filePath) {
        await p.loadImageData(props.filePath);
      }
      return;
    };

    p.draw = () => {
      if (this.store.pixels) {
        p.pixels = this.store.pixels as any;
        p.updatePixels();
      } else if (imgCopy) {
        p.image(imgCopy, 0, 0);
      }

      if (this.store.toolAreaIsVisible) {
        this.tools.drawToolArea();
      }

      if (this.store.selectedPlugin && this.store.pluginActive) {
        this.store.selectedPlugin.plugin(p, this.store.toolData());
        this.store.setPixels(p.pixels as any);
        this.store.togglePlugin();
      }

      if (this.store.shouldSave) {
        p.saveCanvas(`Untitled-${this.store.saveCount}`, 'png');
        this.store.resetShouldSave();
      }
    };
  };
}
