import React, { ReactElement, useState } from 'react';
import { Form } from 'semantic-ui-react';
import { toString } from 'lodash';

import { useForm } from '../../contexts';

import './styles.scss';

const Onboard4 = (): ReactElement => {
  const [response, setResponse] = useState('');

  const { updateOnboardingData, formData } = useForm();

  const onSubmit = (): void => {
    const data = {
      involvementResponse: response,
    };

    updateOnboardingData(data, true);
  };

  return (
    <div className="onboard4-wrapper">
      <div className="prompt">
        Tell us how you want to get involved and why. If you have relevant
        experience, please briefly share too.
      </div>
      <Form id="onboard-4" onSubmit={onSubmit}>
        <Form.TextArea
          required
          defaultValue={formData.involvementResponse}
          onChange={(e, { value }) => setResponse(toString(value))}
        />
      </Form>
    </div>
  );
};

export default Onboard4;
