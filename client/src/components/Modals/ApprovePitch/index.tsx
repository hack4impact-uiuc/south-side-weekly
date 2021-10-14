import { isEmpty, toString } from 'lodash';
import React, {
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Button, Form, Grid, Modal, ModalProps } from 'semantic-ui-react';
import { IPitch } from 'ssw-common';
import Swal from 'sweetalert2';

import { approvePitch, declinePitch, getUser, isError } from '../../../api';
import { useTeams } from '../../../contexts';
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

  const getAuthor = useCallback(async (): Promise<void> => {
    if (isEmpty(pitch.author)) {
      return;
    }

    const res = await getUser(pitch.author);

    if (!isError(res)) {
      setAuthor(getUserFullName(res.data.result));
    }
  }, [pitch.author]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const roster : IPitch['teams']= [];

    teams.map((team) => {
      roster.push({teamId: team._id, target: 0});
    });

    setTeamMap(roster);

    getAuthor();

    return () => {
      setAuthor('');
      setTeamMap([]);
    };
  }, [getAuthor, isOpen, teams]);

  const changeTeam = (teamId: string, value: number): void => {
    const indexOfTeamId = teamMap.findIndex(team => team.teamId === teamId)!;
    teamMap[indexOfTeamId].target = value;
    console.log(teamMap);
    const teamMapCopy = [...teamMap];
    setTeamMap(teamMapCopy);
  };

  const handleApprove = async (): Promise<void> => {

    const validForm = teamMap.some(team => team.target > 0);

    if (!validForm) {
      Swal.fire({
        title: 'Please set at least 1 team position',
        icon: 'error',
      });
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
          {pitch.topics.map((topic, index) => (
            <Grid.Column key={index}>
              <FieldTag content={topic} />
            </Grid.Column>
          ))}
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
                <FieldTag content={team.name} />
                <Form.Input
                  onChange={(e, { value }) => changeTeam(team._id, parseInt(value))}
                  value={teamMap.find(teamMapElement => teamMapElement.teamId === team._id)?.target}
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
