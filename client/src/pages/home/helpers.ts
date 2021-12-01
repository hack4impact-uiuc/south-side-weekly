import { IPitch, IPitchAggregate, IUser, IUserAggregate } from 'ssw-common';

import { Sort } from '../../components/Tables/DynamicTable/types';
import { pitchStatusEnum } from '../../utils/enums';
import {
  findPendingContributor,
  getUserClaimStatusForPitch,
  isPast,
} from '../../utils/helpers';

import { getColumnsForTab } from './views';

const sswEstablishedYear = 1995;

const getYearsSinceSSWEstablished = (): number[] => {
  const currentYear = new Date().getFullYear();
  return new Array(currentYear - sswEstablishedYear + 1)
    .fill(null)
    .map((_, i) => currentYear - i);
};

const TABS = {
  MEMBER_PITCHES: 'Your Current Pitches',
  SUBMITTED_PITCHES: 'Pitches You Submitted',
  SUBMITTED_CLAIMS: 'Your Claim Requests',
  SUBMITTED_PUBLICATIONS: 'Your Publications',
} as const; // As const prevents modification of this object
type Tab = typeof TABS[keyof typeof TABS];

const filterCreatedYear = (pitches: IPitch[], year?: number): IPitch[] =>
  pitches.filter((pitch) => new Date(pitch.createdAt).getFullYear() === year);

const filterRequestClaimYear = (
  pitches: IPitch[],
  user: IUser,
  year?: number,
): IPitch[] =>
  pitches.filter(
    (pitch) =>
      new Date(
        findPendingContributor(pitch, user)?.dateSubmitted ?? new Date(),
      ).getFullYear() === year,
  );

const filterPitchStatus = (
  pitches: IPitch[],
  status?: keyof typeof pitchStatusEnum,
): IPitch[] => pitches.filter((pitch) => pitch.status === status);

const filterPitchClaimStatus = (
  pitches: IPitch[],
  user: IUser,
  status?: keyof typeof pitchStatusEnum,
): IPitch[] =>
  pitches.filter((pitch) => getUserClaimStatusForPitch(pitch, user) === status);

const isPitchPublished = (pitch: IPitchAggregate): boolean =>
  pitch.aggregated.issues.length > 0 &&
  pitch.aggregated.issues
    .map((issue) => new Date(issue.releaseDate))
    .some(isPast);

const getPublishedPitches = (pitches: IPitchAggregate[]): IPitchAggregate[] =>
  pitches.filter(isPitchPublished);

const getUnpublishedPitches = (pitches: IPitchAggregate[]): IPitchAggregate[] =>
  pitches.filter((pitch) => !isPitchPublished(pitch));

const getRecordsForTab = (
  { aggregated }: IUserAggregate,
  tab: Tab,
): IPitch[] => {
  switch (tab) {
    case TABS.MEMBER_PITCHES:
      return getUnpublishedPitches(
        aggregated.claimedPitches as IPitchAggregate[],
      );
    case TABS.SUBMITTED_CLAIMS:
      return aggregated.submittedClaims as IPitch[];
    case TABS.SUBMITTED_PITCHES:
      return aggregated.submittedPitches as IPitch[];
    case TABS.SUBMITTED_PUBLICATIONS:
      return getPublishedPitches(
        aggregated.claimedPitches as IPitchAggregate[],
      );
    default:
      return [];
  }
};

const getInitialSort = (user: IUser, tab: Tab): Sort<IPitch> | undefined => {
  switch (tab) {
    case TABS.MEMBER_PITCHES:
      return {
        column: getColumnsForTab(user, tab).find(
          (column) => column.title === 'Deadline',
        )!,
        direction: 'descending',
      };
    case TABS.SUBMITTED_PITCHES:
      return {
        column: getColumnsForTab(user, tab).find(
          (column) => column.title === 'Date Submitted',
        )!,
        direction: 'descending',
      };
    case TABS.SUBMITTED_CLAIMS:
      return {
        column: getColumnsForTab(user, tab).find(
          (column) => column.title === 'Date Submitted',
        )!,
        direction: 'descending',
      };
    case TABS.SUBMITTED_PUBLICATIONS:
      return {
        column: getColumnsForTab(user, tab).find(
          (column) => column.title === 'Publish Date',
        )!,
        direction: 'descending',
      };
    default:
      return;
  }
};

export {
  getYearsSinceSSWEstablished,
  filterCreatedYear,
  filterRequestClaimYear,
  filterPitchStatus,
  filterPitchClaimStatus,
  getRecordsForTab,
  getInitialSort,
  TABS,
};
export type { Tab };
