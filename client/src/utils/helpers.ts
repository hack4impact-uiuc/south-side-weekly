import { AsYouType } from 'libphonenumber-js';
import { camelCase, isUndefined, reject, startCase, toUpper } from 'lodash';
import { DropdownItemProps } from 'semantic-ui-react';
import { IUser, IPitch } from 'ssw-common';

/**
 * Gets all of the teams associated with a pitch
 *
 * A pitch has a team when the {TEAM}.target > 0
 *
 * @param pitch the pitch to pull the teams from
 * @returns an array of all of teams belonging to the pitch
 */
const getPitchTeams = (pitch: IPitch): string[] => {
  const teams: string[] = [];

  const pitchTeams = Object.entries(pitch.teams);

  pitchTeams.forEach((team) => {
    const teamName = team[0];
    const assignments = team[1];

    if (assignments.target > 0) {
      teams.push(toUpper(teamName));
    }
  });

  return teams;
};

/**
 * Updates a user's field generically
 *
 * @param user the user to update
 * @param key the field of the user to change
 * @param value the corresponding to value to set the user's key to
 * @returns the updated user object
 */
const updateUserField = <T extends keyof IUser>(
  user: IUser,
  key: T,
  value: IUser[T],
): IUser => {
  const userCopy = { ...user };
  userCopy[key] = value;
  return userCopy;
};

const getUserFullName = (user: IUser): string =>
  `${user.preferredName ? user.preferredName : user.firstName} ${
    user.lastName
  }`;

const parseOptions = (options: string[]): DropdownItemProps[] =>
  options.map((option, index) => ({
    key: index,
    text: option,
    value: option,
  }));

const isPitchClaimed = (pitch: IPitch): boolean =>
  Object.entries(pitch.teams).every(
    ([, spots]) => spots.current === spots.target,
  );

interface MapConversion<T, K> {
  key: T;
  value: K;
}

const convertMap = <T, K>(map: Map<T, K>): MapConversion<T, K>[] =>
  Array.from(map, ([key, value]) => ({ key, value }));

const titleCase = (str: string): string => startCase(camelCase(str));

const defaultFunc = (): void => void 0;

const formatNumber = (value: string): string => {
  if (value.includes('(') && !value.includes(')')) {
    return value.replace('(', '');
  }
  return new AsYouType('US').input(value);
};

const classNames = (classNames: (string | undefined)[]): string => {
  const parsed = reject(classNames, isUndefined);
  return parsed.join(' ');
};

const openProfile = (user: IUser): void =>
  window.open(`/profile/${user._id}`)!.focus();

export {
  getPitchTeams,
  updateUserField,
  getUserFullName,
  parseOptions,
  isPitchClaimed,
  convertMap,
  titleCase,
  defaultFunc,
  formatNumber,
  classNames,
  openProfile,
};
