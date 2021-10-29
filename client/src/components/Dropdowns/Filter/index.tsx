import React, { FC, ReactElement } from 'react';
import { Dropdown, DropdownProps } from 'semantic-ui-react';

import './styles.scss';

const FilterDropdown: FC<DropdownProps> = ({ ...rest }): ReactElement => (
  <Dropdown
    {...rest}
    scrolling
    clearable
    selectOnBlur={false}
    selectOnNavigation={false}
    fluid
    className={`default-filter-dropdown ${rest.className}`}
  >
    <Dropdown.Menu>
      <Dropdown.Header icon="tags" content={rest.placeholder} />
      {rest.options?.map((option, index) => (
        <Dropdown.Item key={index}>{option.value}</Dropdown.Item>
      ))}
    </Dropdown.Menu>
  </Dropdown>
);

export default FilterDropdown;
