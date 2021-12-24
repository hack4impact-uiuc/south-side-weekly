import React, { ReactElement } from 'react';
import ReactSelect, { SingleValue, ActionMeta } from 'react-select';
import cn from 'classnames';

export interface SelectOption<T> {
  value: T;
  label: string;
}

export interface SelectProps<T> {
  options: SelectOption<T>[];
  value: T;
  onChange: (
    newValue: SingleValue<SelectOption<T>>,
    actionMeta: ActionMeta<SelectOption<T>>,
  ) => void;
  placeholder?: string;
  className?: string | undefined;
  isClearable?: boolean;
  maxMenuHeight?: number;
}

export const SingleSelect = <SelectOptionValue,>({
  options,
  value,
  onChange,
  placeholder = '',
  className,
  isClearable = true,
  maxMenuHeight,
}: SelectProps<SelectOptionValue>): ReactElement => (
  <ReactSelect<SelectOption<SelectOptionValue>>
    placeholder={placeholder}
    value={options.find((item) => value === item.value)}
    options={options}
    onChange={onChange}
    isClearable={isClearable}
    className={cn(className)}
    menuPlacement={'auto'}
    maxMenuHeight={maxMenuHeight}
  />
);
