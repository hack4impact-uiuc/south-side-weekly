import { IUser } from 'ssw-common';

export interface IFilterKeys {
  role: string;
  date: string;
  interests: string[];
  teams: string[];
}

export interface ISearchState {
  users: IUser[];
  query: string;
  isLoading: boolean;
}

export interface ISearchAction<T> {
  type: T;
  query: string;
  users: IUser[];
}

export interface IModalState {
  isOpen: boolean;
  user?: IUser;
}

export interface IModalAction<T> {
  type: T;
  isOpen: boolean;
  user?: IUser;
}
