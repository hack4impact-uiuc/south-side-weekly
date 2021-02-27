import React, { FC, ReactElement, MouseEvent } from 'react';
import { Button } from 'semantic-ui-react';

import Icon from '../../assets/info.svg';
import '../../css/wizard/InitialPrompt.css';

interface IProps {
  handleRole(e: MouseEvent<HTMLButtonElement>): void;
}

const WizardInitialPrompt: FC<IProps> = ({ handleRole }): ReactElement => (
  <div className="initial-prompt">
    <div className="header-text">Are you joining as a...</div>
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
          photogrpahing, or fact-checking, this one is for you!
        </div>
      </div>
      <div className="btn-wrapper">
        <Button onClick={handleRole} name="role" value="STAFF" className="btn">
          Staff Member
        </Button>
        <img className="icon" alt="icon symbol" src={Icon} />
        <div className="hide">
          Put some text here please Alice, idk what to write
        </div>
      </div>
    </div>
  </div>
);

export default WizardInitialPrompt;
