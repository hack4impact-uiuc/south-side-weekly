import React, { ReactNode } from 'react';
import { IPitch, IUser } from 'ssw-common';

import { buildColumn, DynamicColumn, InterestList, TeamList } from '../..';
import { formatDate, getUserTeamsForPitch } from '../../../utils/helpers';
import PitchPublishDate from '../../PitchPublishDate';
import PitchStatusTag from '../../PitchStatusTag';
import { deadlineSort, titleSort } from '../Util/TableUtil';

const titleColumn = buildColumn<Partial<IPitch>>({
  title: 'Title',
  width: 2,
  sorter: titleSort,
  extractor: 'title',
});

const topicsColumn = buildColumn<Partial<IPitch>>({
  title: 'Associated Topics',
  width: 2,
  extractor: function getTopics(pitch: Partial<IPitch>): ReactNode {
    return pitch.topics && <InterestList interestIds={pitch.topics} />;
  },
});

const contributionColumns = (user: IUser): DynamicColumn<Partial<IPitch>>[] => [
  titleColumn,
  topicsColumn,
  {
    title: "Team(s) You're On",
    width: 2,
    extractor: function TeamsCell(pitch: Partial<IPitch>) {
      return <TeamList teamIds={getUserTeamsForPitch(pitch, user)} />;
    },
  },
  dateColumn,
  statusColumn,
];

const dateColumn = buildColumn<Partial<IPitch>>({
  title: 'Publish Date',
  width: 2,
  sorter: deadlineSort,
  extractor: function getDeadlineDate(pitch: Partial<IPitch>): ReactNode {
    return <PitchPublishDate pitch={pitch} />;
  },
});

const statusColumn = buildColumn<Partial<IPitch>>({
  title: 'Status',
  width: 2,
  sorter: deadlineSort,
  extractor: function getStatus(pitch: Partial<IPitch>): ReactNode {
    return <PitchStatusTag pitch={pitch} />;
  },
});

const formatPitchDate = (pitch: Partial<IPitch>): string => {
  if (pitch.deadline !== undefined) {
    const date = new Date(pitch.deadline);
    return formatDate(date);
  }
  return '';
};

export {
  titleColumn,
  topicsColumn,
  dateColumn,
  formatPitchDate,
  statusColumn,
  contributionColumns,
};
