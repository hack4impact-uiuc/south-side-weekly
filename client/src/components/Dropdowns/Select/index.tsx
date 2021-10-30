import React, { FC, ReactElement } from 'react';
import ReactSelect, { SingleValue, ActionMeta } from 'react-select';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: string[];
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
}): ReactElement => {
  const parseOptions = (options: string[]): SelectOption[] =>
    options.map((option) => ({
      label: option,
      value: option,
    }));

  const formmatedOptions = parseOptions(options);

  return (
    <ReactSelect<SelectOption>
      placeholder={placeholder}
      value={formmatedOptions.find((item) => value === item.value)}
      options={formmatedOptions}
      onChange={onChange}
      isClearable
    />
  );
};

export default Select;
