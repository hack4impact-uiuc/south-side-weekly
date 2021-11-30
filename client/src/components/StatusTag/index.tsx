import React, { FC } from 'react';
import { LabelProps } from 'semantic-ui-react';
import { IUser } from 'ssw-common';

import { FieldTag } from '..';
import { statusEnum } from '../../utils/enums';

interface StatusTagProps extends LabelProps {
  user: IUser;
}

const MONTHS_IN_YEAR = 12;

const ACTIVE_PERIOD = 3;
const RECENTLY_ACTIVE = MONTHS_IN_YEAR;

const StatusTag: FC<StatusTagProps> = ({ user, ...rest }) => {
  const getStatus = (): string => {
    const lastActive = new Date(user.lastActive);
    const now = new Date();

    let months =
      (now.getUTCFullYear() - lastActive.getUTCFullYear()) * MONTHS_IN_YEAR;
    months -= lastActive.getUTCMonth();
    months += now.getUTCMonth();
    months = months <= 0 ? 0 : months;

    if (months <= ACTIVE_PERIOD) {
      return statusEnum.ACTIVE;
    } else if (months <= RECENTLY_ACTIVE) {
      return statusEnum.RECENTLY_ACTIVE;
    }

    return statusEnum.INACTIVE;
  };

  return <FieldTag content={getStatus()} {...rest} />;
};

export default StatusTag;
