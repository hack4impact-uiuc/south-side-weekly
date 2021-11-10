import React, { FC, ReactElement, useEffect, useState } from 'react';
import { Button, Form, Grid, Modal, ModalProps } from 'semantic-ui-react';
import { IPitch } from 'ssw-common';
import Swal from 'sweetalert2';

import {
  approvePitch,
  declinePitch,
  isError,
  getAggregatedPitch,
} from '../../../api';
import { useInterests, useTeams } from '../../../contexts';
import { classNames, getUserFullName } from '../../../utils/helpers';
import FieldTag from '../../FieldTag';
import PitchCard from '../../PitchCard';

import './styles.scss';
 
interface ApprovePitchProps extends ModalProps {
  pitch: IPitch;
  callback(): void;
}

const ApprovePitchModal: FC<ApprovePitchProps> = ({
  pitch,
  callback,
  ...rest
}): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const [author, setAuthor] = useState('');
  const [teamMap, setTeamMap] = useState<IPitch['teams']>([]);
  const { teams } = useTeams();
  const { getInterestById } = useInterests();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const fetchAggregatedPitch = async (): Promise<void> => {
      const res = await getAggregatedPitch(pitch._id);

      if (!isError(res)) {
        setAuthor(getUserFullName(res.data.result.aggregated.author));
      }
    };

    fetchAggregatedPitch();

    return () => {
      setAuthor('');
      setTeamMap([]);
    };
  }, [isOpen, pitch._id]);

  const findTeamTarget = (teamId: string): number => {
    const team = teamMap.find(
      (teamMapElement) => teamMapElement.teamId === teamId,
    );
    return team === undefined ? 0 : team.target;
  };

  const changeTeam = (teamId: string, value: number): void => {
    const indexOfTeamId = teamMap.findIndex((team) => team.teamId === teamId)!;
    const notFoundIndex = -1;
    if (indexOfTeamId === notFoundIndex) {
      teamMap.push({ teamId: teamId, target: value });
    } else {
      if (value === 0 || isNaN(value)) {
        teamMap.splice(indexOfTeamId, 1);
      } else {
        teamMap[indexOfTeamId].target = value;
      }
    }
    const teamMapCopy = [...teamMap];
    setTeamMap(teamMapCopy);
  };

  const handleApprove = async (): Promise<void> => {
    const validForm = teamMap.length > 0;

    if (!validForm) {
      Swal.fire({
        title: 'Please set at least 1 team position',
        icon: 'error',
      });
      return;
    }

    const res = await approvePitch(pitch._id, teamMap);

    if (!isError(res)) {
      callback();
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Successfully approved pitch.',
      });
      setIsOpen(false);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Failed to approve pitch.',
        text: 'Server may be down.',
      });
    }
  };

  const handleDecline = async (): Promise<void> => {
    const res = await declinePitch(pitch._id);

    if (!isError(res)) {
      callback();
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Successfully declined pitch.',
      });
      setIsOpen(false);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Failed to decline pitch.',
        text: 'Server may be down.',
      });
    }
  };

  return (
    <Modal
      {...rest}
      open={isOpen}
      onClose={() => setIsOpen(false)}
      onOpen={() => setIsOpen(true)}
      trigger={<PitchCard pitch={pitch} />}
      className={classNames('approve-pitch-modal', rest.className)}
    >
      <Modal.Header content="Approve or Decline Pitch" />
      <Modal.Content>
        <h1>{pitch.title}</h1>
        <Grid className="topics-section" columns={6}>
          {pitch.topics.map((topic, index) => {
            const interest = getInterestById(topic);

            return (
              <Grid.Column key={index}>
                <FieldTag name={interest?.name} hexcode={interest?.color} />
              </Grid.Column>
            );
          })}
        </Grid>
        <div className="author-section">
          <div className="author">
            <h3>{`Submitted by: ${author}`}</h3>
          </div>
        </div>
        <p className="description">{pitch.description}</p>
        <p>
          Link to Pitch:{' '}
          <a href={pitch.assignmentGoogleDocLink}>
            {pitch.assignmentGoogleDocLink}
          </a>
        </p>
        <h2>Set positions Available Per Team: </h2>
        <p>
          If approving this Pitch, please indicate the amount of positions that
          each team will have for this Pitch:
        </p>
        <Form>
          <Form.Group inline widths={5} className="team-select-group">
            {teams.map((team, index) => (
              <div key={index} className="input-group">
                <FieldTag name={team.name} hexcode={team.color} />
                <Form.Input
                  onChange={(e, { value }) =>
                    changeTeam(team._id, parseInt(value))
                  }
                  value={findTeamTarget(team._id)}
                  type="number"
                  min={0}
                />
              </div>
            ))}
          </Form.Group>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={handleApprove} content="Approve Pitch" positive />
        <Button onClick={handleDecline} content="Decline Pitch" negative />
      </Modal.Actions>
    </Modal>
  );
};

export default ApprovePitchModal;
