import React, { FC, Dispatch, SetStateAction, ReactElement } from 'react';
import { Form } from 'semantic-ui-react';

import InvolvementSVG from '../../assets/involvement-page.svg';
import WizardStar from '../../components/WizardStar';

import '../../css/wizard/Onboard4.css';

interface IProps {
  reasonsForInvolvement: string;
  setReasonsForInvolvement: Dispatch<SetStateAction<string>>;
}

/**
 * Builds and controls the form management for Onboard4 of the Onboarding Wizard
 *
 * @param {string} reasonsForInvolvement the user response to the reason they want to be involved
 */
const Onboard4: FC<IProps> = ({
  reasonsForInvolvement,
  setReasonsForInvolvement,
}): ReactElement => (
  <div className="involvement-wrapper">
    <img alt="Involvement" className="page-svg" src={InvolvementSVG} />
    <div className="involvement-content">
      <div className="page-text">
        <WizardStar />
        Tell us how you want to get involved and why. If you have relevant
        experience, please briefly share too.
      </div>
      <Form>
        <Form.TextArea
          required
          value={reasonsForInvolvement}
          onChange={(e) => setReasonsForInvolvement(e.currentTarget.value)}
          className="response-text-area"
          error={reasonsForInvolvement === ''}
        />
      </Form>
    </div>
  </div>
);

export default Onboard4;
