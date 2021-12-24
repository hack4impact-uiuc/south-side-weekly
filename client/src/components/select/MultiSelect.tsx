import React, { FC, ReactElement } from 'react';
import Select, { MultiValue, ActionMeta, StylesConfig } from 'react-select';

export interface MultiSelectOption {
  value: string;
  label: string;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (
    newValue: MultiValue<MultiSelectOption>,
    actionMeta: ActionMeta<MultiSelectOption>,
  ) => void;
  placeholder?: string;
  className?: string;
  styles?: StylesConfig<MultiSelectOption>;
  maxMenuHeight?: number;
}

export const MultiSelect: FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = '',
  className = '',
  styles = {},
  maxMenuHeight,
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
    styles={styles}
    maxMenuHeight={maxMenuHeight}
  />
);
