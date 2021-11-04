import React, { FC, ReactElement, useEffect } from 'react';
import { ActionMeta, SingleValue } from 'react-select';
import { IUser } from 'ssw-common';

import { getStaff, isError } from '../../../api';
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

interface StaffSingleSelectProps {
  onChange?: SingleSelectType;
  values?: string;
}

const StaffSingleSelect: FC<StaffSingleSelectProps> = ({
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
    <Select
      value={values ? values : ''}
      options={staff.map((admin) => ({
        value: admin._id,
        label: getUserFullName(admin),
      }))}
      onChange={onChange as SingleSelectType}
      placeholder="Role"
    />
  );
};

export default StaffSingleSelect;
