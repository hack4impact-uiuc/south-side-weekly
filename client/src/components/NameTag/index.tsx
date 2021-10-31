import React, { FC, ReactElement } from 'react';
import { Label, LabelProps, Image } from 'semantic-ui-react';
import { IUser } from 'ssw-common';

import { getUserFullName } from '../../utils/helpers';

import './styles.scss';
interface NameTagProps extends LabelProps {
  user: Partial<IUser>;
}
const NameTag: FC<NameTagProps> = ({
  user,
  size = 'mini',
  ...rest
}): ReactElement => {
  const getUserName = (fullName: string): string => {
    if (fullName === '') {
      return '';
    }
    const firstLast = fullName.split(' ');
    const lastInitial = firstLast[1].charAt(0);

    return `${firstLast[0]} ${lastInitial}.`;
  };

  return (
    <Label
      className="name-tag"
      content={
        <div className="tag-container">
          <Image src={user?.profilePic} avatar />
          <div className="user-name">
            <p>{getUserName(getUserFullName(user))}</p>
          </div>
        </div>
      }
      size={size}
      {...rest}
    />
  );
};

export default NameTag;
