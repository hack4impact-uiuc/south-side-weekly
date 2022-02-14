import React, { ReactElement, useMemo } from 'react';

import { Walkthrough } from '../components';
import { SubmitPitchModal } from '../components/modal/SubmitPitchModal';
import { Pusher } from '../components/ui/Pusher';
import { PitchesView } from '../components/view/PitchesView';
import { useAuth } from '../contexts';
import { Tabs } from '../layouts/tabs/Tabs';
import { pagesEnum } from '../utils/enums';

import './pages.scss';
import './PitchDoc.scss';

export const PitchDocPage = (): ReactElement => {
  const { isAdmin, isStaff } = useAuth();

  const views = useMemo(() => {
    const panes = [
      {
        title: 'Claim an Assignment',
        content: <PitchesView type="claim" />,
      },
      {
        title: 'View all Stories',
        content: <PitchesView type="all" />,
      },
    ];

    if (isAdmin || isStaff) {
      panes.unshift({
        title: 'Review Assignments',
        content: <PitchesView type="review-unclaimed" />,
      });
      if (isAdmin) {
        panes.unshift({
          title: 'Review New Pitches',
          content: <PitchesView type="review-new" />,
        });
      }
    }

    return panes;
  }, [isAdmin, isStaff]);

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

      <Tabs views={views} />
    </div>
  );
};
