import { observer } from 'mobx-react';
import * as React from 'react';
import { Store, ToolType } from '../stores/store';
import * as _ from 'lodash';
import * as dg from 'dis-gui';

export interface ISidebarProps {
  store: Store;
}

@observer
export class Sidebar extends React.Component<ISidebarProps, any> {
  public renderPluginButtons = () => {
    const { store } = this.props;
    return store.availablePlugins.map((plugin, i) => {
      const active = store.selectedPlugin === plugin;
      return (
        <dg.Button
          key={i}
          label={active ? `>  ${plugin.name}` : plugin.name}
          onClick={() => {
            store.setSelectedPlugin(plugin);
          }}
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
      <dg.Select
        label={controlItem.label}
        key={`pluginControl-${index}`}
        options={controlItem.options.map(option => option.value)}
        onChange={(e: any) =>
          store.setToolControlOption(controlItem.name, e.value)
        }
        value={store.toolControlOptions[controlItem.name]}
      />
    ));
  };

  public renderToolButtons = () => {
    const { store } = this.props;
    const availableTools = store.selectedPlugin
      ? store.selectedPlugin.tools
      : [];

    return availableTools.map((tool, i) => {
      const active = store.selectedTool === tool;
      const labelName = tool.charAt(0) + tool.substr(1).toLowerCase();
      return (
        <dg.Button
          key={i}
          label={active ? `> ${labelName}` : labelName}
          onClick={() => store.setTool(tool as ToolType)}
        />
      );
    });
  };

  public handleUpdate = data => {
    console.log(data);
  };

  public render() {
    const { store } = this.props;
    return (
      <div className={'sidebarPanel'}>
        <dg.GUI
          style={{
            left: 0,
          }}>
          <dg.Folder label="Plugins" expanded>
            {this.renderPluginButtons()}
          </dg.Folder>
          <dg.Folder label="Tools" expanded>
            {this.renderToolButtons()}
          </dg.Folder>
          <dg.Folder
            label={
              store.selectedPlugin
                ? `${store.selectedPlugin.name} Options`
                : 'Options'
            }
            expanded>
            {this.renderPluginOptions()}
          </dg.Folder>
          {/* <dg.Number
            label="Horses"
            value={2}
            min={0}
            max={4}
            step={0.1}
            onFinishChange={function(value) {
              console.log(value);
            }}
          /> */}
          <dg.Button
            label={store.pluginActive ? 'Stop' : 'Apply'}
            disabled={store.selectedPlugin ? false : true}
            onClick={() => {
              store.togglePlugin();
            }}
            active={store.pluginActive}
          />
          {/* 
        {/* <Button
          label={store.pluginActive ? 'Stop' : 'Apply'}
          disabled={store.selectedPlugin ? false : true}
          onClick={() => {
            store.togglePlugin();
          }}
          active={store.pluginActive}
        /> */}{' '}
        </dg.GUI>

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
