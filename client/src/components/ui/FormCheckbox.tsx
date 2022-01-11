import { FieldProps } from 'formik';
import { Form } from 'semantic-ui-react';
import React, { FC, ReactElement, useMemo } from 'react';
import cn from 'classnames';

import './Form.scss';

interface FormCheckboxProps extends FieldProps<boolean> {
  className?: string;
  label?: string;
}

export const FormCheckbox: FC<FormCheckboxProps> = ({
  className,
  label,
  field,
  form: { setFieldValue },
  ...props
}): ReactElement => {
  const memoizedJSX = useMemo(
    () => (
      <div>
        <Form.Checkbox
          id="option-label"
          className={cn('form-field', className)}
          fluid
          checked={field.value}
          onChange={(e, { checked }) => {
            setFieldValue(field.name, checked);
          }}
          label={label}
          {...props}
        />
      </div>
    ),
    [field, setFieldValue, className, label, props],
  );

  return memoizedJSX;
};
