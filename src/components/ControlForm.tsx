import * as React from 'react';
import { observer } from 'mobx-react';
import {MobxReactForm} from 'mobx-react-form'


// const $btn = 'f6 link dim bn br2 ph3 pv2 mr2 dib white bg-dark-blue';


@observer
export class ControlForm extends React.Component<{form:MobxReactForm}, any> {
    render (){ 
        
        const {form } = this.props

        console.log(form)
        return <form>
      <label >
        {form.email.label}
      </label>
      <input {...form.email.bind()} />
      
      <button type="submit" onClick={form.onSubmit}>Submit</button>
      <button type="button" onClick={form.onReset}>Reset</button>
      <button type="button" onClick={form.onClear}>Clear</button>
  
      <p>{form.error}</p>
    </form>
    }};