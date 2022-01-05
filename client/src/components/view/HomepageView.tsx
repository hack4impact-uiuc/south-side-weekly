import _ from 'lodash';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FullPopulatedPitch } from 'ssw-common';
import { useQueryParams } from 'use-query-params';
import toast from 'react-hot-toast';

import { isError, apiCall } from '../../api';
import { MultiSelectFilter } from '../filter/MultiSelectFilter';
import { DelayedSearch } from '../search/DelayedSearch';
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
      hasPublishDate: type === 'published' || undefined,
      'issueStatuses.issueStatus':
        type === 'published' ? issueStatusEnum.PUSH : undefined,
      status: type === 'submitted' ? pitchStatusEnum.PENDING : undefined,
      author: type === 'submitted' ? user?._id : undefined,
      'pendingContributors.userId':
        type === 'claim-submitted' ? user?._id : undefined,
    };

    return _.omitBy(q, _.isNil);
  }, [location.search, type, user]);

  const apiUrl = useMemo(() => {
    switch (type) {
      case 'member':
        return `/users/${user?._id}/pitches`;
      case 'submitted':
        return '/pitches/pending';
      case 'claim-submitted':
        return `/pitches/approved`;
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
        populate: type === 'published' ? 'full' : 'default',
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
