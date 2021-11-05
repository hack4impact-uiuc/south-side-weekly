import React, { FC, ReactElement, useEffect } from 'react';
import { ActionMeta, MultiValue } from 'react-select';
import { IUser } from 'ssw-common';

import { getUsersByTeam, isError } from '../../../api';
import { rolesEnum } from '../../../utils/enums';
import { defaultFunc, getUserFullName } from '../../../utils/helpers';
import MultiSelect from '../MultiSelect';

type MultiSelectType = (
  newValue: MultiValue<{
    value: string;
    label: string;
  }>,
  actionMeta: ActionMeta<{
    value: string;
    label: string;
  }>,
) => void;

interface UserMultiSelectByTeamProps {
  onChange?: MultiSelectType;
  values?: string[];
  team: string;
  primary?: boolean;
}

const UserMultiSelectByTeam: FC<UserMultiSelectByTeamProps> = ({
  onChange,
  values,
  team,
  primary = false,
}): ReactElement => {
  const [users, setUsers] = React.useState<IUser[]>([]);

  useEffect(() => {
    const fetchUsersByTeam = async (): Promise<void> => {
      const res = await getUsersByTeam(team);

      if (!isError(res)) {
        let teamUsers = res.data.result;

        if (primary) {
          teamUsers = teamUsers.filter((user) => user.role === rolesEnum.ADMIN);
        }

        setUsers(teamUsers);
      }
    };

    fetchUsersByTeam();
  }, [team, primary]);

  return (
    <MultiSelect
      options={users.map((user) => ({
        value: user._id,
        label: getUserFullName(user),
      }))}
      placeholder="Users"
      onChange={onChange || defaultFunc}
      value={values || []}
    />
  );
};

export default UserMultiSelectByTeam;
