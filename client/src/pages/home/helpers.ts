import { IIssue, IPitch, IUser, IUserAggregate } from 'ssw-common';

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

type RecordType = IPitch | IIssue;

const getSearchFields = (records: RecordType[]): string[] => {
  if (isPitchArray(records)) {
    return ['title'];
  }
  return ['name'];
};

const getRecordsForTab = (
  { aggregated }: IUserAggregate,
  tab: Tab,
): RecordType[] => {
  switch (tab) {
    case TABS.MEMBER_PITCHES:
      return aggregated.claimedPitches as IPitch[];
    case TABS.SUBMITTED_CLAIMS:
      return aggregated.submittedClaims as IPitch[];
    case TABS.SUBMITTED_PITCHES:
      return aggregated.submittedPitches as IPitch[];
    case TABS.SUBMITTED_PUBLICATIONS:
      return aggregated.publications as IIssue[];
    default:
      return [];
  }
};

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
  getSearchFields,
  getRecordsForTab,
  TABS,
};
export type { Tab, RecordType };
