import React, { FC, useMemo } from 'react';
import { BasePopulatedUser } from 'ssw-common';

import { ReviewUser } from '..';
import { ViewUserModal } from '../modal/ViewUser';

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

const deniedColumns = [
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
        return deniedColumns;
      default:
        return [];
    }
  }, [type]);

  return (
    <PaginatedTable<BasePopulatedUser>
      count={count}
      pageOptions={['1', '10', '25', '50']}
      sortType="query"
      sortable
      records={users}
      columns={cols}
      getModal={(user, open, setOpen) => (
        <>
          {type === 'approved' && (
            <ViewUserModal open={open} setOpen={setOpen} user={user} />
          )}
          {type === 'pending' && (
            <ReviewUser
              type="review"
              open={open}
              setOpen={setOpen}
              user={user}
            />
          )}
          {type === 'denied' && (
            <ReviewUser
              type="reject"
              open={open}
              setOpen={setOpen}
              user={user}
            />
          )}
        </>
      )}
    />
  );

  return (
    <PaginatedTable
      columns={[]}
      records={users}
      count={count}
      pageOptions={['1', '10', '25', '50']}
      getModal={(user, open, setOpen) => (
        <>
          {type === 'approved' && (
            <ViewUserModal open={open} setOpen={setOpen} user={user} />
          )}
          {type === 'pending' && (
            <ReviewUser
              type="review"
              open={open}
              setOpen={setOpen}
              user={user}
            />
          )}
          {type === 'denied' && (
            <ReviewUser
              type="reject"
              open={open}
              setOpen={setOpen}
              user={user}
            />
          )}
        </>
      )}
    />
  );
};
