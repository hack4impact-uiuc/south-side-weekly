import React, { ReactElement, FC } from 'react';
import { SemanticICONS, Grid, Icon, Input } from 'semantic-ui-react';
import { IUser } from 'ssw-common';

interface ISocialsInput {
  icon: SemanticICONS;
  label: keyof IUser;
  value: string;
  isEditMode: boolean;
  updateUserField: <T extends keyof IUser>(key: T, value: IUser[T]) => void;
}

const SocialsInput: FC<ISocialsInput> = ({
  icon,
  label,
  value,
  isEditMode,
  updateUserField,
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
        readOnly={!isEditMode}
        transparent
        onChange={(e) => updateUserField(label, e.currentTarget.value)}
      />
    </Grid.Column>
  </Grid>
);

export default SocialsInput;
