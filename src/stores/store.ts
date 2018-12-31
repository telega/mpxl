import { observable, action, toJS } from 'mobx';
import { ipcRenderer, IpcRenderer } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { parseFunction } from '../util/parseFunction';

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);

export interface Point {
  x: number;
  y: number;
}

export interface Plugin {
  name: string;
  plugin: (p: any, toolData: any) => void;
  tools: ToolType[];
  options: any[];
}

export enum ToolType {
  Point = 'POINT',
  Square = 'SQUARE',
  Circle = 'CIRCLE',
  Line = 'LINE',
}

export class Store {
  @observable
  public myStoreThing: string;

  @observable
  public point: Point = null;

  @observable
  public endPoint: Point = null;

  @observable
  public distance: number = null;

  @observable
  public pluginActive: boolean = false;

  @observable
  pixels: Uint8ClampedArray;

  @observable
  filePath: string = '';

  @observable
  toolAreaIsVisible: boolean = false;

  @observable
  selectedTool: ToolType = null;

  @observable
  mouseReleased: boolean = true;

  @observable
  availablePlugins: Plugin[] = [];

  @observable
  selectedPlugin: Plugin = null;

  private ipcRenderer: IpcRenderer;

  constructor() {
    this.ipcRenderer = ipcRenderer;

    this.ipcRenderer.on('loadImage', (event: any, filePath: string) => {
      this.setFilePath(filePath); // TODO move this function , async it
    });
  }

  init = async () => {
    this.loadPlugins();
  };

  @action
  setSelectedPlugin = (plugin: Plugin) => {
    this.selectedPlugin = plugin;
  };

  @action
  resetActivePlugin = () => {
    this.selectedPlugin = null;
  };

  @action loadPlugins = async () => {
    const pluginPath = path.join(__dirname, '../../../plugins');
    const files = await readdir(pluginPath);

    const pluginDescriptionFileNames = files.filter(fileName => {
      return fileName.indexOf('.json') >= 0;
    });

    const plugins = await Promise.all(
      pluginDescriptionFileNames.map(async pluginDescriptionFileName => {
        const pluginDescriptionFile = await readFile(
          path.join(pluginPath, pluginDescriptionFileName),
          'utf-8'
        );
        const pluginDescription = JSON.parse(pluginDescriptionFile);

        const pluginFile = await readFile(
          path.join(pluginPath, pluginDescription.main),
          'utf-8'
        );

        return {
          name: pluginDescription.name,
          plugin: parseFunction(pluginFile),
          tools: pluginDescription.tools,
          options: pluginDescription.options,
        } as Plugin;
      })
    );

    this.setAvailablePlugins(plugins);
  };

  @action
  setAvailablePlugins(availablePlugins: Plugin[]) {
    this.availablePlugins = availablePlugins;
  }

  @action
  setFilePath = (path: string) => {
    this.filePath = path;
  };

  @action
  resetFilePath = () => {
    this.filePath = '';
  };

  @action
  showToolArea = () => {
    this.toolAreaIsVisible = true;
  };

  @action hideToolArea = () => {
    this.toolAreaIsVisible = false;
  };

  @action
  setPixels = (pixels: Uint8ClampedArray) => {
    this.pixels = pixels;
  };

  @action
  resetPixels = () => {
    this.pixels = undefined;
  };

  @action
  setPoint(point: Point) {
    this.point = point;
  }

  @action
  setEndPoint(point: Point) {
    this.endPoint = point;
  }

  @action
  setDistance = (distance: number) => {
    this.distance = distance;
  };

  @action
  resetDistance = () => {
    this.distance = null;
  };

  @action
  setMouseReleased = () => {
    this.mouseReleased = true;
  };

  @action
  resetMouseReleased = () => {
    this.mouseReleased = false;
  };

  @action
  togglePlugin = () => {
    this.pluginActive = !this.pluginActive;
    if (this.pluginActive) {
      this.hideToolArea();
    } else {
      this.resetToolData();
    }
  };

  @action
  resetToolData = () => {
    this.point = null;
    this.endPoint = null;
    this.resetDistance();
  };

  @action
  setTool = (tool: ToolType) => {
    this.selectedTool = tool;
    this.hideToolArea();
    this.resetToolData();
  };

  @action
  resetTool = () => {
    this.selectedTool = null;
  };

  toolData = () => {
    return {
      selectedTool: toJS(this.selectedTool),
      point: toJS(this.point),
      endPoint: toJS(this.endPoint),
    };
  };
}