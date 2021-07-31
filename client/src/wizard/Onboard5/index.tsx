import React, { ReactElement, useState } from 'react';
import { isEmpty } from 'lodash';
import { CalendlyEventListener, InlineWidget } from 'react-calendly';
import { Form } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import { AsYouType } from 'libphonenumber-js';

import { isError, updateUser } from '../../api';
import { useAuth, useForm } from '../../contexts';

import './styles.scss';

const Onboard5 = (): ReactElement => {
  const { updateOnboardingData, formData } = useForm();
  const [scheduled, setScheduled] = useState(!isEmpty(formData.onboarding));
  const { user } = useAuth();

  const formatNumber = (value: string): string => {
    if (value.includes('(') && !value.includes(')')) {
      return value.replace('(', '');
    }
    return new AsYouType('US').input(value);
  };

  const onEventScheduled = (): void => {
    setScheduled(true);
    updateOnboardingData({ onboarding: 'ONBOARDING_SCHEDULED' }, false);
  };

  const onSubmit = (): void => {
    if (!scheduled) {
      Swal.fire({
        title: 'Please schedule an onboarding time!',
        icon: 'error',
      });
      return;
    }

    const data = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      preferredName: formData.preferredName,
      phone: formatNumber(formData.phone),
      genders: formData.genders,
      pronouns: formData.pronouns,
      dateJoined: new Date(Date.now()),
      onboarding: 'ONBOARDING_SCHEDULED',
      involvementResponse: formData.involvementResponse,
      currentTeams: formData.currentTeams,
      role: formData.role,
      races: formData.races,
      interests: formData.interests,
    };

    const onboardUser = async (): Promise<void> => {
      const res = await updateUser(data, user._id);

      if (!isError(res)) {
        updateOnboardingData(data, true);
      } else {
        Swal.fire({
          title: 'Failed to create account.',
          icon: 'error',
          text: 'Please contact an SSW Admin.',
        });
      }
    };

    onboardUser();
  };

  return (
    <div className="onboard5-wrapper">
      <div className="prompt">
        Please schedule an Onboarding Session with a Staff Member. If no times
        work for you, please contact a Staff Member at amitplaystrumpet@ssw.com
        after submitting.
      </div>
      <Form id="onboard-5" onSubmit={onSubmit}>
        <InlineWidget
          styles={{ height: '77vh' }}
          url="https://calendly.com/sawhney4/60min"
        />
        <CalendlyEventListener onEventScheduled={onEventScheduled} />
      </Form>
    </div>
  );
};

export default Onboard5;
