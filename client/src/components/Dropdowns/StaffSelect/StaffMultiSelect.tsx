import React, { FC, ReactElement, useEffect } from 'react';
import { ActionMeta, MultiValue } from 'react-select';
import { IUser } from 'ssw-common';

import { getStaff, isError } from '../../../api';
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

interface StaffMultiSelectProps {
  onChange?: MultiSelectType;
  values?: string[];
}

const StaffMultiSelect: FC<StaffMultiSelectProps> = ({
  onChange,
  values,
}): ReactElement => {
  const [staff, setStaff] = React.useState<IUser[]>([]);

  useEffect(() => {
    const fetchStaff = async (): Promise<void> => {
      const res = await getStaff();

      if (!isError(res)) {
        setStaff(res.data.result);
      }
    };

    fetchStaff();
  }, []);

  return (
    <MultiSelect
      options={staff.map((admin) => ({
        value: admin._id,
        label: getUserFullName(admin),
      }))}
      placeholder="Interests"
      onChange={onChange || defaultFunc}
      value={values || []}
    />
  );
};

export default StaffMultiSelect;
