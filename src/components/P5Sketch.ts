import { Store, Point, ToolType } from '../stores/store';
import { MPXLTools } from './MPXLTools';
import p5 = require('p5');

export interface MPXLSketch extends p5 {
  loadImageData: (filePath: string) => any;
  newPropsHandler: (props: any) => any;
  drawingContext: CanvasRenderingContext2D;
}

export class P5Sketch {
  public store: Store;
  public p: MPXLSketch;
  public tools: MPXLTools;

  constructor(store: Store) {
    this.store = store;
    this.tools = new MPXLTools(store);
  }

  public sketch = (p: MPXLSketch) => {
    this.p = p;
    this.tools.init(p);
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

    p.mouseReleased = () => {
      if (!this.store.imageLoaded) {
        return false;
      }

      if (p.mouseX < 0 || p.mouseX > p.width) {
        return false;
      }

      if (p.mouseY < 0 || p.mouseY > p.height) {
        return false;
      }

      this.store.setMouseReleased();
      return false;
    };

    p.mouseClicked = () => {
      if (!this.store.imageLoaded) {
        return false;
      }

      if (this.store.selectedTool !== ToolType.Point) {
        return false;
      }

      if (p.mouseX < 0 || p.mouseX > p.width) {
        return false;
      }

      if (p.mouseY < 0 || p.mouseY > p.height) {
        return false;
      }

      this.store.setPoint({
        x: p.mouseX,
        y: p.mouseY,
      } as Point);

      return false;
    };

    p.mouseDragged = () => {
      if (!this.store.imageLoaded) {
        return false;
      }

      const x = p.mouseX < 0 ? 0 : p.mouseX > p.width ? p.width : p.mouseX;
      const y = p.mouseY < 0 ? 0 : p.mouseY > p.height ? p.height : p.mouseY;

      if (!this.store.pluginActive) {
        if (this.store.mouseReleased) {
          this.store.setPoint({ x, y });
          this.store.setEndPoint({ x, y });
          this.store.resetMouseReleased();
        } else {
          this.store.setEndPoint({ x, y });
        }

        if (!this.store.point) {
          this.store.setPoint({
            x,
            y,
          });
        }

        this.store.setDistance(
          p.dist(
            this.store.point.x,
            this.store.point.y,
            this.store.endPoint.x,
            this.store.endPoint.y
          )
        );
        this.store.showToolArea();
      }

      // prevent default
      return false;
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
