import React, { FC, ReactElement, useEffect, useState } from 'react';
import { ActionMeta, SingleValue } from 'react-select';
import { IUser } from 'ssw-common';

import { getUsersByTeam, isError } from '../../../api';
import { rolesEnum } from '../../../utils/enums';
import { getUserFullName } from '../../../utils/helpers';
import Select from '../Select';

type SingleSelectType = (
  newValue: SingleValue<{
    value: string;
    label: string;
  }>,
  actionMeta: ActionMeta<{
    value: string;
    label: string;
  }>,
) => void;

interface UserSingleSelectByTeamProps {
  onChange?: SingleSelectType;
  values?: string;
  teamName: string;
  primary?: boolean;
}

const UserSingleSelectByTeam: FC<UserSingleSelectByTeamProps> = ({
  onChange,
  values,
  teamName,
  primary = false,
}): ReactElement => {
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    const fetchUsersByTeam = async (): Promise<void> => {
      const res = await getUsersByTeam(teamName);

      if (!isError(res)) {
        let teamUsers = res.data.result;

        if (primary) {
          teamUsers = teamUsers.filter((user) => user.role === rolesEnum.ADMIN);
        }

        setUsers(teamUsers);
      }
    };

    fetchUsersByTeam();
  }, [teamName, primary]);

  return (
    <Select
      value={values ? values : ''}
      options={users.map((user) => ({
        value: user._id,
        label: getUserFullName(user),
      }))}
      onChange={onChange as SingleSelectType}
      placeholder="User"
    />
  );
};

export default UserSingleSelectByTeam;
