import { FieldProps } from 'formik';
import React, { FC, ReactElement, useMemo } from 'react';
import cn from 'classnames';

import { MultiSelect } from '../select/MultiSelect';
import './Form.scss';

interface Option {
  label: string;
  value: string;
}

interface FormMultiSelectProps extends FieldProps<string[]> {
  className?: string;
  options?: Option[];
  label?: string;
  viewable?: boolean;
  editable?: boolean;
}

export const FormMultiSelect: FC<FormMultiSelectProps> = ({
  className,
  viewable = true,
  editable = true,
  label,
  options = [],
  field,
  form: { setFieldValue },
}): ReactElement => {
  const memoizedJSX = useMemo(
    () => (
      <div className={cn('form-field', className)}>
        {label && <label>{label}</label>}
        <MultiSelect
          options={options}
          value={field.value}
          disabled={!editable}
          onChange={(values) =>
            setFieldValue(
              field.name,
              values.map((v) => v.value),
            )
          }
        />
      </div>
    ),
    [field, setFieldValue, label, className, options, editable],
  );

  if (!viewable) {
    return <></>;
  }

  return memoizedJSX;
};
