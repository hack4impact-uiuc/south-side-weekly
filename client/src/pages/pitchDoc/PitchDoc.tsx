import React, { useEffect, useState, ReactElement, useMemo } from 'react';
import { IPitch } from 'ssw-common';
import { Dropdown, Search } from 'semantic-ui-react';

import { pages } from '../../utils/enums';
import {
  parseArrayToSemanticDropdownOptions,
  parseSemanticMultiSelectTypes,
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

const initialFilterKeys: IFilterKeys = {
  date: '',
  status: '',
  teams: [],
  interests: [],
};

function PitchDoc(): ReactElement {
  const [unclaimedPitches, setUnclaimedPitches] = useState<IPitch[]>([]);
  const [filterKeys, setFilterKeys] = useState<IFilterKeys>(initialFilterKeys);

  const teamOptions = useMemo(
    () =>
      parseArrayToSemanticDropdownOptions([
        'Editing',
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

  const getAllUnclaimedPitches = async (): Promise<void> => {
    const resp = await getPitches();

    if (!isError(resp) && resp.data) {
      setUnclaimedPitches(resp.data.result);
    }
  };

  useEffect(() => {
    getAllUnclaimedPitches();
  }, []);

  const handlePitchDocFiltering = (pitches: IPitch[]): IPitch[] => {
    if (isFilterKeysEmpty()) {
      return pitches;
    }

    let filteredPitches = [...pitches];

    const isAscending = filterKeys.date === 'Earliest to Latest';

    filteredPitches = sortPitchesByDate(isAscending, filteredPitches);
    filteredPitches = filterPitchesByTeams(filterKeys.teams, filteredPitches);
    console.log(filteredPitches);
    filteredPitches = filterPitchesByInterests(
      filterKeys.interests,
      filteredPitches,
    );
    filteredPitches = filterPitchesByClaimStatus(
      filterKeys.status,
      filteredPitches,
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

  /**
   * Filters out the pitches that have any of the selected teams.
   *
   * @param teams the interests to filter by
   * @param pitches the pitches to filter
   */
  const filterPitchesByTeams = (
    teams: string[],
    pitches: IPitch[],
  ): IPitch[] => {
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
   *
   * @param pitch
   * @returns
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

  const sortPitchesByDate = (
    isAscending: boolean,
    directory: IPitch[],
  ): IPitch[] => {
    const sortedDirectory = [...directory];

    sortedDirectory.sort((first: IPitch, second: IPitch): number => {
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

    return sortedDirectory;
  };

  const filterPitchesByInterests = (
    interests: string[],
    pitches: IPitch[],
  ): IPitch[] => {
    if (typeof interests !== 'object' || interests.length === 0) {
      return pitches;
    }

    let filteredDirectory = [...pitches];

    filteredDirectory = filteredDirectory.filter((pitch: IPitch) => {
      let hasInterest = true;

      interests.forEach((interest) => {
        if (!pitch.topics.includes(interest.toString().toUpperCase())) {
          hasInterest = false;
        }
      });

      return hasInterest;
    });

    return filteredDirectory;
  };

  const filterPitchesByClaimStatus = (
    claimStatus: string,
    pitches: IPitch[],
  ): IPitch[] => {
    if (claimStatus === '') {
      return pitches;
    }

    let filteredDirectory = [...pitches];

    filteredDirectory = filteredDirectory.filter((pitch: IPitch) => {
      if (claimStatus === 'Claimed') {
        return isPitchClaimed(pitch);
      } else if (claimStatus === 'Unclaimed') {
        return !isPitchClaimed(pitch);
      }
    });

    return filteredDirectory;
  };

  const isPitchClaimed = (pitch: IPitch): boolean => {
    const pitchTeams = Object.entries(pitch.teams);
    let isClaimed = true;

    pitchTeams.forEach((team) => {
      const assignments = team[1];

      if (assignments.current < assignments.target) {
        // Cannot return early in for each loop
        isClaimed = false;
      }
    });

    return isClaimed;
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
            <Search className="search-bar"> </Search>
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
            pitches={handlePitchDocFiltering(unclaimedPitches)}
            getAllUnclaimedPitches={getAllUnclaimedPitches}
          />
        </div>
      </div>
    </>
  );
}

export default PitchDoc;
