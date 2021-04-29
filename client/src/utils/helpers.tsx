import { Dispatch, SetStateAction } from 'react';
import { IUser } from 'ssw-common';
import { CheckboxProps } from 'semantic-ui-react';

/**
 * Adds selected element to the specific form array if it isn't already there, otherwise removes it
 *
 * @param e the MouseEvent of clicking the select button
 * @param selectedArray the selected array to check from
 * @param setArray React setter for the selected array
 */
const handleSelectGroupArray = (
  data: CheckboxProps,
  selectedArray: Array<string>,
  setArray: Dispatch<SetStateAction<Array<string>>>,
): void => {
  const notFoundIdx = -1;
  const value = String(data.value!);
  const elementIdx = selectedArray.indexOf(value);

  if (elementIdx === notFoundIdx) {
    const addedElements = selectedArray.concat(value);

    setArray(addedElements);
  } else {
    const removedElements = selectedArray.filter(
      (element) => element !== value,
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

export {
  handleSelectGroupArray,
  parseArrayToSemanticDropdownOptions,
  parseSemanticMultiSelectTypes,
  sortUsersByDate,
  filterUsersByRole,
  filterUsersByTeams,
  filterUsersByInterests,
};
