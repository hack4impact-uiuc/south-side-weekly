import React, { FC } from 'react';
import { LabelProps } from 'semantic-ui-react';
import { IUser } from 'ssw-common';

import { FieldTag } from '..';
import { statusEnum } from '../../utils/enums';

interface StatusTagProps extends LabelProps {
  user: IUser;
}

const ACTIVE_PERIOD = 3;

const StatusTag: FC<StatusTagProps> = ({ user, ...rest }) => {
  const getStatus = (): string => {
    const lastActive = new Date(user.lastActive);
    const now = new Date();

    const threeMonthsAgo = new Date(
      now.getUTCFullYear(),
      now.getUTCMonth() - ACTIVE_PERIOD,
      now.getUTCDate(),
    );
    const oneYearAgo = new Date(
      now.getUTCFullYear() - 1,
      now.getUTCMonth(),
      now.getUTCDate(),
    );

    if (lastActive >= threeMonthsAgo) {
      return statusEnum.ACTIVE;
    } else if (lastActive >= oneYearAgo) {
      return statusEnum.RECENTLY_ACTIVE;
    }

    return statusEnum.INACTIVE;
  };

  return <FieldTag content={getStatus()} {...rest} />;
};

export default StatusTag;
