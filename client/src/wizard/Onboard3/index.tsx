import React, {
  Dispatch,
  FC,
  ReactElement,
  SetStateAction,
  FormEvent,
} from 'react';
import { Checkbox, Form } from 'semantic-ui-react';

import { WizardSvg , WizardStar } from '../../components';
import { handleSelectGroupArray } from '../../utils/helpers';
import { interestsEnum } from '../../utils/enums';
import './styles.css';


interface IProps {
  currentTeams: Array<string>;
  setCurrentTeams: Dispatch<SetStateAction<Array<string>>>;
  interests: Array<string>;
  setInterests: Dispatch<SetStateAction<Array<string>>>;
}

/**
 * Builds and controls the form management for the teams and topics page of the Onboarding Wizard
 *
 * @param {Array<string>} currentTeams the current teams that the user is interested in
 * @param {Dispatch<SetStateAction<Array<string>>>} setCurrentTeams React setter function to control
 *                                                                  current Teams state variable
 * @param {string} interests the interests of the user
 * @param {Dispatch<SetStateAction<Array<string>>} setInterests React setter function to update user interests
 */
const Onboard3: FC<IProps> = ({
  currentTeams,
  setCurrentTeams,
  interests,
  setInterests,
}): ReactElement => {
  /**
   * Adds selected current team to the current teams form array if it isn't already there, otherwise removes it
   *
   * @param e the mouse event of clicking one of the current team select options
   */
  const handleCurrentTeams = (event: FormEvent<HTMLInputElement>): void => {
    handleSelectGroupArray(event, currentTeams, setCurrentTeams);
  };

  /**
   * Adds selected interest to the interests form array if it isn't already there, otherwise removes it
   *
   * @param e the mouse event from clicking one of the interests select optoins
   */
  const handleInterests = (event: FormEvent<HTMLInputElement>): void => {
    handleSelectGroupArray(event, interests, setInterests);
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
    <div className="teams-topics-wrapper">
      <WizardSvg page="onboard3" />
      <div className="teams-topics-content">
        <div className="section">
          <div className="page-text">
            <WizardStar />
            <b>What do you want to do at the Weekly?</b>
            <br />
            Please limit to 1-2 teams that you're interested in.
          </div>

          <div className="select-group">
            {currentTeamsButtons.map((button) => (
              <Form.Field key={button.value} className="select-item">
                <Checkbox label={button.value} onChange={handleCurrentTeams} />
              </Form.Field>
            ))}
          </div>
        </div>
        <div className="section">
          <div className="page-text">
            <WizardStar />
            <b>What topics are you interested in working on?</b>
          </div>
          <div className="select-group">
            {interestsButtons.map((button) => (
              <Form.Field key={button.value} className="select-item">
                <Checkbox label={button.display} onChange={handleInterests} />
              </Form.Field>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboard3;
