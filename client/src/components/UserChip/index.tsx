import React, { FC } from 'react';
import { IUser } from 'ssw-common';
import { getUserFullName, getUserShortName } from '../../utils/helpers';

import './styles.scss';

interface UserChipProps {
  user: Partial<IUser>;
}

const UserChip: FC<UserChipProps> = ({ user }) => {
  const userProfileUrl = `/profile/${user._id}`;
  return (
    <a href={userProfileUrl}>
      <span className="user-chip-wrapper">
        <img src={user.profilePic} alt={getUserFullName(user)} />
        {getUserShortName(user)}
      </span>
    </a>
  );
};

export default UserChip;
