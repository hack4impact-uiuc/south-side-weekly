import React, { FC, ReactElement } from 'react';
import { Image, ImageProps } from 'semantic-ui-react';
import { IUser } from 'ssw-common';
import { isEmpty } from 'lodash';

import { classNames, getUserFullName } from '../../utils/helpers';
import DefaultProfile from '../../assets/default_profile.png';

interface UserPictureProps extends ImageProps {
  user: Partial<IUser>;
}

const UserPicture: FC<UserPictureProps> = ({
  user,
  size = 'mini',
  className,
  ...rest
}): ReactElement => {
  const getPicture = (profilePic: IUser['profilePic'] = ''): string =>
    !isEmpty(profilePic) ? profilePic : DefaultProfile;

  return (
    <Image
      circular
      size={size}
      src={getPicture(user.profilePic)}
      alt={getUserFullName(user)}
      className={classNames('user-picture', className)}
      {...rest}
    />
  );
};

export default UserPicture;
