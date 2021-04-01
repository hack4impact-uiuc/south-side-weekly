import React, {
  Dispatch,
  FC,
  SetStateAction,
  ReactElement,
  MouseEvent,
} from 'react';

import PersonalInfoSvg from '../../assets/personal-information.svg';
import WizardSelectButton from '../../components/WizardSelectButton/WizardSelectButton';
import WizardListTitle from "../../components/WizardListTitle";
import { handleSelectGroupArray } from '../../utils/helpers';

import '../../css/wizard/Onboard2.css';

interface IProps {
  genders: Array<string>;
  pronouns: Array<string>;
  setGenders: Dispatch<SetStateAction<Array<string>>>;
  setPronouns: Dispatch<SetStateAction<Array<string>>>;
}

/**
 * Builds and controls the form management for Onboard2 of the Onboarding Wizard
 *
 * @param {Array<string>} genders the selected genders
 * @param {Array<string>} pronouns the selected pronouns
 * @param {Dispatch<SetStateAction<Array<string>>>} setGenders React setter funtion to update genders
 * @param {Dispatch<SetStateAction<Array<string>>>} setPronouns React setter function to update pronouns
 */
const Onboard2: FC<IProps> = ({
  genders,
  pronouns,
  setGenders,
  setPronouns,
}): ReactElement => {
  /**
   * Adds selected gender to the genders form array if it isn't already there, otherwise removes it
   *
   * @param e the mouse event from clicking one of the gender select optoins
   */
  const handleGenders = (e: MouseEvent<HTMLButtonElement>): void => {
    handleSelectGroupArray(e, genders, setGenders);
  };

  /**
   * Adds selected pronoun to the pronouns form array if it isn't already there, otherwise removes it
   *
   * @param e the mouse event of clicking one of the pronoun select options
   */
  const handlePronouns = (e: MouseEvent<HTMLButtonElement>): void => {
    handleSelectGroupArray(e, pronouns, setPronouns);
  };

  // All of the gender buttons to render
  const genderButtons = [
    { value: 'Man', color: '#EF8B8B' },
    { value: 'Woman', color: '#CFE7C4' },
    { value: 'Nonbinary', color: '#F9B893' },
    { value: 'Other', color: '#BFEBE0' },
  ];

  // All of the pronoun buttons to render
  const pronounButtons = [
    { value: 'He/his', color: '#EF8B8B' },
    { value: 'She/her', color: '#CFE7C4' },
    { value: 'They/them', color: '#F9B893' },
    { value: 'Ze/hir', color: '#F1D8B0' },
    { value: 'Other', color: '#BFEBE0' },
  ];

  return (
    <div className="personal-information">
      <div className="page-text">
        These fields are optional. If you feel comfortable answering, your
        responses will not be used to evaulate your submission. Select all that
        apply or leave it blank.
      </div>
      <div className="personal-information-wrapper">
        <div className="personal-information-svg">
          <img
            className="svg"
            src={PersonalInfoSvg}
            alt="personal information"
          />
        </div>
        <div className="personal-information-form">
          <div className="section">
            <WizardListTitle value="Gender" />
            {genderButtons.map((button) => (
              <WizardSelectButton
                key={button.value}
                onClick={handleGenders}
                selectedArray={genders}
                value={button.value}
                width="90%"
                margin="25px 0px 0px 20px"
                color={button.color}
              />
            ))}
          </div>
          <div className="section">
            <WizardListTitle value="Pronouns" />
            {pronounButtons.map((button) => (
              <WizardSelectButton
                key={button.value}
                onClick={handlePronouns}
                selectedArray={pronouns}
                value={button.value}
                width="90%"
                margin="25px 0px 0px 20px"
                color={button.color}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboard2;
