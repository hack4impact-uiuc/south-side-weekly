import React, {
  useEffect,
  useState,
  ReactElement,
  useMemo,
  useReducer,
  useCallback,
} from 'react';
import { IPitch } from 'ssw-common';
import { Button, Dropdown, Input } from 'semantic-ui-react';

import { pages } from '../../utils/enums';
import {
  parseArrayToSemanticDropdownOptions,
  parseSemanticMultiSelectTypes,
  filterPitchesByClaimStatus,
  filterPitchesByInterests,
  filterPitchesByTeams,
  sortPitchesByDeadlineDate,
} from '../../utils/helpers';
import Sidebar from '../../components/Sidebar';
import {
  getApprovedPitches,
  isError,
  getCurrentUser,
  getPendingPitches,
  getPendingContributorPitches,
} from '../../api';
import PitchGrid from '../../components/PitchDoc/PitchGrid';
import SubmitPitchModal from '../../components/PitchDoc/SubmitPitchModal';
import Logo from '../../assets/ssw-form-header.png';

import '../../css/pitchDoc/PitchDoc.css';

interface IFilterKeys {
  teams: string[];
  date: string;
  interests: string[];
  status: string;
}

interface ISearchState {
  pitches: IPitch[];
  query: string;
  isLoading: boolean;
}

interface ISearchAction {
  type: SearchAction;
  query: string;
  pitches: IPitch[];
}

const initialFilterKeys: IFilterKeys = {
  date: '',
  status: '',
  teams: [],
  interests: [],
};

enum SearchAction {
  CLEAN_QUERY = 'CLEAN_QUERY',
  INITIALIZE_PITCHES = 'INITIALIZE_USERS',
  START_SEARCH = 'START_SEARCH',
  UPDATE_QUERY = 'UPDATE_QUERY',
  FINISH_SEARCH = 'FINISH_SEARCH',
}

const tabs = [
  'Unclaimed Pitches',
  'Pitches Pending Approval',
  'Claims Pending Approval',
];

const initialSearchState: ISearchState = {
  pitches: [],
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
  action: ISearchAction,
): ISearchState => {
  switch (action.type) {
    case 'CLEAN_QUERY':
      return initialSearchState;
    case 'INITIALIZE_USERS':
      return { ...state, pitches: action.pitches };
    case 'START_SEARCH':
      return { ...state, isLoading: true, query: action.query };
    case 'UPDATE_QUERY':
      return { ...state, query: action.query };
    case 'FINISH_SEARCH':
      return { ...state, isLoading: false, pitches: action.pitches };
    default:
      throw new Error();
  }
};

function PitchDoc(): ReactElement {
  const [displayedCards, setDisplayedCards] = useState<IPitch[]>([]);
  const [unclaimedPitches, setUnclaimedPitches] = useState<IPitch[]>([]);
  const [pendingPitches, setPendingPitches] = useState<IPitch[]>([]);
  const [pendingContributors, setPendingContributors] = useState<IPitch[]>([]);
  const [filterKeys, setFilterKeys] = useState<IFilterKeys>(initialFilterKeys);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<string>(tabs[1]);

  const [searchState, dispatchSearch] = useReducer(
    searchReducer,
    initialSearchState,
  );

  const getAllUnclaimedPitches = useCallback(async (): Promise<void> => {
    console.log('here');
    const unclaimedPitchesResp = await getApprovedPitches();
    let pendingPitchesResp;
    let pendingContributorsResp;

    let tempPitches: IPitch[] = [];
    if (!isError(unclaimedPitchesResp) && unclaimedPitchesResp.data) {
      tempPitches = unclaimedPitchesResp.data.result;
      setUnclaimedPitches(unclaimedPitchesResp.data.result);
    }

    if (isAdmin) {
      pendingPitchesResp = await getPendingPitches();
      pendingContributorsResp = await getPendingContributorPitches();

      if (
        !isError(pendingPitchesResp) &&
        !isError(pendingContributorsResp) &&
        pendingPitchesResp.data &&
        pendingContributorsResp.data
      ) {
        setPendingPitches(pendingPitchesResp.data.result);
        setPendingContributors(pendingContributorsResp.data.result);
        setDisplayedCards(pendingPitchesResp.data.result);
      }
    } else {
      setDisplayedCards(tempPitches);
    }
  }, [isAdmin]);

  useEffect(() => {
    const getUser = async (): Promise<void> => {
      const res = await getCurrentUser();

      if (!isError(res) && res.data.result.role === 'ADMIN') {
        setIsAdmin(true);
      }
    };

    getUser();
    getAllUnclaimedPitches();
  }, [getAllUnclaimedPitches]);

  const teamOptions = useMemo(
    () =>
      parseArrayToSemanticDropdownOptions([
        'Editors',
        'Writing',
        'Fact-Checking',
        'Illustration',
        'Visuals',
        'Photography',
      ]),
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
    () =>
      parseArrayToSemanticDropdownOptions([
        'Cannabis',
        'Education',
        'Food & Land',
        'Fun',
        'Health',
        'Housing',
        'Immigration',
        'Lit',
        'Music',
        'Nature',
        'Politics',
        'Stage and Screen',
        'Transportation',
        'Visual Arts',
      ]),
    [],
  );

  const claimOptios = useMemo(
    () => parseArrayToSemanticDropdownOptions(['Unclaimed', 'Claimed']),
    [],
  );

  /**
   * Calls /pitch api through api wrapper to get ALL pitches
   */
  const handleSearch = useCallback(
    (searchTerm: string): IPitch[] => {
      let searchPitches = [...displayedCards];
      searchTerm = searchTerm.toLowerCase().trim();

      searchPitches = displayedCards.filter((pitch: IPitch) => {
        // Avoid null fields in database
        const pitchName = pitch.name ? pitch.name.toLowerCase() : '';
        return pitchName.includes(searchTerm);
      });

      return searchPitches;
    },
    [displayedCards],
  );

  /**
   * Delay before searching.
   */
  useEffect(() => {
    if (searchState.query === '') {
      dispatchSearch({
        type: SearchAction.FINISH_SEARCH,
        query: '',
        pitches: displayedCards,
      });
      return;
    }

    dispatchSearch({
      type: SearchAction.START_SEARCH,
      query: searchState.query,
      pitches: [],
    });

    const millisecondDelay = 500;

    const delaySearch = setTimeout(() => {
      const pitches = [...handleSearch(searchState.query)];

      dispatchSearch({
        type: SearchAction.FINISH_SEARCH,
        query: searchState.query,
        pitches: pitches,
      });
    }, millisecondDelay);

    return () => clearTimeout(delaySearch);
  }, [searchState.query, displayedCards, handleSearch]);

  /**
   * Filters a set of pitches passed in
   *
   * @param pitches the passed in pitches
   * @returns the filtered list of pitches
   */
  const handlePitchDocFiltering = (pitches: IPitch[]): IPitch[] => {
    if (isFilterKeysEmpty()) {
      return pitches;
    }

    let filteredPitches = [...pitches];

    const isAscending = filterKeys.date === 'Earliest to Latest';

    filteredPitches = sortPitchesByDeadlineDate(isAscending, filteredPitches);

    filteredPitches = filterPitchesByTeams(filterKeys.teams, filteredPitches);
    filteredPitches = filterPitchesByInterests(
      filterKeys.interests,
      filteredPitches,
    );

    filteredPitches = filterPitchesByClaimStatus(
      filterKeys.status,
      filteredPitches,
      filterKeys.teams,
    );

    return filteredPitches;
  };

  /**
   * Determines if the filter state is empty.
   *
   * @returns true if filter keys are empty, else false
   */
  const isFilterKeysEmpty = (): boolean =>
    filterKeys.status === '' &&
    filterKeys.date === '' &&
    filterKeys.interests.length === 0 &&
    filterKeys.teams.length === 0;

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
      case 'date':
      case 'status':
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

  // Handles the admin changing tabs and changes the cards displayed
  useEffect(() => {
    if (currentTab === tabs[0]) {
      setDisplayedCards(unclaimedPitches);
    } else if (currentTab === tabs[1]) {
      setDisplayedCards(pendingPitches);
    } else if (currentTab === tabs[2]) {
      setDisplayedCards(pendingContributors);
    }
  }, [currentTab, unclaimedPitches, pendingPitches, pendingContributors]);

  return (
    <>
      <Sidebar currentPage={pages.PITCHES} />
      <div className="logo-header">
        <img className="logo" alt="SSW Logo" src={Logo} />
      </div>

      <div className="content-wrapper">
        <div className="top-section">
          <div className="pitchdoc-title">
            {isAdmin ? 'Pitch Approval' : 'The Pitch Doc'}
          </div>

          {isAdmin ? (
            <div className="buttons-section">
              <Button
                className={`admin-pitch-tab ${
                  currentTab === tabs[0] && 'active'
                }`}
                onClick={() => setCurrentTab(tabs[0])}
              >
                {tabs[0]}
              </Button>
              <Button
                className={`admin-pitch-tab ${
                  currentTab === tabs[1] && 'active'
                }`}
                onClick={() => setCurrentTab(tabs[1])}
              >
                {tabs[1]}: {pendingPitches.length}
              </Button>
              <Button
                className={`admin-pitch-tab ${
                  currentTab === tabs[2] && 'active'
                }`}
                onClick={() => setCurrentTab(tabs[2])}
              >
                {tabs[2]}
              </Button>
            </div>
          ) : (
            ''
          )}

          <div className="submit-search-section">
            {isAdmin ? (
              ''
            ) : (
              <span>
                <SubmitPitchModal />
              </span>
            )}
            <div className="pitch-search">
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
          </div>

          <div className="container">
            <div className="filters">
              <h2>Filter by: </h2>
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
                  updateFilterKeys(
                    'teams',
                    parseSemanticMultiSelectTypes(value!),
                  )
                }
              />
              <Dropdown
                className="custom-dropdown"
                text="Date Joined"
                options={dateOptions}
                scrolling
                clearable
                selectOnNavigation={false}
                selectOnBlur={false}
                onChange={(e, { value }) =>
                  updateFilterKeys('date', `${value}`)
                }
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
                text="Claim Status"
                options={claimOptios}
                scrolling
                clearable
                selectOnNavigation={false}
                selectOnBlur={false}
                onChange={(e, { value }) =>
                  updateFilterKeys('status', `${value}`)
                }
              />
            </div>
          </div>

          {isAdmin ? <h2>Approve Contributor Pitches:</h2> : ''}
        </div>

        <div className="pitch-grid">
          <PitchGrid
            pitches={handlePitchDocFiltering(searchState.pitches)}
            getAllUnclaimedPitches={getAllUnclaimedPitches}
          />
        </div>
      </div>
    </>
  );
}

export default PitchDoc;
