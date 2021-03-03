import React, {
  Dispatch,
  FC,
  ReactElement,
  SetStateAction,
  MouseEvent,
} from 'react';
import { Button } from 'semantic-ui-react';

import Onboard6SVG from '../../assets/onboard6.svg';

import '../../css/wizard/Onboard6.css';

interface IProps {
  interests: Array<string>;
  setInterests: Dispatch<SetStateAction<Array<string>>>;
}

const NOT_FOUND_IDX = -1;

const Onboard6: FC<IProps> = ({ interests, setInterests }): ReactElement => {
  const handleInterests = (e: MouseEvent<HTMLButtonElement>): void => {
    const elementIdx = interests.indexOf(e.currentTarget.value);
    if (elementIdx === NOT_FOUND_IDX) {
      const addedGenders = interests.concat(e.currentTarget.value);
      setInterests(addedGenders);
    } else {
      const removedGenders = interests.filter(
        (race) => race !== e.currentTarget.value,
      );
      setInterests(removedGenders);
    }
  };

  return (
    <div className="onboard6-wrapper">
      <img className="page-svg" alt="onboard6" src={Onboard6SVG} />

      <div className="onboard6-content">
        <div className="page-text">
          What topics are you interested in working on?
        </div>
        <div className="select-group">
          <Button
            value="Cannabis"
            style={{
              backgroundColor: `${
                interests.indexOf('Cannabis') === NOT_FOUND_IDX
                  ? '#CFE7C4'
                  : '#CCD1D1'
              }`,
            }}
            onClick={handleInterests}
            className="select"
          >
            Cannabis
          </Button>
          <Button
            value="Education"
            style={{
              backgroundColor: `${
                interests.indexOf('Education') === NOT_FOUND_IDX
                  ? '#A9D3E5'
                  : '#CCD1D1'
              }`,
            }}
            onClick={handleInterests}
            className="select"
          >
            Education
          </Button>
          <Button
            value="Food and Land"
            style={{
              backgroundColor: `${
                interests.indexOf('Food and Land') === NOT_FOUND_IDX
                  ? '#BFEBE0'
                  : '#CCD1D1'
              }`,
            }}
            onClick={handleInterests}
            className="select"
          >
            Food and Land
          </Button>
          <Button
            value="Fun"
            style={{
              backgroundColor: `${
                interests.indexOf('Fun') === NOT_FOUND_IDX
                  ? '#F9B893'
                  : '#CCD1D1'
              }`,
            }}
            onClick={handleInterests}
            className="select"
          >
            Fun
          </Button>
          <Button
            value="Health"
            style={{
              backgroundColor: `${
                interests.indexOf('Health') === NOT_FOUND_IDX
                  ? '#F9B893'
                  : '#CCD1D1'
              }`,
            }}
            onClick={handleInterests}
            className="select"
          >
            Health
          </Button>
          <Button
            value="Housing"
            style={{
              backgroundColor: `${
                interests.indexOf('Housing') === NOT_FOUND_IDX
                  ? '#EF8B8B'
                  : '#CCD1D1'
              }`,
            }}
            onClick={handleInterests}
            className="select"
          >
            Housing
          </Button>
          <Button
            value="Immigration"
            style={{
              backgroundColor: `${
                interests.indexOf('Immigration') === NOT_FOUND_IDX
                  ? '#D8ACE8'
                  : '#CCD1D1'
              }`,
            }}
            onClick={handleInterests}
            className="select"
          >
            Immigration
          </Button>
          <Button
            value="Literature"
            style={{
              backgroundColor: `${
                interests.indexOf('Literature') === NOT_FOUND_IDX
                  ? '#A5C4F2'
                  : '#CCD1D1'
              }`,
            }}
            onClick={handleInterests}
            className="select"
          >
            Literature
          </Button>
          <Button
            value="Music"
            style={{
              backgroundColor: `${
                interests.indexOf('Music') === NOT_FOUND_IDX
                  ? '#BFEBE0'
                  : '#CCD1D1'
              }`,
            }}
            onClick={handleInterests}
            className="select"
          >
            Music
          </Button>
          <Button
            value="Nature"
            style={{
              backgroundColor: `${
                interests.indexOf('Nature') === NOT_FOUND_IDX
                  ? '#CFE7C4'
                  : '#CCD1D1'
              }`,
            }}
            onClick={handleInterests}
            className="select"
          >
            Nature
          </Button>
          <Button
            value="Politics"
            style={{
              backgroundColor: `${
                interests.indexOf('Politics') === NOT_FOUND_IDX
                  ? '#A5C4F2'
                  : '#CCD1D1'
              }`,
            }}
            onClick={handleInterests}
            className="select"
          >
            Politics
          </Button>
          <Button
            value="Stage and Screen"
            style={{
              backgroundColor: `${
                interests.indexOf('Stage and Screen') === NOT_FOUND_IDX
                  ? '#D8ACE8'
                  : '#CCD1D1'
              }`,
            }}
            onClick={handleInterests}
            className="select"
          >
            Stage and Screen
          </Button>
          <Button
            value="Transportation"
            style={{
              backgroundColor: `${
                interests.indexOf('Transportation') === NOT_FOUND_IDX
                  ? '#F1D8B0'
                  : '#CCD1D1'
              }`,
            }}
            onClick={handleInterests}
            className="select"
          >
            Transportation
          </Button>
          <Button
            value="Visual Arts"
            style={{
              backgroundColor: `${
                interests.indexOf('Visaul Arts') === NOT_FOUND_IDX
                  ? '#BAB9E9'
                  : '#CCD1D1'
              }`,
            }}
            onClick={handleInterests}
            className="select"
          >
            Visual Arts
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboard6;
