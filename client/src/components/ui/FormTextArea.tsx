import { FieldProps } from 'formik';
import { Form } from 'semantic-ui-react';
import React, { FC, ReactElement, ReactNode, useMemo } from 'react';
import cn from 'classnames';

import './Form.scss';

interface FormTextAreaProps extends FieldProps<string> {
  className?: string;
  label?: ReactNode;
  editable?: string;
}

export const FormTextArea: FC<FormTextAreaProps> = ({
  className,
  label,
  field,
  editable = true,
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

  if (!editable) {
    return (
      <div className={cn('form-field', className)}>
        <label>{label}</label>
        <p>{field.value}</p>
      </div>
    );
  }

  return memoizedJSX;
};
