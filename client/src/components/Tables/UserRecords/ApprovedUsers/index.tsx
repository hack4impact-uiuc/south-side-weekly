import React, { FC, ReactElement } from 'react';
import { IUser } from 'ssw-common';

import DynamicTable from '../../DyanmicTable';
import {
  nameColumn,
  roleColumn,
  userColumn,
  viewUserColumn,
  viewDateColumn,
  activityColumn,
  teamsColumnModal,
  interestsColumnModal,
} from '../utils';

interface ApprovedUserProps {
  users: IUser[];
}

const ApprovedUsers: FC<ApprovedUserProps> = ({ users }): ReactElement => {
  const columns = [
    userColumn,
    nameColumn,
    roleColumn,
    teamsColumnModal,
    interestsColumnModal,
    activityColumn,
    viewDateColumn,
    viewUserColumn,
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
