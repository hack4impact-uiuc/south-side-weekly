import React, { FC, ReactElement } from 'react';
import { IUser } from 'ssw-common';

import DynamicTable from '../../DyanmicTable';
import ReviewUserModal from '../../../Modals/ReviewUser';
import {
  nameColumn,
  roleColumn,
  userColumn,
  teamsColumnModal,
  interestsColumnModal,
  onboardDateColumn,
  onboardActionColumn,
} from '../utils';

import './styles.scss';

interface PendingUserProps {
  users: IUser[];
}

const PendingUsers: FC<PendingUserProps> = ({ users }): ReactElement => {
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
        <DynamicTable
          records={users}
          columns={columns}
          singleLine={users.length > 0}
          onRecordClick={(user: IUser) => ReviewUserModal({user})}
        />
      </div>
    </div>
  );
};

export default PendingUsers;
