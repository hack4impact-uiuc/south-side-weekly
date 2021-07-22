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
 * Filters out the pitches that have any of the selected teams.
 *
 * @param teams the interests to filter by
 * @param pitches the pitches to filter
 */
const filterPitchesByTeams = (teams: string[], pitches: IPitch[]): IPitch[] => {
  if (typeof teams !== 'object' || teams.length === 0) {
    return pitches;
  }

  let filteredPitches: IPitch[] = [...pitches];

  filteredPitches = filteredPitches.filter((pitch: IPitch) => {
    let hasTeam = true;

    const pitchTeams: string[] = getPitchTeams(pitch);

    teams.forEach((team) => {
      if (!pitchTeams.includes(team.toUpperCase())) {
        hasTeam = false;
      }
    });

    return hasTeam;
  });

  return filteredPitches;
};

/**
 * Sorts a set of pitches by their deadline date
 *
 * @param isAscending whether to sort them earliest to latest or vis versa
 * @param pitches the set of pithces to sort
 * @returns the sorted pitches
 */
const sortPitchesByDeadlineDate = (
  isAscending: boolean,
  pitches: IPitch[],
): IPitch[] => {
  const sortedPitches = [...pitches];

  sortedPitches.sort((first: IPitch, second: IPitch): number => {
    const firstPitchDeadline: Date = new Date(first.deadline);
    const secondPitchDeadline: Date = new Date(second.deadline);

    if (firstPitchDeadline > secondPitchDeadline) {
      // -1 is a magic number
      return isAscending ? 1 : 0 - 1;
    } else if (firstPitchDeadline < secondPitchDeadline) {
      return isAscending ? 0 - 1 : 1;
    }
    return 0;
  });

  return sortedPitches;
};

/**
 * Filters a set of pitches by interests
 *
 * @param interests the interests to filter by
 * @param pitches the set of pitches
 * @returns the filtered pitches
 */
const filterPitchesByInterests = (
  interests: string[],
  pitches: IPitch[],
): IPitch[] => {
  if (typeof interests !== 'object' || interests.length === 0) {
    return pitches;
  }

  let filteredPitches = [...pitches];

  filteredPitches = filteredPitches.filter((pitch: IPitch) => {
    let hasInterest = true;

    interests.forEach((interest) => {
      if (!pitch.topics.includes(interest.toString().toUpperCase())) {
        hasInterest = false;
      }
    });

    return hasInterest;
  });

  return filteredPitches;
};

/**
 * Filteres the pitches by claim status
 *
 * @param claimStatus the claim status to filter by
 * @param pitches the pitches to filter
 * @returns the filtered pitches
 */
const filterPitchesByClaimStatus = (
  claimStatus: string,
  pitches: IPitch[],
  teams: string[],
): IPitch[] => {
  if (claimStatus === '') {
    return pitches;
  }

  let filteredPitches = [...pitches];

  filteredPitches = filteredPitches.filter((pitch: IPitch) => {
    if (claimStatus === 'Claimed') {
      return isPitchClaimed(pitch, teams);
    } else if (claimStatus === 'Unclaimed') {
      return !isPitchClaimed(pitch, teams);
    }
  });

  return filteredPitches;
};

/**
 * Determines if a pitch is claimed or not
 *
 * A pitch is claimed such that if for every team,
 * the current amount of team claims is equivelant to
 * the target amount of team claims
 *
 * {TEAM}.current === {TEAM.target} for all tams
 *
 * @param pitch the pitch to check if claimed
 * @returns true if pitch is claimed, else false
 */
const isPitchClaimed = (pitch: IPitch, teams: string[]): boolean => {
  const pitchTeams = Object.entries(pitch.teams);
  let isClaimed = true;

  pitchTeams.forEach((team) => {
    // Essentially `continue`
    if (teams.length === 0 || teams.includes(team[0])) {
      if (!isClaimed) {
        return;
      }
      const assignments = team[1];

      if (assignments.current < assignments.target) {
        // Cannot return early in for each loop
        isClaimed = false;
      }
    }
  });

  return isClaimed;
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

export {
  handleSelectGroupArray,
  parseSemanticMultiSelectTypes,
  getPitchTeams,
  isPitchClaimed,
  filterPitchesByClaimStatus,
  filterPitchesByInterests,
  filterPitchesByTeams,
  sortPitchesByDeadlineDate,
  getUserFirstName,
  updateUserField,
  getUserProfilePic,
  getUserFullName,
  parseOptions,
};
