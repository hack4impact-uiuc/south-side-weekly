import React, {
  Dispatch,
  FC,
  ReactElement,
  SetStateAction,
  MouseEvent,
} from 'react';

import Onboard5SVG from '../../assets/onboard5.svg';
import RequiredSvg from '../../assets/required.svg';
import { handleSelectGroupArray } from '../../utils/helpers';
import '../../css/wizard/Onboard5.css';
import WizardSelectButton from '../../components/WizardSelectButton/WizardSelectButton';
import { currentTeamsButtons } from '../../utils/constants';

interface IProps {
  currentTeams: Array<string>;
  setCurrentTeams: Dispatch<SetStateAction<Array<string>>>;
}

/**
 * Builds and controls the form management for Onboard5 of the Onboarding Wizard
 *
 * @param {Array<string>} currentTeams the current teams that the user is interested in
 * @param {Dispatch<SetStateAction<Array<string>>>} setCurrentTeams React setter function to control
 *                                                                  current Teams state variable
 */
const Onboard5: FC<IProps> = ({
  currentTeams,
  setCurrentTeams,
}): ReactElement => {
  /**
   * Adds selected current team to the current teams form array if it isn't already there, otherwise removes it
   *
   * @param e the mouse event of clicking one of the current team select options
   */
  const handleCurrentTeams = (e: MouseEvent<HTMLButtonElement>): void => {
    handleSelectGroupArray(e, currentTeams, setCurrentTeams);
  };

  return (
    <div className="onboard5-wrapper">
      <img className="page-svg" alt="onboard5" src={Onboard5SVG} />

      <div className="onboard5-content">
        <div className="page-text">
          <b>What do you want to do at the Weekly?</b>
          <br />
          Please limit to the 1-2 options you're interest in.
          <img className="required-icon" alt="required" src={RequiredSvg} />
        </div>

        <div className="select-group">
          {Object.keys(currentTeamsButtons).map((button) => (
            <WizardSelectButton
              key={button}
              onClick={handleCurrentTeams}
              selectedArray={currentTeams}
              width="150px"
              margin="15px 30px 15px 30px"
              value={button}
              color={currentTeamsButtons[button]}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Onboard5;
