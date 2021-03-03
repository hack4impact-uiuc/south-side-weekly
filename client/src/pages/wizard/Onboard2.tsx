import React, {
  Dispatch,
  FC,
  SetStateAction,
  ReactElement,
  MouseEvent,
} from 'react';
import { Button } from 'semantic-ui-react';

import PersonalInfoSvg from '../../assets/personal-information.svg';

import '../../css/wizard/Onboard2.css';

interface IProps {
  genders: Array<string>;
  pronouns: Array<string>;
  setGenders: Dispatch<SetStateAction<Array<string>>>;
  setPronouns: Dispatch<SetStateAction<Array<string>>>;
}

const NOT_FOUND_IDX = -1;

const Onboard2: FC<IProps> = ({
  genders,
  pronouns,
  setGenders,
  setPronouns,
}): ReactElement => {
  const handleGenders = (e: MouseEvent<HTMLButtonElement>): void => {
    const elementIdx = genders.indexOf(e.currentTarget.value);
    if (elementIdx === NOT_FOUND_IDX) {
      const addedGenders = genders.concat(e.currentTarget.value);
      setGenders(addedGenders);
    } else {
      const removedGenders = genders.filter(
        (gender) => gender !== e.currentTarget.value,
      );
      setGenders(removedGenders);
    }
  };

  const handlePronouns = (e: MouseEvent<HTMLButtonElement>): void => {
    const elementIdx = pronouns.indexOf(e.currentTarget.value);
    if (elementIdx === NOT_FOUND_IDX) {
      const addedGenders = pronouns.concat(e.currentTarget.value);
      setPronouns(addedGenders);
    } else {
      const removedGenders = pronouns.filter(
        (pronoun) => pronoun !== e.currentTarget.value,
      );
      setPronouns(removedGenders);
    }
  };

  return (
    <div className="personal-information">
      <div className="page-text">
        These field are optional. If you feel comfortable answering your
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
            <div className="list-title">Gender</div>
            <Button
              onClick={handleGenders}
              value="Man"
              style={{
                backgroundColor: `${
                  genders.indexOf('Man') === NOT_FOUND_IDX
                    ? '#EF8B8B'
                    : '#CCD1D1'
                }`,
              }}
              className="select"
            >
              Man
            </Button>
            <Button
              onClick={handleGenders}
              value="Woman"
              style={{
                backgroundColor: `${
                  genders.indexOf('Woman') === NOT_FOUND_IDX
                    ? '#CFE7C4'
                    : '#CCD1D1'
                }`,
              }}
              className="select"
            >
              Woman
            </Button>
            <Button
              onClick={handleGenders}
              value="Nonbinary"
              style={{
                backgroundColor: `${
                  genders.indexOf('Nonbinary') === NOT_FOUND_IDX
                    ? '#F9B893'
                    : '#CCD1D1'
                }`,
              }}
              className="select"
            >
              Nonbinary
            </Button>
            <Button
              onClick={handleGenders}
              value="Trans Man"
              style={{
                backgroundColor: `${
                  genders.indexOf('Trans Man') === NOT_FOUND_IDX
                    ? '#A5C4F2'
                    : '#CCD1D1'
                }`,
              }}
              className="select"
            >
              Trans Man
            </Button>
            <Button
              onClick={handleGenders}
              value="Trans Woman"
              style={{
                backgroundColor: `${
                  genders.indexOf('Trans Woman') === NOT_FOUND_IDX
                    ? '#BAB9E9'
                    : '#CCD1D1'
                }`,
              }}
              className="select"
            >
              Trans Woman
            </Button>
            <Button
              onClick={handleGenders}
              value="Other"
              style={{
                backgroundColor: `${
                  genders.indexOf('Other') === NOT_FOUND_IDX
                    ? '#BFEBE0'
                    : '#CCD1D1'
                }`,
              }}
              className="select"
            >
              Other
            </Button>
          </div>
          <div className="section">
            <div className="list-title">Pronouns</div>
            <Button
              onClick={handlePronouns}
              value="He/his"
              style={{
                backgroundColor: `${
                  pronouns.indexOf('He/his') === NOT_FOUND_IDX
                    ? '#EF8B8B'
                    : '#CCD1D1'
                }`,
              }}
              className="select"
            >
              He/his
            </Button>
            <Button
              onClick={handlePronouns}
              value="She/her"
              style={{
                backgroundColor: `${
                  pronouns.indexOf('She/her') === NOT_FOUND_IDX
                    ? '#CFE7C4'
                    : '#CCD1D1'
                }`,
              }}
              className="select"
            >
              She/her
            </Button>
            <Button
              onClick={handlePronouns}
              value="They/them"
              style={{
                backgroundColor: `${
                  pronouns.indexOf('They/them') === NOT_FOUND_IDX
                    ? '#F9B893'
                    : '#CCD1D1'
                }`,
              }}
              className="select"
            >
              They/them
            </Button>
            <Button
              onClick={handlePronouns}
              value="Ze/hir"
              style={{
                backgroundColor: `${
                  pronouns.indexOf('Ze/hir') === NOT_FOUND_IDX
                    ? '#F1D8B0'
                    : '#CCD1D1'
                }`,
              }}
              className="select"
            >
              Ze//hir
            </Button>
            <Button
              onClick={handlePronouns}
              value="Other"
              style={{
                backgroundColor: `${
                  pronouns.indexOf('Other') === NOT_FOUND_IDX
                    ? '#BFEBE0'
                    : '#CCD1D1'
                }`,
              }}
              className="select"
            >
              Other
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboard2;
