import React, { ReactElement, FC } from 'react';
import { Dropdown, Input } from 'semantic-ui-react';

import { ISelectAttribute } from './types';

const SelectAttribute: FC<ISelectAttribute> = ({
  label,
  value,
  options,
  onChange,
  viewable,
  editable,
}): ReactElement => (
  <>
    {viewable && (
      <div className="input-field">
        <span>{`${label}:`}</span>
        {editable ? (
          <Dropdown
            className="dropdown-field"
            options={options}
            onChange={onChange}
            selection
            floating
            value={value.toUpperCase()}
          />
        ) : (
          <Input value={value} transparent />
        )}
      </div>
    )}
  </>
);

export default SelectAttribute;
