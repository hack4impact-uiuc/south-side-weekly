import React, { FC, ReactElement } from 'react';
import { WizardPage } from '../../pages/wizard/WizardWrapper';
import '../../css/wizard/WizardPageCounter.css';

interface IProps {
  wizardPages: Array<string>;
  activePage: string;
}

const WizardPageCounter: FC<IProps> = ({
  wizardPages,
  activePage,
}): ReactElement => (
  <div className="page-counter-wrapper">
    {wizardPages.map((wizardPage, index) => (
      <div
        className={`page-icon ${wizardPage === activePage ? 'active' : ''}`}
        key={index}
      >
        {index + 1}
      </div>
    ))}
  </div>
);

export default WizardPageCounter;
