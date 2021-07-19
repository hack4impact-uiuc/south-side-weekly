import React, {
  Dispatch,
  FC,
  SetStateAction,
  ReactElement,
  FormEvent,
} from 'react';
import { Checkbox, Form } from 'semantic-ui-react';

import { WizardSvg, WizardListTitle } from '../../components';
import { handleSelectGroupArray } from '../../utils/helpers';
import { racesEnum } from '../../utils/enums';

import './styles.css';

interface IProps {
  genders: Array<string>;
  pronouns: Array<string>;
  races: Array<string>;
  setGenders: Dispatch<SetStateAction<Array<string>>>;
  setPronouns: Dispatch<SetStateAction<Array<string>>>;
  setRaces: Dispatch<SetStateAction<Array<string>>>;
}

/**
 * Builds and controls the form management for Onboard2 of the Onboarding Wizard
 *
 * @param {Array<string>} genders the selected genders
 * @param {Array<string>} pronouns the selected pronouns
 * @param {Array<string>} races the selected races
 * @param {Dispatch<SetStateAction<Array<string>>>} setGenders React setter funtion to update genders
 * @param {Dispatch<SetStateAction<Array<string>>>} setPronouns React setter function to update pronouns
 * @param {Dispatch<SetStateAction<Array<string>>>} setRaces React setter function to update races
 */
const Onboard2: FC<IProps> = ({
  genders,
  pronouns,
  races,
  setGenders,
  setPronouns,
  setRaces,
}): ReactElement => {
  /**
   * Adds selected gender to the genders form array if it isn't already there, otherwise removes it
   *
   * @param e the mouse event from clicking one of the gender select optoins
   */
  const handleGenders = (event: FormEvent<HTMLInputElement>): void => {
    handleSelectGroupArray(event, genders, setGenders);
  };

  /**
   * Adds selected pronoun to the pronouns form array if it isn't already there, otherwise removes it
   *
   * @param e the mouse event of clicking one of the pronoun select options
   */
  const handlePronouns = (event: FormEvent<HTMLInputElement>): void => {
    handleSelectGroupArray(event, pronouns, setPronouns);
  };

  /**
   * Adds selected race to the races form array if it isn't already there, otherwise removes it
   *
   * @param e the mouse event of clicking one of the pronoun select options
   */
  const handleRaces = (event: FormEvent<HTMLInputElement>): void => {
    handleSelectGroupArray(event, races, setRaces);
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
    <div className="personal-information">
      <div className="page-text">
        These fields are optional. If you feel comfortable answering, your
        responses will not be used to evaulate your submission. Select all that
        apply or leave it blank.
      </div>
      <div className="personal-information-wrapper">
        <div className="personal-information-svg">
          <WizardSvg page="onboard2" />
        </div>
        <Form>
          <div className="personal-information-form">
            <div className="section">
              <WizardListTitle value="Gender" />
              {genderButtons.map((button) => (
                <Form.Field key={button.value}>
                  <Checkbox label={button.value} onChange={handleGenders} />
                </Form.Field>
              ))}
            </div>
            <div className="section">
              <WizardListTitle value="Pronouns" />
              {pronounButtons.map((button) => (
                <Form.Field key={button.value}>
                  <Checkbox label={button.value} onChange={handlePronouns} />
                </Form.Field>
              ))}
            </div>
            <div className="section">
              <WizardListTitle value="Race" />
              {raceButtons.map((button) => (
                <Form.Field key={button.value}>
                  <Checkbox label={button.display} onChange={handleRaces} />
                </Form.Field>
              ))}
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Onboard2;
