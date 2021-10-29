import { IInterest } from 'ssw-common';

export interface IInterestsContext {
  interests: IInterest[];
  fetchInterests: () => void;
  getInterestById: (id: string) => IInterest | undefined;
}
