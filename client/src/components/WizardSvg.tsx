import React, { FC, ReactElement } from 'react';

import '../css/wizard/WizardSvg.css';

import BasicInfoSvg from '../assets/basic-info.svg';
import PersonalInfoSvg from '../assets/personal-information.svg';
import RacesSVG from '../assets/races-page.svg';
import InvolvementSVG from '../assets/involvement-page.svg';
import Onboard5SVG from '../assets/onboard5.svg';
import Onboard6SVG from '../assets/onboard6.svg';
import Onboard7SVG from '../assets/onboard7.svg';
import Onboard8SVG from '../assets/onboard8.svg';

interface IProps {
  page: string;
}

/**
 * Returns the corresponding svg for the page
 *
 * @param {string} page the current page
 */
const WizardListTitle: FC<IProps> = ({ page }): ReactElement => {
  const getSvg = (): ReactElement => {
    switch (page) {
      case 'onboard1':
        return (
          <img
            className="basic-info-image page-svg"
            alt="info-graphic"
            src={BasicInfoSvg}
          />
        );
      case 'onboard2':
        return (
          <img
            className="svg page-svg"
            src={PersonalInfoSvg}
            alt="personal information"
          />
        );
      case 'onboard3':
        return (
          <img src={RacesSVG} alt="Races Page" className="races-svg page-svg" />
        );
      case 'onboard4':
        return (
          <img alt="Involvement" className="page-svg" src={InvolvementSVG} />
        );
      case 'onboard5':
        return <img className="page-svg" alt="onboard5" src={Onboard5SVG} />;
      case 'onboard6':
        return <img className="page-svg" alt="onboard6" src={Onboard6SVG} />;
      case 'onboard7':
        return <img className="page-svg" alt="onboard7" src={Onboard7SVG} />;
      case 'onboard8':
        return <img className="page-svg" alt="Oboard 8" src={Onboard8SVG} />;
      default:
        return <></>;
    }
  };

  return getSvg();
};

export default WizardListTitle;
