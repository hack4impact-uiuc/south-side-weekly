import { Pitch, User } from 'ssw-common';

import { Sort } from '../../components/table/dynamic/types';
import { DynamicColumn } from '../../components/Tables/DynamicTable/types';
import { pitchStatusEnum } from '../../utils/enums';
import {
  findPendingContributor,
  getUserClaimStatusForPitch,
} from '../../utils/helpers';

type Column = DynamicColumn<Pitch>;

const sswEstablishedYear = 1995;

const getYearsSinceSSWEstablished = (): number[] => {
  const currentYear = new Date().getFullYear();
  return new Array(currentYear - sswEstablishedYear + 1)
    .fill(null)
    .map((_, i) => currentYear - i);
};

const filterCreatedYear = (pitches: Pitch[], year?: number): Pitch[] =>
  pitches.filter((pitch) => new Date(pitch.createdAt).getFullYear() === year);

const filterRequestClaimYear = (
  pitches: Pitch[],
  user: User,
  year?: number,
): Pitch[] =>
  pitches.filter(
    (pitch) =>
      new Date(
        findPendingContributor(pitch, user)?.dateSubmitted ?? new Date(),
      ).getFullYear() === year,
  );

const filterPitchStatus = (
  pitches: Pitch[],
  status?: keyof typeof pitchStatusEnum,
): Pitch[] => pitches.filter((pitch) => pitch.status === status);

const filterPitchClaimStatus = (
  pitches: Pitch[],
  user: User,
  status?: keyof typeof pitchStatusEnum,
): Pitch[] =>
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
