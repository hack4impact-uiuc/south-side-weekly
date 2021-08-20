import React, { FC, ReactElement } from 'react';
import { Card, CardProps } from 'semantic-ui-react';
import { IUser } from 'ssw-common';

import { classNames, getUserFullName, titleCase } from '../../utils/helpers';
import UserPicture from '../UserPicture';

import './styles.scss';

interface UserCardProps extends CardProps {
  user: IUser;
}

const UserCard: FC<UserCardProps> = ({
  user,
  className,
  ...rest
}): ReactElement => (
  <Card fluid className={classNames('user-card', className)} {...rest}>
    <Card.Content>
      <UserPicture user={user} />
      <div className="name">
        <h2>{getUserFullName(user)}</h2>
      </div>
      <div>
        <h2>{titleCase(user.role)}</h2>
      </div>
    </Card.Content>
  </Card>
);

export default UserCard;
