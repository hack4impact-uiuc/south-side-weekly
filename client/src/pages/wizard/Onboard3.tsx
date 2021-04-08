import React, {
  Dispatch,
  SetStateAction,
  FC,
  ReactElement,
  MouseEvent,
} from 'react';

import RacesSVG from '../../assets/races-page.svg';
import { handleSelectGroupArray } from '../../utils/helpers';
import { racesEnum } from '../../utils/enums';
import '../../css/wizard/Onboard3.css';
import WizardSelectButton from '../../components/WizardSelectButton/WizardSelectButton';
import WizardListTitle from '../../components/WizardListTitle';

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

  // All of the race buttons
  const raceButtons = [
    {
      display: 'American Indian or Alaskan Native',
      value: racesEnum.AMERICAN_INDIAN_OR_ALASKAN_NATIVE,
      color: '#EF8B8B',
    },
    {
      display: 'Black or African American',
      value: racesEnum.BLACK_OR_AFRICAN_AMERICAN,
      color: '#A5C4F2',
    },
    {
      display: 'Middle Eastern or North African',
      value: racesEnum.MIDDLE_EASTERN_OR_NORTH_AFRICAN,
      color: '#BAB9E9',
    },
    {
      display: 'Native Hawaiian or Pacific Islander',
      value: racesEnum.NATIVE_HAWAIIAN_OR_PACIFIC_ISLANDER,
      color: '#A9D3E5',
    },
    {
      display: 'Latinx or Hispanic',
      value: racesEnum.LATINX_OR_HISPANIC,
      color: '#F9B893',
    },
    { display: 'White', value: racesEnum.WHITE, color: '#F1D8B0' },
    { display: 'Asian', value: racesEnum.ASIAN, color: '#CFE7C4' },
    { display: 'Other', value: racesEnum.OTHER, color: '#BFEBE0' },
  ];

  return (
    <div className="races-wrapper">
      <div className="page-text">
        These fields are optional. If you feel comfortable answering, your
        responses will not be used to evaulate your submission. Select all that
        apply or leave it blank.
      </div>
      <div className="races-content-wrapper">
        <img src={RacesSVG} alt="Races Page" className="races-svg" />
        <WizardListTitle value="Race"/>
        <div className="race-button-wrapper">
          {raceButtons.map((button) => (
            <WizardSelectButton
              key={button.value}
              onClick={handleRaces}
              buttonText={button.display}
              value={button.value}
              selectedArray={races}
              color={button.color}
              padding="5px 18px 5px 18px"
              margin="20px 0px 20px 0px"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Onboard3;
