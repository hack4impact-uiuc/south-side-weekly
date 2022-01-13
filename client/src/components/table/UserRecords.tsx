import React, { FC, useMemo } from 'react';
import { BasePopulatedUser } from 'ssw-common';

import { ReviewUser } from '..';
import { approveUser, rejectUser } from '../../api';
import { useAuth } from '../../contexts';
import { ViewUserModal } from '../modal/ViewUser';
import { PrimaryButton } from '../ui/PrimaryButton';
import { SecondaryButton } from '../ui/SecondaryButton';

import {
  profilePic,
  roleColumn,
  nameColumn,
  teamsColumn,
  interestsColumn,
  statusColumn,
  ratingColumn,
  joinedColumn,
  rejectionColumn,
  teamsModalColumn,
  interestsModalColumn,
  onboardStatusColumn,
} from './columns';
import { configureColumn } from './dynamic/DynamicTable2.0';
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

const approvedAdminColumns = [
  profilePic,
  nameColumn,
  roleColumn,
  teamsModalColumn,
  interestsModalColumn,
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
];

const pendingAdminColumns = [
  profilePic,
  nameColumn,
  roleColumn,
  onboardStatusColumn,
  teamsModalColumn,
  interestsModalColumn,
  joinedColumn,
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
  onModalClose?: () => void;
}

export const UsersRecords: FC<TableProps> = ({
  users,
  count,
  type,
  onModalClose,
}) => {
  const { isAdmin } = useAuth();

  const actionColumn = configureColumn<BasePopulatedUser>({
    title: '',
    width: 2,
    extractor: function getAction(user: BasePopulatedUser) {
      return (
        <div style={{ display: 'flex' }}>
          <PrimaryButton
            size="mini"
            onClick={async (e) => {
              e.stopPropagation();
              await approveUser(user);
              if (onModalClose) {
                onModalClose();
              }
            }}
            content="Approve"
          />
          <SecondaryButton
            size="mini"
            onClick={async (e) => {
              e.stopPropagation();
              await rejectUser(user);
              if (onModalClose) {
                onModalClose();
              }
            }}
            content="Decline"
            border
          />
        </div>
      );
    },
  });

  const cols = useMemo(() => {
    switch (type) {
      case 'approved':
        return isAdmin ? approvedAdminColumns : approvedColumns;
      case 'pending':
        return isAdmin
          ? [...pendingAdminColumns, actionColumn]
          : [...pendingColumns, actionColumn];
      case 'denied':
        return deniedColumns;
      default:
        return [];
    }
  }, [type, actionColumn, isAdmin]);

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
            <ViewUserModal
              onUnmount={onModalClose}
              open={open}
              setOpen={setOpen}
              user={user}
            />
          )}
          {type === 'pending' && (
            <ReviewUser
              type="review"
              open={open}
              setOpen={setOpen}
              user={user}
              onUnmount={onModalClose}
            />
          )}
          {type === 'denied' && (
            <ReviewUser
              type="reject"
              open={open}
              setOpen={setOpen}
              user={user}
              onUnmount={onModalClose}
            />
          )}
        </>
      )}
    />
  );
};
