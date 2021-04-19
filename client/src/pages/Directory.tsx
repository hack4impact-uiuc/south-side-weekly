import React, {
  ReactElement,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { Dropdown, Button, Input } from 'semantic-ui-react';

import { IUser } from '../../../common/index';
import { getUsers, isError } from '../utils/apiWrapper';
import Sidebar from '../components/Sidebar';
import SSW from '../assets/ssw-form-header.png';
import '../css/Directory.css';
import UserModal from '../components/UserModal/UserModal';
import { pages } from '../utils/enums';

interface IFilterKeys {
  role: string;
  date: string;
  interests: string[];
  teams: string[];
}

interface ISearchState {
  users: IUser[];
  query: string;
  isLoading: boolean;
}

interface ISearchAction {
  type: SearchAction;
  query: string;
  users: IUser[];
}

interface IModalState {
  isOpen: boolean;
  user?: IUser;
}

interface IModalAction {
  type: ModalAction;
  isOpen: boolean;
  user?: IUser;
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

const teamOptions = [
  { key: 1, text: 'Editing', value: 'Editing' },
  { key: 2, text: 'Writing', value: 'Writing' },
  { key: 3, text: 'Fact-Checking', value: 'Fact-Checking' },
  { key: 4, text: 'Illustration', value: 'Illustration' },
  { key: 5, text: 'Visuals', value: 'Visuals' },
  { key: 6, text: 'Photography', value: 'Photography' },
];

enum SearchAction {
  CLEAN_QUERY = 'CLEAN_QUERY',
  INITIALIZE_USERS = 'INITIALIZE_USERS',
  START_SEARCH = 'START_SEARCH',
  UPDATE_QUERY = 'UPDATE_QUERY',
  FINISH_SEARCH = 'FINISH_SEARCH',
}

const initialSearchState: ISearchState = {
  users: [],
  query: '',
  isLoading: false,
};

const searchReducer = (
  state: ISearchState,
  action: ISearchAction,
): ISearchState => {
  switch (action.type) {
    case 'CLEAN_QUERY':
      return initialSearchState;
    case 'INITIALIZE_USERS':
      return { ...state, users: action.users };
    case 'START_SEARCH':
      return { ...state, isLoading: true, query: action.query };
    case 'UPDATE_QUERY':
      return { ...state, query: action.query };
    case 'FINISH_SEARCH':
      return { ...state, isLoading: false, users: action.users };
    default:
      throw new Error();
  }
};

enum ModalAction {
  OPEN_MODAL = 'OPEN_MODAL',
  CLOSE_MODAL = 'CLOSE_MODAL',
}

const initialModalState: IModalState = {
  isOpen: false,
  user: undefined,
};

const modalReducer = (
  state: IModalState,
  action: IModalAction,
): IModalState => {
  switch (action.type) {
    case 'OPEN_MODAL':
      return { isOpen: true, user: action.user };
    case 'CLOSE_MODAL':
      return { isOpen: false };
    default:
      throw new Error();
  }
};

const Directory = (): ReactElement => {
  const [directory, setDirectory] = useState<IUser[]>([]);

  const [searchState, dispatchSearch] = useReducer(
    searchReducer,
    initialSearchState,
  );

  const [modalState, dispatchModal] = useReducer(
    modalReducer,
    initialModalState,
  );

  const [filterKeys, setFilterKeys] = useState<IFilterKeys>(initialFilterKeys);

  /**
   * Populated the directory and connect to the API
   */
  useEffect(() => {
    const populateDirectory = async (): Promise<void> => {
      const resp = await getUsers();

      if (!isError(resp)) {
        setDirectory(resp.data.result);
        // setSearchedDirectory(resp.data.result);
        dispatchSearch({
          type: SearchAction.INITIALIZE_USERS,
          query: '',
          users: resp.data.result,
        });
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
        // Avoid null fields in database
        const firstName = user.firstName ? user.firstName : '';
        const lastName = user.lastName ? user.lastName : '';
        const email = user.email ? user.email : '';

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
   * Delay before searching
   */
  useEffect(() => {
    if (
      searchState.query === null ||
      searchState.query === undefined ||
      searchState.query === ''
    ) {
      dispatchSearch({
        type: SearchAction.FINISH_SEARCH,
        query: '',
        users: directory,
      });
      return;
    }

    dispatchSearch({
      type: SearchAction.START_SEARCH,
      query: searchState.query,
      users: [],
    });

    const millisecondDelay = 500;

    const delaySearch = setTimeout(() => {
      const users = [...handleSearch(searchState.query)];

      dispatchSearch({
        type: SearchAction.FINISH_SEARCH,
        query: searchState.query,
        users: users,
      });
    }, millisecondDelay);

    return () => clearTimeout(delaySearch);
  }, [searchState.query, directory, handleSearch]);

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
    filteredDirectory = filterUsersByTeams(filterKeys.teams, filteredDirectory);

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
   * Filters out the users that have any of the selected teams
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
   * Opens the contributor modal for a specific user
   *
   * @param user ther current modal user
   */
  const openContributorModal = (user: IUser): void => {
    if (user) {
      dispatchModal({ type: ModalAction.OPEN_MODAL, isOpen: true, user: user });
      console.log(modalState.isOpen);
    }
  };

  const closeContributorModal = (): void => {
    dispatchModal({
      type: ModalAction.CLOSE_MODAL,
      isOpen: false,
      user: modalState.user,
    });
  };

  return (
    <>
      {modalState.user !== undefined && (
        <UserModal
          open={modalState.isOpen}
          handleClose={closeContributorModal}
          user={modalState.user!}
        />
      )}
      <Sidebar currentPage={pages.USERS} />
      <div className="directory-wrapper">
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <img src={SSW} alt="South Side Weekly" style={{ width: '50%' }} />
        </div>
        <div className="directory-content">
          <h2>Directory</h2>
          <div className="directory-search">
            <Input
              onChange={(e) =>
                dispatchSearch({
                  ...searchState,
                  type: SearchAction.UPDATE_QUERY,
                  query: e.currentTarget.value,
                })
              }
              icon="search"
              loading={searchState.isLoading}
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
              text="Topics of Interest"
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
            <Dropdown
              className="custom-dropdown"
              text="Teams"
              options={teamOptions}
              scrolling
              multiple
              clearable
              selectOnNavigation={false}
              selectOnBlur={false}
              onChange={(e, { value }) =>
                updateFilterKeys('teams', parseSemanticMultiSelectTypes(value!))
              }
            />
          </div>
          <div className="directory">
            {handleDirectoryFilter(searchState.users).map((user) => (
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
                <h2 className="text">
                  {/* Capitalize the first letter */}
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
