import React, { ReactElement, useMemo } from 'react';

import { Walkthrough } from '../components';
import { SubmitPitchModal } from '../components/modal/SubmitPitchModal';
import { HomepageView } from '../components/view/HomepageView';
import { Pusher } from '../components/ui/Pusher';
import { Tabs } from '../layouts/tabs/Tabs';
import { pagesEnum } from '../utils/enums';

import './Home.scss';
import './pages.scss';

const Homepage = (): ReactElement => {
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
      {
        title: 'Your Claim Requests',
        content: <HomepageView type="claim-submitted" />,
      },
      {
        title: 'Your Publications',
        content: <HomepageView type="published" />,
      },
    ];

    return panes;
  }, []);

  return (
    <div className="pitch-doc-page">
      <div className="page-header-content page-wrapper-header">
        <Walkthrough
          page={pagesEnum.PITCHDOC}
          content="The Home Page is where you can view your current pitches, the pitches you have submitted, claim requests, and publications. Use the filters to see all of your pitches!"
        />
        <div className="header">
          <Pusher />
          <SubmitPitchModal />
        </div>
      </div>

      <Tabs views={views} />
    </div>
  );
};

export default Homepage;
