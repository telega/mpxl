import * as React from 'react';
import P5Wrapper from './P5Wrapper';
import { Store } from '../stores/store';
import { P5Sketch } from './P5Sketch';
import { observer } from 'mobx-react';

// import { PPixelSort } from '../plugins/pixelsort';

export interface IImagePanelProps {
  store: Store;
  plugin: any;
}

@observer
export class ImagePanel extends React.Component<IImagePanelProps, any> {
  public sketch = new P5Sketch(this.props.store);

  public render() {
    return (
      <div className={'imagePanel'}>
        <P5Wrapper
          sketch={this.sketch}
          filePath={this.props.store.filePath}
          imageLoaded={this.props.store.imageLoaded}
        />
      </div>
    );
  }
}
