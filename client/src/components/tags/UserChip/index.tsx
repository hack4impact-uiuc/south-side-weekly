import React, { FC } from 'react';
import { User } from 'ssw-common';

import './styles.scss';

interface UserChipProps {
  user: Pick<User, '_id' | 'fullname' | 'profilePic' | 'shortName'> | undefined;
}

const UserChip: FC<UserChipProps> = ({ user }) => {
  if (!user) {
    return <></>;
  }

  return (
    <a href={`/profile/${user._id}`}>
      <span className="user-chip-wrapper">
        <img src={user.profilePic} alt={user.fullname} />
        {user.shortName}
      </span>
    </a>
  );
};

export default UserChip;
