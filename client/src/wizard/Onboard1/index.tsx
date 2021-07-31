import React, { ReactElement, useState } from 'react';
import { Form, Grid } from 'semantic-ui-react';

import { WizardSvg } from '../../components';
import { useForm } from '../../contexts';
import { wizardPages } from '../../utils/enums';

import './styles.scss';

const Onboard1 = (): ReactElement => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [preferredName, setPreferredName] = useState('');
  const [phone, setPhone] = useState('');

  const { formData, updateOnboardingData } = useForm();

  const onSubmit = (): void => {
    const data = {
      firstName: firstName,
      lastName: lastName,
      preferredName: preferredName,
      phone: phone,
    };

    updateOnboardingData(data, true);
  };

  return (
    <Grid className="onboard1-wrapper" columns={2} padded doubling centered>
      <Grid.Column textAlign="center">
        <WizardSvg size="tiny" page={wizardPages.ONBOARD_1} />
      </Grid.Column>
      <Grid.Column stretched>
        <Form id="onboard-1" onSubmit={onSubmit} size="small">
          <div className="form-group">
            <div className="input-group">
              <Form.Input
                onChange={(e, { value }) => setFirstName(value)}
                label="First Name"
                name="firstName"
                required
                placeholder="First Name..."
                defaultValue={formData.firstName}
              />
              <Form.Input
                onChange={(e, { value }) => setLastName(value)}
                label="Last Name"
                name="lastName"
                required
                placeholder="Last Name..."
                defaultValue={formData.lastName}
              />
              <Form.Input
                onChange={(e, { value }) => setPreferredName(value)}
                label="Preferred Name"
                placeholder="Preferred Name..."
                defaultValue={formData.preferredName}
              />
              <Form.Input
                onChange={(e, { value }) => setPhone(value)}
                label="Phone"
                name="phone"
                required
                placeholder="(123) 838-5466"
                defaultValue={formData.phone}
              />
            </div>
          </div>
        </Form>
      </Grid.Column>
    </Grid>
  );
};

export default Onboard1;
