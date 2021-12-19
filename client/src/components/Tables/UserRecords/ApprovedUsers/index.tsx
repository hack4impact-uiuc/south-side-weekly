import React, { ReactElement } from 'react';
import { IUser } from 'ssw-common';

import { useAuth } from '../../../../contexts';
import PaginatedTable from '../../PaginatedTable';
import { QueryFunction } from '../../PaginatedTable/types';
import {
  nameColumn,
  roleColumn,
  userColumn,
  viewUserColumn,
  viewDateColumn,
  activityColumn,
  teamsColumnModal,
  teamsColumnNoModal,
  interestsColumnModal,
  interestsColumnNoModal,
} from '../utils';

interface ApprovedUserProps<QueryArgs> {
  query: QueryFunction<IUser, QueryArgs>;
  filterParams: QueryArgs;
}

const ApprovedUsers = <QueryArgs extends Record<string, string[]>>({
  query,
  filterParams,
}: ApprovedUserProps<QueryArgs>): ReactElement => {
  const { isContributor } = useAuth();

  const columns = [
    userColumn,
    nameColumn,
    roleColumn,
    isContributor ? teamsColumnNoModal : teamsColumnModal,
    isContributor ? interestsColumnNoModal : interestsColumnModal,
    activityColumn,
    viewDateColumn,
    ...(isContributor ? [] : [viewUserColumn]),
  ];

  return (
    <div className="table">
      <div className="directory">
        <PaginatedTable<IUser, QueryArgs>
          columns={columns}
          query={query}
          params={filterParams}
          emptyMessage={'There are no approved users.'}
        />
      </div>
    </div>
  );
};

export default ApprovedUsers;
