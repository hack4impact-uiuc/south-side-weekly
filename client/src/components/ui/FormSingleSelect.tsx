import { FieldProps } from 'formik';
import React, { FC, ReactElement, useMemo } from 'react';
import cn from 'classnames';

import { SingleSelect } from '../select/SingleSelect';

import './Form.scss';
import { FieldTag } from '..';

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
  name?: string;
}

export const FormSingleSelect: FC<FormSingleSelectProps> = ({
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
        <SingleSelect
          disabled={!editable}
          options={options}
          value={field.value}
          onChange={(value) => setFieldValue(field.name, value?.value)}
        />
      </div>
    ),
    [field, className, label, editable, options, setFieldValue],
  );

  if (!viewable) {
    return <></>;
  } else if (!editable) {
    return (
      <div className={cn('form-field', className)}>
        {label && <label>{label}</label>}
        <div>
          <FieldTag
            content={field.value}
            name={field.value}
            key={field.value}
          />
        </div>
      </div>
    );
  }

  return memoizedJSX;
};
