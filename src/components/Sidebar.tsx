import { observer } from 'mobx-react';
import * as React from 'react';
import { Store, ToolType } from '../stores/store';
import * as _ from 'lodash';
import { Select, Button } from 'grommet';

export interface ISidebarProps {
  store: Store;
}

@observer
export class Sidebar extends React.Component<ISidebarProps, any> {
  public renderPluginButtons = () => {
    const { store } = this.props;
    return store.availablePlugins.map((plugin, i) => {
      return (
        <Button
          label={plugin.name}
          key={i}
          onClick={() => {
            store.setSelectedPlugin(plugin);
          }}
          active={store.selectedPlugin === plugin}
        />
      );
    });
  };

  public renderPluginOptions = () => {
    const { store } = this.props;

    if (!store.selectedPlugin) {
      return null;
    }
    return store.selectedPlugin.controls.map((controlItem, index) => (
      <div key={`pluginControl-${index}`}>
        {controlItem.label}
        <Select
          options={controlItem.options.map(option => option.value)}
          onChange={(e: any) =>
            store.setToolControlOption(controlItem.name, e.value)
          }
          value={store.toolControlOptions[controlItem.name]}
        />
      </div>
    ));
  };

  public renderToolButtons = () => {
    const { store } = this.props;
    const availableTools = store.selectedPlugin
      ? store.selectedPlugin.tools
      : [];

    return (
      <div>
        <Button
          label="Point"
          disabled={!_.includes(availableTools, ToolType.Point)}
          onClick={() => {
            store.setTool(ToolType.Point);
          }}
          active={store.selectedTool === ToolType.Point}
        />

        <Button
          label="Square"
          disabled={!_.includes(availableTools, ToolType.Square)}
          onClick={() => {
            store.setTool(ToolType.Square);
          }}
          active={store.selectedTool === ToolType.Square}
        />

        <Button
          label="Circle"
          disabled={!_.includes(availableTools, ToolType.Square)}
          onClick={() => {
            store.setTool(ToolType.Circle);
          }}
          active={store.selectedTool === ToolType.Circle}
        />

        <Button
          label="Line"
          disabled={!_.includes(availableTools, ToolType.Line)}
          onClick={() => {
            store.setTool(ToolType.Line);
          }}
          active={store.selectedTool === ToolType.Line}
        />
      </div>
    );
  };

  public render() {
    const { store } = this.props;
    return (
      <div className={'sidebarPanel'}>
        <h2>Sidebar</h2>
        {this.renderPluginButtons()}
        <br />
        {this.renderToolButtons()}
        <br />
        {this.renderPluginOptions()}

        <br />

        <Button
          label={store.pluginActive ? 'Stop' : 'Apply'}
          disabled={store.selectedPlugin ? false : true}
          onClick={() => {
            store.togglePlugin();
          }}
          active={store.pluginActive}
        />

        <hr />
        {store.point && (
          <div>
            {store.point.x} | {store.point.y}
          </div>
        )}
        <div>{store.pixels ? 'Pixels' : 'noPixels'} </div>
        {store.selectedTool && <div>{store.selectedTool}</div>}

        {store.distance && <div>{store.distance}</div>}

        <div>{store.mouseReleased ? 'Mouse Released' : 'M Not Released'}</div>
      </div>
    );
  }
}
