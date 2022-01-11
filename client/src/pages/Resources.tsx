import React, { ReactElement, useMemo } from 'react';

import { ResourceModal, Walkthrough } from '../components';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { Pusher } from '../components/ui/Pusher';
import { ResourcesView } from '../components/view/ResourcesView';
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

  return (
    <div className="directory-page">
      <div className="page-header-content directory-page-header">
        <Walkthrough page={pagesEnum.RESOURCES} content={walkthroughContent} />
        <div style={{ display: 'flex' }}>
          <Pusher />
          <ResourceModal
            action="create"
            trigger={<PrimaryButton content="Add Resource" icon="add" />}
          />
        </div>
      </div>
      <div style={{ display: 'flex' }}></div>
      <Tabs views={views} />
    </div>
  );
};

export default Resources;
