import React, { ReactNode } from 'react';
import { IPitch } from 'ssw-common';

import { getFormattedDate } from '../../../utils/helpers';
import PitchItems from '../../Lists/PitchItems';
import PitchStatus from '../../PitchStatus';
import { buildColumn } from '../DyanmicTable/util';
import {deadlineSort, titleSort} from '../Util/TableUtil'

const titleColumn = buildColumn<Partial<IPitch>>({
  title: 'Title',
  width: 2,
  sorter: titleSort,
  extractor: function getTitle(pitch: Partial<IPitch>): ReactNode {
    return pitch.title
  },
});

const topicsColumn = buildColumn<Partial<IPitch>>({
  title: 'Associated Topics',
  width: 2,
  extractor: function getTopics(pitch: Partial<IPitch>): ReactNode {
   return <PitchItems pitch = {pitch} type = "topics" />
  }
})

const teamsColumn = buildColumn<Partial<IPitch>>({
  title: "Team(s) you're on",
  width: 2,
  extractor: function getTeams(pitch: Partial<IPitch>): ReactNode {
    return <PitchItems pitch = {pitch} type = "teams" />
  }
})

const dateColumn = buildColumn<Partial<IPitch>>({
  title: "Publish Date",
  width: 2,
  sorter: deadlineSort,
  extractor: function getDeadlineDate(pitch: Partial<IPitch>): ReactNode {
    return pitch.deadline ? formatPitchDate(pitch) : '';
  },
})

const statusColumn = buildColumn<Partial<IPitch>>({
  title: "Status",
  width: 2,
  sorter: deadlineSort,
  extractor: function getStatus(pitch: Partial<IPitch>): ReactNode {
    return pitch.deadline && <PitchStatus date={pitch.deadline} />
  }
})

const formatPitchDate = (pitch: Partial<IPitch>): string => {
  if (pitch.deadline !== undefined) {
    const date = new Date(pitch.deadline);
    return getFormattedDate(date);
  } 
  return ''
}


export {
  titleColumn, topicsColumn, teamsColumn, dateColumn, formatPitchDate, statusColumn
};