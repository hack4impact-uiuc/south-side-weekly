import React, { ReactElement, FC } from 'react';
import {
  SemanticICONS,
  Grid,
  Icon,
  Input,
  InputProps,
} from 'semantic-ui-react';

import './styles.css';

interface InputOnChangeData extends InputProps {
  value: string;
}
interface ISocialsInput {
  icon: SemanticICONS;
  value: string;
  readOnly: boolean;
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    data: InputOnChangeData,
  ) => void;
}

const SocialsInput: FC<ISocialsInput> = ({
  icon,
  value,
  readOnly,
  onChange,
}): ReactElement => (
  <Grid className="social-input" columns="equal">
    <Grid.Column className="col" width={2}>
      <Icon size="big" name={icon} />
    </Grid.Column>
    <Grid.Column className="col">
      <Input
        size="big"
        style={{ border: 'solid 1px', borderRadius: '1rem', padding: '5px' }}
        fluid
        value={value}
        readOnly={readOnly}
        transparent
        onChange={onChange}
      />
    </Grid.Column>
  </Grid>
);

export default SocialsInput;
