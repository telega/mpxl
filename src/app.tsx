import * as React from 'react';

import { Sidebar } from './components/Sidebar';
import { ImagePanel } from './components/ImagePanel';
import { Store } from './stores/store';
import { observer } from 'mobx-react';

export interface AppProps {}

@observer
export class App extends React.Component<AppProps, any> {
  public store: Store;
  constructor(props: AppProps) {
    super(props);
    this.store = new Store();
  }

  async componentDidMount() {
    await this.store.init();
  }

  render() {
    return (
      <div className="container">
        <Sidebar store={this.store} />
        {this.store.availablePlugins.length > 0 && (
          <ImagePanel
            store={this.store}
            plugin={
              this.store.selectedPlugin
                ? this.store.selectedPlugin.plugin
                : null
            }
          />
        )}
      </div>
    );
  }
}
