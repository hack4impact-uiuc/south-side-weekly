import { IUser } from 'ssw-common';

export interface ParamTypes {
  userId: string;
}

export interface IDropdownOptions {
  [key: string]: string[];
}

export interface IPermissions {
  view: (keyof IUser)[];
  edit: (keyof IUser)[];
}

export type MultiDropdowns = 'genders' | 'pronouns' | 'races';
