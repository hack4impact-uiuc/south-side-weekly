import React, {
  Dispatch,
  FC,
  ReactElement,
  SetStateAction,
  MouseEvent,
} from 'react';
import { Button } from 'semantic-ui-react';

import Onboard5SVG from '../../assets/onboard5.svg';
import RequiredSvg from '../../assets/required.svg';

import '../../css/wizard/Onboard5.css';

interface IProps {
  currentTeams: Array<string>;
  setCurrentTeams: Dispatch<SetStateAction<Array<string>>>;
}

const NOT_FOUND_IDX = -1;

const Onboard5: FC<IProps> = ({
  currentTeams,
  setCurrentTeams,
}): ReactElement => {
  const handleCurrentTeams = (e: MouseEvent<HTMLButtonElement>) => {
    const elementIdx = currentTeams.indexOf(e.currentTarget.value);
    if (elementIdx === NOT_FOUND_IDX) {
      const addedGenders = currentTeams.concat(e.currentTarget.value);
      setCurrentTeams(addedGenders);
    } else {
      const removedGenders = currentTeams.filter(
        (race) => race !== e.currentTarget.value,
      );
      setCurrentTeams(removedGenders);
    }
  };

  return (
    <div className="onboard5-wrapper">
      <img className="page-svg" alt="onboard5" src={Onboard5SVG} />

      <div className="onboard5-content">
        <div className="page-text">
          <b>What do you want to do at the Weekly?</b>
          <br />
          Please limit to the 1-2 options you're interest in.
          <img className="required-icon" alt="required" src={RequiredSvg} />
        </div>

        <div className="select-group">
          <Button
            value="Data"
            style={{
              backgroundColor: `${
                currentTeams.indexOf('Data') === NOT_FOUND_IDX
                  ? '#EF8B8B'
                  : '#CCD1D1'
              }`,
            }}
            onClick={handleCurrentTeams}
            className="select"
          >
            Data
          </Button>
          <Button
            style={{
              backgroundColor: `${
                currentTeams.indexOf('Editing') === NOT_FOUND_IDX
                  ? '#A5C4F2'
                  : '#CCD1D1'
              }`,
            }}
            value="Editing"
            onClick={handleCurrentTeams}
            className="select"
          >
            Editing
          </Button>
          <Button
            style={{
              backgroundColor: `${
                currentTeams.indexOf('Fact-checking') === NOT_FOUND_IDX
                  ? '#CFE7C4'
                  : '#CCD1D1'
              }`,
            }}
            value="Fact-checking"
            onClick={handleCurrentTeams}
            className="select"
          >
            Fact-checking
          </Button>
          <Button
            style={{
              backgroundColor: `${
                currentTeams.indexOf('Illustration') === NOT_FOUND_IDX
                  ? '#BAB9E9'
                  : '#CCD1D1'
              }`,
            }}
            value="Illustration"
            onClick={handleCurrentTeams}
            className="select"
          >
            Illustration
          </Button>
          <Button
            style={{
              backgroundColor: `${
                currentTeams.indexOf('Layout') === NOT_FOUND_IDX
                  ? '#F9B893'
                  : '#CCD1D1'
              }`,
            }}
            value="Layout"
            onClick={handleCurrentTeams}
            className="select"
          >
            Layout
          </Button>
          <Button
            style={{
              backgroundColor: `${
                currentTeams.indexOf('Photography') === NOT_FOUND_IDX
                  ? '#D8ACE8'
                  : '#CCD1D1'
              }`,
            }}
            value="Photography"
            onClick={handleCurrentTeams}
            className="select"
          >
            Photography
          </Button>
          <Button
            style={{
              backgroundColor: `${
                currentTeams.indexOf('Radio') === NOT_FOUND_IDX
                  ? '#F1D8B0'
                  : '#CCD1D1'
              }`,
            }}
            value="Radio"
            onClick={handleCurrentTeams}
            className="select"
          >
            Radio
          </Button>
          <Button
            style={{
              backgroundColor: `${
                currentTeams.indexOf('Visuals') === NOT_FOUND_IDX
                  ? '#BFEBE0'
                  : '#CCD1D1'
              }`,
            }}
            value="Visuals"
            onClick={handleCurrentTeams}
            className="select"
          >
            Visuals
          </Button>
          <Button
            style={{
              backgroundColor: `${
                currentTeams.indexOf('Writing') === NOT_FOUND_IDX
                  ? '#A9D3E5'
                  : '#CCD1D1'
              }`,
            }}
            value="Writing"
            onClick={handleCurrentTeams}
            className="select"
          >
            Writing
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboard5;
