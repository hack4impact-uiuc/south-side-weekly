import React, { FC, ReactElement } from 'react';
import { IUser } from 'ssw-common';

<<<<<<< HEAD
import { useAuth } from '../../../../contexts';
=======
import { rolesEnum } from '../../../../utils/enums';
>>>>>>> dc00cefbbd8b967d31b74fcedf876cc16b7f7a08
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
<<<<<<< HEAD
=======
  auth?: keyof typeof rolesEnum;
>>>>>>> dc00cefbbd8b967d31b74fcedf876cc16b7f7a08
}

const ApprovedUsers: FC<ApprovedUserProps> = ({
  users,
<<<<<<< HEAD
}): ReactElement => {
  const { isContributor } = useAuth();

=======
  auth,
}): ReactElement => {
>>>>>>> dc00cefbbd8b967d31b74fcedf876cc16b7f7a08
  const columns = [
    userColumn,
    nameColumn,
    roleColumn,
<<<<<<< HEAD
    isContributor
      ? teamsColumnNoModal
      : teamsColumnModal,
    isContributor
=======
    auth && auth === rolesEnum.CONTRIBUTOR
      ? teamsColumnNoModal
      : teamsColumnModal,
    auth && auth === rolesEnum.CONTRIBUTOR
>>>>>>> dc00cefbbd8b967d31b74fcedf876cc16b7f7a08
      ? interestsColumnNoModal
      : interestsColumnModal,
    activityColumn,
    viewDateColumn,
<<<<<<< HEAD
    ...(isContributor ? [] : [viewUserColumn]),
=======
    ...(auth && auth === rolesEnum.CONTRIBUTOR ? [] : [viewUserColumn]),
>>>>>>> dc00cefbbd8b967d31b74fcedf876cc16b7f7a08
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
