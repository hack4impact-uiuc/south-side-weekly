import React, { FC, useEffect, useMemo, useState } from 'react';

import { DynamicTable, View, Walkthrough } from '../../components';
import { pagesEnum, pitchStatusEnum } from '../../utils/enums';

import './styles.scss';
import { Tabs } from '../../layouts/tabs/Tabs';
import { useAuth } from '../../contexts';
import { getMemberPitchesView, getSubmittedPitchesView } from './views';
import HomepageTab from './tab';

const Homepage: FC = () => {
  const { user } = useAuth();
  const views = useMemo(() => [
    {
      title: 'Your Current Pitches',
      content: <HomepageTab columns={getMemberPitchesView()} initialSort />,
    },
    {
      title: 'Pitches You Submitted',
      content: <HomepageTab columns={getSubmittedPitchesView} filters />,
    },
    {
      title: 'Your Claim Requests',
      content: <HomepageTab columns={}
    },
    {
      title: 'Your Publications',
  
    }
  ], user);

  return (
    <div className="homepage-wrapper">
      <div className="page-header-content homepage-header">
        <Walkthrough
          page={pagesEnum.HOMEPAGE}
          content="The homepage is the main landing point for users to see their pitch history."
        />
      </div>

      <Tabs views={views} />
    </div>
  );
};

export default Homepage;
