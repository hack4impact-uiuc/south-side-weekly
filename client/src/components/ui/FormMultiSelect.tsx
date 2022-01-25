import { FieldProps } from 'formik';
import React, { FC, ReactElement, useMemo } from 'react';
import cn from 'classnames';

import { MultiSelect } from '../select/MultiSelect';
import './Form.scss';
import { FieldTag } from '..';

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
  getTagData?: (id: string) => any;
  maxMenuHeight?: number;
}

export const FormMultiSelect: FC<FormMultiSelectProps> = ({
  className,
  viewable = true,
  editable = true,
  label,
  options = [],
  field,
  getTagData = undefined,
  form: { setFieldValue },
  maxMenuHeight,
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
          maxMenuHeight={maxMenuHeight}
        />
      </div>
    ),
    [field, setFieldValue, label, className, options, editable, maxMenuHeight],
  );

  if (!viewable) {
    return <></>;
  } else if (!editable) {
    return (
      <div className={cn('form-field', className)}>
        {label && <label>{label}</label>}
        <div>
          {field.value.map((value: string) => {
            if (getTagData) {
              const data = getTagData(value);
              return (
                <FieldTag name={data?.name} hexcode={data?.color} key={value} />
              );
            }
            <FieldTag content={value} key={value} />;
          })}
        </div>
      </div>
    );
  }

  return memoizedJSX;
};
