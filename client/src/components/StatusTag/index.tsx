import React, { FC } from 'react';
import { LabelProps } from 'semantic-ui-react';
import { IUser } from 'ssw-common';

import { FieldTag } from '..';
import { statusEnum } from '../../utils/enums';

interface StatusTagProps extends LabelProps {
  user: IUser;
}

const ACTIVE_PERIOD = 3;
const RECENTLY_ACTIVE_PERIOD = 12;

const StatusTag: FC<StatusTagProps> = ({ user, ...rest }) => {
  const getStatus = (): string => {
    const lastActive = new Date(user.lastActive);
    const now = new Date();

    const latestActiveStartPeriod = new Date(
      now.getUTCFullYear(),
      now.getUTCMonth() - ACTIVE_PERIOD,
      now.getUTCDate(),
    );
    const latestRecentlyActiveStartPeriod = new Date(
      now.getUTCFullYear(),
      now.getUTCMonth() - RECENTLY_ACTIVE_PERIOD,
      now.getUTCDate(),
    );

    if (lastActive >= latestActiveStartPeriod) {
      return statusEnum.ACTIVE;
    } else if (lastActive >= latestRecentlyActiveStartPeriod) {
      return statusEnum.RECENTLY_ACTIVE;
    }

    return statusEnum.INACTIVE;
  };

  return <FieldTag content={getStatus()} {...rest} />;
};

export default StatusTag;
