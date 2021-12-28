import { FieldProps } from 'formik';
import { Form } from 'semantic-ui-react';
import React, { FC, ReactElement, ReactNode, useMemo } from 'react';
import cn from 'classnames';

import './Form.scss';

interface FormTextAreaProps extends FieldProps<string> {
  className?: string;
  label?: ReactNode;
}

export const FormTextArea: FC<FormTextAreaProps> = ({
  className,
  label,
  field,
  ...props
}): ReactElement => {
  const memoizedJSX = useMemo(
    () => (
      <div className={cn('form-field', className)}>
        {label && <label>{label}</label>}
        <Form.TextArea {...field} {...props} />
      </div>
    ),
    [field, className, props, label],
  );

  return memoizedJSX;
};
