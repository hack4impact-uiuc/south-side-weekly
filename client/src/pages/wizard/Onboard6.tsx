import React, {
  Dispatch,
  FC,
  ReactElement,
  SetStateAction,
  MouseEvent,
} from 'react';

import Onboard6SVG from '../../assets/onboard6.svg';
import { handleSelectGroupArray } from '../../utils/helpers';
import { interestsEnum } from '../../utils/enums';
import '../../css/wizard/Onboard6.css';
import WizardSelectButton from '../../components/WizardSelectButton/WizardSelectButton';

interface IProps {
  interests: Array<string>;
  setInterests: Dispatch<SetStateAction<Array<string>>>;
}

/**
 * Builds and controls the form management for Onboard7 of the Onboarding Wizard
 *
 * @param {string} interests the interests of the user
 * @param {Dispatch<SetStateAction<Array<string>>} setInterests React setter function to update user interests
 */
const Onboard6: FC<IProps> = ({ interests, setInterests }): ReactElement => {
  /**
   * Adds selected interest to the interests form array if it isn't already there, otherwise removes it
   *
   * @param e the mouse event from clicking one of the interests select optoins
   */
  const handleInterests = (e: MouseEvent<HTMLButtonElement>): void => {
    handleSelectGroupArray(e, interests, setInterests);
  };

  // All of the interests buttons to show
  const interestsButtons = [
    { display: 'Cannabis', value: interestsEnum.CANNABIS, color: '#CFE7C4' },
    { display: 'Education', value: interestsEnum.EDUCATION, color: '#A9D3E5' },
    {
      display: 'Food and Land',
      value: interestsEnum.FOOD_AND_LAND,
      color: '#BFEBE0',
    },
    { display: 'Fun', value: interestsEnum.FUN, color: '#F9B893' },
    { display: 'Health', value: interestsEnum.HEALTH, color: '#F9B893' },
    { display: 'Housing', value: interestsEnum.HOUSING, color: '#EF8B8B' },
    {
      display: 'Immigration',
      value: interestsEnum.IMMIGRATION,
      color: '#D8ACE8',
    },
    { display: 'Literature', value: interestsEnum.LIT, color: '#A5C4F2' },
    { display: 'Music', value: interestsEnum.MUSIC, color: '#BFEBE0' },
    { display: 'Nature', value: interestsEnum.NATURE, color: '#CFE7C4' },
    { display: 'Politics', value: interestsEnum.POLITICS, color: '#A5C4F2' },
    {
      display: 'Stage and Screen',
      value: interestsEnum.STAGE_AND_SCREEN,
      color: '#D8ACE8',
    },
    {
      display: 'Transportation',
      value: interestsEnum.TRANSPORTATION,
      color: '#F1D8B0',
    },
    {
      display: 'Visual Arts',
      value: interestsEnum.VISUAL_ARTS,
      color: '#BAB9E9',
    },
  ];

  return (
    <div className="onboard6-wrapper">
      <img className="page-svg" alt="onboard6" src={Onboard6SVG} />

      <div className="onboard6-content">
        <div className="page-text">
          What topics are you interested in working on?
        </div>
        <div className="select-group">
          {interestsButtons.map((button) => (
            <WizardSelectButton
              key={button.value}
              onClick={handleInterests}
              buttonText={button.display}
              selectedArray={interests}
              width="150px"
              margin="10px 15px 10px 15px"
              value={button.value}
              color={button.color}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Onboard6;
