import { FieldProps } from 'formik';
import { Form } from 'semantic-ui-react';
import React, { FC, ReactElement, useMemo } from 'react';
import cn from 'classnames';

import './Form.scss';

interface FormInputProps extends FieldProps<string> {
  className?: string;
  editable?: boolean;
  label?: string;
  type?: string;
}

const SECS = 50000000;

export const FormInput: FC<FormInputProps> = ({
  className,
  editable = true,
  field,
  label,
  type,
  ...props
}): ReactElement => {
  const memoizedJSX = useMemo(
    () => (
      <div className={cn('form-field', className)}>
        {label && <label>{label}</label>}
        <Form.Input fluid {...field} {...props} />
      </div>
    ),
    [field, label, className, props],
  );

  if (!editable) {
    return (
      <div className={cn('form-field', className)}>
        <label>{label}</label>
        {type === 'date' ? (
          <p>
            {new Date(
              new Date(field.value).getTime() + SECS,
            ).toLocaleDateString()}
          </p>
        ) : (
          <p>{field.value}</p>
        )}
      </div>
    );
  }

  return memoizedJSX;
};
