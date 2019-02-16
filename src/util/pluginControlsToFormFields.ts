import {PluginControls} from '../stores/store'
import * as _ from 'lodash'


export function pluginControlsToFormFields (controls: PluginControls[]){
    return _.reduce(controls, (obj, control)=>{
        obj[control.name] = 'x'
    }, {})
}

export const parseControl = (control: PluginControls) =>{
    return {
        value: false,
        type:'checkbox',
        label:control.label,
        
    }
}


/* terms: {
      value: true,
      type: 'checkbox',
      label: 'Accept Terms',
      rules: 'boolean|accepted',
      options: {
        validateOnChange: true,
      },
}, */