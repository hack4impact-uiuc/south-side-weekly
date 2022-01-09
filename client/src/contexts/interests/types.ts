import { Interest } from 'ssw-common';

export interface IInterestsContext {
  interests: Interest[];
  fetchInterests: () => void;
  getInterestById: (id: string) => Interest | undefined;
}
