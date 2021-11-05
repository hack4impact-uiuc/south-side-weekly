import React, { FC, ReactElement } from 'react';
import ReactSelect, { SingleValue, ActionMeta } from 'react-select';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (
    newValue: SingleValue<SelectOption>,
    actionMeta: ActionMeta<SelectOption>,
  ) => void;
  placeholder?: string;
}

const Select: FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = '',
}): ReactElement => (
  <ReactSelect<SelectOption>
    placeholder={placeholder}
    value={options.find((item) => value === item.value)}
    options={options}
    onChange={onChange}
    isClearable
  />
);

export default Select;
