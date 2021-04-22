import React, { FC, ReactElement } from 'react';
import { Button } from 'semantic-ui-react';

import '../css/wizard/WizardPageCounter.css';

interface IProps {
  wizardPages: Array<string>;
  activePage: string;
  pageChanger(page: string): void;
}

/**
 * Builds the a counter display to represent what page the user is on
 *
 * @param {Array<string>} wizardPages an array of strings representing each page of the onboarding wizard
 * @param {string} activePage the page the user is currently viewing
 * @param {(page: string): void} pageChanger a function to change the current page
 */
const WizardPageCounter: FC<IProps> = ({
  wizardPages,
  activePage,
  pageChanger,
}): ReactElement => (
  <div className="page-counter-wrapper">
    {wizardPages.map((wizardPage, index) => (
      <Button
        onClick={() => pageChanger(wizardPage)}
        circular
        className={`page-icon ${wizardPage === activePage ? 'active' : ''}`}
        key={index}
      >
        {index + 1}
      </Button>
    ))}
  </div>
);

export default WizardPageCounter;
