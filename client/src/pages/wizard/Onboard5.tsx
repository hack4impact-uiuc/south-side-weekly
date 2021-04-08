import React, {
  Dispatch,
  FC,
  ReactElement,
  SetStateAction,
  MouseEvent,
} from 'react';

import Onboard5SVG from '../../assets/onboard5.svg';
import { handleSelectGroupArray } from '../../utils/helpers';
import '../../css/wizard/Onboard5.css';
import WizardSelectButton from '../../components/WizardSelectButton/WizardSelectButton';
import WizardStar from '../../components/WizardStar';

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
    { value: 'Editing', color: '#A5C4F2' },
    { value: 'Fact-checking', color: '#CFE7C4' },
    { value: 'Illustration', color: '#BAB9E9' },
    { value: 'Photography', color: '#D8ACE8' },
    { value: 'Visuals', color: '#BFEBE0' },
    { value: 'Writing', color: '#A9D3E5' },
  ];

  return (
    <div className="onboard5-wrapper">
      <img className="page-svg" alt="onboard5" src={Onboard5SVG} />

      <div className="onboard5-content">
        <div className="page-text">
          <WizardStar />
          <b>What do you want to do at the Weekly?</b>
          <br />
          Please limit to 1-2 teams that you're interested in.
        </div>

        <div className="select-group">
          {currentTeamsButtons.map((button) => (
            <WizardSelectButton
              key={button.value}
              onClick={handleCurrentTeams}
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
