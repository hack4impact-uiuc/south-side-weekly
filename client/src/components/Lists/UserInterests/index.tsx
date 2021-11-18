import React, { FC, ReactElement } from 'react';
import { IUser } from 'ssw-common';

import { FieldTag } from '../..';
import { useInterests } from '../../../contexts';

interface UserInterestsProps {
  user: IUser;
}

const UserInterests: FC<UserInterestsProps> = ({ user }): ReactElement => {
  const { getInterestById } = useInterests();

  return (
    <>
      {user.interests.map((interest, index) => (
        <FieldTag
          size="small"
          key={index}
          name={getInterestById(interest)?.name}
          hexcode={getInterestById(interest)?.color}
        />
      ))}
    </>
  );
};

export default UserInterests;
