import React, { FC, Dispatch, SetStateAction, ReactElement } from 'react';
import { TextArea } from 'semantic-ui-react';

import InvolvementSVG from '../../assets/involvement-page.svg';
import RequiredSvg from '../../assets/required.svg';

import '../../css/wizard/Onboard4.css';

interface IProps {
  reasonsForInvolvement: string;
  setReasonsForInvolvement: Dispatch<SetStateAction<string>>;
}

const Onboard4: FC<IProps> = ({
  reasonsForInvolvement,
  setReasonsForInvolvement,
}): ReactElement => (
  <div className="involvement-wrapper">
    <img alt="Involvement" className="page-svg" src={InvolvementSVG} />
    <div className="involvement-content">
      <div className="page-text">
        Tell us how you want to get involved and why. If you have relevant
        experience, please briefly share too.
        <img alt="required" className="required-icon" src={RequiredSvg} />
      </div>

      <TextArea
        value={reasonsForInvolvement}
        onChange={(e) => setReasonsForInvolvement(e.currentTarget.value)}
        className="response-text-area"
      />
    </div>
  </div>
);

export default Onboard4;
