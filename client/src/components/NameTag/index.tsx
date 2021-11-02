import React, { FC, ReactElement } from 'react';
import { Label, LabelProps, Image } from 'semantic-ui-react';
import { IUser } from 'ssw-common';

import './styles.scss';

interface NameTagProps extends LabelProps {
  user: Partial<IUser>;
}

const NameTag: FC<NameTagProps> = ({
  user,
  size = 'mini',
  ...rest
}): ReactElement => {
  const getFirstNameWithInitial = (user: Partial<IUser>): string => {
    const lastNameInitial = user.lastName?.charAt(0);

    return `${user.firstName} ${lastNameInitial}`;
  };

  return (
    <Label
      className="name-tag"
      content={
        <div className="tag-container">
          <Image src={user?.profilePic} avatar />
          <div className="user-name">
            <p>{getFirstNameWithInitial(user)}</p>
          </div>
        </div>
      }
      size={size}
      {...rest}
    />
  );
};

export default NameTag;
