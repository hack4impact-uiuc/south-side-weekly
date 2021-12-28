import React, { FC } from 'react';
import { User } from 'ssw-common';
import cn from 'classnames';

import './styles.scss';

interface UserChipProps {
  user: Pick<User, '_id' | 'fullname' | 'profilePic' | 'shortName'> | undefined;
  className?: string;
}

const UserChip: FC<UserChipProps> = ({ user, className }) => {
  if (!user) {
    return <></>;
  }

  return (
    <a className={className} href={`/profile/${user._id}`}>
      <span className={cn('user-chip-wrapper')}>
        <img src={user.profilePic} alt={user.fullname} />
        {user.shortName}
      </span>
    </a>
  );
};

export default UserChip;
