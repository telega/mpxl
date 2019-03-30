import { MPXLSketch } from './P5Sketch';
import { Store, ToolType, Point } from '../stores/store';

/** Class for handling mouse events and updating the store */
export class MPXLMouseHandlers {
  public store: Store;
  public p: MPXLSketch;
  constructor(store: Store) {
    this.store = store;
  }

  /** Assigns the handlers to the p5 sketch
   * @param p the sketch
   */
  public init(p: MPXLSketch) {
    this.p = p;
    this.p.mouseDragged = this.mouseDragged;
    this.p.mouseClicked = this.mouseClicked;
    this.p.mouseReleased = this.mouseReleased;
  }

  private mouseDragged = () => {
    const { store, p } = this;
    if (!store.imageLoaded) {
      return false;
    }

    const x = p.mouseX < 0 ? 0 : p.mouseX > p.width ? p.width : p.mouseX;
    const y = p.mouseY < 0 ? 0 : p.mouseY > p.height ? p.height : p.mouseY;

    if (!store.pluginActive) {
      if (store.mouseReleased) {
        store.setPoint({ x, y });
        store.setEndPoint({ x, y });
        store.resetMouseReleased();
      } else {
        store.setEndPoint({ x, y });
      }

      if (!store.point) {
        store.setPoint({
          x,
          y,
        });
      }

      store.setDistance(
        p.dist(store.point.x, store.point.y, store.endPoint.x, store.endPoint.y)
      );
      store.showToolArea();
    }

    // prevent default
    return false;
  };

  private mouseReleased = () => {
    const { p, store } = this;
    if (!store.imageLoaded) {
      return false;
    }

    if (p.mouseX < 0 || p.mouseX > p.width) {
      return false;
    }

    if (p.mouseY < 0 || p.mouseY > p.height) {
      return false;
    }

    store.setMouseReleased();
    return false;
  };

  private mouseClicked = () => {
    const { p, store } = this;

    if (!store.imageLoaded) {
      return false;
    }

    if (store.selectedTool !== ToolType.Point) {
      return false;
    }

    if (p.mouseX < 0 || p.mouseX > p.width) {
      return false;
    }

    if (p.mouseY < 0 || p.mouseY > p.height) {
      return false;
    }

    store.setPoint({
      x: p.mouseX,
      y: p.mouseY,
    } as Point);

    return false;
  };
}
