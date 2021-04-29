import React, {
  Dispatch,
  FC,
  SetStateAction,
  ReactElement,
  FormEvent,
  useState,
} from 'react';
import { Checkbox, CheckboxProps, Form } from 'semantic-ui-react';

import WizardSvg from '../../components/WizardSvg';
import WizardListTitle from '../../components/WizardListTitle';
import { handleSelectGroupArray } from '../../utils/helpers';
import { gendersEnum, pronounsEnum, racesEnum } from '../../utils/enums';

import '../../css/wizard/Onboard2.css';

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
   * @param event the form event from clicking one of the gender select optoins
   * @param data contains the value selected
   */
  const handleGenders = (
    _event: FormEvent<HTMLInputElement>,
    data: CheckboxProps,
  ): void => {
    handleSelectGroupArray(data, genders, setGenders);
  };

  /**
   * Adds selected pronoun to the pronouns form array if it isn't already there, otherwise removes it
   *
   * @param event the form event of clicking one of the pronoun select options
   * @param data contains the value selected
   */
  const handlePronouns = (
    _event: FormEvent<HTMLInputElement>,
    data: CheckboxProps,
  ): void => {
    handleSelectGroupArray(data, pronouns, setPronouns);
  };

  /**
   * Adds selected race to the races form array if it isn't already there, otherwise removes it
   *
   * @param event the form event of clicking one of the pronoun select options
   * @param data contains the value selected
   */
  const handleRaces = (
    _event: FormEvent<HTMLInputElement>,
    data: CheckboxProps,
  ): void => {
    handleSelectGroupArray(data, races, setRaces);
  };

  // All of the gender buttons to render
  const genderButtons = [
    { display: 'Man', value: gendersEnum.MAN, color: '#EF8B8B' },
    { display: 'Woman', value: gendersEnum.WOMAN, color: '#CFE7C4' },
    { display: 'Nonbinary', value: gendersEnum.NONBINARY, color: '#F9B893' },
    { display: 'Other', value: gendersEnum.OTHER, color: '#BFEBE0' },
  ];

  // All of the pronoun buttons to render
  const pronounButtons = [
    { display: 'He/his', value: pronounsEnum.HEHIS, color: '#EF8B8B' },
    { display: 'She/her', value: pronounsEnum.SHEHER, color: '#CFE7C4' },
    { display: 'They/them', value: pronounsEnum.THEYTHEM, color: '#F9B893' },
    { display: 'Ze/hir', value: pronounsEnum.ZEHIR, color: '#F1D8B0' },
    { display: 'Other', value: pronounsEnum.OTHER, color: '#BFEBE0' },
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
