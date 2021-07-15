import React, {
  FC,
  ReactElement,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  Modal,
  Button,
  Image,
  Label,
  Checkbox,
  Popup,
  Input,
} from 'semantic-ui-react';
import { IPitch, IUser } from 'ssw-common';

import {
  getOpenTeams,
  updatePitchContributors,
  updateUserClaimedPitches,
  updatePitch,
  getUser,
  isError,
} from '../../api';
import { getUserFirstName } from '../../utils/helpers';
import Homerun from '../../assets/homerun.svg';
import Pfp from '../../assets/pfp.svg';
import {
  currentTeamsButtons,
  teamToTeamsButtons,
  enumToInterestButtons,
  interestsButtons,
} from '../../utils/constants';
import { pitchStatusEnum } from '../../utils/enums';

import PitchCard from './PitchCard';

import '../../css/pitchDoc/ApprovePitchModal.css';
import '../../css/pitchDoc/ClaimPitchModal.css';

interface IProps {
  pitch: IPitch;
}

const ApprovePitchModal: FC<IProps> = ({ pitch }): ReactElement => {
  const [firstOpen, setFirstOpen] = useState<boolean>(false);
  const [secondOpen, setSecondOpen] = useState<boolean>(false);
  const [pitchAuthor, setPitchAuthor] = useState<string>('');
  //TODO: Change from hardcoded values to database values
  const userId = '6031a866c70ec705736a79e5';
  const pitchData: { [key: string]: number | string } = {};

  const claimPitch = async (): Promise<void> => {
    pitchData['pitchStatus'] = pitchStatusEnum['APPROVED'];
    const res = await updatePitch(pitchData, pitch._id);
    if (!isError(res)) {
      setSecondOpen(true);
    }
    console.log(pitchData);
  };

  const loadUser = useCallback(async () => {
    if (pitch.pitchAuthor) {
      const res = await getUser(pitch.pitchAuthor);
      if (!isError(res)) {
        setPitchAuthor(
          `${getUserFirstName(res.data.result)} ${res.data.result.lastName}`,
        );
      }
    }
  }, [pitch.pitchAuthor]);

  useEffect(() => {
    loadUser();
  }, [firstOpen, loadUser]);

  return (
    <>
      <Modal
        className="claim-pitch-modal"
        onClose={() => {
          setFirstOpen(false);
        }}
        onOpen={() => {
          setFirstOpen(true);
        }}
        open={firstOpen}
        trigger={<PitchCard pitch={pitch} />}
        closeIcon
      >
        <Modal.Actions>
          <div className="claim-pitches-wrapper">
            <div className="pitch-info">
              <div className="topics-wrapper">
                <Label.Group style={{ marginBottom: 10 }} circular>
                  {pitch.topics.map((topic, idx) => (
                    <>
                      <Label
                        style={{
                          backgroundColor:
                            interestsButtons[enumToInterestButtons[topic]],
                        }}
                        key={idx}
                      >
                        {enumToInterestButtons[topic]}
                      </Label>
                    </>
                  ))}
                </Label.Group>
              </div>
              <div className="pitch-name"> {pitch.name} </div>
              <span className="pitch-info-title">
                {`Submitted By: ${pitchAuthor}`}
              </span>
              <div className="pitch-description">{pitch.pitchDescription}</div>
              <div className="pitch-info-title">
                Link to Pitch:{' '}
                <a
                  href={pitch.assignmentGoogleDocLink}
                  rel="noreferrer"
                  target="_blank"
                >
                  {pitch.assignmentGoogleDocLink}
                </a>
              </div>
            </div>

            <div className="role-contributor-section">
              <div className="section-title">
                Set Positions Available Per Team:
              </div>
              <div className="section-description">
                If approving this Pitch, please indicate the amount of positions
                that each team will have for this Pitch:
              </div>
              <div className="role-items">
                {Object.keys(teamToTeamsButtons).map((team, idx) => (
                  <div className="role-item" key={idx}>
                    <Label
                      className="role-name"
                      circular
                      style={{
                        backgroundColor:
                          currentTeamsButtons[teamToTeamsButtons[team]],
                      }}
                    >
                      {teamToTeamsButtons[team]}
                    </Label>
                    <Input
                      className="role-number-input"
                      onChange={(e, { value }) =>
                        (pitchData[`teams.${team}.target`] = value)
                      }
                    />
                  </div>
                ))}
              </div>

              <div className="modal-submit-button">
                <Button id="submit" type="submit" onClick={claimPitch}>
                  Approve Pitch
                </Button>
                <Button id="decline" type="decline" onClick={claimPitch}>
                  Decline Pitch
                </Button>
              </div>
            </div>
          </div>
        </Modal.Actions>
      </Modal>

      <Modal
        onClose={() => {
          setSecondOpen(false);
          setFirstOpen(false);
        }}
        onOpen={() => setFirstOpen(false)}
        open={secondOpen}
        closeIcon
      >
        <Modal.Actions>
          <div className="success-wrapper">
            <div className="text">
              You successfully claimed this Pitch! Once approved, it will show
              up on your Home Page under “Claimed Pitches”.
            </div>
            <div className="image">
              <Image src={Homerun} />
            </div>
          </div>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default ApprovePitchModal;
