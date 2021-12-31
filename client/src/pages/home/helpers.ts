import { IPitch, IPitchAggregate, IUser, IUserAggregate } from 'ssw-common';

import {
  DynamicColumn,
  Sort,
} from '../../components/Tables/DynamicTable/types';
import { pitchStatusEnum } from '../../utils/enums';
import {
  findPendingContributor,
  getUserClaimStatusForPitch,
  isPast,
} from '../../utils/helpers';

const sswEstablishedYear = 1995;

const getYearsSinceSSWEstablished = (): number[] => {
  const currentYear = new Date().getFullYear();
  return new Array(currentYear - sswEstablishedYear + 1)
    .fill(null)
    .map((_, i) => currentYear - i);
};

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

type Column = DynamicColumn<IPitch>;

const getInitialSort = (
  user: IUser,
  tab: Tab,
): Sort<DynamicColumn<IPitch>> | undefined => {
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
};
export type { Column };
