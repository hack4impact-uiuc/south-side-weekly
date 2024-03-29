import _ from 'lodash';
import React, {
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import { BasePopulatedPitch } from 'ssw-common';
import { useQueryParams } from 'use-query-params';
import toast from 'react-hot-toast';

import { isError, apiCall } from '../../api';
import { MultiSelectFilter } from '../filter/MultiSelectFilter';
import { DelayedSearch } from '../search/DelayedSearch';
import { PitchRecords } from '../table/PitchRecords';
import { useAuth } from '../../contexts';
import { RadioFilter } from '../filter/RadioFilter';

interface PitchesRes {
  data: BasePopulatedPitch[];
  count: number;
}

interface PitchesViewProps {
  type: 'review-new' | 'review-unclaimed' | 'claim' | 'all';
}

export const PitchesView: FC<PitchesViewProps> = ({ type }): ReactElement => {
  const [, setQuery] = useQueryParams({});
  const [data, setData] = useState<PitchesRes>({ data: [], count: 0 });
  const { user } = useAuth();

  const location = useLocation();

  const queryParams = useMemo(() => {
    const params = new URLSearchParams(location.search);

    const q = {
      limit: params.get('limit') || '10',
      offset: params.get('offset') || '0',
      search: params.get('search'),
      'teams.teamId__all': params.get('teams__all'),
      topics__all: params.get('interests__all'),
      hasPublishDate: params.get('hasPublishDate'),
      claimStatus: type === 'review-unclaimed' ? 'unclaimed' : undefined,
      sortBy: params.get('sortBy') || 'updatedAt',
      orderBy: params.get('orderBy') || 'desc',
    };

    return _.omitBy(q, _.isNil);
  }, [location.search, type]);

  const apiUrl = useMemo(() => {
    switch (type) {
      case 'review-new':
        return '/pitches/pending';
      case 'review-unclaimed':
        return '/pitches/approved';
      case 'claim':
        return `/pitches/claimable/${user!._id}`;
      case 'all':
        return '/pitches/approved';
      default:
        return '';
    }
  }, [type, user]);

  const queryPitches = useCallback(async (): Promise<void> => {
    const res = await apiCall<PitchesRes>({
      url: apiUrl,
      method: 'GET',
      populate: 'default',
      query: queryParams,
    });

    if (!isError(res)) {
      setData(res.data.result);
    }
  }, [queryParams, apiUrl]);

  useEffect(() => {
    let message = '';

    if (type === 'all') {
      message = 'Loading all approved pitches...';
    } else if (type === 'claim') {
      message = 'Loading your claimable pitches...';
    } else if (type === 'review-unclaimed') {
      message = 'Loading unclaimed pitches...';
    } else if (type === 'review-new') {
      message = 'Loading new pitches...';
    }

    toast.promise(queryPitches(), {
      loading: message,
      success: () => `Successfully loaded pitches...`,
      error: () => `Failed to load ${type} pitches...`,
    });
  }, [type, queryPitches]);

  useEffect(() => {
    setData({ data: [], count: 0 });
    setQuery({ limit: 10, offset: 0 }, 'push');
  }, [setQuery]);

  return (
    <div className="users-view">
      <div className="filters">
        <div className="top-filters">
          <div id="search">
            <DelayedSearch id="search" />
          </div>
          <RadioFilter
            className="publish-date-checkbox"
            label="Has Publish Date"
            filterKey="hasPublishDate"
          />
          <RadioFilter
            label="Has No Publish Date"
            value="false"
            filterKey="hasPublishDate"
            className="publish-date-checkbox"
          />
        </div>

        <div className="bottom-filters">
          <MultiSelectFilter
            className="filter"
            filterKey="interests__all"
            type="interests"
          />

          <MultiSelectFilter
            className="filter"
            filterKey="teams__all"
            type="teams"
          />
        </div>
      </div>
      <PitchRecords
        onModalClose={queryPitches}
        type={type}
        data={data.data}
        count={data.count}
      />
    </div>
  );
};
