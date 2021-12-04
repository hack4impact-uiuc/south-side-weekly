import React, { ReactNode } from 'react';
import { IPitch, IUser } from 'ssw-common';

import { buildColumn, ColumnType, InterestList, TeamList } from '../..';
import { getFormattedDate, getUserTeamsForPitch } from '../../../utils/helpers';
import PitchStatusTag from '../../PitchStatusTag';
import { deadlineSort, titleSort } from '../Util/TableUtil';

const titleColumn = buildColumn<Partial<IPitch>>({
  title: 'Title',
  width: 2,
  sorter: titleSort,
  extractor: function getTitle(pitch: Partial<IPitch>): ReactNode {
    return pitch.title;
  },
});

const topicsColumn = buildColumn<Partial<IPitch>>({
  title: 'Associated Topics',
  width: 2,
  extractor: function getTopics(pitch: Partial<IPitch>): ReactNode {
    return pitch.topics && <InterestList interestIds={pitch.topics} />;
  },
});

const contributionColumns = (user: IUser): ColumnType<Partial<IPitch>>[] => [
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
    return pitch.deadline && formatPitchDate(pitch);
  },
});

const statusColumn = buildColumn<Partial<IPitch>>({
  title: 'Status',
  width: 2,
  sorter: deadlineSort,
  extractor: function getStatus(pitch: Partial<IPitch>): ReactNode {
    return pitch.deadline && <PitchStatusTag date={pitch.deadline} />;
  },
});

const formatPitchDate = (pitch: Partial<IPitch>): string => {
  if (pitch.deadline !== undefined) {
    const date = new Date(pitch.deadline);
    return getFormattedDate(date);
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
