import { BasePopulatedUser, IUser } from 'ssw-common';

export type UserElements = { [key: string]: IUser[keyof IUser] };

export interface IWizardContext {
  currentPage: number;
  data?: Partial<BasePopulatedUser>;
  store: (data: Partial<BasePopulatedUser>) => void;
  jumpTo: (page: number) => void;
  hasSubmitted: (page: number) => boolean;
}
