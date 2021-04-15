import React, { Dispatch, FC, ReactElement, SetStateAction } from 'react';
import { Input } from 'semantic-ui-react';

import WizardSvg from '../../components/WizardSvg';

import '../../css/wizard/Onboard7.css';

interface IProps {
  portfolio: string;
  linkedIn: string;
  twitter: string;
  setPortfolio: Dispatch<SetStateAction<string>>;
  setLinkedIn: Dispatch<SetStateAction<string>>;
  setTwitter: Dispatch<SetStateAction<string>>;
}

/**
 * Builds and controls the form management for Onboard7 of the Onboarding Wizard
 *
 * @param {string} portfolio the link to the users portfolio
 * @param {string} linkedIn the link to the users linkedIn profile
 * @param {string} twitter the link to the users twitter profile
 * @param {Dispatch<SetStateAction<string>>} setPortfolio React setter function to update portfolio link
 * @param {Dispatch<SetStateAction<string>>} setLinkedIn React setter function to update linkedIn link
 * @param {Dispatch<SetStateAction<string>>} setTwitter React setter function to update twitter link
 */
const Onboard7: FC<IProps> = ({
  portfolio,
  linkedIn,
  twitter,
  setPortfolio,
  setLinkedIn,
  setTwitter,
}): ReactElement => (
  <div className="onboard7-wrapper">
    <WizardSvg page="onboard7" />
    <div className="onboard7-content">
      <div className="input-wrapper">
        <div className="label">Portfolio Link</div>
        <Input
          defaultValue={portfolio}
          onChange={(e) => setPortfolio(e.currentTarget.value)}
          focus
          transparent
          className="input"
        />
      </div>
      <div className="input-wrapper">
        <div className="label">LinkedIn Link</div>
        <Input
          defaultValue={linkedIn}
          onChange={(e) => setLinkedIn(e.currentTarget.value)}
          focus
          transparent
          className="input"
        />
      </div>
      <div className="input-wrapper">
        <div className="label">Twitter Link</div>
        <Input
          defaultValue={twitter}
          onChange={(e) => setTwitter(e.currentTarget.value)}
          focus
          transparent
          className="input"
        />
      </div>
    </div>
  </div>
);

export default Onboard7;
