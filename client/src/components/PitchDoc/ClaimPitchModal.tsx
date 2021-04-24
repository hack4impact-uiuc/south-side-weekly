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
  Input,
  Checkbox,
  Popup,
} from 'semantic-ui-react';
import { IPitch } from 'ssw-common';

import {
  getOpenTeams,
  updatePitchContributors,
  updateClaimedPitches,
  updatePitch,
  loadUser,
  isError,
} from '../../utils/apiWrapper';
import Homerun from '../../assets/homerun.svg';
import Pfp from '../../assets/pfp.svg';
import {
  currentTeamsButtons,
  teamToTeamsButtons,
  enumToInterestButtons,
  interestsButtons,
} from '../../utils/constants';

import PitchCard from './PitchCard';

import '../../css/pitchDoc/ClaimPitchModal.css';

interface IProps {
  pitch: IPitch;
  getAllUnclaimedPitches: () => Promise<void>;
}

const ClaimPitchModal: FC<IProps> = ({
  pitch,
  getAllUnclaimedPitches,
}): ReactElement => {
  const [firstOpen, setFirstOpen] = useState<boolean>(false);
  const [secondOpen, setSecondOpen] = useState<boolean>(false);
  const [openTeams, setOpenTeams] = useState<{
    [key: string]: { current: number; target: number };
  }>({});
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [pitchContributors, setPitchContributors] = useState<{
    [key: string]: string;
  }>({});
  const [pitchLink, setPitchLink] = useState<string>('');
  const [pitchAuthor, setPitchAuthor] = useState<string>('');
  const [approvedBy, setApprovedBy] = useState<string>('');
  const userId = '6031a866c70ec705736a79e5';
  const temp_pfp = Pfp;
  const pitchData: { [key: string]: number | string } = {};

  const claimPitch = async (): Promise<void> => {
    const pitchRes = await updatePitchContributors(userId, pitch._id);
    const claimedRes = await updateClaimedPitches(userId, pitch._id);
    setData();
    const updateRes = await updatePitch(pitchData, pitch._id);
    if (!isError(pitchRes) && !isError(claimedRes) && !isError(updateRes)) {
      setSecondOpen(true);
    }
    getAllUnclaimedPitches();
  };

  const setData = (): void => {
    selectedTeams.map((team) => {
      pitchData[`teams.${team}.current`] = openTeams[team].current + 1;
    });
    pitchData['assignmentGoogleDocLink'] = pitchLink;
  };

  const handleCheckboxes = (team: string): void => {
    const notFoundIdx = -1;
    const elementIdx = selectedTeams.indexOf(team);
    if (elementIdx === notFoundIdx) {
      const addedElements = selectedTeams.concat(team);
      setSelectedTeams(addedElements);
    } else {
      const removedElements = selectedTeams.filter(
        (element) => element !== team,
      );
      setSelectedTeams(removedElements);
    }
  };

  const getTeams = useCallback(async (): Promise<void> => {
    const resp = await getOpenTeams(pitch._id);

    if (!isError(resp) && resp.data) {
      setOpenTeams(resp.data.result);
    }
  }, [pitch._id]);

  const getUser = useCallback(async () => {
    const contributors: { [name: string]: string } = {};
    for (const userId of pitch.assignmentContributors) {
      const res = await loadUser(userId);
      if (!isError(res)) {
        contributors[
          `${res.data.result.firstName} ${res.data.result.lastName}`
        ] = temp_pfp;
      }
    }
    setPitchContributors(contributors);
    if (pitch.pitchAuthor) {
      const res = await loadUser(pitch.pitchAuthor);
      if (!isError(res)) {
        setPitchAuthor(
          `${res.data.result.firstName} ${res.data.result.lastName}`,
        );
      }
    }
    if (pitch.approvedBy) {
      const res = await loadUser(pitch.approvedBy);
      if (!isError(res)) {
        setApprovedBy(
          `${res.data.result.firstName} ${res.data.result.lastName}`,
        );
      }
    }
  }, [
    pitch.assignmentContributors,
    pitch.pitchAuthor,
    pitch.approvedBy,
    temp_pfp,
  ]);

  useEffect(() => {
    getTeams();
    setSelectedTeams([]);
    getUser();
    setPitchLink('');
  }, [firstOpen, getTeams, getUser]);

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
        trigger={<PitchCard pitch={pitch} openTeams={openTeams}></PitchCard>}
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
              <span className="submitted-reviewed-by">
                Submitted By: {pitchAuthor}
              </span>
              <span className="submitted-reviewed-by">
                Reviewed By: {approvedBy}
              </span>
              <div className="section-description">
                Here lies a two sentence summary of pitch. It will be two
                sentences and no more.
              </div>
            </div>
            <div className="pitch-link">
              <div className="pitch-link-title">Link to Pitch:</div>
              <Input
                className="pitch-link-input"
                placeholder="Pitch link"
                onChange={(e) => {
                  setPitchLink(e.currentTarget.value);
                }}
              />
            </div>
            <div className="role-contributor-section">
              <div className="section-title">Roles Available Per Team:</div>
              <div className="section-description">
                Please select the team that you will be filling the role for
                before claiming this pitch.
              </div>
              <div className="role-items">
                {Object.entries(openTeams).map(([team, value], idx) => (
                  <>
                    <div className="role-item" key={idx}>
                      <div className="checkbox">
                        <Checkbox
                          className="checkbox"
                          onClick={() => handleCheckboxes(team)}
                        />
                      </div>
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
                      <div className="role-number">
                        {value.target - value.current}
                      </div>
                    </div>
                  </>
                ))}
              </div>
              <div className="section-title">Pitch Claimed By:</div>
              <div className="pitch-contributors">
                {Object.entries(pitchContributors).map(
                  ([name, pfpLink], idx) => (
                    <>
                      <Popup
                        content={name}
                        trigger={
                          <img
                            key={idx}
                            src={pfpLink}
                            className="pfp"
                            alt="pfp"
                          />
                        }
                      />
                    </>
                  ),
                )}
              </div>

              <div className="modal-submit-button">
                <Button type="submit" onClick={claimPitch}>
                  Submit My Claim for Approval
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

export default ClaimPitchModal;
