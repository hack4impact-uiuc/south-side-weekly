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
  name?: string;
  tagColor?: string;
}

export const FormSingleSelect: FC<FormSingleSelectProps> = ({
  className,
  viewable = true,
  editable = true,
  label,
  options = [],
  field,
  tagColor = undefined,
  form: { setFieldValue },
}): ReactElement => {
  const memoizedJSX = useMemo(
    () => (
      <div className={cn('form-field', className)}>
        {label && <label>{label}</label>}
        <SingleSelect
          options={options}
          value={field.value}
          onChange={(value) => setFieldValue(field.name, value?.value)}
        />
      </div>
    ),
    [field, className, label, options, setFieldValue],
  );

  if (!viewable) {
    return <></>;
  } else if (!editable) {
    <div className={cn('form-field', className)}>
      {label && <label>{label}</label>}{' '}
      {() => {
        if (tagColor) {
          return <FieldTag name={field.value} hexcode={tagColor} />;
        }
        return <FieldTag content={field.value} key={field.value} />;
      }}
    </div>;
  }

  return memoizedJSX;
};
