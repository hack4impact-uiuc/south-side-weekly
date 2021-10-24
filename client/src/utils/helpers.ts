import { AsYouType } from 'libphonenumber-js';
import { camelCase, isUndefined, reject, startCase } from 'lodash';
import { DropdownItemProps } from 'semantic-ui-react';
import { IUser, IPitch } from 'ssw-common';

/**
 * Gets all of the teams associated with a pitch
 *
 * A pitch has a team when the {TEAM}.target > 0
 *
 * @param pitch the pitch to pull the teams from
 * @returns an array of all of team IDs belonging to the pitch
 */
const getPitchTeams = (pitch: IPitch): string[] => {
  const teams = pitch.teams
    .filter((team) => team.target > 0)
    .map((team) => team.teamId);

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

/**
 * Gets a user's first and last name, preferring their preferred name over first name
 *
 * @param user the user to get the fullname of
 * @returns the fullname of the user
 */
const getUserFullName = (user: Partial<IUser>): string =>
  `${user.preferredName ? user.preferredName : user.firstName} ${
    user.lastName
  }`;

/**
 * Parses an array of options into Semantic UI style Dropdown Items objects
 *
 * @param options the dropdown options to create
 * @returns the Semantic-UI Dropdown options
 */
const parseOptions = (options: string[]): DropdownItemProps[] =>
  options.map((option, index) => ({
    key: index,
    text: option,
    value: option,
  }));

/**
 * Determines if a pitch is claimed or not
 *
 * @param pitch the pitch check the claims status
 * @returns true if pitch is claimed, else false
 */
const isPitchClaimed = (pitch: IPitch): boolean =>
  pitch.teams.every((team) => team.target <= 0);

interface MapConversion<T, K> {
  key: T;
  value: K;
}

/**
 * Converts an object to an array of objects [{k1, v1}, {k2, v2}, ...]
 *
 * @param map the Map to convert
 * @returns an array version of the map
 */
const convertMap = <T, K>(map: Map<T, K>): MapConversion<T, K>[] =>
  Array.from(map, ([key, value]) => ({ key, value }));

/**
 * Converts a string to title case format
 *
 * this is a test -> This Is A Test
 *
 * @param str the string to convert
 * @returns the title cased string
 */
const titleCase = (str: string): string => startCase(camelCase(str));

/**
 * A default void function to use as an initial function for contexts
 */
const defaultFunc = (): void => void 0;

/**
 * Formats a number using libphonenumber-js into a US phone number
 *
 * @param value the unformatted phone number
 * @returns the US formatted number
 */
const formatNumber = (value: string): string => {
  if (value.includes('(') && !value.includes(')')) {
    return value.replace('(', '');
  }
  return new AsYouType('US').input(value);
};

/**
 * Converts an array of arguments into a single className
 *
 * ("first", "second", undefined, "third") -> "first second third"
 *
 * @param classNames the classnames to combine
 * @returns a single classname string
 */
const classNames = (...classNames: (string | undefined)[]): string => {
  const parsed = reject(classNames, isUndefined);
  return parsed.join(' ');
};

/**
 * Opens a user's profile in a new tab and focuses that tab
 *
 * @param user the user whose profile should be opened
 */
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
