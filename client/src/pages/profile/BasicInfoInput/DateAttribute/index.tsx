import React, { ReactElement, FC } from 'react';
import { Input } from 'semantic-ui-react';

import { IDateAttribute } from './types';

const DateAttribute: FC<IDateAttribute> = ({
  label,
  value,
  onChange,
  viewable,
  editable,
  max = new Date(Date.now()).toISOString().split('T')[0],
}): ReactElement => (
  <>
    {viewable && (
      <div className="input-field">
        <span>{`${label}:`}</span>
        {editable ? (
          <Input
            value={new Date(value).toISOString().split('T')[0]}
            transparent
            onChange={onChange}
            type="date"
            max={max}
          />
        ) : (
          <Input
            value={new Date(value).toLocaleDateString('en-US', {
              timeZone: 'UTC',
            })}
            transparent
          />
        )}
      </div>
    )}
  </>
);

export default DateAttribute;
