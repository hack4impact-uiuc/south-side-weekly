import React, { FC, ReactElement } from 'react';
import { User } from 'ssw-common';

import UserChip from '../../tag/UserChip';

import './styles.scss';

interface RoleRowProps {
  users: User[];
  roleName: string;
}

const RoleRow: FC<RoleRowProps> = ({ users, roleName }): ReactElement => (
  <div className="role-row">
    <div className="row-title">
      <h4>{`${roleName}: `}</h4>
    </div>
    {users?.map((user, index) =>
      user ? <UserChip key={index} user={user} /> : <></>,
    )}
  </div>
);

export default RoleRow;
