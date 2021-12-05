import { AsYouType } from 'libphonenumber-js';
import { camelCase, isUndefined, reject, startCase } from 'lodash';
import { DropdownItemProps } from 'semantic-ui-react';
import { IUser, IPitch } from 'ssw-common';

import { pitchStatusEnum } from './enums';

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
 * Gets all of the teams a user is on for a given pitch
 *
 * @param pitch the pitch to check
 * @param user the user to look at teams for
 * @returns an array of all the team IDs belonging to the user or undefined if the user isn't on the pitch
 */
const getPitchTeamsForContributor = (
  pitch: IPitch,
  user: IUser,
): string[] | undefined => {
  type Contributor = IPitch['assignmentContributors'][0];
  const isUser = (contributor: Contributor): boolean =>
    contributor.userId === user._id;

  const contributor =
    pitch.assignmentContributors.find(isUser) ||
    pitch.pendingContributors.find(isUser);

  return contributor?.teams;
};

type PendingContributor = IPitch['pendingContributors'][0];
/**
 * Find a pending contributor on a pitch that matches a given user
 *
 * @param pitch the pitch to check
 * @param user the user to match
 * @returns the pending contributor object
 */
const findPendingContributor = (
  pitch: IPitch,
  user: IUser,
): PendingContributor | undefined =>
  pitch.pendingContributors.find(
    (contributor) => contributor.userId === user._id,
  );

type AssignmentContributor = IPitch['assignmentContributors'][0];
/**
 * Find an assignment contributor on a pitch that matches a given user
 *
 * @param pitch the pitch to check
 * @param user the user to match
 * @returns the assignment contributor object
 */
const findAssignmentContributor = (
  pitch: IPitch,
  user: IUser,
): AssignmentContributor | undefined =>
  pitch.assignmentContributors.find(
    (contributor) => contributor.userId === user._id,
  );

type PitchClaimStatus = typeof pitchStatusEnum[keyof typeof pitchStatusEnum];
/**
 * Gets a user's claim status for a pitch
 *
 * @param pitch the pitch
 * @param user the user
 * @returns the user's pitch claim status
 */
const getUserClaimStatusForPitch = (
  pitch: IPitch,
  user: IUser,
): PitchClaimStatus => {
  if (findAssignmentContributor(pitch, user)) {
    return pitchStatusEnum.APPROVED;
  }

  const pendingContributor = findPendingContributor(pitch, user);
  if (pendingContributor) {
    return pendingContributor.status;
  }

  return pitchStatusEnum.DECLINED;
};
/**
 * Filters a list of pitches by a list of interests
 *
 * Returns the pitches in the pitches list which have all of the interests contained in interests
 *
 * @param pitches the pitches to filter
 * @param interests the interests to filter by
 * @returns all the pitches which contain all the interests
 */
const filterPitchesByInterests = (
  pitches: IPitch[],
  interests: string[],
): IPitch[] => {
  if (interests.length === 0) {
    return pitches;
  }

  return pitches.filter((pitch) =>
    interests.every((interest) => pitch.topics.includes(interest)),
  );
};

/**
 * Sorts a list of pitches by their deadline
 *
 * @param pitches the list of pitches
 * @param sort the sort direction
 * @returns the sorted list of pitches
 */
const sortPitches = (
  pitches: IPitch[],
  sort: 'none' | 'increase' | 'decrease',
): IPitch[] => {
  if (sort === 'none') {
    return pitches;
  }

  pitches.sort((a, b) => {
    const first = new Date(a.deadline);
    const second = new Date(b.deadline);
    if (sort === 'increase') {
      return first.getTime() - second.getTime();
    }

    return second.getTime() - first.getTime();
  });

  return pitches;
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
const getUserFullName = (user?: Partial<IUser>): string => {
  if (user === null || user === undefined) {
    return 'null';
  }

  const firstName = user.preferredName ? user.preferredName : user.firstName;
  const lastName = user.lastName;

  return `${firstName} ${lastName}`;
};

/**
 * Gets a user's first name and last initial, preferring their preferred name over first name
 *
 * @param user the user to get the short name of
 * @returns the shortname of the user
 */
const getUserShortName = (user?: Partial<IUser>): string => {
  if (user === null || user === undefined) {
    return 'null';
  }

  return `${user.preferredName || user.firstName} ${user.lastName?.slice(
    0,
    1,
  )}.`;
};
/**
 * Gets the teams on a pitch that a user can claimed
 *
 * @param pitch the pitch to check the teams for
 * @param user the user to check the teams for
 * @returns the teams that the user can claim
 */
const getClaimableTeams = (pitch: IPitch, user: IUser): string[] =>
  pitch.writer
    ? pitch.teams
        .filter((team) => team.target > 0 && user.teams.includes(team.teamId))
        .map((team) => team.teamId)
    : [];

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
 * A default async void function to use as an initial function for contexts
 */
const defaultAsyncFunc = (): Promise<void> => Promise.resolve();

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

interface SelectOption {
  value: string;
  label: string;
}

/**
 * Parses an array of options into React Select style Dropdown Items objects
 *
 * @param options the dropdown options to create
 * @returns the Semantic-UI Dropdown options
 */
const parseOptionsSelect = (options: string[]): SelectOption[] =>
  options.map((option) => ({
    label: option,
    value: option,
  }));
/**
 * Adds an "s" to a word if the "numberOf" parameter is not 1
 *
 * @param word the word to pluralize
 * @param numberOf the number of the word that you want to describe
 */
const pluralize = (word: string, numberOf: number): string =>
  word + (numberOf !== 1 ? 's' : '');

/**
 * Tests whether a date occurs in the past
 *
 * @param date the date to check
 * @returns true if the date is in the past false if not
 */
const isPast = (date: Date): boolean => Date.now() - date.getTime() > 0;

export {
  getPitchTeams,
  getPitchTeamsForContributor,
  findPendingContributor,
  findAssignmentContributor,
  getUserClaimStatusForPitch,
  filterPitchesByInterests,
  sortPitches,
  updateUserField,
  getUserFullName,
  getUserShortName,
  getClaimableTeams,
  parseOptions,
  parseOptionsSelect,
  isPitchClaimed,
  convertMap,
  titleCase,
  defaultFunc,
  formatNumber,
  classNames,
  openProfile,
  pluralize,
  isPast,
  defaultAsyncFunc,
};
