import { startsWith, toLower, toString } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { Input, Menu } from 'semantic-ui-react';
import Select from 'react-select';
import { IPitch, IUserAggregate } from 'ssw-common';

import { getAggregatedUser, isError } from '../../api';
import {
  DynamicTable,
  InterestsSelect,
  SubmitPitchModal,
  View,
  Walkthrough,
} from '../../components';
import { useAuth } from '../../contexts';
import { pagesEnum, pitchStatusEnum } from '../../utils/enums';
import { filterPitchesByInterests, titleCase } from '../../utils/helpers';

import {
  filterCreatedYear,
  filterPitchClaimStatus,
  filterPitchStatus,
  filterRequestClaimYear,
  getInitialSort,
  getRecordsForTab,
  getYearsSinceSSWEstablished,
  Tab,
  TABS,
} from './helpers';
import { getColumnsForTab } from './views';
import './styles.scss';

const searchFields: (keyof IPitch)[] = ['title'];

const Homepage: FC = () => {
  const { user } = useAuth();

  const [refreshRecords, setRefreshRecords] = useState(false);
  const [aggregatedUser, setAggregatedUser] = useState<IUserAggregate>();

  const [currentTab, setCurrentTab] = useState<Tab>(TABS.MEMBER_PITCHES);

  const [searchInput, setSearchInput] = useState('');
  const [filteredInterests, setFilteredInterests] = useState<string[]>([]);
  const [filteredYear, setFilteredYear] = useState<number>();
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
  const canFilterStatuses = canFilterInterests;
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
        pitches =
          currentTab === TABS.SUBMITTED_PITCHES
            ? filterPitchStatus(pitches, filteredStatus)
            : filterPitchClaimStatus(pitches, user, filteredStatus);
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

  return (
    <div className="homepage-wrapper">
      <div className="page-header-content homepage-header">
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
      </div>
      <div className="page-inner-content">
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
              isClearable
              placeholder="Status"
              className="filter-dropdown"
              value={
                filteredStatus
                  ? {
                      value: filteredStatus,
                      label: titleCase(filteredStatus || ''),
                    }
                  : undefined
              }
              options={
                Object.keys(pitchStatusEnum).map((status) => ({
                  value: status,
                  label: titleCase(status),
                })) as any
              }
              onChange={(value) =>
                setFilteredStatus(value?.value as keyof typeof pitchStatusEnum)
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
              isClearable
              isSearchable
              placeholder="Year"
              className="filter-dropdown"
              value={
                filteredYear
                  ? { value: filteredYear, label: filteredYear }
                  : undefined
              }
              options={getYearsSinceSSWEstablished().map((year) => ({
                value: year,
                label: year,
              }))}
              onChange={(value) =>
                setFilteredYear(value?.value as number | undefined)
              }
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
      </div>
    </div>
  );
};

export default Homepage;
