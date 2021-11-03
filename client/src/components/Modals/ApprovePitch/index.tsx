import React, { FC, ReactElement, useEffect, useState } from 'react';
import {
  Button,
  Form,
  Grid,
  Header,
  Input,
  Modal,
  ModalProps,
} from 'semantic-ui-react';
import { IPitch } from 'ssw-common';
import Swal from 'sweetalert2';
import { LinkDisplay } from '../..';

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
      <Modal.Header content="Review Pitch" />
      <Modal.Content scrolling className="content">
        <div className="title-section">
          <h1 className="title">{pitch.title}</h1>
          <LinkDisplay href={pitch.assignmentGoogleDocLink} />
        </div>
        <div className="topics-section">
          {pitch.topics.map((topic, index) => (
            <FieldTag key={index} content={topic} />
          ))}
        </div>
        <p className="description">{pitch.description}</p>
        <div className="author-section">
          <div className="author">
            <h3>{`Pitch Creator: ${author}`}</h3>
          </div>
        </div>

        <Form>
          <Form.Input fluid label="Associated Neighborhoods" />
          <label htmlFor="testts">
            Number of Contributors Needed Per Team{' '}
          </label>
          <Form.Group inline widths="equal" className="team-select-group">
            {[...teams, ...teams].slice(0, 7).map((team, index) => (
              <div key={index} className="input-group">
                <FieldTag name={team.name} hexcode={team.color} />
                <Form.Input
                  onChange={(e, { value }) =>
                    changeTeam(team._id, parseInt(value))
                  }
                  value={findTeamTarget(team._id)}
                  type="number"
                  min={0}
                  fluid
                  className="team-input"
                />
              </div>
            ))}
          </Form.Group>
          {/* <Form.Group inline>
            {teams.map((team, index) => (
              <Form.Field
                control={Input}
                label="First name"
                placeholder="First name"
                key={index}
              />
            ))}
          </Form.Group> */}
          <Form.Group inline className="format-deadline-section">
            <Form.Group grouped>
              <label htmlFor="testtest">Issue Format</label>
              <Form.Checkbox
                label={'Print'}
                value={'Print'}
                //checked={false}
                //onChange={(_, value) =>{}}
              />
              <Form.Checkbox
                label={'Online'}
                value={'Online'}
                //checked={false}
                //onChange={(_, value) =>{}}
              />
            </Form.Group>
            <Form.Input
              label={'Deadline'}
              value={'0'}
              className="prints-input"
            />
          </Form.Group>
          <Form.Group inline className="writer-editors-section">
            <Form.Group grouped>
              <label htmlFor="testtest">
                Writer <mark className="optional">- Optional</mark>
              </label>
              <Form.Input />
            </Form.Group>
            <Form.Group grouped>
              <label htmlFor="testtest">Editors</label>
              <Form.Input />
              <Form.Input />
              <Form.Input />
            </Form.Group>
          </Form.Group>
          <Form.Input
            fluid
            label={
              <label htmlFor="testtest">
                Writer <mark className="optional">- Optional</mark>
              </label>
            }
          />
        </Form>
        <Modal.Actions>
          <Button onClick={handleApprove} content="Approve Pitch" positive />
          <Button onClick={handleDecline} content="Decline Pitch" negative />
        </Modal.Actions>
      </Modal.Content>
    </Modal>
  );
};

export default ApprovePitchModal;
