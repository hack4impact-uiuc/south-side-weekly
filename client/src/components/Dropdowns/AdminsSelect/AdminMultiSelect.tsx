import React, { FC, ReactElement, useEffect } from 'react';
import { ActionMeta, MultiValue } from 'react-select';
import { IUser } from 'ssw-common';

import { getAdmins, isError } from '../../../api';
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

interface AdminMultiSelectProps {
  onChange?: MultiSelectType;
  values?: string[];
}

const AdminMultiSelect: FC<AdminMultiSelectProps> = ({
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
    <MultiSelect
      options={admins.map((admin) => ({
        value: admin._id,
        label: getUserFullName(admin),
      }))}
      placeholder="Interests"
      onChange={onChange || defaultFunc}
      value={values || []}
    />
  );
};

export default AdminMultiSelect;
