import { startsWith, toLower, toString } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import {
  DropdownItemProps,
  Input,
  Menu,
  Segment,
  Select,
} from 'semantic-ui-react';
import { IPitch, IUserAggregate } from 'ssw-common';
import { getAggregatedUser, isError } from '../../api';
import {
  InterestsSelect,
  SubmitPitchModal,
  Walkthrough,
} from '../../components';
import DynamicTable from '../../components/Tables/DyanmicTable';
// import { HomepageTable } from '../../components/Tables/Homepage';
import { useAuth } from '../../contexts';
import { pagesEnum, pitchStatusEnum } from '../../utils/enums';
import { filterPitchesByInterests, titleCase } from '../../utils/helpers';
import { filterClaimStatus } from '../pitchDoc/helpers';
import {
  filterCreatedYear,
  filterRequestClaimYear,
  filterStatus,
  getYearsSinceSSWEstablished,
  Tab,
  TABS,
} from './helpers';
import './styles.scss';
import { getViewForTab } from './views';

const searchFields: (keyof IPitch)[] = ['title'];

const Homepage: FC = () => {
  const { user } = useAuth();

  const [refreshRecords, setRefreshRecords] = useState<boolean>(false);
  const [aggregatedUser, setAggregatedUser] = useState<IUserAggregate>();
  const [interests, setInterests] = useState<string[]>([]);

  const [currentTab, setCurrentTab] = useState<Tab>(TABS.MEMBER_PITCHES);

  const [searchInput, setSearchInput] = useState<string>('');
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [filteredPitches, setFilteredPitches] = useState<IPitch[]>([]);
  const [filteredYear, setFilteredYear] = useState<string>();
  const [filteredStatus, setFilteredStatus] =
    useState<keyof typeof pitchStatusEnum>();

  const canFilterInterests = currentTab !== TABS.MEMBER_PITCHES;
  // && currentTab !== TABS.SUBMITTED_PUBLICATIONS;
  const canFilterStatuses = currentTab === TABS.SUBMITTED_PITCHES;
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
      if (canFilterInterests) {
        pitches = filterPitchesByInterests(pitches, interests);
      }

      if (canFilterStatuses && filteredStatus) {
        pitches = filterStatus(pitches, filteredStatus);
      }

      if (canFilterYear && filteredYear) {
        pitches =
          currentTab === TABS.SUBMITTED_PITCHES
            ? filterCreatedYear(pitches, filteredYear)
            : filterRequestClaimYear(pitches, user, filteredYear);
      }

      return pitches;
    };

    setFilteredPitches([
      ...search(filter(getPitchesForTab(aggregatedUser, currentTab))),
    ]);
  }, [
    searchInput,
    interests,
    canFilterInterests,
    canFilterYear,
    filteredYear,
    filteredStatus,
    canFilterStatuses,
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
      // case TABS.SUBMITTED_PUBLICATIONS:
      //   return [];
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

      <Menu className="tab-menu" tabular secondary pointing size="large">
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

        {/* <Menu.Item
          name={TABS.SUBMITTED_PUBLICATIONS}
          active={TABS.SUBMITTED_PUBLICATIONS === currentTab}
          onClick={() => setCurrentTab(TABS.SUBMITTED_PUBLICATIONS)}
        /> */}

        <Menu.Item
          content={<SubmitPitchModal callback={onSubmitPitch} />}
          position="right"
        />
      </Menu>
      <Segment loading={aggregatedUser === undefined}>
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
              value={filteredStatus}
              options={Object.keys(pitchStatusEnum).map((id) => ({
                text: titleCase(id),
                value: id,
              }))}
              onChange={(_, data) =>
                setFilteredStatus(data.value as keyof typeof pitchStatusEnum)
              }
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
              placeholder="Year"
              options={yearSelectOptions}
              value={filteredYear}
              onChange={(_, data) => setFilteredYear(data.value?.toString())}
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
      </Segment>
    </div>
  );
};

export default Homepage;
