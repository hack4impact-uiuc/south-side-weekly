import { isEqual, startsWith, toArray, toLower, toString } from 'lodash';
import React, {
  ReactElement,
  SyntheticEvent,
  useEffect,
  useState,
} from 'react';
import { DropdownProps, Input, Menu } from 'semantic-ui-react';
import { IPitch } from 'ssw-common';

import {
  getApprovedPitches,
  getPendingContributorPitches,
  getPitchesPendingApproval,
  getUnclaimedPitches,
  isError,
} from '../../api';
import {
  PitchCard,
  SubmitPitchModal,
  StaffView,
  AdminView,
  ClaimPitchModal,
  FilterDropdown,
  ApprovePitchModal,
} from '../../components';
import { useAuth } from '../../contexts';
import { allInterests, allTeams } from '../../utils/constants';
import { parseOptions } from '../../utils/helpers';

import {
  filterInterests,
  filterClaimStatus,
  filterTeams,
  sortPitches,
} from './helpers';

import './styles.scss';

const dateOptions = ['Earliest to Latest', 'Latest to Earliest'];

const searchFields: (keyof IPitch)[] = ['title'];
const TABS = {
  UNCLAIMED: 'Unclaimed Pitches',
  PITCH_APPROVAL: 'Pitches Pending Approval',
  CLAIM_APPROVAL: 'Claims Pending Approval',
  APPROVED: 'Approved Pitches',
};

const PitchDoc = (): ReactElement => {
  const [approved, setApproved] = useState<IPitch[]>([]);
  const [unclaimed, setUnclaimed] = useState<IPitch[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<IPitch[]>([]);
  const [pendingClaims, setPendingClaims] = useState<IPitch[]>([]);
  const [currentTab, setCurrentTab] = useState(TABS.UNCLAIMED);

  const [currentPitches, setCurrentPitches] = useState<IPitch[]>([]);
  const [filteredPitches, setFilteredPitches] = useState<IPitch[]>([]);

  const [claimStatus, setClaimStatus] = useState<string>('');
  const [sort, setSort] = useState<'increase' | 'decrease' | 'none'>('none');
  const [interests, setInterests] = useState<string[]>([]);
  const [teams, setTeams] = useState<string[]>([]);
  const [query, setQuery] = useState('');

  const { isAdmin, isStaff } = useAuth();

  const getApproved = async (): Promise<void> => {
    const res = await getApprovedPitches();

    if (!isError(res)) {
      setApproved(res.data.result);
    }
  };

  const getUnclaimed = async (): Promise<void> => {
    const res = await getUnclaimedPitches();

    if (!isError(res)) {
      setUnclaimed(res.data.result);
      setCurrentPitches(res.data.result);
      setFilteredPitches(res.data.result);
    }
  };

  const getPendingApprovals = async (): Promise<void> => {
    const res = await getPitchesPendingApproval();

    if (!isError(res)) {
      setPendingApprovals(res.data.result);
    }
  };

  const getPendingClaims = async (): Promise<void> => {
    const res = await getPendingContributorPitches();

    if (!isError(res)) {
      setPendingClaims(res.data.result);
    }
  };

  useEffect(() => {
    setCurrentTab(TABS.UNCLAIMED);
    getUnclaimed();
    getApproved();

    if (isStaff || isAdmin) {
      getPendingApprovals();
    }

    if (isAdmin) {
      getPendingClaims();
    }

    return () => {
      setUnclaimed([]);
      setApproved([]);
      setPendingApprovals([]);
      setPendingClaims([]);
      setFilteredPitches([]);
      setCurrentPitches([]);
    };
  }, [isAdmin, isStaff]);

  useEffect(() => {
    const search = (pitches: IPitch[]): IPitch[] => {
      if (query.length === 0) {
        return pitches;
      }

      const searchTerm = toLower(query.trim());

      return pitches.filter((pitch) =>
        searchFields.some((field) =>
          startsWith(toLower(toString(pitch[field])), searchTerm),
        ),
      );
    };

    const filter = (pitches: IPitch[]): IPitch[] => {
      let filtered = filterInterests(pitches, interests);
      filtered = filterClaimStatus(filtered, claimStatus);
      filtered = filterTeams(filtered, teams);
      filtered = sortPitches(filtered, sort);

      return filtered;
    };

    setFilteredPitches([...search(filter(currentPitches))]);
  }, [currentPitches, query, interests, teams, claimStatus, sort]);

  useEffect(() => {
    if (currentTab !== TABS.APPROVED) {
      setClaimStatus('');
    }

    if (currentTab === TABS.UNCLAIMED) {
      setCurrentPitches(unclaimed);
    } else if (currentTab === TABS.PITCH_APPROVAL) {
      setCurrentPitches(pendingApprovals);
    } else if (currentTab === TABS.CLAIM_APPROVAL) {
      setCurrentPitches(pendingClaims);
    } else if (currentTab === TABS.APPROVED) {
      setCurrentPitches(approved);
    }
  }, [currentTab, unclaimed, pendingApprovals, pendingClaims, approved]);

  const determineSort = (
    e: SyntheticEvent<HTMLElement>,
    data: DropdownProps,
  ): void => {
    if (typeof data.value === 'string') {
      if (data.value === dateOptions[0]) {
        setSort('increase');
      } else if (data.value === dateOptions[1]) {
        setSort('decrease');
      } else {
        setSort('none');
      }
    }
  };

  const populatePitches = (): void => {
    getUnclaimed();
    getPendingApprovals();
    getPendingClaims();
    getApproved();
  };

  return (
    <div className="pitch-doc-wrapper">
      <h1>Pitch Doc</h1>
      <Menu className="tab-menu" tabular size="large">
        <Menu.Item
          name={TABS.UNCLAIMED}
          active={TABS.UNCLAIMED === currentTab}
          onClick={(e, { name }) => setCurrentTab(name!)}
        />

        <StaffView>
          <Menu.Item
            name={TABS.PITCH_APPROVAL}
            active={TABS.PITCH_APPROVAL === currentTab}
            onClick={(e, { name }) => setCurrentTab(name!)}
          />
        </StaffView>

        <Menu.Item
          name={TABS.APPROVED}
          active={TABS.APPROVED === currentTab}
          onClick={(e, { name }) => setCurrentTab(name!)}
        />
        <AdminView>
          <Menu.Item
            name={TABS.CLAIM_APPROVAL}
            active={TABS.CLAIM_APPROVAL === currentTab}
            onClick={(e, { name }) => setCurrentTab(name!)}
          />
        </AdminView>
      </Menu>
      <div className="search-add-wrapper">
        <Input
          value={query}
          onChange={(e, { value }) => setQuery(value)}
          fluid
          placeholder="Search..."
          icon="search"
          iconPosition="left"
          className="search"
        />
        <SubmitPitchModal callback={populatePitches} />
      </div>

      <div className="filters">
        <div>
          <h3>Filters: </h3>
        </div>
        <div className="wrapper">
          <FilterDropdown
            text="Date Joined"
            options={parseOptions(dateOptions)}
            onChange={determineSort}
          />
        </div>
        <div className="wrapper">
          <FilterDropdown
            text="Topics of Interest"
            options={parseOptions(allInterests)}
            onChange={(e, { value }) => setInterests(toArray(value))}
            multiple
          />
        </div>
        <div className="wrapper">
          <FilterDropdown
            text="Teams"
            options={parseOptions(allTeams)}
            onChange={(e, { value }) => setTeams(toArray(value))}
            multiple
          />
        </div>
        {isEqual(currentTab, TABS.APPROVED) && (
          <div className="wrapper">
            <FilterDropdown
              text="Claim Status"
              options={parseOptions(['Claimed', 'Unclaimed'])}
              onChange={(e, { value }) => setClaimStatus(toString(value))}
            />
          </div>
        )}
      </div>
      <div className="pitch-doc">
        {filteredPitches.map((pitch, index) => {
          if (currentTab === TABS.UNCLAIMED) {
            return (
              <ClaimPitchModal
                callback={populatePitches}
                key={index}
                pitch={pitch}
              />
            );
          } else if (currentTab === TABS.PITCH_APPROVAL) {
            return (
              <ApprovePitchModal
                callback={populatePitches}
                key={index}
                pitch={pitch}
              />
            );
          } else if (currentTab === TABS.CLAIM_APPROVAL) {
            return <PitchCard key={index} pitch={pitch} />;
          } else if (currentTab === TABS.APPROVED) {
            return <PitchCard key={index} pitch={pitch} />;
          }
        })}
      </div>
    </div>
  );
};

export default PitchDoc;
