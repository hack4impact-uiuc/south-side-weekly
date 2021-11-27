import { startsWith, toLower, toString } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import {
  DropdownItemProps,
  Input,
  Menu,
  Segment,
  Select,
} from 'semantic-ui-react';
import { IIssue, IPitch, IUserAggregate } from 'ssw-common';

import { getAggregatedUser, isError } from '../../api';
import {
  InterestsSelect,
  SubmitPitchModal,
  Walkthrough,
} from '../../components';
import DynamicTable from '../../components/Tables/DynamicTable';
import { Sort, View } from '../../components/Tables/DynamicTable/types';
import { useAuth } from '../../contexts';
import { pagesEnum, pitchStatusEnum } from '../../utils/enums';
import { filterPitchesByInterests, titleCase } from '../../utils/helpers';

import {
  filterCreatedYear,
  filterRequestClaimYear,
  filterStatus,
  getInitialSort,
  getRecordsForTab,
  getYearsSinceSSWEstablished,
  Tab,
  TABS,
} from './helpers';
import './styles.scss';
import { getColumnsForTab } from './views';

const searchFields: (keyof IPitch)[] = ['title'];

const Homepage: FC = () => {
  const { user } = useAuth();

  const [refreshRecords, setRefreshRecords] = useState<boolean>(false);
  const [aggregatedUser, setAggregatedUser] = useState<IUserAggregate>();

  const [currentTab, setCurrentTab] = useState<Tab>(TABS.MEMBER_PITCHES);

  const [searchInput, setSearchInput] = useState<string>('');
  const [filteredInterests, setFilteredInterests] = useState<string[]>([]);
  const [filteredYear, setFilteredYear] = useState<string>();
  const [filteredStatus, setFilteredStatus] =
    useState<keyof typeof pitchStatusEnum>();

  const [filteredView, setFilteredView] = useState<View<IPitch>>({
    records: [],
    columns: getColumnsForTab(user, currentTab),
    initialSort: getInitialSort(user, currentTab),
  });
  const canFilterInterests =
    currentTab !== TABS.MEMBER_PITCHES &&
    currentTab !== TABS.SUBMITTED_PUBLICATIONS;
  const canFilterStatuses = currentTab === TABS.SUBMITTED_PITCHES;
  const canFilterYear = canFilterInterests;

  useEffect(() => {
    if (!aggregatedUser) {
      return;
    }

    const search = (records: IPitch[]): IPitch[] => {
      if (searchInput.length === 0) {
        return records;
      }

      const searchTerm = toLower(searchInput.trim());

      return records.filter((record) =>
        searchFields.some((field) =>
          startsWith(
            toLower(toString(record[field as keyof typeof record])),
            searchTerm,
          ),
        ),
      );
    };

    const filterPitches = (pitches: IPitch[]): IPitch[] => {
      if (canFilterInterests) {
        pitches = filterPitchesByInterests(pitches, filteredInterests);
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

    const records = [...search(getRecordsForTab(aggregatedUser, currentTab))];
    const filtered = filterPitches(records);

    setFilteredView({
      records: filtered,
      columns: getColumnsForTab(user, currentTab),
      initialSort: getInitialSort(user, currentTab),
    });
  }, [
    searchInput,
    filteredInterests,
    canFilterInterests,
    canFilterYear,
    filteredYear,
    filteredStatus,
    canFilterStatuses,
    aggregatedUser,
    currentTab,
    user,
  ]);

  useEffect(() => {
    const getAggregate = async (): Promise<void> => {
      const res = await getAggregatedUser(user._id);

      if (!isError(res)) {
        const aggregatedUser = res.data.result;
        setAggregatedUser(aggregatedUser);
      }
    };

    getAggregate();
  }, [user, refreshRecords]);

  const onSubmitPitch = (): void => {
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
      <Segment loading={aggregatedUser === undefined}>
        <div className="filters-wrapper">
          <Input
            value={searchInput}
            onChange={(_, { value }) => setSearchInput(value)}
            placeholder={`Search ${
              currentTab !== TABS.SUBMITTED_PUBLICATIONS
                ? 'pitches'
                : 'publications'
            }`}
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
                values={filteredInterests}
                onChange={(values) =>
                  setFilteredInterests(
                    values ? values.map((item) => item.value) : [],
                  )
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
            view={filteredView}
            singleLine={filteredView.records.length > 0}
            emptyMessage="You have no pitches in this category."
          />
        </div>
      </Segment>
    </div>
  );
};

export default Homepage;
