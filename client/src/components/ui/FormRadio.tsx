import { FieldProps } from 'formik';
import { Form } from 'semantic-ui-react';
import React, { FC, ReactElement, useMemo } from 'react';
import cn from 'classnames';

import './Form.scss';

interface FormRadioProps extends FieldProps<string> {
  className?: string;
  label?: string;
}

export const FormRadio: FC<FormRadioProps> = ({
  className,
  label,
  field,
  form: { setFieldValue },
  ...props
}): ReactElement =>
  useMemo(
    () => (
      <div className={cn('form-field', className)}>
        <Form.Radio
          label={label}
          {...field}
          {...props}
          onChange={() => setFieldValue(field.name, field.value)}
        />
      </div>
    ),
    [setFieldValue, className, label, field, props],
  );
