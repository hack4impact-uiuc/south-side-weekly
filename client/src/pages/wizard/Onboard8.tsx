import React, { ReactElement } from 'react';
import { Button } from 'semantic-ui-react';
import { openPopupWidget } from 'react-calendly';

import '../../css/wizard/Onboard8.css';
import Onboard8SVG from '../../assets/onboard8.svg';
import RequiredSVG from '../../assets/required.svg';

const Onboard8 = (): ReactElement => (
  <div className="onboard8-wrapper">
    <img className="page-svg" alt="Oboard 8" src={Onboard8SVG} />
    <div className="onboard8-content">
      <div className="page-text">
        Please schedule an Onboarding Session with a Staff Member.
        <img className="required-icon" alt="required" src={RequiredSVG} />
      </div>
      <Button
        className="calendly-btn"
        onClick={() =>
          openPopupWidget({ url: 'https://calendly.com/sawhney4/60min' })
        }
      >
        Schedule meeting
      </Button>
    </div>
  </div>
);

export default Onboard8;
