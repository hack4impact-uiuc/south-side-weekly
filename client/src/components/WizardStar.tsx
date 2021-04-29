import React, { ReactElement } from 'react';

import Required from '../assets/required.svg';

import '../css/wizard/WizardStar.css';

/**
 * A component for the star used for required elements
 */
const WizardStar = (): ReactElement => (
  <img alt="required" className="required-icon" src={Required} />
);

export default WizardStar;
