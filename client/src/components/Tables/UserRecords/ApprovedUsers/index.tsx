import React, { FC, ReactElement } from 'react';
import { IUser } from 'ssw-common';

import { rolesEnum } from '../../../../utils/enums';
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
  auth?: keyof typeof rolesEnum;
}

const ApprovedUsers: FC<ApprovedUserProps> = ({
  users,
  auth,
}): ReactElement => {
  const columns = [
    userColumn,
    nameColumn,
    roleColumn,
    auth && auth === rolesEnum.CONTRIBUTOR
      ? teamsColumnNoModal
      : teamsColumnModal,
    auth && auth === rolesEnum.CONTRIBUTOR
      ? interestsColumnNoModal
      : interestsColumnModal,
    activityColumn,
    viewDateColumn,
    ...(auth && auth === rolesEnum.CONTRIBUTOR ? [] : [viewUserColumn]),
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
