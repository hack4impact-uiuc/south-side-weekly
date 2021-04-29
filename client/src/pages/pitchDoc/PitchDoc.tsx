import React, {
  useEffect,
  useState,
  ReactElement,
  useMemo,
  useReducer,
  useCallback,
} from 'react';
import { IPitch } from 'ssw-common';
import { Dropdown, Input } from 'semantic-ui-react';

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
import { getPitches, isError } from '../../utils/apiWrapper';
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
  const [unclaimedPitches, setUnclaimedPitches] = useState<IPitch[]>([]);
  const [filterKeys, setFilterKeys] = useState<IFilterKeys>(initialFilterKeys);

  const [searchState, dispatchSearch] = useReducer(
    searchReducer,
    initialSearchState,
  );

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
  const getAllUnclaimedPitches = async (): Promise<void> => {
    const resp = await getPitches();

    if (!isError(resp) && resp.data) {
      setUnclaimedPitches(resp.data.result);
    }
  };

  useEffect(() => {
    getAllUnclaimedPitches();
  }, []);

  /**
   * Searches through all of the pitches to find pitches by name
   */
  const handleSearch = useCallback(
    (searchTerm: string): IPitch[] => {
      let searchPitches = [...unclaimedPitches];
      searchTerm = searchTerm.toLowerCase().trim();

      console.log(searchTerm);

      searchPitches = unclaimedPitches.filter((pitch: IPitch) => {
        // Avoid null fields in database
        const pitchName = pitch.name ? pitch.name.toLowerCase() : '';
        console.log(pitchName);
        return pitchName.includes(searchTerm);
      });

      console.log(searchPitches);
      return searchPitches;
    },
    [unclaimedPitches],
  );

  /**
   * Delay before searching.
   */
  useEffect(() => {
    if (searchState.query === '') {
      dispatchSearch({
        type: SearchAction.FINISH_SEARCH,
        query: '',
        pitches: unclaimedPitches,
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
  }, [searchState.query, unclaimedPitches, handleSearch]);

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

  return (
    <>
      <Sidebar currentPage={pages.PITCHES} />
      <div className="logo-header">
        <img className="logo" alt="SSW Logo" src={Logo} />
      </div>

      <div className="content-wrapper">
        <div className="top-section">
          <div className="pitchdoc-title">The Pitch Doc</div>
          <div className="submit-search-section">
            <SubmitPitchModal />
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
