import React, { FC, ReactElement } from 'react';
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

interface ApprovedUserProps {
  query: QueryFunction<IUser>;
}

const ApprovedUsers: FC<ApprovedUserProps> = ({ query }): ReactElement => {
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
        <PaginatedTable
          columns={columns}
          query={query}
          emptyMessage={'There are no approved users.'}
        />
      </div>
    </div>
  );
};

export default ApprovedUsers;
