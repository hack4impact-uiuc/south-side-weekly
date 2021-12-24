import React, { FC, useMemo } from 'react';
import { BasePopulatedUser } from 'ssw-common';

import {
  profilePic,
  roleColumn,
  nameColumn,
  teamsColumn,
  interestsColumn,
  statusColumn,
  ratingColumn,
  joinedColumn,
  actionColumn,
  rejectionColumn,
} from './columns';
import { PaginatedTable } from './dynamic/PaginatedTable';

const approvedColumns = [
  profilePic,
  nameColumn,
  roleColumn,
  teamsColumn,
  interestsColumn,
  statusColumn,
  ratingColumn,
  joinedColumn,
];

const pendingColumns = [
  profilePic,
  nameColumn,
  roleColumn,
  teamsColumn,
  interestsColumn,
  joinedColumn,
  actionColumn,
];

const deniedColumsn = [
  profilePic,
  nameColumn,
  roleColumn,
  teamsColumn,
  rejectionColumn,
  joinedColumn,
];

interface TableProps {
  count: number;
  users: BasePopulatedUser[];
  type: 'approved' | 'pending' | 'denied';
}

export const UsersRecords: FC<TableProps> = ({ users, count, type }) => {
  const cols = useMemo(() => {
    switch (type) {
      case 'approved':
        return approvedColumns;
      case 'pending':
        return pendingColumns;
      case 'denied':
        return deniedColumsn;
      default:
        return [];
    }
  }, [type]);

  return (
    <PaginatedTable
      columns={cols}
      records={users}
      count={count}
      pageOptions={['1', '10', '25', '50']}
    />
  );
};
