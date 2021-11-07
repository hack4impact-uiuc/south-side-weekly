import { isEqual, startsWith, toLower, toString } from 'lodash';
import React, { ReactElement, useEffect, useState } from 'react';
import { Input, Menu } from 'semantic-ui-react';
import { IPitch } from 'ssw-common';

import {
  getApprovedPitches,
  getPendingContributorPitches,
  getPitchesPendingApproval,
  getUnclaimedPitches,
  isError,
} from '../../api';
import {
  SubmitPitchModal,
  StaffView,
  AdminView,
  Select,
  Walkthrough,
  InterestsSelect,
  TeamsSelect,
  PitchTable,
} from '../../components';
import { useAuth } from '../../contexts';
import { pagesEnum } from '../../utils/enums';

import { filterInterests, filterClaimStatus, filterTeams } from './helpers';

import './styles.scss';

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

      return filtered;
    };

    setFilteredPitches([...search(filter(currentPitches))]);
  }, [currentPitches, query, interests, teams, claimStatus]);

  useEffect(() => {
    if (currentTab !== TABS.APPROVED) {
      setClaimStatus('');
    }

    if (currentTab === TABS.UNCLAIMED) {
      setCurrentPitches([...unclaimed]);
    } else if (currentTab === TABS.PITCH_APPROVAL) {
      setCurrentPitches([...pendingApprovals]);
    } else if (currentTab === TABS.CLAIM_APPROVAL) {
      setCurrentPitches([...pendingClaims]);
    } else if (currentTab === TABS.APPROVED) {
      setCurrentPitches([...approved]);
    }
  }, [currentTab, unclaimed, pendingApprovals, pendingClaims, approved]);

  const populatePitches = (): void => {
    getUnclaimed();
    getPendingApprovals();
    getPendingClaims();
    getApproved();
  };

  return (
    <div className="pitch-doc-wrapper">
      <Walkthrough
        page={pagesEnum.PITCHDOC}
        content="The Pitch Doc is where you can claim, submit, and view pitches! Use the filters to find pitches you are interested in."
      />
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
          <InterestsSelect
            values={interests}
            onChange={(values) =>
              setInterests(values ? values.map((item) => item.value) : [])
            }
          />
        </div>
        <div className="wrapper">
          <TeamsSelect
            values={teams}
            onChange={(values) => setTeams(values.map((item) => item.value))}
          />
        </div>
        {isEqual(currentTab, TABS.APPROVED) && (
          <div className="wrapper">
            <Select
              value={claimStatus}
              options={['Claimed', 'Unclaimed']}
              onChange={(e) => setClaimStatus(e ? e.value : '')}
              placeholder="Claim status"
            />
          </div>
        )}
      </div>
      <div className="pitch-doc">
        <PitchTable pitches={filteredPitches} />
      </div>
    </div>
  );
};

export default PitchDoc;
