import { MPXLSketch } from './P5Sketch';
import { Store, ToolType } from '../stores/store';

const marchingAntsOffset = 0.5;

export class MPXLTools {
  public p: MPXLSketch;
  public store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  public init(p: MPXLSketch) {
    this.p = p;
  }

  private drawToolPoint = () => {
    const { p, store } = this;
    p.noFill();
    p.drawingContext.setLineDash([]);
    p.stroke('white');
    p.ellipse(store.point.x, store.point.y, 3, 3);
    p.drawingContext.setLineDash([4, 4]);
    p.drawingContext.lineDashOffset += marchingAntsOffset;
    p.stroke('black');
    p.ellipse(store.point.x, store.point.y, 3, 3);
  };

  private drawToolSquare = () => {
    const { p, store } = this;
    p.rectMode(p.CORNERS);
    p.noFill();
    p.drawingContext.setLineDash([]);
    p.stroke('white');
    p.rect(store.point.x, store.point.y, store.endPoint.x, store.endPoint.y);
    p.drawingContext.setLineDash([4, 4]);
    p.drawingContext.lineDashOffset += marchingAntsOffset;
    p.stroke('black');
    p.rect(store.point.x, store.point.y, store.endPoint.x, store.endPoint.y);
    p.rectMode(p.CORNER);
  };

  private drawToolCircle = () => {
    const { p, store } = this;
    p.noFill();
    p.drawingContext.setLineDash([]);
    p.stroke('white');
    p.ellipse(
      store.point.x,
      store.point.y,
      2 * store.distance,
      2 * store.distance
    );
    p.drawingContext.setLineDash([4, 4]);
    p.drawingContext.lineDashOffset += marchingAntsOffset;
    p.stroke('black');
    p.ellipse(
      store.point.x,
      store.point.y,
      2 * store.distance,
      2 * store.distance
    );
  };

  private drawToolLine = () => {
    const { p, store } = this;
    p.noFill();
    p.drawingContext.setLineDash([]);
    p.stroke('white');
    p.line(store.point.x, store.point.y, store.endPoint.x, store.endPoint.y);
    p.drawingContext.setLineDash([4, 4]);
    p.drawingContext.lineDashOffset = marchingAntsOffset;
    p.stroke('black');
    p.line(store.point.x, store.point.y, store.endPoint.x, store.endPoint.y);
  };

  public drawToolArea = () => {
    const { store } = this;
    if (!store.imageLoaded) {
      return false;
    }

    if (!store.selectedTool) {
      return false;
    }

    switch (store.selectedTool) {
      case ToolType.Point:
        this.drawToolPoint();
        break;
      case ToolType.Square:
        this.drawToolSquare();
        break;
      case ToolType.Line:
        this.drawToolLine();
        break;
      case ToolType.Circle:
        this.drawToolCircle();
        break;
      default:
        return false;
    }
    return false;
  };
}
