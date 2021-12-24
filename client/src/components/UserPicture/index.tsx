import React, { FC, ReactElement } from 'react';
import { Image, ImageProps } from 'semantic-ui-react';
import { User } from 'ssw-common';
import { isEmpty } from 'lodash';

import { classNames } from '../../utils/helpers';
import DefaultProfile from '../../assets/default_profile.png';

interface UserPictureProps extends ImageProps {
  user: Pick<User, 'profilePic' | 'fullname'>;
}

const UserPicture: FC<UserPictureProps> = ({
  user,
  size = 'mini',
  className,
  ...rest
}): ReactElement => {
  const getPicture = (pic: string): string =>
    !isEmpty(pic) ? pic : DefaultProfile;

  return (
    <Image
      circular
      size={size}
      src={getPicture(user.profilePic)}
      alt={user.fullname}
      className={classNames('user-picture', className)}
      onError={(e: any) => (e.target.src = DefaultProfile)}
      {...rest}
    />
  );
};

export default UserPicture;
