import { FieldProps } from 'formik';
import React, { FC, ReactElement, useMemo } from 'react';
import cn from 'classnames';

import { SingleSelect } from '../select/SingleSelect';
import { FieldTag } from '..';

import './Form.scss';

interface Option {
  label: string;
  value: string;
}

interface FormSingleSelectProps extends FieldProps<string> {
  className?: string;
  options?: Option[];
  label?: string;
  viewable?: boolean;
  editable?: boolean;
}

export const FormSingleSelect: FC<FormSingleSelectProps> = ({
  className,
  viewable = true,
  editable = true,
  label,
  options = [],
  field,
}): ReactElement => {
  const memoizedJSX = useMemo(
    () => (
      <div className={cn('form-field', className)}>
        {label && <label>{label}</label>}
        <SingleSelect
          options={options}
          value={field.value}
          onChange={field.onChange}
        />
      </div>
    ),
    [field, className, label, options],
  );

  if (!viewable) {
    return <></>;
  } else if (!editable) {
    return <FieldTag content={field.value} key={field.value} />;
  }

  return memoizedJSX;
};
