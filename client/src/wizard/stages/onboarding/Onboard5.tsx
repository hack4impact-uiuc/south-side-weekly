import React, { ReactElement, useState } from 'react';
import { isEmpty, reject } from 'lodash';
import { CalendlyEventListener, InlineWidget } from 'react-calendly';
import { Form } from 'semantic-ui-react';
import Swal from 'sweetalert2';

import { isError, apiCall } from '../../../api';
import { useAuth, useWizard } from '../../../contexts';
import { formatNumber } from '../../../utils/helpers';

import './Onboard5.scss';

const Onboard5 = (): ReactElement => {
  const { store, data } = useWizard();
  const { user } = useAuth();

  const [scheduled, setScheduled] = useState(!isEmpty(data!.onboardingStatus));

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
      firstName: data!.firstName,
      lastName: data!.lastName,
      preferredName: data!.preferredName,
      phone: formatNumber(data!.phone!),
      genders: reject(data!.genders, isEmpty),
      pronouns: reject(data!.pronouns, isEmpty),
      dateJoined: new Date(Date.now()),
      onboardingStatus: 'ONBOARDING_SCHEDULED',
      involvementResponse: data!.involvementResponse,
      journalismResponse: data!.journalismResponse,
      neighborhood: data!.neighborhood || 'NA',
      teams: [...new Set(data!.teams)],
      role: data!.role,
      races: reject(data!.races, isEmpty),
      interests: [...new Set(reject(data!.interests, isEmpty))],
    };

    const onboardUser = async (): Promise<void> => {
      const res = await apiCall({
        url: `/users/${user!._id}`,
        method: 'PUT',
        body: newUser,
      });

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

  const getCalendlyUrl = (): string => {
    if (window.location.hostname === 'localhost') {
      // TODO: if continuing development, please change this calendly
      return 'https://calendly.com/sawhney4/60min';
    }

    // TODO: fix this to SSW
    return 'https://calendly.com/south-side-weekly-1';
  };

  return (
    <div className="onboard5-wrapper">
      <div className="prompt">
        Please schedule an Onboarding Session with a Staff Member. If no times
        work for you, please contact a Staff Member at
        editor@southsideweekly.com after submitting.
      </div>
      <Form id="onboard-5" onSubmit={onSubmit}>
        <InlineWidget styles={{ height: '77vh' }} url={getCalendlyUrl()} />
        <CalendlyEventListener onEventScheduled={onEventScheduled} />
      </Form>
    </div>
  );
};

export default Onboard5;
