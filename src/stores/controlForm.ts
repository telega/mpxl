import MobxReactForm from 'mobx-react-form';
// import validatorjs from 'validatorjs';

// const plugins = { dvr: validatorjs };

const fields = [{
  name: 'email',
  label: 'Email',
  placeholder: 'Insert Email',
  rules: 'required|email|string|between:5,25',
  value: 's.jobs@apple.com'
}, {
  name: 'password',
  label: 'Password',
  placeholder: 'Insert Password',
  rules: 'required|string|between:5,25',
}, {
  name: 'passwordConfirm',
  label: 'Password Confirmation',
  placeholder: 'Confirm Password',
  rules: 'required|string|same:password',
}];

const hooks = {
  onSuccess(form) {
    alert('Form is valid! Send the request here.');
    // get field values
    console.log('Form Values!', form.values());
  },
  onError(form) {
    alert('Form has errors!');
    // get all form errors
    console.log('All form errors', form.errors());
  }
}

export default new MobxReactForm({ fields }, { hooks });
