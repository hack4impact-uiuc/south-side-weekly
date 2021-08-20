import React, { ReactElement, useState } from 'react';
import { Form } from 'semantic-ui-react';
import { toString } from 'lodash';

import { useWizard } from '../../contexts';

import './styles.scss';

const Onboard4 = (): ReactElement => {
  const { store, data } = useWizard();

  const [response, setResponse] = useState(data.involvementResponse);

  const onSubmit = (): void => {
    const data = {
      involvementResponse: response,
    };

    store(data);
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
          defaultValue={data.involvementResponse}
          onChange={(e, { value }) => setResponse(toString(value))}
        />
      </Form>
    </div>
  );
};

export default Onboard4;
