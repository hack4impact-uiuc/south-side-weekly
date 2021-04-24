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
import { interestsButtons } from '../../utils/constants';

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

  return (
    <div className="onboard6-wrapper">
      <img className="page-svg" alt="onboard6" src={Onboard6SVG} />

      <div className="onboard6-content">
        <div className="page-text">
          What topics are you interested in working on?
        </div>
        <div className="select-group">
          {Object.keys(interestsButtons).map((interest) => (
            <WizardSelectButton
              key={interest}
              onClick={handleInterests}
              selectedArray={interests}
              width="150px"
              margin="10px 15px 10px 15px"
              value={interest}
              color={interestsButtons[interest]}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Onboard6;
