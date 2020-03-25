import React, { useState, ChangeEvent } from 'react';
import { register } from '../api';
import Page from '../components/Page';
import { Form, InputOnChangeData } from 'semantic-ui-react';
import { useLoading } from '../utils/useLoading';
import { useHistory } from 'react-router';
import UserContainer from '../state/UserContainer';

const initialModel = {
  username: '',
  email: '',
  password: ''
};

type Field = keyof typeof initialModel;
type Errors = { [field in Field]: string[] };

// eslint-disable-next-line no-control-regex
const emailRegex = /^((([a-z]|\d|[!#$%&'*+\-/=?^_`{|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#$%&'*+\-/=?^_`{|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;

export const Register = () => {
  const { push } = useHistory();
  const { login } = UserContainer.useContainer();
  const [loading, withLoading] = useLoading();
  const [model, setModel] = useState(initialModel);
  const [error, setError] = useState<Errors>({
    username: [],
    email: [],
    password: []
  });

  const handleChange = (_: ChangeEvent, { name, value }: InputOnChangeData) => {
    if (error[name as Field].length) {
      setError(error => ({ ...error, [name]: [] }));
    }
    setModel(model => ({ ...model, [name]: value }));
  };

  const handleSubmit = () => {
    if (loading) {
      return;
    }

    const errors: Errors = { ...error };

    Object.entries(model).forEach(([field, value]) => {
      if (!value) {
        errors[field as Field].push('Field is required');
      }
    });

    if (!emailRegex.test(model.email)) {
      errors.email.push('Email is invalid');
    }

    if (model.password.length < 6) {
      errors.password.push('Password should be at least 6 characters long');
    }

    withLoading(
      register(model)
        .then(() =>
          login({ username: model.username, password: model.password })
        )
        .then(() => push('/'))
    );
  };

  const hasError = Object.values(error).some(Boolean);

  return (
    <Page>
      <Form error={hasError} onSubmit={handleSubmit}>
        <Form.Input
          label="Username"
          name="username"
          error={error.username[0]}
          onChange={handleChange}
        />
        <Form.Input
          label="Email"
          name="email"
          type="email"
          error={error.email[0]}
          onChange={handleChange}
        />
        <Form.Input
          label="Password"
          name="password"
          type="password"
          error={error.password[0]}
          onChange={handleChange}
        />
        <Form.Button content="Register" loading={loading} primary />
      </Form>
    </Page>
  );
};

export default Register;
