import React, { FC, ReactElement, useEffect } from 'react';
import { ActionMeta, SingleValue } from 'react-select';
import { IUser } from 'ssw-common';

import { getAdmins, isError } from '../../../api';
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

interface AdminSingleSelectProps {
  onChange?: SingleSelectType;
  values?: string;
}

const AdminSingleSelect: FC<AdminSingleSelectProps> = ({
  onChange,
  values,
}): ReactElement => {
  const [admins, setAdmins] = React.useState<IUser[]>([]);

  useEffect(() => {
    const fetchAdmins = async (): Promise<void> => {
      const res = await getAdmins();

      if (!isError(res)) {
        setAdmins(res.data.result);
      }
    };

    fetchAdmins();
  }, []);

  return (
    <Select
      value={values ? values : ''}
      options={admins.map((admin) => ({
        value: admin._id,
        label: getUserFullName(admin),
      }))}
      onChange={onChange as SingleSelectType}
      placeholder="Role"
    />
  );
};

export default AdminSingleSelect;
