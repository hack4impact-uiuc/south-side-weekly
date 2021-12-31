import React, { FC, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { BasePopulatedPitch } from 'ssw-common';
import { useQueryParams } from 'use-query-params';
import { Sort } from '../../components/table/dynamic/types';
import { useAuth } from '../../contexts';
import { Column } from './helpers';

interface PitchesRes {
  data: BasePopulatedPitch[];
  count: number;
}

interface HomepageTabProps {
  columns: Column;
  initialSort: Sort<Column>;
  filters: boolean;
}

const HomepageTab: FC<HomepageTabProps> = ({}) => {
    const [, setQuery] = useQueryParams({});
    const [data, setData] = useState<PitchesRes>({ data: [], count: 0 });
    const { user } = useAuth();
  
    const location = useLocation();
  
    const queryParams = useMemo(() => {
      const params = new URLSearchParams(location.search);
  
      const q = {
        limit: params.get('limit'),
        offset: params.get('offset'),
        search: params.get('search'),
        teams__all: params.get('teams__all'),
        interests__all: params.get('interests__all'),
        hasPublishDate: params.get('hasPublishDate'),
        hasNoPublishDate: params.get('hasNoPublishDate'),
        status: type === 'review-unclaimed' ? 'unclaimed' : undefined,
      };
  
      return _.omitBy(q, _.isNil);
    }, [location.search, type]);


  const [refreshRecords] = useState(false);
  const [aggregatedUser] = useState<IUserAggregate>();

  const [currentTab, setCurrentTab] = useState<Tab>(TABS.MEMBER_PITCHES);

  const [searchInput, setSearchInput] = useState('');
  const [filteredInterests, setFilteredInterests] = useState<string[]>([]);
  const [filteredYear, setFilteredYear] = useState<number>();
  const [filteredStatus, setFilteredStatus] =
    useState<keyof typeof pitchStatusEnum>();

  const [filteredView, setFilteredView] = useState<View<IPitch>>({
    records: [],
    columns: [],
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
      pitches = pitches.filter((pitch) => pitch !== null);
      if (canFilterInterests) {
        pitches = filterPitchesByInterests(pitches, filteredInterests);
      }

      if (canFilterStatuses && filteredStatus) {
        pitches =
          currentTab === TABS.SUBMITTED_PITCHES
            ? filterPitchStatus(pitches, filteredStatus)
            : // : filterPitchClaimStatus(pitches, user, filteredStatus);
              [];
      }

      if (canFilterYear && filteredYear) {
        pitches =
          currentTab === TABS.SUBMITTED_PITCHES
            ? filterCreatedYear(pitches, filteredYear)
            : // : filterRequestClaimYear(pitches, user, filteredYear);
              [];
      }

      return pitches;
    };

    const records = [...search(getRecordsForTab(aggregatedUser, currentTab))];
    const filtered = filterPitches(records);

    setFilteredView({
      records: filtered,
      columns: [],
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
      const res = await apiCall({
        url: '/users',
        method: 'GET',
      });

      if (!isError(res)) {
        // const aggregatedUser = res.data.result;
        // setAggregatedUser(aggregatedUser);
      }
    };

    getAggregate();
  }, [user, refreshRecords]);

  // const onSubmitPitch = (): void => {
  //   setRefreshRecords((refresh) => !refresh);
  // };

    return (
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
              <ContextSelect
                type="Interests"
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

export default HomepageTab;
