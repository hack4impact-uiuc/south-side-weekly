import { MouseEvent, Dispatch, SetStateAction } from 'react';
import { IUser, IPitch } from 'ssw-common';

/**
 * Adds selected element to the specific form array if it isn't already there, otherwise removes it
 *
 * @param e the MouseEvent of clicking the select button
 * @param selectedArray the selected array to check from
 * @param setArray React setter for the selected array
 */
const handleSelectGroupArray = (
  e: MouseEvent<HTMLButtonElement>,
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

interface ISemanticDropdownOptions {
  key: number;
  text: string;
  value: string;
}

const parseArrayToSemanticDropdownOptions = (
  arr: string[],
): ISemanticDropdownOptions[] => {
  const semanticOptions: ISemanticDropdownOptions[] = [];

  for (let count = 0; count < arr.length; ++count) {
    const newOption: ISemanticDropdownOptions = {
      key: count + 1,
      text: arr[count],
      value: arr[count],
    };

    semanticOptions.push(newOption);
  }

  return semanticOptions;
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
 * Sorts all of the users in the directory by date.
 *
 * @param isAscending the filter string representation, Earliest to Latest, Latest to Earliest, [empty]
 */
const sortUsersByDate = (isAscending: boolean, directory: IUser[]): IUser[] => {
  const sortedDirectory: IUser[] = [...directory];

  sortedDirectory.sort((first: IUser, second: IUser): number => {
    const firstUserDate: Date = new Date(first.dateJoined);
    const secondUserDate: Date = new Date(second.dateJoined);

    if (firstUserDate > secondUserDate) {
      // -1 is a magic number
      return isAscending ? 1 : 0 - 1;
    } else if (firstUserDate < secondUserDate) {
      return isAscending ? 0 - 1 : 1;
    }
    return 0;
  });

  return sortedDirectory;
};

/**
 * Filters out the users that have the specified role.
 *
 * @param role the role to filter by
 */
const filterUsersByRole = (role: string, directory: IUser[]): IUser[] => {
  if (role === '') {
    return directory;
  }
  let filteredDirectory: IUser[] = [...directory];

  filteredDirectory = filteredDirectory.filter(
    (result: IUser) => result.role === role.toUpperCase(),
  );

  return filteredDirectory;
};

/**
 * Filters out the users that have any of the selected interests.
 *
 * @param interests the interests to filter by
 */
const filterUsersByInterests = (
  interests: string[],
  directory: IUser[],
): IUser[] => {
  if (typeof interests !== 'object' || interests.length === 0) {
    return directory;
  }

  let filteredDirectory: IUser[] = [...directory];

  filteredDirectory = filteredDirectory.filter((user: IUser) => {
    let hasInterest = true;

    interests.forEach((interest) => {
      if (!user.interests.includes(interest.toString().toUpperCase())) {
        hasInterest = false;
      }
    });

    return hasInterest;
  });

  return filteredDirectory;
};

/**
 * Filters out the users that have any of the selected teams.
 *
 * @param interests the interests to filter by
 */
const filterUsersByTeams = (teams: string[], directory: IUser[]): IUser[] => {
  if (typeof teams !== 'object' || teams.length === 0) {
    return directory;
  }

  let filteredDirectory: IUser[] = [...directory];

  filteredDirectory = filteredDirectory.filter((user: IUser) => {
    let hasTeam = true;

    teams.forEach((team) => {
      if (!user.currentTeams.includes(team.toUpperCase())) {
        hasTeam = false;
      }
    });

    return hasTeam;
  });

  return filteredDirectory;
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
    const assingments = team[1];

    if (assingments.target > 0) {
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

    console.log(pitch.name);

    const pitchTeams: string[] = getPitchTeams(pitch);
    console.log(pitch.teams);
    console.log(pitchTeams);

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
  if (teams.length === 0) {
    const pitchTeams = Object.entries(pitch.teams);
    let isClaimed = true;

    pitchTeams.forEach((team) => {
      // Essentially `continue`
      if (!isClaimed) {
        return;
      }

      const assignments = team[1];

      if (assignments.current < assignments.target) {
        // Cannot return early in for each loop
        isClaimed = false;
      }
    });

    return isClaimed;
  }

  const pitchTeams = Object.entries(pitch.teams);
  let isClaimed = true;

  pitchTeams.forEach((team) => {
    if (teams.includes(team[0])) {
      // Essentially `continue`
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

export {
  handleSelectGroupArray,
  parseArrayToSemanticDropdownOptions,
  parseSemanticMultiSelectTypes,
  sortUsersByDate,
  filterUsersByRole,
  filterUsersByTeams,
  filterUsersByInterests,
  getPitchTeams,
  isPitchClaimed,
  filterPitchesByClaimStatus,
  filterPitchesByInterests,
  filterPitchesByTeams,
  sortPitchesByDeadlineDate,
};
