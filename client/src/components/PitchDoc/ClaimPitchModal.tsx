import React, { FC, ReactElement, useState, useEffect } from 'react';
import { Modal, Button, Image, Label, Input, Checkbox, Radio} from 'semantic-ui-react';
import { IPitch } from 'ssw-common';
import { getOpenTeams, updatePitchContributors, updateClaimedPitches, isError } from '../../utils/apiWrapper'
import GoogleDriveScreenshot from '../../assets/GoogleDriveScreenshot.png';
import Homerun from '../../assets/homerun.svg';

import PitchCard from './PitchCard';
import '../../css/pitchDoc/ClaimPitchModal.css';
import {
  currentTeamsButtons,
  teamToTeamsButtons,
  enumToInterestButtons,
  interestsButtons,
} from '../../utils/constants';

interface IProps {
  pitch: IPitch;
}


const ClaimPitchModal: FC<IProps> = ({ pitch }): ReactElement => {
  const [firstOpen, setFirstOpen] = useState<boolean>(false);
  const [secondOpen, setSecondOpen] = useState<boolean>(false);
  const [openTeams, setOpenTeams] = useState<{[key: string]: number}>({});
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const userId = "6031a866c70ec705736a79e5";
  
  const claimPitch = async (): Promise<void> => {
    let res = await updatePitchContributors(userId, pitch._id);
    if (isError(res)) {
      console.log("error");
      return;
    }
    res = await updateClaimedPitches(userId, pitch._id)
    if (isError(res)) {
      console.log("error");
      return;
    }
    console.log(selectedTeams);
    setSecondOpen(true);
    setSelectedTeams([]);

  }

  const handleCheckboxes = (team: string) => {
    console.log("fjsdlkfjdslkfjsdlfkjsdlkfjsdlkfjsdlkfjsdlkfjds");
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
  }
 
  const getAllUnclaimedPitches = async (): Promise<void> => {
    const resp = await getOpenTeams(pitch._id);
    console.log(resp);

    if (!isError(resp) && resp.data) {
      console.log(resp.data.result);
      const teamTemp:{[key: string]: number}= {};
      for (const [key, values] of Object.entries(resp.data.result)) {
        teamTemp[key] = values.target-values.current;
      }
      setOpenTeams(teamTemp);
    }
  };

  const getPitchContributors = async (): Promise<void> => {
    console.log('f');
  }

  useEffect(() => {
    getAllUnclaimedPitches();
  }, []);

  return (
    <>
      {console.log(openTeams)}
      <Modal
        onClose={() => setFirstOpen(false)}
        onOpen={() => setFirstOpen(true)}
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
                    <Label
                      style={{
                        backgroundColor: interestsButtons[enumToInterestButtons[topic]],
                      }}
                      key={idx}
                    >
                      {enumToInterestButtons[topic]}
                    </Label>
                  ))}
                </Label.Group>
              </div>
              <div className="pitch-name"> {pitch.name} </div>
              <div className="submitted-by"> Submitted by: Mustafa Ali </div>
              <div className="summary">
                Here lies a two sentence summary of pitch. It will be two
                sentences and no more.
              </div>
            </div>
            <div className="pitch-link">
              <div className="pitch-link-title">Link to Pitch:</div>
              <Input
                className="pitch-link-input"
                placeholder="Pitch link"
              />
            </div>      
            <div className="role-section">
                <div className="roles-needed-title">Roles Needed:</div>
                <div className="role-items">
                    {Object.entries(openTeams).map(([team,target], idx) => (
                      <>
                        <div className="role-item">
                          <div className="checkbox">
                            <Checkbox
                              className="checkbox"
                              onClick={() => handleCheckboxes(team)}
                            />
                          </div>
                          <Label
                            className="role-name"
                            circular
                            style={{ backgroundColor: currentTeamsButtons[teamToTeamsButtons[team]] }}
                            key={idx}
                          >
                            {teamToTeamsButtons[team]}
                          </Label>  
                          <div className="role-number">{target}</div>
                        </div>
                      </>
                    ))}
                </div>
          
                <div className="modal-submit-button">
                  <Button type="submit" onClick={claimPitch}>
                    Claim Pitch!
                  </Button>
                </div>
            </div>
          </div>

        </Modal.Actions>
      </Modal>

      <Modal
        onClose={() => {setSecondOpen(false); setFirstOpen(false)}}
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
