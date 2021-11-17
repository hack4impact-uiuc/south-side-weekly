import { startsWith, toLower, toString } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import {
  Button,
  DropdownItemProps,
  Icon,
  Input,
  Menu,
  Select,
  Table,
  TableHeader,
  TableRow,
} from 'semantic-ui-react';
import { IPitch } from 'ssw-common';
import {
  InterestsSelect,
  PitchTable,
  SubmitPitchModal,
  TableTool,
  Walkthrough,
} from '../../components';
// import { HomepageTable } from '../../components/Tables/Homepage';
import { useAuth, useInterests } from '../../contexts';
import { pagesEnum } from '../../utils/enums';
import { filterPitchesByInterests } from '../../utils/helpers';
import { getYearsSinceSSWEstablished } from './helpers';

import './styles.scss';

const searchFields: (keyof IPitch)[] = ['title'];
const TABS = {
  MEMBER_PITCHES: 'Your Current Pitches',
  SUBMITTED_PITCHES: 'Pitches You Submitted',
  SUBMITTED_CLAIMS: 'Your Claim Requests',
  SUBMITTED_PUBLICATIONS: 'Your Publications',
} as const;
type Tab = typeof TABS[keyof typeof TABS];

const Homepage: FC = () => {
  const { user } = useAuth();

  const [currentPitches, setCurrentPitches] = useState<IPitch[]>([]);
  const [interests, setInterests] = useState<string[]>([]);

  const [currentTab, setCurrentTab] = useState<Tab>(TABS.MEMBER_PITCHES);

  const [searchInput, setSearchInput] = useState<string>('');
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [filteredPitches, setFilteredPitches] = useState<IPitch[]>([]);

  const canFilterInterests =
    currentTab !== TABS.MEMBER_PITCHES &&
    currentTab !== TABS.SUBMITTED_PUBLICATIONS;
  const canFilterStatuses = canFilterInterests;
  const canFilterYear = canFilterInterests;

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

  const yearSelectOptions: DropdownItemProps[] =
    getYearsSinceSSWEstablished().map((year) => ({ text: year, value: year }));

  return (
    <div className="homepage-wrapper">
      <Walkthrough
        page={pagesEnum.HOMEPAGE}
        content="The homepage is the main landing point for users to see their pitch history."
      />

      <Menu className="tab-menu" tabular size="large">
        <Menu.Item
          name={TABS.MEMBER_PITCHES}
          active={TABS.MEMBER_PITCHES === currentTab}
          onClick={() => setCurrentTab(TABS.MEMBER_PITCHES)}
        />

        <Menu.Item
          name={TABS.SUBMITTED_PITCHES}
          active={TABS.SUBMITTED_PITCHES === currentTab}
          onClick={() => setCurrentTab(TABS.SUBMITTED_PITCHES)}
        />

        <Menu.Item
          name={TABS.SUBMITTED_CLAIMS}
          active={TABS.SUBMITTED_CLAIMS === currentTab}
          onClick={() => setCurrentTab(TABS.SUBMITTED_CLAIMS)}
        />

        <Menu.Item
          name={TABS.SUBMITTED_PUBLICATIONS}
          active={TABS.SUBMITTED_PUBLICATIONS === currentTab}
          onClick={() => setCurrentTab(TABS.SUBMITTED_PUBLICATIONS)}
        />

        <Menu.Item
          content={<SubmitPitchModal callback={populatePitches} />}
          position="right"
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
        {canFilterStatuses && (
          <Select
            clearable
            placeholder="Status"
            options={[{ text: 'In Progress', value: 'in-progress' }]}
            onChange={(_, data) => console.log(data)}
          />
        )}
        {canFilterInterests && (
          <div className="filter-dropdown">
            <InterestsSelect
              values={interests}
              onChange={(values) =>
                setInterests(values ? values.map((item) => item.value) : [])
              }
            />
          </div>
        )}
        {canFilterYear && (
          <Select
            clearable
            search
            defaultValue="test"
            placeholder="Year"
            options={yearSelectOptions}
            onChange={(_, data) => console.log(data)}
            defaultUpward={false}
          />
        )}
      </div>

      <div className="pitch-table">
        <TableTool
          singleLine={false}
          tableBody={
            <>
              <Table.Row>
                <Table.Cell>Big</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Small</Table.Cell>
              </Table.Row>
            </>
          }
          tableHeader={
            <Table.HeaderCell sorted={'descending'}>Title</Table.HeaderCell>
          }
        ></TableTool>
      </div>
    </div>
  );
};

export default Homepage;
