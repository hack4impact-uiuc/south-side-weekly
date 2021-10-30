import React, { FC, ReactElement } from 'react';
import { IUser } from 'ssw-common';

import NameTag from '../../NameTag';

import './styles.scss';
interface RoleTagProps {
  users: (Partial<IUser> | undefined)[] | Partial<IUser>[] | undefined;
  roleName: string;
}
const RoleTag: FC<RoleTagProps> = ({ users, roleName }): ReactElement => (
  <div className="role-row">
    <div className="row-title">
      <h4>{`${roleName}: `}</h4>
    </div>
    {users?.map((user, index) => (
      <NameTag key={index} user={user}></NameTag>
    ))}
  </div>
);

export default RoleTag;
