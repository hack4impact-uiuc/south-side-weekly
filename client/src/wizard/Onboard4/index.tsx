import React, { ReactElement, useState } from 'react';
import { Form } from 'semantic-ui-react';
import { toString } from 'lodash';

import { useWizard } from '../../contexts';

import './styles.scss';

const Onboard4 = (): ReactElement => {
  const { store, data } = useWizard();

  const [involvementResponse, setInvolvementResponse] = useState(
    data.involvementResponse,
  );
  const [journalismResponse, setJournalismResponse] = useState(
    data.journalismResponse,
  );

  const onSubmit = (): void => {
    const data = {
      involvementResponse: involvementResponse,
      journalismResponse: journalismResponse,
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
          onChange={(e, { value }) => setInvolvementResponse(toString(value))}
        />
        <div className="prompt">
          Please share your previous experience in the team role you're applying
          for or in journalism in general.
        </div>
        <Form.TextArea
          required
          defaultValue={data.journalismResponse}
          onChange={(e, { value }) => setJournalismResponse(toString(value))}
        />
      </Form>
    </div>
  );
};

export default Onboard4;
