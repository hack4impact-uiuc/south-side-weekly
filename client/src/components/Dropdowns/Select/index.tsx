import React, { FC, ReactElement } from 'react';
import ReactSelect, { SingleValue, ActionMeta } from 'react-select';

interface SelectOption<SelectOptionValue> {
  value: SelectOptionValue;
  label: string;
}

interface SelectProps<SelectOptionValue> {
  options: SelectOption<SelectOptionValue>[];
  value: SelectOptionValue;
  onChange: (
    newValue: SingleValue<SelectOption<SelectOptionValue>>,
    actionMeta: ActionMeta<SelectOption<SelectOptionValue>>,
  ) => void;
  placeholder?: string;
  className?: string | undefined;
  isClearable?: boolean;
}

const Select = <SelectOptionValue,>({
  options,
  value,
  onChange,
  placeholder = '',
  className = undefined,
  isClearable = true,
}: SelectProps<SelectOptionValue>): ReactElement => (
  <ReactSelect<SelectOption<SelectOptionValue>>
    placeholder={placeholder}
    value={options.find((item) => value === item.value)}
    options={options}
    onChange={onChange}
    isClearable={isClearable}
    className={className}
    menuPlacement={'auto'}
  />
);

export default Select;
