import React, { FC, ReactElement, MouseEvent } from 'react';
import { Button } from 'semantic-ui-react';

import RolePageSVG from '../../assets/role-page.svg';
import Icon from '../../assets/info.svg';
import '../../css/wizard/InitialPrompt.css';

interface IProps {
  handleRole(e: MouseEvent<HTMLButtonElement>): void;
}

const WizardInitialPrompt: FC<IProps> = ({ handleRole }): ReactElement => (
  <div className="initial-prompt">
    <div className="header-text">Are you joining as a...</div>
    <img className="page-image" src={RolePageSVG} alt="role page" />
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
          If you're an employee or a contractor, this one is for you!
        </div>
      </div>
    </div>
  </div>
);

export default WizardInitialPrompt;
