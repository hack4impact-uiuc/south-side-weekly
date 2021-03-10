import React, {
  Dispatch,
  SetStateAction,
  FC,
  ReactElement,
  MouseEvent,
} from 'react';

import RacesSVG from '../../assets/races-page.svg';
import { handleSelectGroupArray } from '../../utils/helpers';
import '../../css/wizard/Onboard3.css';
import WizardSelectButton from '../../components/WizardSelectButton/WizardSelectButton';

interface IProps {
  races: Array<string>;
  setRaces: Dispatch<SetStateAction<Array<string>>>;
}

/**
 * Builds and controls the form management for Onboard3 of the Onboarding Wizard
 *
 * @param {Array<string>} races the selected races
 * @param {Dispatch<SetStateAction<Array<string>>>} setRaces React setter to update the selected races
 */
const Onboard3: FC<IProps> = ({ races, setRaces }): ReactElement => {
  /**
   * Adds selected races to the races form array if it isn't already there, otherwise removes it
   *
   * @param e the mouse event from clicking one of the gender select optoins
   */
  const handleRaces = (e: MouseEvent<HTMLButtonElement>): void => {
    handleSelectGroupArray(e, races, setRaces);
  };

  // All of the race buttons to show in the first row
  const raceButtonsRow1 = [
    { value: 'American Indian or Alaskan Native', color: '#EF8B8B' },
    { value: 'Black or African American', color: '#A5C4F2' },
    { value: 'Middle Eastern or North African', color: '#BAB9E9' },
    { value: 'Native Hawaiian or Pacific Islander', color: '#A9D3E5' },
  ];

  // All of the race buttons to show in the second row
  const raceButtonsRow2 = [
    { value: 'Latinx or Hispanic', color: '#F9B893' },
    { value: 'White', color: '#F1D8B0' },
    { value: 'Asian', color: '#CFE7C4' },
    { value: 'Other', color: '#BFEBE0' },
  ];

  return (
    <div className="races-wrapper">
      <div className="page-text">
        These field are optional. If you feel comfortable answering your
        responses will not be used to evaulate your submission. Select all that
        apply or leave it blank.
      </div>
      <div className="races-content-wrapper">
        <img src={RacesSVG} alt="Races Page" className="races-svg" />
        <div className="select-title">Races</div>
        <div className="select-row-1">
          {raceButtonsRow1.map((button) => (
            <WizardSelectButton
              key={button.value}
              onClick={handleRaces}
              value={button.value}
              selectedArray={races}
              color={button.color}
              padding="5px 18px 5px 18px"
              margin="20px 0px 20px 0px"
            />
          ))}
        </div>
        <div className="select-row-2">
          {raceButtonsRow2.map((button) => (
            <WizardSelectButton
              key={button.value}
              onClick={handleRaces}
              value={button.value}
              selectedArray={races}
              color={button.color}
              width="150px"
              padding="5px 10px 5px 10px"
              margin="0px 30px 0px 30px"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Onboard3;
