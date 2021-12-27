import _ from 'lodash';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { BasePopulatedUser } from 'ssw-common';
import { useQueryParams } from 'use-query-params';
import toast from 'react-hot-toast';

import { isError } from '../../api';
import { apiCall } from '../../api/request';
import { allActivities, allRoles } from '../../utils/constants';
import { MultiSelectFilter } from '../filter/MultiSelectFilter';
import { SelectFilter } from '../filter/SelectFilter';
import { DelayedSearch } from '../search/DelayedSearch';
import { UsersRecords } from '../table/UserRecords';
import './UsersView.scss';

interface UsersRes {
  users: BasePopulatedUser[];
  count: number;
}

interface UsersViewProps {
  type: 'approved' | 'pending' | 'denied';
}

export const UsersView: FC<UsersViewProps> = ({ type }): ReactElement => {
  const [, setQuery] = useQueryParams({});
  const [data, setData] = useState<UsersRes>({ users: [], count: 0 });

  const location = useLocation();

  const queryParams = useMemo(() => {
    const params = new URLSearchParams(location.search);

    const q = {
      limit: params.get('limit'),
      offset: params.get('offset'),
      search: params.get('search'),
      teams__all: params.get('teams__all'),
      interests__all: params.get('interests__all'),
      role: params.get('role'),
      activityStatus: params.get('activityStatus'),
    };

    return _.omitBy(q, _.isNil);
  }, [location.search]);

  useEffect(() => {
    const queryUsers = async (): Promise<void> => {
      const res = await apiCall<UsersRes>({
        url: `/users/${type}`,
        method: 'GET',
        populate: 'default',
        query: queryParams,
      });

      if (!isError(res)) {
        setData(res.data.result);
        toast.dismiss();
      }
    };

    queryUsers();
  }, [queryParams, type]);

  useEffect(() => {
    setData({ users: [], count: 0 });
    setQuery({ limit: 10, offset: 0 }, 'push');
    toast.loading(`Loading ${type} users...`, { position: 'bottom-right' });
  }, [type, setQuery]);

  return (
    <div className="users-view">
      <div className="filters">
        <div className="top-filters">
          <div id="search">
            <DelayedSearch id="search" />
          </div>
          {type === 'approved' && (
            <SelectFilter
              options={allActivities}
              filterKey="activityStatus"
              placeholder="Activity status"
              className="filter"
            />
          )}
        </div>
        {type === 'approved' && (
          <div className="bottom-filters">
            <SelectFilter
              options={allRoles}
              filterKey="role"
              placeholder="Role"
              className="filter"
            />
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
        )}
      </div>
      <UsersRecords type={type} users={data.users} count={data.count} />
    </div>
  );
};