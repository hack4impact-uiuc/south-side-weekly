import React, { FC, ReactElement } from 'react';

import '../css/wizard/WizardSvg.css';

import RolePageSVG from '../assets/role-page.svg';
import BasicInfoSvg from '../assets/basic-info.svg';
import PersonalInfoSvg from '../assets/personal-information.svg';
import InvolvementSVG from '../assets/involvement-page.svg';
import Onboard5SVG from '../assets/onboard5.svg';
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
      case 'onboard0':
        return <img className="page-image" src={RolePageSVG} alt="role page" />;
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
        return <img className="page-svg" alt="onboard5" src={Onboard5SVG} />;
      case 'onboard4':
        return (
          <img alt="Involvement" className="page-svg" src={InvolvementSVG} />
        );
      case 'onboard5':
        return <img className="page-svg" alt="Onboard 5" src={Onboard8SVG} />;
      default:
        return <></>;
    }
  };

  return getSvg();
};

export default WizardListTitle;
