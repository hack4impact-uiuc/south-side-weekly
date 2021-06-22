import React, { ReactElement, FC } from 'react';
import { Dropdown, Input } from 'semantic-ui-react';

import { IArrayAttribute } from './types';

const ArrayAttribute: FC<IArrayAttribute> = ({
  label,
  value,
  options,
  onChange,
  onAddItem,
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
            search
            selection
            floating
            multiple
            allowAdditions
            value={value}
            onAddItem={onAddItem}
            onChange={onChange}
          />
        ) : (
          <Input value={value.join(', ')} transparent />
        )}
      </div>
    )}
  </>
);

export default ArrayAttribute;
