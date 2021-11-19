import React, { FC, ReactElement } from 'react';
import { IUser } from 'ssw-common';

import { useAuth } from '../../../../contexts';
import DynamicTable from '../../DyanmicTable';
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
  users: IUser[];
}

const ApprovedUsers: FC<ApprovedUserProps> = ({
  users,
}): ReactElement => {
  const isContributor = useAuth();
  const columns = [
    userColumn,
    nameColumn,
    roleColumn,
    isContributor
      ? teamsColumnNoModal
      : teamsColumnModal,
    isContributor
      ? interestsColumnNoModal
      : interestsColumnModal,
    activityColumn,
    viewDateColumn,
    ...(isContributor ? [] : [viewUserColumn]),
  ];

  return (
    <div className="table">
      <div className="directory">
        <DynamicTable
          records={users}
          columns={columns}
          singleLine={users.length > 0}
        />
      </div>
    </div>
  );
};

export default ApprovedUsers;
