import React, { FC, ReactElement } from 'react';
import { ImageProps } from 'semantic-ui-react';

import RolePageSVG from '../../../assets/role-page.svg';
import BasicInfoSvg from '../../../assets/basic-info.svg';
import PersonalInfoSvg from '../../../assets/personal-information.svg';
import InvolvementSVG from '../../../assets/involvement-page.svg';
import TasksSVG from '../../../assets/tasks.svg';
import ScheduleSVG from '../../../assets/schedule.svg';
import { wizardPages } from '../../../utils/enums';

import './styles.scss';

interface SvgProps extends ImageProps {
  page: string;
}

const WizardSvg: FC<SvgProps> = ({ page, ...rest }): ReactElement => {
  const attributes = (): ImageProps => {
    switch (page) {
      case wizardPages.INITIAL_PAGE:
        return { src: RolePageSVG, alt: 'role page' };
      case wizardPages.ONBOARD_1:
        return { src: BasicInfoSvg, alt: 'info-graphic' };
      case wizardPages.ONBOARD_2:
        return { src: PersonalInfoSvg, alt: 'personal info' };
      case wizardPages.ONBOARD_3:
        return { src: TasksSVG, alt: 'role page' };
      case wizardPages.ONBOARD_4:
        return { src: InvolvementSVG, alt: 'role page' };
      case wizardPages.ONBOARD_5:
        return { src: ScheduleSVG, alt: 'role page' };
      default:
        return {};
    }
  };

  return <img alt="temp" {...attributes()} {...rest} />;
};

export default WizardSvg;
