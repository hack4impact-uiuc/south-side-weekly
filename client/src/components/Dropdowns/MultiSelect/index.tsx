import React, { FC, ReactElement } from 'react';
import Select, { MultiValue, ActionMeta } from 'react-select';

interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (
    newValue: MultiValue<MultiSelectOption>,
    actionMeta: ActionMeta<MultiSelectOption>,
  ) => void;
  placeholder?: string;
  className?: string;
}

const MultiSelect: FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = '',
  className = '',
}): ReactElement => (
  <Select<MultiSelectOption, true>
    isMulti
    placeholder={placeholder}
    value={options.filter((item) => value.includes(item.value))}
    options={options}
    onChange={onChange}
    closeMenuOnSelect={false}
    hideSelectedOptions={false}
    className={className}
  />
);

export default MultiSelect;
