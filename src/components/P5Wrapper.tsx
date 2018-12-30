import * as React from 'react';
import * as p5 from 'p5';
import { P5Sketch } from './P5Sketch';

export interface IP5WrapperProps {
  sketch: P5Sketch;
  filePath?: string;
}

export default class P5Wrapper extends React.Component<IP5WrapperProps, any> {
  private canvas: any;
  private wrapper: any;

  componentDidMount() {
    this.canvas = new p5(this.props.sketch.sketch, this.wrapper);
    if (this.canvas.myCustomRedrawAccordingToNewPropsHandler) {
      this.canvas.myCustomRedrawAccordingToNewPropsHandler(this.props);
    }
  }

  componentWillReceiveProps(newprops: Partial<IP5WrapperProps>) {
    if (this.props.sketch !== newprops.sketch) {
      this.wrapper.removeChild(this.wrapper.childNodes[0]);
      this.canvas = new p5(newprops.sketch as any, this.wrapper);
    }
    if (this.canvas.myCustomRedrawAccordingToNewPropsHandler) {
      this.canvas.myCustomRedrawAccordingToNewPropsHandler(newprops);
    }
  }

  render() {
    return (
      <div className="imageWrapper" ref={wrapper => (this.wrapper = wrapper)} />
    );
  }
}
