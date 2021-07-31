import { IUser } from 'ssw-common';

export interface IWizardContext {
  currentPage: number;
  formData: IUser;
  updateOnboardingData: (
    data: { [key: string]: IUser[keyof IUser] },
    goNext: boolean,
  ) => void;
  prevPage: () => void;
  jumpTo: (page: number) => void;
  hasSubmitted: (page: number) => boolean;
  firstLogin: boolean;
}
