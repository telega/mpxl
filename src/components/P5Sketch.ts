import { Store, Point, ToolType } from '../stores/store';

export class P5Sketch {
  public store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  public sketch = (p: any) => {
    let imgCopy: any;

    p.setup = function() {
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

      const x = p.mouseX < 0 ? 0 : p.mouxeX > p.width ? p.width : p.mouseX;
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

    p.drawToolArea = () => {
      if (!this.store.imageLoaded) {
        return false;
      }

      if (!this.store.selectedTool) {
        return false;
      }

      switch (this.store.selectedTool) {
        case ToolType.Point:
          p.stroke('red');
          p.fill('red');
          p.ellipse(this.store.point.x, this.store.point.y, 3, 3);
          break;
        case ToolType.Square:
          p.rectMode(p.CORNERS);
          p.stroke('red');
          p.noFill();
          p.rect(
            this.store.point.x,
            this.store.point.y,
            this.store.endPoint.x,
            this.store.endPoint.y
          );
          p.rectMode(p.CORNER);
          break;
        case ToolType.Line:
          p.stroke('red');
          p.line(
            this.store.point.x,
            this.store.point.y,
            this.store.endPoint.x,
            this.store.endPoint.y
          );
          break;
        case ToolType.Circle:
          p.stroke('red');
          p.noFill();
          p.ellipse(
            this.store.point.x,
            this.store.point.y,
            2 * this.store.distance,
            2 * this.store.distance
          );
          break;
        default:
          return false;
      }
      return false;
    };

    p.draw = () => {
      if (this.store.pixels) {
        p.pixels = this.store.pixels;
        p.updatePixels();
      } else if (imgCopy) {
        p.image(imgCopy, 0, 0);
      }

      if (this.store.toolAreaIsVisible) {
        p.drawToolArea();
      }

      if (this.store.selectedPlugin && this.store.pluginActive) {
        this.store.selectedPlugin.plugin(p, this.store.toolData());
        this.store.setPixels(p.pixels);
        this.store.togglePlugin();
      }

      if (this.store.shouldSave) {
        p.saveCanvas(`Untitled-${this.store.saveCount}`, 'png');
        this.store.resetShouldSave();
      }
    };
  };
}
