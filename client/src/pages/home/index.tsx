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
import DynamicTable, { ColumnType } from '../../components/Tables/DynamicTable';
import { SortDirection } from '../../components/Tables/DynamicTable/types';
import { useAuth } from '../../contexts';
import { pagesEnum, pitchStatusEnum } from '../../utils/enums';
import { filterPitchesByInterests, titleCase } from '../../utils/helpers';

import {
  filterCreatedYear,
  filterRequestClaimYear,
  filterStatus,
  getRecordsForTab,
  getSearchFields,
  getYearsSinceSSWEstablished,
  isPitchArray,
  Tab,
  TABS,
} from './helpers';
import './styles.scss';
import { getViewForTab } from './views';

const Homepage: FC = () => {
  type RecordType = IPitch | IIssue;
  type View = { records: RecordType[]; columns: ColumnType<RecordType>[] };

  const { user } = useAuth();

  const [refreshRecords, setRefreshRecords] = useState<boolean>(false);
  const [aggregatedUser, setAggregatedUser] = useState<IUserAggregate>();

  const [currentTab, setCurrentTab] = useState<Tab>(TABS.MEMBER_PITCHES);

  const [searchInput, setSearchInput] = useState<string>('');
  const [filteredInterests, setFilteredInterests] = useState<string[]>([]);
  const [filteredYear, setFilteredYear] = useState<string>();
  const [filteredStatus, setFilteredStatus] =
    useState<keyof typeof pitchStatusEnum>();

  const [filteredView, setFilteredView] = useState<View>({
    records: [],
    columns: getViewForTab(user, currentTab),
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

    const search = (records: RecordType[]): RecordType[] => {
      if (searchInput.length === 0) {
        return records;
      }

      const searchTerm = toLower(searchInput.trim());

      return records.filter((record) =>
        getSearchFields(records).some((field) =>
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
    const filtered = isPitchArray(records) ? filterPitches(records) : records;

    setFilteredView({
      records: filtered,
      columns: getViewForTab(user, currentTab),
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

  const getInitialSort = (
    tab: Tab,
  ): {
    column: ColumnType<RecordType>;
    direction: SortDirection;
  } | void => {
    switch (tab) {
      case TABS.MEMBER_PITCHES:
        return {
          column: getViewForTab(user, tab).find(
            (column) => column.title === 'Deadline',
          )!,
          direction: 'descending',
        };
      case TABS.SUBMITTED_PITCHES:
        return {
          column: getViewForTab(user, tab).find(
            (column) => column.title === 'Date Submitted',
          )!,
          direction: 'descending',
        };
      case TABS.SUBMITTED_CLAIMS:
        return {
          column: getViewForTab(user, tab).find(
            (column) => column.title === 'Date Submitted',
          )!,
          direction: 'descending',
        };
      case TABS.SUBMITTED_PUBLICATIONS:
        return {
          column: getViewForTab(user, tab).find(
            (column) => column.title === 'Publish Date',
          )!,
          direction: 'descending',
        };
      default:
        return;
    }
  };

  const onSubmitPitch = (): void => {
    setRefreshRecords((refresh) => !refresh);
  };

  const yearSelectOptions: DropdownItemProps[] =
    getYearsSinceSSWEstablished().map((year) => ({ text: year, value: year }));

  const { records, columns } = filteredView;
  console.log(records, columns);
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
          <DynamicTable<RecordType>
            records={records}
            columns={columns}
            singleLine={records.length === 0}
            emptyMessage="You have no pitches in this category."
            sortColumn={getInitialSort(currentTab)?.column}
            sortDirection={getInitialSort(currentTab)?.direction}
          />
        </div>
      </Segment>
    </div>
  );
};

export default Homepage;
