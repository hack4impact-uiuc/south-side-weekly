import { FormEvent, Dispatch, SetStateAction } from 'react';
import { DropdownItemProps } from 'semantic-ui-react';
import { IUser, IPitch } from 'ssw-common';

import DefaultProfile from '../assets/default_profile.png';

/**
 * Adds selected element to the specific form array if it isn't already there, otherwise removes it
 *
 * @param e the MouseEvent of clicking the select button
 * @param selectedArray the selected array to check from
 * @param setArray React setter for the selected array
 */
const handleSelectGroupArray = (
  e: FormEvent<HTMLInputElement>,
  selectedArray: Array<string>,
  setArray: Dispatch<SetStateAction<Array<string>>>,
): void => {
  const notFoundIdx = -1;
  const elementIdx = selectedArray.indexOf(e.currentTarget.value);

  if (elementIdx === notFoundIdx) {
    const addedElements = selectedArray.concat(e.currentTarget.value);

    setArray(addedElements);
  } else {
    const removedElements = selectedArray.filter(
      (element) => element !== e.currentTarget.value,
    );

    setArray(removedElements);
  }
};

/**
 * Parses a semantic multi select into the filter key usable types.
 *
 * @param value the value from the multiselect
 * @returns a conversion from semantic's type to string | string[]
 */
const parseSemanticMultiSelectTypes = (
  value: string | number | boolean | (string | number | boolean)[],
): string | string[] => {
  if (typeof value === 'string') {
    return value;
  } else if (Array.isArray(value)) {
    const parsedArray: string[] = [];

    value.forEach((element) => {
      parsedArray.push(`${element}`);
    });

    return parsedArray;
  }

  console.error('Invalid datatype to convert');
  return [];
};

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
    const teamName: string = team[0];
    const assignments = team[1];

    if (assignments.target > 0) {
      teams.push(teamName.toUpperCase());
    }
  });

  return teams;
};

/**
 * Determines a user's first name by prioritizing preferred name
 *
 * @param user the user to get the first name of
 * @returns the user's first name
 */
const getUserFirstName = (user: IUser): string => {
  if (user.preferredName === null || user.preferredName === '') {
    return user.firstName;
  }

  return user.preferredName;
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
 * Determines a user's profile picture and returns the Default Profile
 * picture if user has none
 *
 * @param user the user to get the profile picture of
 * @returns the profile picture
 */
const getUserProfilePic = (user: IUser): string =>
  user.profilePic !== null && user.profilePic !== undefined
    ? user.profilePic
    : DefaultProfile;

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
    (team) => team[1].current === team[1].target,
  );

interface MapConversion<T, K> {
  key: T;
  value: K;
}

const convertMap = <T, K>(map: Map<T, K>): MapConversion<T, K>[] =>
  Array.from(map, ([key, value]) => ({ key, value }));

export {
  handleSelectGroupArray,
  parseSemanticMultiSelectTypes,
  getPitchTeams,
  getUserFirstName,
  updateUserField,
  getUserProfilePic,
  getUserFullName,
  parseOptions,
  isPitchClaimed,
  convertMap,
};