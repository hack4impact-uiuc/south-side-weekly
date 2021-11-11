import { startsWith, toLower, toString } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { Button, Icon, Input, Menu, Select } from 'semantic-ui-react';
import { IPitch } from 'ssw-common';
import {
  InterestsSelect,
  PitchTable,
  SubmitPitchModal,
  Walkthrough,
} from '../../components';
import { useAuth, useInterests } from '../../contexts';
import { pagesEnum } from '../../utils/enums';
import { filterPitchesByInterests } from '../../utils/helpers';

import './styles.scss';

const searchFields: (keyof IPitch)[] = ['title'];
const TABS = {
  MEMBER_PITCHES: 'Your Current Pitches',
  SUBMITTED_PITCHES: 'Pitches You Submitted',
  SUBMITTED_CLAIMS: 'Your Claim Requests',
  SUBMITTED_PUBLICATIONS: 'Your Publications',
};

const Homepage: FC = () => {
  const { user } = useAuth();
  const [currentPitches, setCurrentPitches] = useState<IPitch[]>([]);
  const [filteredPitches, setFilteredPitches] = useState<IPitch[]>([]);
  const [searchInput, setSearchInput] = useState<string>('');
  const [currentTab, setCurrentTab] = useState(TABS.MEMBER_PITCHES);
  const [interests, setInterests] = useState<string[]>([]);

  const [filteredTopics, setFilteredTopics] = useState([]);

  const canFilterInterests = currentTab !== TABS.MEMBER_PITCHES;

  useEffect(() => {
    const search = (pitches: IPitch[]): IPitch[] => {
      if (searchInput.length === 0) {
        return pitches;
      }

      const searchTerm = toLower(searchInput.trim());

      return pitches.filter((pitch) =>
        searchFields.some((field) =>
          startsWith(toLower(toString(pitch[field])), searchTerm),
        ),
      );
    };

    const filter = (pitches: IPitch[]): IPitch[] => {
      let filtered = [] as IPitch[];

      if (canFilterInterests) {
        filtered = filterPitchesByInterests(pitches, interests);
      }

      // filtered = filterClaimStatus(filtered, claimStatus);

      return filtered;
    };

    setFilteredPitches([...search(filter(currentPitches))]);
  }, [currentPitches, searchInput, interests, canFilterInterests]);

  const populatePitches = (): void => {
    // getUnclaimed();
    // getPendingApprovals();
    // getPendingClaims();
    // getApproved();
  };

  return (
    <div className="homepage-wrapper">
      <Walkthrough
        page={pagesEnum.HOMEPAGE}
        content="The homepage is the main landing point for users to see their pitch history."
      />
      <div className="header">
        <h1>Welcome, {user.preferredName || user.firstName}!</h1>
        <Button secondary>
          <Icon name="send" />
          Submit Pitch
        </Button>
      </div>

      <Menu className="tab-menu" tabular size="large">
        <Menu.Item
          name={TABS.MEMBER_PITCHES}
          active={TABS.MEMBER_PITCHES === currentTab}
          onClick={(_, { name }) => setCurrentTab(name!)}
        />

        <Menu.Item
          name={TABS.SUBMITTED_PITCHES}
          active={TABS.SUBMITTED_PITCHES === currentTab}
          onClick={(_, { name }) => setCurrentTab(name!)}
        />

        <Menu.Item
          name={TABS.SUBMITTED_CLAIMS}
          active={TABS.SUBMITTED_CLAIMS === currentTab}
          onClick={(_, { name }) => setCurrentTab(name!)}
        />

        <Menu.Item
          name={TABS.SUBMITTED_PUBLICATIONS}
          active={TABS.SUBMITTED_PUBLICATIONS === currentTab}
          onClick={(_, { name }) => setCurrentTab(name!)}
        />
      </Menu>

      <div className="filters-wrapper">
        <Input
          value={searchInput}
          onChange={(_, { value }) => setSearchInput(value)}
          placeholder="Search pitches"
          icon="search"
          iconPosition="left"
          className="search"
          style={{ minWidth: '400px' }}
        />
        {canFilterInterests && (
          <InterestsSelect
            values={interests}
            onChange={(values) =>
              setInterests(values ? values.map((item) => item.value) : [])
            }
          />
        )}
        {/* {currentTab !== TABS.MEMBER_PITCHES && (
          <Select
            values={interests}
            onChange={(values) =>
              setInterests(values ? values.map((item) => item.value) : [])
            }
          />
        )} */}
      </div>

      <div className="pitch-doc">
        <PitchTable
          pitches={filteredPitches}
          callback={populatePitches}
          currentTab={currentTab}
        />
      </div>
    </div>
  );
};

export default Homepage;
