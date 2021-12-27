import _ from 'lodash';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { BasePopulatedPitch } from 'ssw-common';
import { useQueryParams } from 'use-query-params';
import toast from 'react-hot-toast';

import { isError } from '../../api';
import { apiCall } from '../../api/request';
import { MultiSelectFilter } from '../filter/MultiSelectFilter';
import { DelayedSearch } from '../search/DelayedSearch';
import { CheckboxFilter } from '../filter/CheckboxFilter';
import { PitchRecords } from '../table/PitchRecords';
import { useAuth } from '../../contexts';
// import './ReviewPitches.scss';

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

  useEffect(() => {
    const queryPitches = async (): Promise<void> => {
      const res = await apiCall<PitchesRes>({
        url: apiUrl,
        method: 'GET',
        populate: 'default',
        query: queryParams,
      });

      if (!isError(res)) {
        setData(res.data.result);
        toast.dismiss();
      }
    };

    queryPitches();
  }, [queryParams, type, apiUrl]);

  useEffect(() => {
    setData({ data: [], count: 0 });
    setQuery({ limit: 10, offset: 0 }, 'push');
    toast.loading(`Loading pending pitches...`, { position: 'bottom-right' });
  }, [setQuery]);

  return (
    <div className="users-view">
      <div className="filters">
        <div className="top-filters">
          <div id="search">
            <DelayedSearch id="search" />
          </div>
          <CheckboxFilter label="Has Publish Date" filterKey="hasPublishDate" />
          <CheckboxFilter
            label="Has No Publish Date"
            value="false"
            filterKey="hasPublishDate"
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
      <PitchRecords type={type} data={data.data} count={data.count} />
    </div>
  );
};