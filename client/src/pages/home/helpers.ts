import { IPitch, IPitchAggregate, IUser, IUserAggregate } from 'ssw-common';
import { Sort } from '../../components/table/dynamic/types';

import { DynamicColumn } from '../../components/Tables/DynamicTable/types';
import { pitchStatusEnum } from '../../utils/enums';
import {
  findPendingContributor,
  getUserClaimStatusForPitch,
} from '../../utils/helpers';

type Column = DynamicColumn<IPitch>;

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

const getInitialSort = (column: Column): Sort<Column> => ({
  column,
  direction: 'descending',
});

export {
  getYearsSinceSSWEstablished,
  filterCreatedYear,
  filterRequestClaimYear,
  filterPitchStatus,
  filterPitchClaimStatus,
  getInitialSort,
};
export type { Column };
