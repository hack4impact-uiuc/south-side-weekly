import React, { FC, ReactElement, ReactNode, useRef } from 'react';
import { IUser } from 'ssw-common';
import { Button } from 'semantic-ui-react';
import toast from 'react-hot-toast';

import ReviewUserModal from '../../../Modals/ReviewUser';
import {
  nameColumn,
  roleColumn,
  userColumn,
  teamsColumnModal,
  interestsColumnModal,
  onboardDateColumn,
} from '../utils';
import { isError, updateOnboardingStatus } from '../../../../api';
import { onboardingStatusEnum } from '../../../../utils/enums';
import './styles.scss';
import { buildColumn } from '../../DynamicTable/util';
import { QueryFunction } from '../../PaginatedTable/types';
import PaginatedTable from '../../PaginatedTable';

interface PendingUserProps {
  query: QueryFunction<IUser>;
}

const PendingUsers: FC<PendingUserProps> = ({ query }): ReactElement => {
  const paginatedTable = useRef<typeof PaginatedTable>();

  const updateUserStatus = async (
    user: IUser,
    status: keyof typeof onboardingStatusEnum,
  ): Promise<void> => {
    const res = await updateOnboardingStatus(user._id, status);
    if (!isError(res)) {
      // TODO: Refetch all data to remove this user from pending
      toast.success('Updated User Status!', {
        position: 'bottom-right',
      });
    }
  };

  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    user: IUser,
    status: keyof typeof onboardingStatusEnum,
  ): void => {
    e.stopPropagation();
    updateUserStatus(user, status);
  };

  const onboardActionColumn = buildColumn<IUser>({
    title: '',
    extractor: function getActions(user: IUser): ReactNode {
      return (
        <div className="actions">
          <Button
            id="decline"
            className="edit-button"
            size="small"
            onClick={(e) => {
              handleClick(e, user, 'DENIED');
            }}
            basic
            compact
          >
            Decline
          </Button>
          <Button
            id="approve"
            className="edit-button"
            size="small"
            onClick={(e) => {
              handleClick(e, user, 'ONBOARDED');
            }}
          >
            Approve
          </Button>
        </div>
      );
    },
  });

  const columns = [
    userColumn,
    nameColumn,
    roleColumn,
    teamsColumnModal,
    interestsColumnModal,
    onboardDateColumn,
    onboardActionColumn,
  ];

  return (
    <div className="table">
      <div className="directory">
        <PaginatedTable<IUser>
          columns={columns}
          query={query}
          emptyMessage={'There are no pending users.'}
          getModal={(user, isOpen, setIsOpen) => (
            <ReviewUserModal
              user={user}
              open={isOpen}
              setOpen={setIsOpen}
              actionUpdate={updateUserStatus}
              type="review"
            />
          )}
        />
      </div>
    </div>
  );
};

export default PendingUsers;
