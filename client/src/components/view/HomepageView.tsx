import _ from 'lodash';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { BasePopulatedPitch, FullPopulatedPitch } from 'ssw-common';
import { useQueryParams } from 'use-query-params';
import toast from 'react-hot-toast';

import { isError, apiCall } from '../../api';
import { MultiSelectFilter } from '../filter/MultiSelectFilter';
import { DelayedSearch } from '../search/DelayedSearch';
import { CheckboxFilter } from '../filter/CheckboxFilter';
import { useAuth } from '../../contexts';
import { issueStatusEnum, pitchStatusEnum } from '../../utils/enums';
import { HomepageRecords } from '../table/HomepageRecords';

interface PitchesRes {
  data: FullPopulatedPitch[];
  count: number;
}

interface HomepageViewProps {
  type: 'member' | 'submitted' | 'claim-submitted' | 'published';
}

export const HomepageView: FC<HomepageViewProps> = ({ type }): ReactElement => {
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
      hasPublishDate: params.get('hasPublishDate') || type === 'published',
      hasNoPublishDate: params.get('hasNoPublishDate'),
      'issueStatuses.issueStatus':
        type === 'published' ? issueStatusEnum.PUSH : undefined,
      status: type === 'submitted' ? pitchStatusEnum.PENDING : undefined,
      author: ['submitted'].includes(type) ? user?._id : undefined,
    };

    return _.omitBy(q, _.isNil);
  }, [location.search, type]);

  const apiUrl = useMemo(() => {
    switch (type) {
      case 'member':
        return `/users/${user?._id}/pitches`;
      case 'submitted':
        return '/pitches/pending';
      case 'claim-submitted':
        return `/users/${user?._id}/submittedClaims`;
      case 'published':
        return `/users/${user?._id}/pitches`;
      default:
        return '';
    }
  }, [type, user]);

  useEffect(() => {
    const queryPitches = async (): Promise<void> => {
      const res = await apiCall<PitchesRes>({
        url: apiUrl,
        method: 'GET',
        populate: 'full',
        query: queryParams,
      });

      if (!isError(res)) {
        setData(res.data.result);
        toast.dismiss();
        toast.success('Successfully loaded pitches!');
      }
    };

    queryPitches();
  }, [queryParams, type, apiUrl]);

  useEffect(() => {
    setData({ data: [], count: 0 });
    setQuery({ limit: 10, offset: 0 }, 'push');

    if (type === 'member') {
      toast.loading('Loading your pitches...');
    } else if (type === 'submitted') {
      toast.loading('Loading your submitted pitches...');
    } else if (type === 'claim-submitted') {
      toast.loading('Loading submitted claims...');
    } else if (type === 'published') {
      toast.loading('Loading your published pitches...');
    }
  }, [setQuery, type]);

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
      <HomepageRecords type={type} data={data.data} count={data.count} />
    </div>
  );
};
