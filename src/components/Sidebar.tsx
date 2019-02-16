import { observer } from 'mobx-react';
import * as React from 'react';
import { Store, ToolType } from '../stores/store';
import * as _ from 'lodash';
import {Select} from 'grommet'

export interface ISidebarProps {
  store: Store;
}

@observer
export class Sidebar extends React.Component<ISidebarProps, any> {
  public renderPluginButtons = () => {
    return this.props.store.availablePlugins.map((plugin, i) => {
      return (
        <button
          key={i}
          onClick={() => {
            this.props.store.setSelectedPlugin(plugin);
          }}>
          {plugin.name}
        </button>
      );
    });
  };

  public renderPluginOptions = () => {

    const {store} = this.props

    if (!store.selectedPlugin) {
      return null;
    }
    return store.selectedPlugin.controls.map(
      (controlItem, index) => (
        <div key={`pluginControl-${index}`}>{controlItem.label}
          <Select 
          options = { controlItem.options.map( option => option.value) } 
          onChange={(e)=> store.setToolControlOption(controlItem.name, e.value )}
          value = {store.toolControlOptions[controlItem.name]}
           />
        </div>
      )
    );
  };


  public renderToolButtons = () => {
    const availableTools = this.props.store.selectedPlugin
      ? this.props.store.selectedPlugin.tools
      : [];

    return (
      <div>
        <button
          disabled={!_.includes(availableTools, ToolType.Point)}
          onClick={() => {
            this.props.store.setTool(ToolType.Point);
          }}>
          Point
        </button>
        <button
          disabled={!_.includes(availableTools, ToolType.Square)}
          onClick={() => {
            this.props.store.setTool(ToolType.Square);
          }}>
          Square
        </button>
        <button
          disabled={!_.includes(availableTools, ToolType.Square)}
          onClick={() => {
            this.props.store.setTool(ToolType.Circle);
          }}>
          Circle
        </button>
        <button
          disabled={!_.includes(availableTools, ToolType.Line)}
          onClick={() => {
            this.props.store.setTool(ToolType.Line);
          }}>
          Line
        </button>
      </div>
    );
  };

  public render() {
    return (
      <div className={'sidebarPanel'}>
        <h2>Sidebar</h2>
        {this.renderPluginButtons()}
        <br />
        {this.renderToolButtons()}
        <br />
        {this.renderPluginOptions()}

        <br />

        <button
          disabled={this.props.store.selectedPlugin ? false : true}
          onClick={() => {
            this.props.store.togglePlugin();
          }}>
          {this.props.store.pluginActive ? 'Stop' : 'Apply'}
        </button>
        <hr />
        {this.props.store.point && (
          <div>
            {this.props.store.point.x} | {this.props.store.point.y}
          </div>
        )}
        <div>{this.props.store.pixels ? 'Pixels' : 'noPixels'} </div>
        {this.props.store.selectedTool && (
          <div>{this.props.store.selectedTool}</div>
        )}

        {this.props.store.distance && <div>{this.props.store.distance}</div>}

        <div>
          {this.props.store.mouseReleased ? 'Mouse Released' : 'M Not Released'}
        </div>
      </div>
    );
  }
}
