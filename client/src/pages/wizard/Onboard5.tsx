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
import { teamEnum } from "../../utils/enums";
import '../../css/wizard/Onboard5.css';
import WizardSelectButton from '../../components/WizardSelectButton/WizardSelectButton';

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

  // All of the buttons to show for the current teams
  const currentTeamsButtons = [
    { display: 'Editing', value: teamEnum.EDITING, color: '#A5C4F2' },
    { display: 'Fact-checking', value: teamEnum.FACT_CHECKING, color: '#CFE7C4' },
    { display: 'Illustration', value: teamEnum.ILLUSTRATION, color: '#BAB9E9' },
    { display: 'Photography', value: teamEnum.PHOTOGRAPHY, color: '#D8ACE8' },
    { display: 'Visuals', value: teamEnum.VISUALS, color: '#BFEBE0' },
    { display: 'Writing', value: teamEnum.WRITING, color: '#A9D3E5' },
  ];

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
          {currentTeamsButtons.map((button) => (
            <WizardSelectButton
              key={button.value}
              onClick={handleCurrentTeams}
              buttonText={button.display}
              selectedArray={currentTeams}
              width="150px"
              margin="15px 30px 15px 30px"
              value={button.value}
              color={button.color}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Onboard5;
