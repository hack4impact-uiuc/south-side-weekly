import { FieldProps } from 'formik';
import { Form } from 'semantic-ui-react';
import React, { FC, ReactElement, useMemo } from 'react';
import cn from 'classnames';

import './Form.scss';

interface FormInputProps extends FieldProps<string> {
  className?: string;
}

export const FormInput: FC<FormInputProps> = ({
  className,
  field,
  ...props
}): ReactElement =>
  useMemo(
    () => (
      <div className={cn('form-field', className)}>
        <Form.Input fluid {...field} {...props} />
      </div>
    ),
    [field, className, props],
  );
