import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import { Dropdown, Button, Input } from 'semantic-ui-react';
import { IUser } from 'ssw-common';

import Sidebar from '../../components/Sidebar';
import UserModal from '../../components/UserModal/UserModal';
import { getUsers, isError } from '../../api';
import { pages } from '../../utils/enums';
import {
  parseArrayToSemanticDropdownOptions,
  parseSemanticMultiSelectTypes,
  sortUsersByDate,
  filterUsersByInterests,
  filterUsersByRole,
  filterUsersByTeams,
  getUserFirstName,
} from '../../utils/helpers';
import SSW from '../../assets/ssw-form-header.png';
import DefaultProfile from '../../assets/default_profile.png';
import './styles.css';
import { allInterests, allRoles, allTeams } from '../../utils/constants';

import {
  IFilterKeys,
  ISearchAction,
  ISearchState,
  IModalAction,
  IModalState,
} from './types';

const initialFilterKeys = {
  role: '',
  date: '',
  interests: [],
  teams: [],
};

enum SearchAction {
  CLEAN_QUERY = 'CLEAN_QUERY',
  INITIALIZE_USERS = 'INITIALIZE_USERS',
  START_SEARCH = 'START_SEARCH',
  UPDATE_QUERY = 'UPDATE_QUERY',
  FINISH_SEARCH = 'FINISH_SEARCH',
}

const initialSearchState = {
  users: [],
  query: '',
  isLoading: false,
};

/**
 * Reducer for the search state.
 *
 * @param state the current state of the search
 * @param action the action to perform on the search state
 * @returns new search state
 */
const searchReducer = (
  state: ISearchState,
  action: ISearchAction<SearchAction>,
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

const initialModalState = {
  isOpen: false,
  user: undefined,
};

/**
 * Reducer for the modal state.
 *
 * @param state the state of the current modal
 * @param action the action to perform on the modal state
 * @returns new modal state
 */
const modalReducer = (
  state: IModalState,
  action: IModalAction<ModalAction>,
): IModalState => {
  switch (action.type) {
    case 'OPEN_MODAL':
      return { isOpen: true, user: action.user };
    case 'CLOSE_MODAL':
      return { ...state, isOpen: false };
    default:
      throw new Error();
  }
};

const Directory = (): ReactElement => {
  const [directory, setDirectory] = useState<IUser[]>([]);
  const [filterKeys, setFilterKeys] = useState<IFilterKeys>(initialFilterKeys);
  const [searchState, dispatchSearch] = useReducer(
    searchReducer,
    initialSearchState,
  );
  const [modalState, dispatchModal] = useReducer(
    modalReducer,
    initialModalState,
  );

  const roleOptions = useMemo(
    () => parseArrayToSemanticDropdownOptions(allRoles),
    [],
  );
  const dateOptions = useMemo(
    () =>
      parseArrayToSemanticDropdownOptions([
        'Earliest to Latest',
        'Latest to Earliest',
      ]),
    [],
  );
  const interestOptions = useMemo(
    () => parseArrayToSemanticDropdownOptions(allInterests),
    [],
  );
  const teamOptions = useMemo(
    () => parseArrayToSemanticDropdownOptions(allTeams),
    [],
  );

  /**
   * Populated the directory and connect to the API.
   */
  useEffect(() => {
    const populateDirectory = async (): Promise<void> => {
      const resp = await getUsers();

      if (!isError(resp)) {
        setDirectory(resp.data.result);

        // Initializes the search state of the users to start with all of the users
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
   * email contains the search term.
   *
   * Callback prevents infinite re-rendering with the useEffect hook.
   *
   * @param searchTerm the user input to search for
   * @returns an arary of directory members corresponding to the uesrs search
   */
  const handleSearch = useCallback(
    (searchTerm: string): IUser[] => {
      let searchedDirectory = [...directory];
      searchTerm = searchTerm.toLowerCase().trim();

      searchedDirectory = directory.filter((user: IUser) => {
        // Avoid null fields in database
        const firstName = user.firstName ? user.firstName.toLowerCase() : '';
        const preferredName = user.preferredName ? user.preferredName : '';
        const lastName = user.lastName ? user.lastName.toLowerCase() : '';
        const email = user.email ? user.email.toLowerCase() : '';
        const fullName = `${firstName} ${lastName}`.toLowerCase();
        const fullPreferredName = `${preferredName} ${lastName}`.toLowerCase();

        return (
          firstName.includes(searchTerm) ||
          preferredName.includes(searchTerm) ||
          lastName.includes(searchTerm) ||
          email.includes(searchTerm) ||
          fullName.includes(searchTerm) ||
          fullPreferredName.includes(searchTerm)
        );
      });

      return searchedDirectory;
    },
    [directory],
  );

  /**
   * Delay before searching.
   */
  useEffect(() => {
    if (searchState.query === '') {
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
   * Recieves a directory and filters it with all of the selected keys.
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
   * Updates the filter key state.
   *
   * @param key the filter key to update
   * @param newValue the new value to set the filter key's value to
   */
  const updateFilterKeys = (
    key: keyof IFilterKeys,
    newValue: string | string[],
  ): void => {
    const keys: IFilterKeys = { ...filterKeys };

    switch (key) {
      case 'role':
      case 'date':
        keys[key] = `${newValue}`;
        break;
      case 'interests':
      case 'teams':
        if (Array.isArray(newValue)) {
          keys[key] = newValue;
        }
        break;
      default:
        console.error('Invalid filter key');
        break;
    }

    setFilterKeys({ ...keys });
  };

  /**
   * Determines if the filter state is empty.
   *
   * @returns true if filter keys are empty, else false
   */
  const isFilterKeysEmpty = (): boolean =>
    filterKeys.role === '' &&
    filterKeys.date === '' &&
    filterKeys.interests.length === 0 &&
    filterKeys.teams.length === 0;

  /**
   * Opens the contributor modal for a specific user.
   *
   * @param user ther current modal user
   */
  const openContributorModal = (user: IUser): void => {
    if (user) {
      dispatchModal({ type: ModalAction.OPEN_MODAL, isOpen: true, user: user });
    }
  };

  /**
   * Closes the contributor modal
   */
  const closeContributorModal = (): void => {
    dispatchModal({
      type: ModalAction.CLOSE_MODAL,
      isOpen: false,
      user: modalState.user,
    });
  };

  return (
    <>
      {modalState.user && (
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
                  src={user.profilePic ? user.profilePic : DefaultProfile}
                  alt="Profile"
                  className="profile-picture"
                />
                <h2 className="text name">{`${getUserFirstName(user)} ${
                  user.lastName
                }`}</h2>
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
