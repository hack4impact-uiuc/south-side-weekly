import { IUser } from 'ssw-common';

export type UserElements = { [key: string]: IUser[keyof IUser] };

export interface IWizardContext {
  currentPage: number;
  data: IUser;
  store: (data: UserElements) => void;
  jumpTo: (page: number) => void;
  hasSubmitted: (page: number) => boolean;
}
