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

interface ResourcesViewProps {
  team: { teamId: string; teamName: string };
}

export const ResourcesView: FC<ResourcesViewProps> = ({
  team,
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
    };

    return _.omitBy(q, _.isNil);
  }, [location.search]);

  const queryResources = useCallback(async (): Promise<void> => {
    const res = await apiCall<ResourcesRes>({
      url: `/resources/teamName/${team.teamId}`,
      method: 'GET',
      query: queryParams,
    });

    if (!isError(res)) {
      setData(res.data.result);
      toast.dismiss();
    } else {
      toast.error('Failed to load resources');
      toast.dismiss();
    }
  }, [team, queryParams]);

  useEffect(() => {
    queryResources();
  }, [queryResources, queryParams]);

  useEffect(() => {
    setQuery({ limit: 10, offset: 0 }, 'push');
    setData({ data: [], count: 0 });
    toast.loading(`Loading ${team.teamName} resources...`);
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
