import React, { ReactElement, FC } from 'react';
import { Grid, Icon, Input } from 'semantic-ui-react';

import './styles.css';
import { ISocialsInput } from './types';

const SocialsInput: FC<ISocialsInput> = ({
  icon,
  value,
  readOnly,
  onChange,
  viewable,
}): ReactElement => (
  <>
    {viewable && (
      <Grid className="social-input" columns="equal">
        <Grid.Column className="col" width={2}>
          <Icon size="big" name={icon} />
        </Grid.Column>
        <Grid.Column className="col">
          <Input
            size="big"
            className="input"
            fluid
            value={value}
            readOnly={readOnly}
            transparent
            onChange={onChange}
          />
        </Grid.Column>
      </Grid>
    )}
  </>
);

export default SocialsInput;
