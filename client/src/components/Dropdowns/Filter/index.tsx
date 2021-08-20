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
  />
);

export default FilterDropdown;
