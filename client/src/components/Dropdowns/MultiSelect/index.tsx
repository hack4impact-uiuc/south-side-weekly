import React, { FC, ReactElement } from 'react';
import Select, { MultiValue, ActionMeta } from 'react-select';

interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: string[];
  value: string[];
  onChange: (
    newValue: MultiValue<MultiSelectOption>,
    actionMeta: ActionMeta<MultiSelectOption>,
  ) => void;
  placeholder?: string;
}

const MultiSelect: FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = '',
}): ReactElement => {
  const parseOptions = (options: string[]): MultiSelectOption[] =>
    options.map((option) => ({
      label: option,
      value: option,
    }));

  const formattedOptions = parseOptions(options);

  return (
    <Select<MultiSelectOption, true>
      isMulti
      placeholder={placeholder}
      value={formattedOptions.filter((item) => value.includes(item.value))}
      options={formattedOptions}
      onChange={onChange}
      closeMenuOnSelect={false}
      hideSelectedOptions={false}
    />
  );
};

export default MultiSelect;