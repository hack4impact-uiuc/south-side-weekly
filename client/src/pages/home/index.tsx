import { startsWith, toLower, toString } from 'lodash';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
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
import { IPitch, IUser, IUserAggregate } from 'ssw-common';
import { getAggregatedUser, isError } from '../../api';
import {
  InterestsSelect,
  PitchTable,
  SubmitPitchModal,
  TableTool,
  Walkthrough,
} from '../../components';
import DynamicTable from '../../components/Tables/DyanmicTable';
// import { HomepageTable } from '../../components/Tables/Homepage';
import { useAuth, useInterests } from '../../contexts';
import { pagesEnum } from '../../utils/enums';
import { defaultFunc, filterPitchesByInterests } from '../../utils/helpers';
import { getYearsSinceSSWEstablished, Tab, TABS } from './helpers';

import './styles.scss';
import { getViewForTab } from './views';

const searchFields: (keyof IPitch)[] = ['title'];

const Homepage: FC = () => {
  const { user } = useAuth();

  const [refreshRecords, setRefreshRecords] = useState<boolean>(false);
  const [aggregatedUser, setAggregatedUser] = useState<IUserAggregate>();
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
    if (!aggregatedUser) {
      return;
    }

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
      // filtered = filterYear(filtered, )

      return filtered;
    };

    setFilteredPitches([
      ...search(filter(getPitchesForTab(aggregatedUser, currentTab))),
    ]);
  }, [
    currentPitches,
    searchInput,
    interests,
    canFilterInterests,
    aggregatedUser,
    currentTab,
  ]);

  useEffect(() => {
    const getAggregate = async () => {
      const res = await getAggregatedUser(user._id);

      if (!isError(res)) {
        const aggregatedUser = res.data.result;
        setAggregatedUser(aggregatedUser);
      }
    };

    getAggregate();
  }, [user, refreshRecords]);

  const getPitchesForTab = (
    { aggregated }: IUserAggregate,
    tab: Tab,
  ): IPitch[] => {
    switch (tab) {
      case TABS.MEMBER_PITCHES:
        return aggregated.claimedPitches as IPitch[];
      case TABS.SUBMITTED_CLAIMS:
        return aggregated.submittedClaims as IPitch[];
      case TABS.SUBMITTED_PITCHES:
        return aggregated.submittedPitches as IPitch[];
      case TABS.SUBMITTED_PUBLICATIONS:
        return [];
      default:
        return [];
    }
  };

  const onSubmitPitch = () => {
    setRefreshRecords((refresh) => !refresh);
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
          content={<SubmitPitchModal callback={onSubmitPitch} />}
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
        <DynamicTable<IPitch>
          records={filteredPitches}
          columns={getViewForTab(user, currentTab)}
          singleLine={filteredPitches.length === 0}
          emptyMessage="You have no pitches in this category."
        />
      </div>
    </div>
  );
};

export default Homepage;
