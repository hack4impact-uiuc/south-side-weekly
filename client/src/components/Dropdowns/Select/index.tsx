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
  className?: string | undefined;
}

const Select: FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = '',
  className = undefined,
}): ReactElement => (
  <ReactSelect<SelectOption>
    placeholder={placeholder}
    value={options.find((item) => value === item.value)}
    options={options}
    onChange={onChange}
    isClearable
    className={className}
  />
);

export default Select;
