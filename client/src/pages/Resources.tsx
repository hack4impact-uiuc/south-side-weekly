import React, { ReactElement, useMemo } from 'react';
import { openPopupWidget } from 'react-calendly';

import { ResourceModal, Walkthrough } from '../components';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { Pusher } from '../components/ui/Pusher';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import { ResourcesView } from '../components/view/ResourcesView';
import { AuthView } from '../components/wrapper/AuthView';
import { useAuth, useTeams } from '../contexts';
import { Tabs } from '../layouts/tabs/Tabs';
import { pagesEnum } from '../utils/enums';

const Resources = (): ReactElement => {
  const { isOnboarded } = useAuth();
  const { teams } = useTeams();

  const views = useMemo(
    () =>
      teams.map((team) => ({
        title: team.name,
        content: (
          <ResourcesView team={{ teamId: team._id, teamName: team.name }} />
        ),
      })),
    [teams],
  );

  const walkthroughContent = useMemo(() => {
    if (!isOnboarded) {
      return 'After you are onboarded, you will be able to submit and claim pitches and begin your South Side Weekly journey!';
    }

    return 'Check out the members on the SSW team and click their profiles to view more details!';
  }, [isOnboarded]);

  const getCalendlyUrl = (): string => {
    console.log(window.location.hostname);
    if (window.location.hostname === 'localhost') {
      return 'https://calendly.com/sawhney4/60min';
    }

    return 'TODO';
  };

  return (
    <div className="directory-page">
      <div className="page-header-content directory-page-header">
        <Walkthrough page={pagesEnum.RESOURCES} content={walkthroughContent} />
        <AuthView view="isAdmin">
          <div style={{ display: 'flex' }}>
            <Pusher />

            <ResourceModal
              action="create"
              trigger={<PrimaryButton content="Add Resource" icon="add" />}
            />
          </div>
        </AuthView>
        <AuthView view="nonAdmin">
          <div style={{ display: 'flex' }}>
            <Pusher />

            <SecondaryButton
              border
              onClick={() =>
                openPopupWidget({
                  url: getCalendlyUrl(),
                })
              }
              content="Schedule Office Hour"
              className="calendly-button"
            />
          </div>
        </AuthView>
      </div>
      <div style={{ display: 'flex' }}></div>
      <Tabs views={views} />
    </div>
  );
};

export default Resources;
