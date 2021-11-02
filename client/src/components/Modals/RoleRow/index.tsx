import React, { FC, ReactElement } from 'react';
import { IUser } from 'ssw-common';

import NameTag from '../../NameTag';
import './styles.scss';

interface RoleRowProps {
  users: Partial<IUser>[];
  roleName: string;
}

const RoleRow: FC<RoleRowProps> = ({ users, roleName }): ReactElement => (
  <div className="role-row">
    <div className="row-title">
      <h4>{`${roleName}: `}</h4>
    </div>
    {users?.map((user, index) => (
      <NameTag key={index} user={user} />
    ))}
  </div>
);

export default RoleRow;
