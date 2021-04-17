import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { Dropdown, Button, Input } from 'semantic-ui-react';
import { useHistory } from 'react-router-dom';

import { IUser } from '../../../common/index';
import { getUsers, isError } from '../utils/apiWrapper';
import Sidebar from '../components/Sidebar';
import SSW from '../assets/ssw-form-header.png';

import '../css/Directory.css';

interface IFilterKeys {
  role: string;
  date: string;
  interests: string[];
  teams: string[];
}

const initialFilterKeys: IFilterKeys = {
  role: '',
  date: '',
  interests: [],
  teams: [],
};

const roleOptions = [
  { key: 1, text: 'Contributor', value: 'Contributor' },
  { key: 2, text: 'Staff', value: 'Staff' },
  { key: 3, text: 'Admin', value: 'Admin' },
];

const dateOptions = [
  { key: 1, text: 'Earliest to Latest', value: 'Earliest to Latest' },
  { key: 2, text: 'Latest to Earliest', value: 'Latest to Earliest' },
];

const interestOptions = [
  { key: 1, text: 'Cannabis', value: 'Cannabis' },
  { key: 2, text: 'Food & Land', value: 'Food & Land' },
  { key: 3, text: 'Fun', value: 'Fun' },
  { key: 4, text: 'Health', value: 'Health' },
  { key: 5, text: 'Housing', value: 'Housing' },
  { key: 6, text: 'Immigration', value: 'Immigration' },
  { key: 7, text: 'Lit', value: 'Lit' },
  { key: 8, text: 'Music', value: 'Music' },
  { key: 9, text: 'Nature', value: 'Nature' },
  { key: 10, text: 'Politics', value: 'Politics' },
  { key: 11, text: 'Stage and Screen', value: 'Stage and Screen' },
  { key: 12, text: 'Transportation', value: 'Transportation' },
  { key: 13, text: 'Visual Arts', value: 'Visual Arts' },
];

const Directory = (): ReactElement => {
  const history = useHistory();
  const [directory, setDirectory] = useState<IUser[]>([]);
  const [searchedDirectory, setSearchedDirectory] = useState<IUser[]>(
    directory,
  );

  // TODO: Loading, searched directory, and search Term should be a reducer
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [filterKeys, setFilterKeys] = useState<IFilterKeys>(initialFilterKeys);

  /**
   * Populated the directory and connect to the API
   */
  useEffect(() => {
    const populateDirectory = async (): Promise<void> => {
      const resp = await getUsers();

      if (!isError(resp)) {
        setDirectory(resp.data.result);
        setSearchedDirectory(resp.data.result);
      }
    };

    populateDirectory();
  }, []);

  /**
   * Searches through the directory and returns a set of directory member who's name or
   * email contains the search term
   *
   * @param searchTerm the user input to search for
   * @returns an arary of directory members corresponding to the uesrs search
   */
  const handleSearch = useCallback(
    (searchTerm: string): IUser[] => {
      let searchedDirectory = [...directory];

      searchedDirectory = directory.filter((user: IUser) => {
        let firstName = user.firstName;
        let lastName = user.lastName;
        let email = user.email;

        if (firstName === null) {
          firstName = '';
        }
        if (lastName === null) {
          lastName = '';
        }
        if (email === null) {
          email = '';
        }

        return (
          firstName.includes(searchTerm) ||
          lastName.includes(searchTerm) ||
          email.includes(searchTerm)
        );
      });

      return searchedDirectory;
    },
    [directory],
  );

  /**
   * Adds a 1 second delay before searching
   */
  useEffect(() => {
    if (searchTerm === null || searchTerm === undefined || searchTerm === '') {
      setSearchedDirectory(directory);
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);

    const delaySearch = setTimeout(() => {
      setSearchedDirectory([...handleSearch(searchTerm)]);
      setSearchLoading(false);
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchTerm, directory, handleSearch]);

  /**
   * Recevies a directory and filters it with all of the selected keys
   *
   * @param directory the full directory of SSW users
   * @returns a filtered directory
   */
  const handleDirectoryFilter = (directory: IUser[]): IUser[] => {
    if (isFilterKeysEmpty()) {
      return directory;
    }

    let filteredDirectory = [...directory];

    const isAscending = filterKeys.date === 'Earliest to Latest';

    filteredDirectory = sortUsersByDate(isAscending, filteredDirectory);
    filteredDirectory = filterUsersByRole(filterKeys.role, filteredDirectory);
    filteredDirectory = filterUsersByInterests(
      filterKeys.interests,
      filteredDirectory,
    );
    // TODO: add filter by teams

    return filteredDirectory;
  };

  /**
   * Updates the filter key state
   *
   * @param filterKey the filter key to update
   * @param newValue the new value to set the filter key's value to
   */
  const updateFilterKeys = (
    filterKey: keyof IFilterKeys,
    newValue: string | string[],
  ): void => {
    const currentFilterKeys: IFilterKeys = { ...filterKeys };

    switch (filterKey) {
      case 'role':
      case 'date':
        currentFilterKeys[filterKey] = `${newValue}`;
        break;
      case 'interests':
      case 'teams':
        if (Array.isArray(newValue)) {
          currentFilterKeys[filterKey] = newValue;
        }
        break;
      default:
        console.error('Invalid filter key');
        break;
    }

    setFilterKeys({ ...currentFilterKeys });
  };

  /**
   * Parses a semantic multi select into the filter key usable types
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
   * Determines if the filter state is empty
   *
   * @returns true if filter keys are empty, else false
   */
  const isFilterKeysEmpty = (): boolean =>
    filterKeys.role === '' &&
    filterKeys.date === '' &&
    filterKeys.interests.length === 0 &&
    filterKeys.teams.length === 0;

  /**
   * Sorts all of the users in the directory by date
   *
   * @param isAscending the filter string representation, Earliest to Latest, Latest to Earliest, [empty]
   */
  const sortUsersByDate = (
    isAscending: boolean,
    directory: IUser[],
  ): IUser[] => {
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
   * Filters out the users that have the specified role
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
   * Filters out the users that have any of the selected interests
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

    filteredDirectory = filteredDirectory.filter(function (user: IUser) {
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
   * Opens the contributor modal for a specific user
   *
   * @param user ther current modal user
   */
  const openContributorModal = (user: IUser): void => {
    if (user) {
      history.push('/profile');
    }
  };

  return (
    <>
      <Sidebar />
      <div className="directory-wrapper">
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <img src={SSW} alt="South Side Weekly" style={{ width: '50%' }} />
        </div>
        <div className="directory-content">
          <h2>Directory</h2>
          <div className="directory-search">
            <Input
              onChange={(e) => setSearchTerm(e.target.value)}
              icon="search"
              loading={searchLoading}
            />
          </div>
          <div className="filters">
            <h2>Filter by: </h2>
            <Dropdown
              className="custom-dropdown"
              text="Roles"
              options={roleOptions}
              scrolling
              clearable
              selectOnBlur={false}
              selectOnNavigation={false}
              onChange={(e, { value }) => updateFilterKeys('role', `${value}`)}
            />
            <Dropdown
              className="custom-dropdown"
              text="Date Joined"
              options={dateOptions}
              scrolling
              clearable
              selectOnNavigation={false}
              selectOnBlur={false}
              onChange={(e, { value }) => updateFilterKeys('date', `${value}`)}
            />
            <Dropdown
              className="custom-dropdown"
              text="Interests"
              options={interestOptions}
              scrolling
              multiple
              clearable
              selectOnNavigation={false}
              selectOnBlur={false}
              onChange={(e, { value }) =>
                updateFilterKeys(
                  'interests',
                  parseSemanticMultiSelectTypes(value!),
                )
              }
            />
          </div>
          <div className="directory">
            {handleDirectoryFilter(searchedDirectory).map((user) => (
              <Button
                onClick={() => openContributorModal(user)}
                key={user.oauthID}
                className="result"
              >
                <img
                  src={user.profilePic}
                  alt="Profile"
                  className="profile-picture"
                />
                <h2 className="text name">{`${user.firstName} ${user.lastName}`}</h2>
                <h2 className="text end">
                  {user.role.slice(0, 1) + user.role.slice(1).toLowerCase()}
                </h2>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Directory;
