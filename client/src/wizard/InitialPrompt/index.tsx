import React, { FC, ReactElement, MouseEvent } from 'react';
import { Button } from 'semantic-ui-react';

import Icon from '../../assets/info.svg';
import { WizardSvg } from '../../components';
import './styles.css';

interface IProps {
  handleRole(e: MouseEvent<HTMLButtonElement>): void;
}

/**
 * Builds and controls the form management for the Initial Prompt of the Onboarding Wizard
 *
 * @param {(e: MouseEvent<HTMLButtonElement) : void} handleRole updates role React state variable
 */
const WizardInitialPrompt: FC<IProps> = ({ handleRole }): ReactElement => (
  <div className="initial-prompt">
    <div className="header-text">Are you joining as a...</div>
    <WizardSvg page="onboard0" />
    <div className="btn-group">
      <div className="btn-wrapper">
        <Button
          onClick={handleRole}
          name="role"
          value="CONTRIBUTOR"
          className="btn"
        >
          Contributor
        </Button>
        <img className="icon" alt="icon symbol" src={Icon} />
        <div className="hide">
          If you're interested in writing, editing, designing, illustrating,
          photographing, or fact-checking, this one is for you!
        </div>
      </div>
      <div className="btn-wrapper">
        <Button onClick={handleRole} name="role" value="STAFF" className="btn">
          Staff Member
        </Button>
        <img className="icon" alt="icon symbol" src={Icon} />
        <div className="hide">
          If you're an employee or a contractor, this one is for you!
        </div>
      </div>
    </div>
  </div>
);

export default WizardInitialPrompt;
