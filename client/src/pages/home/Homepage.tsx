import React, { ReactElement, useMemo } from 'react';

import { Walkthrough } from '../../components';
import { SubmitPitchModal } from '../../components/modal/SubmitPitchModal';
import { useAuth } from '../../contexts';
import { Tabs } from '../../layouts/tabs/Tabs';
import { pagesEnum } from '../../utils/enums';
import './styles.scss';
import '../pages.scss';
import { HomepageView } from '../../components/view/HomepageView';
import { Pusher } from '../../components/ui/Pusher';

const Homepage = (): ReactElement => {
  const { isAdmin } = useAuth();

  const views = useMemo(() => {
    const panes = [
      {
        title: 'Your Current Pitches',
        content: <HomepageView type="member" />,
      },
      {
        title: 'Pitches You Submitted',
        content: <HomepageView type="submitted" />,
      },
    ];

    if (isAdmin) {
      panes.push({
        title: 'Your Claim Requests',
        content: <HomepageView type="claim-submitted" />,
      });
      panes.push({
        title: 'Your Publications',
        content: <HomepageView type="published" />,
      });
    }

    return panes;
  }, [isAdmin]);

  return (
    <div className="pitch-doc-page">
      <div className="page-header-content page-wrapper-header">
        <Walkthrough
          page={pagesEnum.PITCHDOC}
          content="The Pitch Doc is where you can claim, submit, and view pitches! Use the filters to find pitches you are interested in."
        />
        <div className="header">
          <Pusher />
          <SubmitPitchModal />
        </div>
      </div>

      <Tabs views={views} button={<SubmitPitchModal />} />
    </div>
  );
};

export default Homepage;
