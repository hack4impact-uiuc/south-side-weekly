import React from 'react';
import { IPitch, IPitchAggregate, IUser } from 'ssw-common';

import { buildColumn, DynamicColumn, FieldTag } from '../../components';
import {
  findPendingContributor,
  getUserClaimStatusForPitch,
} from '../../utils/helpers';

import { Tab, TABS } from './helpers';

type Column = DynamicColumn<IPitch>;

const getColumnsForTab = (user: IUser, tab: Tab): Column[] => {
  switch (tab) {
    case TABS.MEMBER_PITCHES:
      return getMemberPitchesView();
    case TABS.SUBMITTED_CLAIMS:
      return getSubmittedClaimsView(user);
    case TABS.SUBMITTED_PITCHES:
      return getSubmittedPitchesView();
    case TABS.SUBMITTED_PUBLICATIONS:
      return getSubmittedPublicationsView() as Column[];
    default:
      return [];
  }
};

const getMemberPitchesView = (): Column[] => [
  titleColumn,
  associatedTopicsColumn,
  {
    title: "Team(s) You're On",
    width: '1',
    extractor: function TeamsCell() {
      return 'TODO';
    },
  },
  {
    title: 'Deadline',
    width: '1',
    sorter: (p1, p2) =>
      new Date(p1.deadline).getTime() - new Date(p2.deadline).getTime(),
    extractor: (pitch) => new Date(pitch.deadline).toLocaleDateString(),
  },
];

const getSubmittedPitchesView = (): Column[] => [
  titleColumn,
  descriptionColumn,
  {
    ...associatedTopicsColumn,
    width: '2',
  },
  {
    title: 'Status',
    width: '1',
    sorter: (p1, p2) => p1.status.localeCompare(p2.status),
    extractor: function StatusCell({ status }) {
      return <FieldTag content={status} size={'small'} />;
    },
  },
  {
    title: 'Date Submitted',
    width: '1',
    sorter: (p1, p2) =>
      new Date(p1.createdAt).getTime() - new Date(p2.createdAt).getTime(),
    extractor: function DateCell(pitch) {
      return new Date(pitch.createdAt).toLocaleDateString();
    },
  },
];

const getSubmittedClaimsView = (user: IUser): Column[] => [
  {
    ...titleColumn,
    width: '4',
  },
  {
    ...associatedTopicsColumn,
    width: '2',
  },
  {
    title: 'Team(s) Requested to Claim',
    width: '2',
    extractor: function TeamsCell() {
      return 'TODO';
    },
  },
  {
    title: 'Status',
    width: '1',
    sorter: (p1, p2) => p1.status.localeCompare(p2.status),
    extractor: function StatusCell(pitch) {
      return (
        <FieldTag
          content={getUserClaimStatusForPitch(pitch, user)}
          size={'small'}
        />
      );
    },
  },
  {
    title: 'Date Submitted',
    width: '1',
    sorter: (p1, p2) =>
      new Date(
        findPendingContributor(p1, user)?.dateSubmitted ?? Date.now(),
      ).getTime() -
      new Date(
        findPendingContributor(p2, user)?.dateSubmitted ?? Date.now(),
      ).getTime(),
    extractor: function DateCell(pitch) {
      return new Date(
        findPendingContributor(pitch, user)?.dateSubmitted ?? Date.now(),
      ).toLocaleDateString();
    },
  },
];

const getSubmittedPublicationsView = (): DynamicColumn<IPitchAggregate>[] => [
  {
    ...titleColumn,
    width: '3',
  },
  associatedTopicsColumn,
  {
    title: "Team(s) You're On",
    width: '1',
    extractor: function TeamsCell() {
      return 'TODO';
    },
  },
  {
    title: 'Publish Date',
    width: '1',
    sorter: (p1, p2) =>
      new Date(p1.aggregated.issues![0].releaseDate).getTime() -
      new Date(p2.aggregated.issues![0].releaseDate).getTime(),
    extractor: function DateCell(pitch) {
      return new Date(
        pitch.aggregated.issues![0].releaseDate,
      ).toLocaleDateString();
    },
  },
];

const titleColumn = buildColumn<IPitch>({
  title: 'Title',
  width: '2',
  sorter: (p1, p2) => p1.title.localeCompare(p2.title),
  extractor: 'title',
});

const descriptionColumn = buildColumn<IPitch>({
  title: 'Description',
  width: '3',
  extractor: 'description',
});

const associatedTopicsColumn = buildColumn<IPitch>({
  title: 'Associated Topics',
  width: '1',
  extractor: function InterestsCell() {
    return <div className="flex-cell">'TODO'</div>;
  },
});

export { getColumnsForTab };
