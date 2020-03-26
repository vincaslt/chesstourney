import React, { useState } from 'react';
import { createTournament } from '../api';
import Page from '../components/Page';
import { Form, InputOnChangeData, DropdownProps } from 'semantic-ui-react';
import { useLoading } from '../utils/useLoading';
import { useHistory } from 'react-router';

const MOVE_TIME_OPTIONS = [
  { key: '4h', value: 4 * 60 * 60 * 1000, text: '4 Hours' },
  { key: '12h', value: 12 * 60 * 60 * 1000, text: '12 Hours' },
  { key: '24h', value: 24 * 60 * 60 * 1000, text: '12 Hours' },
  { key: '48h', value: 48 * 60 * 60 * 1000, text: '48 Hours' },
  { key: '72h', value: 72 * 60 * 60 * 1000, text: '72 Hours' }
];

const initialModel = {
  name: '',
  millisPerMove: MOVE_TIME_OPTIONS[0].value
};

type Field = keyof typeof initialModel;
type Errors = { [field in Field]: string[] };

export const CreateTournament = () => {
  const { push } = useHistory();
  const [loading, withLoading] = useLoading();
  const [model, setModel] = useState(initialModel);
  const [error, setError] = useState<Errors>({
    name: [],
    millisPerMove: []
  });

  const handleChange = (
    _: any,
    { name, value }: InputOnChangeData | DropdownProps
  ) => {
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

    // TODO: link to invite page
    withLoading(createTournament(model).then(() => push('/')));
  };

  const hasError = Object.values(error).some(Boolean);

  return (
    <Page>
      <Form error={hasError} onSubmit={handleSubmit}>
        <Form.Input
          label="Name"
          name="name"
          error={error.name[0]}
          onChange={handleChange}
        />
        <Form.Select
          label="Time per move"
          name="millisPerMove"
          error={error.millisPerMove[0]}
          onChange={handleChange}
          options={MOVE_TIME_OPTIONS}
          defaultValue={model.millisPerMove}
        />
        <Form.Button content="Register" loading={loading} primary />
      </Form>
    </Page>
  );
};

export default CreateTournament;
