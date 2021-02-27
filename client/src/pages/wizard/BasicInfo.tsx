import React, { FC, ReactElement, Dispatch, SetStateAction } from 'react';
import { WizardPage } from './WizardWrapper';

interface IProps {
  setFirstName: Dispatch<SetStateAction<string>>;
  setLastName: Dispatch<SetStateAction<string>>;
  setPreferredName: Dispatch<SetStateAction<string>>;
  setPhoneNumber: Dispatch<SetStateAction<string>>;
  handlePageChange(newPage: WizardPage): void;
}

const BasicInfo: FC<IProps> = ({
  setFirstName,
  setLastName,
  setPreferredName,
  setPhoneNumber,
}): ReactElement => <div>test</div>;

export default BasicInfo;
