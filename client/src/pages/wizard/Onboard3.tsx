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

const racesEnum = {
  AMERICAN_INDIAN_OR_ALASKAN_NATIVE: 'AMERICAN INDIAN OR ALASKAN NATIVE',
  BLACK_OR_AFRICAN_AMERICAN: 'BLACK OR AFRICAN AMERICAN',
  MIDDLE_EASTERN_OR_NORTH_AFRICAN: 'MIDDLE EASTERN OR NORTH AFRICAN',
  NATIVE_HAWAIIAN_OR_PACIFIC_ISLANDER: 'NATIVE HAWAIIAN OR PACIFIC ISLANDER',
  LATINX_OR_HISPANIC: 'LATINX OR HISPANIC',
  WHITE: 'WHITE',
  ASIAN: 'ASIAN',
  OTHER: 'OTHER',
  NONE: 'NONE',
};

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
                races.indexOf(
                  racesEnum.AMERICAN_INDIAN_OR_ALASKAN_NATIVE.toString(),
                ) === NOT_FOUND_IDX
                  ? '#EF8B8B'
                  : '#CCD1D1'
              }`,
            }}
            onClick={handleRaces}
            value={racesEnum.AMERICAN_INDIAN_OR_ALASKAN_NATIVE.toString()}
            className="select"
          >
            American Indian or Alaskan Native
          </Button>
          <Button
            style={{
              backgroundColor: `${
                races.indexOf(
                  racesEnum.BLACK_OR_AFRICAN_AMERICAN.toString(),
                ) === NOT_FOUND_IDX
                  ? '#A5C4F2'
                  : '#CCD1D1'
              }`,
            }}
            onClick={handleRaces}
            value={racesEnum.BLACK_OR_AFRICAN_AMERICAN.toString()}
            className="select"
          >
            Black or African American
          </Button>
          <Button
            style={{
              backgroundColor: `${
                races.indexOf(
                  racesEnum.MIDDLE_EASTERN_OR_NORTH_AFRICAN.toString(),
                ) === NOT_FOUND_IDX
                  ? '#BAB9E9'
                  : '#CCD1D1'
              }`,
            }}
            onClick={handleRaces}
            value={racesEnum.MIDDLE_EASTERN_OR_NORTH_AFRICAN.toString()}
            className="select"
          >
            Middle Eastern or North African
          </Button>
          <Button
            style={{
              backgroundColor: `${
                races.indexOf(
                  racesEnum.NATIVE_HAWAIIAN_OR_PACIFIC_ISLANDER.toString(),
                ) === NOT_FOUND_IDX
                  ? '#A9D3E5'
                  : '#CCD1D1'
              }`,
            }}
            onClick={handleRaces}
            value={racesEnum.NATIVE_HAWAIIAN_OR_PACIFIC_ISLANDER.toString()}
            className="select"
          >
            Native Hawaiian or Pacific Islander
          </Button>
        </div>
        <div className="select-row-2">
          <Button
            style={{
              backgroundColor: `${
                races.indexOf(racesEnum.LATINX_OR_HISPANIC.toString()) ===
                NOT_FOUND_IDX
                  ? '#F9B893'
                  : '#CCD1D1'
              }`,
            }}
            onClick={handleRaces}
            value={racesEnum.LATINX_OR_HISPANIC.toString()}
            className="select"
          >
            Latinx or Hispanic
          </Button>
          <Button
            style={{
              backgroundColor: `${
                races.indexOf(racesEnum.WHITE.toString()) === NOT_FOUND_IDX
                  ? '#F1D8B0'
                  : '#CCD1D1'
              }`,
            }}
            onClick={handleRaces}
            value={racesEnum.WHITE.toString()}
            className="select"
          >
            White
          </Button>
          <Button
            style={{
              backgroundColor: `${
                races.indexOf(racesEnum.ASIAN.toString()) === NOT_FOUND_IDX
                  ? '#CFE7C4'
                  : '#CCD1D1'
              }`,
            }}
            onClick={handleRaces}
            value={racesEnum.ASIAN.toString()}
            className="select"
          >
            Asian
          </Button>
          <Button
            style={{
              backgroundColor: `${
                races.indexOf(racesEnum.OTHER.toString()) === NOT_FOUND_IDX
                  ? '#BFEBE0'
                  : '#CCD1D1'
              }`,
            }}
            onClick={handleRaces}
            value={racesEnum.OTHER.toString()}
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
