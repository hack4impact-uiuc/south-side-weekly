import React, { ReactElement, useState } from 'react';
import { isEmpty, reject } from 'lodash';
import { CalendlyEventListener, InlineWidget } from 'react-calendly';
import { Form } from 'semantic-ui-react';
import Swal from 'sweetalert2';

import { isError, updateUser } from '../../api';
import { useAuth, useWizard } from '../../contexts';
import { formatNumber } from '../../utils/helpers';

import './styles.scss';

const Onboard5 = (): ReactElement => {
  const { store, data } = useWizard();
  const { user } = useAuth();

  const [scheduled, setScheduled] = useState(!isEmpty(data.onboarding));

  const onEventScheduled = (): void => {
    setScheduled(true);
  };

  const onSubmit = (): void => {
    if (!scheduled) {
      Swal.fire({
        title: 'Please schedule an onboarding time!',
        icon: 'error',
      });
      return;
    }

    const newUser = {
      firstName: data.firstName,
      lastName: data.lastName,
      preferredName: data.preferredName,
      phone: formatNumber(data.phone),
      genders: reject(data.genders, isEmpty),
      pronouns: reject(data.pronouns, isEmpty),
      dateJoined: new Date(Date.now()),
      onboardingStatus: 'ONBOARDING_SCHEDULED',
      involvementResponse: data.involvementResponse,
      currentTeams: data.currentTeams,
      role: data.role,
      races: reject(data.races, isEmpty),
      interests: reject(data.interests, isEmpty),
    };

    const onboardUser = async (): Promise<void> => {
      const res = await updateUser(newUser, user._id);

      if (!isError(res)) {
        store(newUser);
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
