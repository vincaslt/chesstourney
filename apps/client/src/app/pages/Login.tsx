import React, { useState, ChangeEvent } from 'react';
import Page from '../components/Page';
import { Form, InputOnChangeData } from 'semantic-ui-react';
import { useLoading } from '../utils/useLoading';
import { useHistory } from 'react-router';
import UserContainer from '../state/UserContainer';

const initialModel = {
  username: '',
  password: ''
};

type Field = keyof typeof initialModel;
type Errors = { [field in Field]: string[] };

export const Register = () => {
  const { push } = useHistory();
  const { login } = UserContainer.useContainer();
  const [loading, withLoading] = useLoading();
  const [model, setModel] = useState(initialModel);
  const [error, setError] = useState<Errors>({
    username: [],
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

    withLoading(
      login({ username: model.username, password: model.password }).then(() =>
        push('/')
      )
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
          label="Password"
          name="password"
          type="password"
          error={error.password[0]}
          onChange={handleChange}
        />
        <Form.Button content="Login" loading={loading} primary />
      </Form>
    </Page>
  );
};

export default Register;
