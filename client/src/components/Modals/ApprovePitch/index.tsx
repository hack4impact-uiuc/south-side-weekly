import React, { FC, ReactElement, useEffect, useState } from 'react';
import {
  Button,
  Form,
  Grid,
  Header,
  Input,
  Label,
  Modal,
  ModalProps,
} from 'semantic-ui-react';
import { IPitch, IUser } from 'ssw-common';
import Swal from 'sweetalert2';
import { LinkDisplay } from '../..';

import {
  approvePitch,
  declinePitch,
  isError,
  getAggregatedPitch,
  getUsers,
} from '../../../api';
import { useInterests, useTeams } from '../../../contexts';
import { classNames, getUserFullName } from '../../../utils/helpers';
import FieldTag from '../../FieldTag';
import PitchCard from '../../PitchCard';

import { Select } from '../../../components';

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
  const [authorImage, setAuthorImage] = useState<string | undefined>('');
  const [teamMap, setTeamMap] = useState<IPitch['teams']>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [writer, setWriter] = useState('');
  const [primaryEditor, setPrimaryEditor] = useState('');
  const [secondaryEditor, setSecondaryEditor] = useState('');
  const [tertiaryEditor, setTertiaryEditor] = useState('');

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
        setAuthorImage(res.data.result.aggregated.author.profilePic);
      }
    };

    const getAllUsers = async (): Promise<void> => {
      const res = await getUsers();

      if (!isError(res)) {
        setUsers(res.data.result);
      }
    };

    getAllUsers();
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
          <h2 className="title">{pitch.title}</h2>
          <LinkDisplay href={pitch.assignmentGoogleDocLink} />
        </div>
        <div className="topics-section">
          {pitch.topics.map((topic, index) => {
            const interest = getInterestById(topic);

            return (
              <FieldTag
                key={index}
                name={interest?.name}
                hexcode={interest?.color}
              />
            );
          })}
        </div>
        <p className="description">{pitch.description}</p>

        {/* TODO: Replace with Neha's NameTag Component */}
        <div className="pitch-author-section">
          <span className="form-label">Pitch Creator:</span>
          <Label as="a" image>
            <img src={authorImage} alt="Author Profile" /> {author}
          </Label>
        </div>

        <Form>
          <p className="form-label">Associated Neighborhoods</p>
          <Form.Input fluid />
          <p className="form-label">Number of Contributors Needed Per Team </p>
          <Form.Group inline widths="equal" className="team-select-group">
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
                  fluid
                  className="team-input"
                />
              </div>
            ))}
          </Form.Group>
          <Grid columns={2} className="writer-editors-section">
            <Grid.Column className="issue-format-column">
              <p className="form-label">Issue Format</p>
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
            </Grid.Column>
            <Grid.Column>
              <p className="form-label">Deadline</p>
              <Form.Input value={'0'} className="prints-input" />
            </Grid.Column>
            <Grid.Column>
              <p className="form-label">
                Writer <mark className="optional">- Optional</mark>
              </p>
              <Select
                value={writer}
                options={users.map(getUserFullName)}
                onChange={(e) => setWriter(e ? e.value : '')}
                placeholder="Select"
              />
            </Grid.Column>
            <Grid.Column>
              <p className="form-label">Editors</p>
              <Select
                value={primaryEditor}
                options={users.map(getUserFullName)}
                onChange={(e) => setPrimaryEditor(e ? e.value : '')}
                placeholder="Select Primary Editor"
              />
              <Select
                value={secondaryEditor}
                options={users.map(getUserFullName)}
                onChange={(e) => setSecondaryEditor(e ? e.value : '')}
                placeholder="Select Secondary Editor - Optional"
              />
              <Select
                value={tertiaryEditor}
                options={users.map(getUserFullName)}
                onChange={(e) => setTertiaryEditor(e ? e.value : '')}
                placeholder="Select Tertiary Editor - Optional"
              />
            </Grid.Column>
          </Grid>
          <p className="form-label">
            Reasoning <mark className="optional">- Optional</mark>
          </p>
          <Form.Input fluid />
        </Form>
        <Modal.Actions>
          <Button onClick={handleApprove} content="Approve" positive />
          <Button onClick={handleDecline} content="Decline" negative />
        </Modal.Actions>
      </Modal.Content>
    </Modal>
  );
};

export default ApprovePitchModal;
