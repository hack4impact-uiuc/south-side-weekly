import React, {
  Dispatch,
  FC,
  ReactElement,
  SetStateAction,
  MouseEvent,
} from 'react';

import Onboard6SVG from '../../assets/onboard6.svg';
import { handleSelectGroupArray } from '../../utils/helpers';
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
    { value: 'Cannabis', color: '#CFE7C4' },
    { value: 'Education', color: '#A9D3E5' },
    { value: 'Food and Land', color: '#BFEBE0' },
    { value: 'Fun', color: '#F9B893' },
    { value: 'Health', color: '#F9B893' },
    { value: 'Housing', color: '#EF8B8B' },
    { value: 'Immigration', color: '#D8ACE8' },
    { value: 'Literature', color: '#A5C4F2' },
    { value: 'Music', color: '#BFEBE0' },
    { value: 'Nature', color: '#CFE7C4' },
    { value: 'Politics', color: '#A5C4F2' },
    { value: 'Stage and Screen', color: '#D8ACE8' },
    { value: 'Transportation', color: '#F1D8B0' },
    { value: 'Visual Arts', color: '#BAB9E9' },
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
