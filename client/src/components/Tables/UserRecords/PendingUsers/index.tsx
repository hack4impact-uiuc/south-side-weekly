import React, { FC, ReactElement, ReactNode, useEffect, useState } from 'react';
import { IUser } from 'ssw-common';
import { Button } from 'semantic-ui-react';
import toast from 'react-hot-toast';

import DynamicTable from '../../DynamicTable';
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

interface PendingUserProps {
  users: IUser[];
}

const PendingUsers: FC<PendingUserProps> = ({ users }): ReactElement => {
  const [data, setData] = useState<IUser[]>(users);

  const updateUserStatus = async (
    user: IUser,
    status: keyof typeof onboardingStatusEnum,
  ): Promise<void> => {
    const res = await updateOnboardingStatus(user._id, status);
    if (!isError(res)) {
      setData(data.filter((d) => d !== user));
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

  useEffect(() => {
    setData(users);
  }, [users]);

  const columns = [
    userColumn,
    nameColumn,
    roleColumn,
    teamsColumnModal,
    interestsColumnModal,
    onboardDateColumn,
    onboardActionColumn,
  ];

  const view = { records: users, columns };
  return (
    <div className="table">
      <div className="directory">
        <DynamicTable<IUser>
          view={view}
          singleLine={users.length > 0}
          emptyMessage="No pending users!"
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
