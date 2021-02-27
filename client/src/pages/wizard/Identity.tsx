import React, { Dispatch, FC, SetStateAction, ReactElement } from 'react';
import { WizardPage } from './WizardWrapper';

interface IProps {
  setGenders: Dispatch<SetStateAction<Array<string>>>;
  setPronouns: Dispatch<SetStateAction<Array<string>>>;
  setRaces: Dispatch<SetStateAction<Array<string>>>;
}

const Identity: FC<IProps> = ({
  setGenders,
  setPronouns,
  setRaces,
}): ReactElement => <div>
  
</div>;

export default Identity;
