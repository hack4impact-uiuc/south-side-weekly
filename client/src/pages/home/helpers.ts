import {
  IIssue,
  IPitch,
  IPitchAggregate,
  IUser,
  IUserAggregate,
} from 'ssw-common';
import { pitchStatusEnum } from '../../utils/enums';

const sswEstablishedYear = 1995;

const getYearsSinceSSWEstablished = (): string[] => {
  const currentYear = new Date().getFullYear();
  return new Array(currentYear - sswEstablishedYear + 1)
    .fill(null)
    .map((_, i) => (currentYear - i).toString());
};

const TABS = {
  MEMBER_PITCHES: 'Your Current Pitches',
  SUBMITTED_PITCHES: 'Pitches You Submitted',
  SUBMITTED_CLAIMS: 'Your Claim Requests',
  SUBMITTED_PUBLICATIONS: 'Your Publications',
} as const;
type Tab = typeof TABS[keyof typeof TABS];

const filterCreatedYear = (pitches: IPitch[], year?: string): IPitch[] =>
  pitches.filter(
    (pitch) => new Date(pitch.createdAt).getFullYear().toString() === year,
  );

const filterRequestClaimYear = (
  pitches: IPitch[],
  user: IUser,
  year?: string,
): IPitch[] =>
  pitches.filter(
    (pitch) =>
      new Date(
        pitch.pendingContributors.find(
          (contributor) => contributor.userId === user._id,
        )?.dateSubmitted ?? new Date(),
      )
        .getFullYear()
        .toString() === year,
  );

const filterStatus = (
  pitches: IPitch[],
  status?: keyof typeof pitchStatusEnum,
): IPitch[] => pitches.filter((pitch) => pitch.status === status);

const isPitchArray = (
  array: Array<IPitch | IIssue>,
): array is Array<IPitch> => {
  if (array.length === 0) {
    return true;
  }

  return 'title' in array[0];
};

export {
  getYearsSinceSSWEstablished,
  filterCreatedYear,
  filterRequestClaimYear,
  filterStatus,
  isPitchArray,
  TABS,
};
export type { Tab };
