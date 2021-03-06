import React, {
  Dispatch,
  SetStateAction,
  FC,
  ReactElement,
  MouseEvent,
} from 'react';
import { Button } from 'semantic-ui-react';

import RacesSVG from '../../assets/races-page.svg';

import '../../css/wizard/Onboard3.css';

interface IProps {
  races: Array<string>;
  setRaces: Dispatch<SetStateAction<Array<string>>>;
}

const NOT_FOUND_IDX = -1;

const Onboard3: FC<IProps> = ({ races, setRaces }): ReactElement => {
  const handleRaces = (e: MouseEvent<HTMLButtonElement>): void => {
    const elementIdx = races.indexOf(e.currentTarget.value);
    if (elementIdx === NOT_FOUND_IDX) {
      const addedGenders = races.concat(e.currentTarget.value);
      setRaces(addedGenders);
    } else {
      const removedGenders = races.filter(
        (race) => race !== e.currentTarget.value,
      );
      setRaces(removedGenders);
    }
  };

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
          <Button
            style={{
              backgroundColor: `${
                races.indexOf('American Indian or Alaskan Native') ===
                NOT_FOUND_IDX
                  ? '#EF8B8B'
                  : '#CCD1D1'
              }`,
            }}
            onClick={handleRaces}
            value="American Indian or Alaskan Native"
            className="select"
          >
            American Indian or Alaskan Native
          </Button>
          <Button
            style={{
              backgroundColor: `${
                races.indexOf('Black or African American') === NOT_FOUND_IDX
                  ? '#A5C4F2'
                  : '#CCD1D1'
              }`,
            }}
            onClick={handleRaces}
            value="Black or African American"
            className="select"
          >
            Black or African American
          </Button>
          <Button
            style={{
              backgroundColor: `${
                races.indexOf('Middle Eastern or North African') ===
                NOT_FOUND_IDX
                  ? '#BAB9E9'
                  : '#CCD1D1'
              }`,
            }}
            onClick={handleRaces}
            value="Middle Eastern or North African"
            className="select"
          >
            Middle Eastern or North African
          </Button>
          <Button
            style={{
              backgroundColor: `${
                races.indexOf('Native Hawaiian or Pacific Islander') ===
                NOT_FOUND_IDX
                  ? '#A9D3E5'
                  : '#CCD1D1'
              }`,
            }}
            onClick={handleRaces}
            value="Native Hawaiian or Pacific Islander"
            className="select"
          >
            Native Hawaiian or Pacific Islander
          </Button>
        </div>
        <div className="select-row-2">
          <Button
            style={{
              backgroundColor: `${
                races.indexOf('Latinx or Hispanic') === NOT_FOUND_IDX
                  ? '#F9B893'
                  : '#CCD1D1'
              }`,
            }}
            onClick={handleRaces}
            value="Latinx or Hispanic"
            className="select"
          >
            Latinx or Hispanic
          </Button>
          <Button
            style={{
              backgroundColor: `${
                races.indexOf('White') === NOT_FOUND_IDX ? '#F1D8B0' : '#CCD1D1'
              }`,
            }}
            onClick={handleRaces}
            value="White"
            className="select"
          >
            White
          </Button>
          <Button
            style={{
              backgroundColor: `${
                races.indexOf('Asian') === NOT_FOUND_IDX ? '#CFE7C4' : '#CCD1D1'
              }`,
            }}
            onClick={handleRaces}
            value="Asian"
            className="select"
          >
            Asian
          </Button>
          <Button
            style={{
              backgroundColor: `${
                races.indexOf('Other') === NOT_FOUND_IDX ? '#BFEBE0' : '#CCD1D1'
              }`,
            }}
            onClick={handleRaces}
            value="Other"
            className="select"
          >
            Other
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboard3;
