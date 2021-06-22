import React, { ReactElement, FC } from 'react';
import { Input } from 'semantic-ui-react';

import { IStringAttribute } from './types';

const StringAttribute: FC<IStringAttribute> = ({
  label,
  value,
  readOnly,
  onChange,
  viewable,
}): ReactElement => (
  <>
    {viewable && (
      <div className="input-field">
        <span>{`${label}:`}</span>
        <Input
          value={value}
          transparent
          readOnly={readOnly}
          onChange={onChange}
        />
      </div>
    )}
  </>
);

export default StringAttribute;
