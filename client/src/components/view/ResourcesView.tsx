import _ from 'lodash';
import React, {
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Resource } from 'ssw-common';
import { useQueryParams } from 'use-query-params';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

import { isError, apiCall } from '../../api';
import { ResourceRecords } from '../table/ResourceRecords';

import './UsersView.scss';

interface ResourcesRes {
  data: Resource[];
  count: number;
}

type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> &
      Partial<Record<Exclude<Keys, K>, undefined>>;
  }[Keys];
interface ResourcesViewProps {
  team: { teamId: string; teamName: string };
  isGeneral: boolean;
}

export const ResourcesView: FC<RequireOnlyOne<ResourcesViewProps>> = ({
  team,
  isGeneral,
}): ReactElement => {
  const [data, setData] = useState<ResourcesRes>({ data: [], count: 0 });
  const location = useLocation();
  const [, setQuery] = useQueryParams({});

  const queryParams = useMemo(() => {
    const params = new URLSearchParams(location.search);

    const q = {
      limit: params.get('limit') || '10',
      offset: params.get('offset') || '0',
      sortBy: params.get('sortBy'),
      orderBy: params.get('orderBy'),
      isGeneral: isGeneral || undefined,
    };

    return _.omitBy(q, _.isNil);
  }, [location.search, isGeneral]);

  const queryResources = useCallback(async (): Promise<void> => {
    const toastId = toast.loading(
      `Loading ${isGeneral ? 'General' : 'Team'} Resources...`,
    );

    const res = await apiCall<ResourcesRes>({
      url: team ? `/resources/teamName/${team.teamId}` : '/resources',
      method: 'GET',
      query: queryParams,
    });

    if (!isError(res)) {
      toast.success(`Loaded ${isGeneral ? 'General' : 'Team'} Resources`, {
        id: toastId,
      });
      setData(res.data.result);
      return;
    }

    toast.error(`Failed to load ${isGeneral ? 'General' : 'Team'} Resources`, {
      id: toastId,
    });
  }, [team, queryParams, isGeneral]);

  useEffect(() => {
    queryResources();
  }, [queryResources, queryParams]);

  useEffect(() => {
    setQuery({ limit: 10, offset: 0 }, 'push');
    setData({ data: [], count: 0 });
  }, [team, setQuery]);

  return (
    <div className="users-view">
      <ResourceRecords
        onModalClose={queryResources}
        resources={data.data}
        count={data.count}
      />
    </div>
  );
};
