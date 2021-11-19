import React from 'react';
import { IPitch, IUser } from 'ssw-common';
import { FieldTag, PitchInterests, PitchTeams } from '../../components';
import { ColumnType } from '../../components/Tables/DyanmicTable';
import { buildColumn } from '../../components/Tables/DyanmicTable/util';
import { Tab, TABS } from './helpers';

type Column = ColumnType<IPitch>;
type View = Column[];

const getViewForTab = (user: IUser, tab: Tab): View => {
  switch (tab) {
    case TABS.MEMBER_PITCHES:
      return getMemberPitchesView(user);
    case TABS.SUBMITTED_CLAIMS:
      return getSubmittedClaimsView(user);
    case TABS.SUBMITTED_PITCHES:
      return getSubmittedPitchesView(user);
    // case TABS.SUBMITTED_PUBLICATIONS:
    //   return getSubmittedPublicationsView(user);
    default:
      return [];
  }
};

const stringArraySorter = <T extends Array<any>>(a1: T, a2: T): number =>
  a1.length - a2.length ||
  a1.reduce((sum, e, i) => sum + e.localeCompare(a2[i]), 0);

const getMemberPitchesView = (user: IUser): View => [
  titleColumn,
  associatedTopicsColumn,
  {
    title: "Team(s) You're On",
    width: '1',
    sorter: (p1, p2) =>
      stringArraySorter(
        p1.assignmentContributors.find(
          (contributor) => contributor.userId === user._id,
        )?.teams ?? [],
        p2.assignmentContributors.find(
          (contributor) => contributor.userId === user._id,
        )?.teams ?? [],
      ),
    extractor: function TeamsCell(pitch) {
      return <PitchTeams pitch={pitch} user={user} assignmentContributors />;
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

const getSubmittedPitchesView = (user: IUser): View => [
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
      return <FieldTag content={status} />;
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

const getSubmittedClaimsView = (user: IUser): View => [
  titleColumn,
  associatedTopicsColumn,
  {
    title: 'Team(s) Requested to Claim',
    width: '2',
    sorter: (p1, p2) =>
      stringArraySorter(
        p1.pendingContributors.find((request) => request.userId === user._id)
          ?.teams ?? [],
        p2.pendingContributors.find((request) => request.userId === user._id)
          ?.teams ?? [],
      ),
    extractor: function TeamsCell(pitch) {
      return <PitchTeams pitch={pitch} user={user} />;
    },
  },
  {
    title: 'Status',
    width: '1',
    sorter: (p1, p2) => p1.status.localeCompare(p2.status),
    extractor: function StatusCell({ status }) {
      return <FieldTag content={'Pending'} />;
    },
  },
  {
    title: 'Date Submitted',
    width: '1',
    sorter: (p1, p2) =>
      new Date(
        p1.pendingContributors.find(
          (contributor) => contributor.userId === user._id,
        )?.dateSubmitted ?? Date.now(),
      ).getTime() -
      new Date(
        p2.pendingContributors.find(
          (contributor) => contributor.userId === user._id,
        )?.dateSubmitted ?? Date.now(),
      ).getTime(),
    extractor: function DateCell(pitch) {
      return new Date(
        pitch.pendingContributors.find(
          (contributor) => contributor.userId === user._id,
        )?.dateSubmitted ?? Date.now(),
      ).toLocaleDateString();
    },
  },
];

const getSubmittedPublicationsView = (user: IUser): View => [];

const titleColumn = buildColumn<IPitch>({
  title: 'Title',
  width: '2',
  sorter: (p1, p2) => p1.title.localeCompare(p2.title),
  extractor: 'title',
});

const descriptionColumn = buildColumn<IPitch>({
  title: 'Description',
  width: '3',
  sorter: (p1, p2) => p1.description.localeCompare(p2.description),
  extractor: 'description',
});

const associatedTopicsColumn = buildColumn<IPitch>({
  title: 'Associated Topics',
  width: '1',
  sorter: (p1, p2) => stringArraySorter(p1.topics, p2.topics),
  extractor: function InterestsCell(pitch) {
    return (
      <div className="flex-cell">
        <PitchInterests pitch={pitch} />
      </div>
    );
  },
});

export { getViewForTab };
