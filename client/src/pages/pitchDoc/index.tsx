import { startsWith, toLower, toString } from 'lodash';
import React, {
  ReactElement,
  SyntheticEvent,
  useEffect,
  useState,
} from 'react';
import { Dropdown, DropdownProps, Input, Menu, Modal } from 'semantic-ui-react';
import { IPitch } from 'ssw-common';

import {
  getApprovedPitches,
  getPendingContributorPitches,
  getPendingPitches,
  isError,
} from '../../api';
import { Header, PitchCard, Sidebar } from '../../components';
import StaffView from '../../components/Auth/StaffView';
import { useAuth } from '../../contexts';
import { allInterests, allTeams } from '../../utils/constants';
import { pages } from '../../utils/enums';
import { parseOptions } from '../../utils/helpers';

import {
  filterInterests,
  filterClaimStatus,
  filterTeams,
  sortPitches,
} from './helpers';

import './styles.scss';

const dateOptions = ['Earliest to Latest', 'Latest to Earliest'];

interface ModalInfo {
  isOpen: boolean;
  pitch?: IPitch;
}

const searchFields: (keyof IPitch)[] = ['name'];
const tabs = [
  'Unclaimed Pitches',
  'Pitches Pending Approval',
  'Claims Pending Approval',
];

const PitchDoc = (): ReactElement => {
  const [unclaimed, setUnclaimed] = useState<IPitch[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<IPitch[]>([]);
  const [pendingClaims, setPendingClaims] = useState<IPitch[]>([]);
  const [currentTab, setCurrentTab] = useState(tabs[0]);

  const [currentPitches, setCurrentPitches] = useState<IPitch[]>([]);
  const [filteredPitches, setFilteredPitches] = useState<IPitch[]>([]);

  const [claimStatus, setClaimStatus] = useState<string>('');
  const [sort, setSort] = useState<'increase' | 'decrease' | 'none'>('none');
  const [interests, setInterests] = useState<string[]>([]);
  const [teams, setTeams] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState<ModalInfo>({
    isOpen: false,
    pitch: undefined,
  });

  const { isAdmin } = useAuth();

  useEffect(() => {
    const getUnclaimedPitches = async (): Promise<void> => {
      const res = await getApprovedPitches();

      if (!isError(res)) {
        setUnclaimed(res.data.result);
        setCurrentPitches(res.data.result);
        setFilteredPitches(res.data.result);
      }
    };

    const getPendingApprovals = async (): Promise<void> => {
      const res = await getPendingPitches();

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

    getUnclaimedPitches();

    if (isAdmin) {
      getPendingApprovals();
      getPendingClaims();
    }
  }, [isAdmin]);

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

    setFilteredPitches(search(filter(currentPitches)));
  }, [currentPitches, query, interests, teams, claimStatus, sort]);

  useEffect(() => {
    if (currentTab === tabs[0]) {
      setCurrentPitches(unclaimed);
    } else if (currentTab === tabs[1]) {
      setCurrentPitches(pendingApprovals);
    } else if (currentTab === tabs[2]) {
      setCurrentPitches(pendingClaims);
    }
  }, [currentTab, unclaimed, pendingApprovals, pendingClaims]);

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

  const addClaimStatus = (
    e: SyntheticEvent<HTMLElement>,
    data: DropdownProps,
  ): void => {
    if (typeof data.value === 'string') {
      setClaimStatus(data.value);
    }
  };

  const addInterest = (
    e: SyntheticEvent<HTMLElement>,
    data: DropdownProps,
  ): void => {
    if (Array.isArray(data.value)) {
      setInterests(data.value as string[]);
    }
  };

  const addTeam = (
    e: SyntheticEvent<HTMLElement>,
    data: DropdownProps,
  ): void => {
    if (Array.isArray(data.value)) {
      setTeams(data.value as string[]);
    }
  };

  const openModal = (pitch: IPitch): void => {
    setModal({
      isOpen: true,
      pitch: pitch,
    });
  };

  const closeModal = (): void => {
    setModal({
      isOpen: false,
      pitch: undefined,
    });
  };

  return (
    <>
      <Modal open={modal.isOpen} onClose={closeModal}>
        <Modal.Content content="I am getting there, hold on" />
      </Modal>
      <Header />
      <Sidebar currentPage={pages.PITCHES} />
      <div className="pitch-doc-wrapper">
        <h1>Pitch doc</h1>
        <StaffView>
          <Menu tabular size="large">
            {tabs.map((tab, index) => (
              <Menu.Item
                key={index}
                name={tab}
                active={tab === currentTab}
                onClick={(e, { name }) => setCurrentTab(name!)}
              />
            ))}
          </Menu>
        </StaffView>
        <Input
          value={query}
          onChange={(e, { value }) => setQuery(value)}
          fluid
          placeholder="Search..."
          icon="search"
          iconPosition="left"
        />
        <div className="filters">
          <div>
            <h3>Filters: </h3>
          </div>
          <div className="wrapper">
            <Dropdown
              className="filter"
              text="Claim Status"
              scrolling
              clearable
              options={parseOptions(['Claimed', 'Unclaimed'])}
              selectOnBlur={false}
              selectOnNavigation={false}
              onChange={addClaimStatus}
              fluid
            />
          </div>
          <div className="wrapper">
            <Dropdown
              className="filter"
              text="Date Joined"
              scrolling
              clearable
              options={parseOptions(dateOptions)}
              selectOnBlur={false}
              selectOnNavigation={false}
              onChange={determineSort}
              fluid
            />
          </div>
          <div className="wrapper">
            <Dropdown
              className="filter"
              text="Topics of Interest"
              options={parseOptions(allInterests)}
              scrolling
              multiple
              clearable
              selectOnNavigation={false}
              selectOnBlur={false}
              onChange={addInterest}
              fluid
            />
          </div>
          <div className="wrapper">
            <Dropdown
              className="filter"
              text="Teams"
              options={parseOptions(allTeams)}
              scrolling
              multiple
              clearable
              selectOnNavigation={false}
              selectOnBlur={false}
              onChange={addTeam}
              fluid
            />
          </div>
        </div>
        <div className="pitch-doc">
          {filteredPitches.map((pitch, index) => (
            <PitchCard
              key={index}
              pitch={pitch}
              onClick={() => openModal(pitch)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default PitchDoc;
