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
import { LinkDisplay, MultiSelect } from '../..';

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
import { neighborhoods } from '../../../utils/constants';
import { getUsersByTeam } from '../../../api/user';
import { rolesEnum } from '../../../utils/enums';

interface ApprovePitchProps extends ModalProps {
  pitch: IPitch;
  callback(): void;
}

type FormData = Pick<
  IPitch,
  | 'neighborhoods'
  | 'teams'
  | 'issues'
  | 'deadline'
  | 'writer'
  | 'primaryEditor'
  | 'secondEditors'
  | 'thirdEditors'
>;

const defaultData: FormData = {
  neighborhoods: [],
  teams: [],
  issues: [],
  deadline: new Date(),
  writer: '',
  primaryEditor: '',
  secondEditors: [],
  thirdEditors: [],
};

const ApprovePitchModal: FC<ApprovePitchProps> = ({
  pitch,
  callback,
  ...rest
}): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const [author, setAuthor] = useState('');
  const [authorImage, setAuthorImage] = useState<string | undefined>('');
  const [formData, setFormData] = useState<FormData>(defaultData);
  const [editors, setEditors] = useState<IUser[]>([]);
  const [writers, setWriters] = useState<IUser[]>([]);

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

    const getEditors = async (): Promise<void> => {
      const res = await getUsersByTeam('Editing');

      if (!isError(res)) {
        setEditors(res.data.result);
      }
    };

    const getWriters = async (): Promise<void> => {
      const res = await getUsersByTeam('Writing');

      if (!isError(res)) {
        setWriters(res.data.result);
      }
    };

    getEditors();
    getWriters();
    fetchAggregatedPitch();

    return () => {
      setAuthor('');
      setFormData({ ...defaultData });
    };
  }, [isOpen, pitch._id]);

  const findTeamTarget = (teamId: string): number => {
    const team = formData.teams.find(
      (teamMapElement) => teamMapElement.teamId === teamId,
    );
    return team === undefined ? 0 : team.target;
  };

  const changeTeam = (teamId: string, value: number): IPitch['teams'] => {
    const teamMap = formData.teams;
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
    return teamMapCopy;
  };

  const changeIssue = (issueType: string): IPitch['issues'] => {
    const issues = formData.issues;
    const indexOfIssue = issues.findIndex(
      (issue) => issue.issueFormat === issueType,
    );
    const notFoundIndex = -1;
    if (indexOfIssue === notFoundIndex) {
      issues.push({ issueFormat: issueType, issueDate: new Date() });
    } else {
      issues.splice(indexOfIssue, 1);
    }
    const issuesCopy = [...issues];
    return issuesCopy;
  };

  const changeField = <T extends keyof FormData>(
    key: T,
    value: FormData[T],
  ): void => {
    const data = { ...formData };
    data[key] = value;
    setFormData(data);
  };

  const handleApprove = async (): Promise<void> => {
    const validForm = formData.teams.length > 0;

    if (!validForm) {
      Swal.fire({
        title: 'Please set at least 1 team position',
        icon: 'error',
      });
      return;
    }

    const res = await approvePitch(pitch._id, formData);

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
  console.log(formData);

  const filterAdmin = (users: IUser[]): IUser[] =>
    users.filter((user) => user.role === rolesEnum.ADMIN);

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
            <img
              src={authorImage}
              alt="Author Profile"
              className="nametag"
              //style={{ borderRadius: '50%', height: '20px' !important }}
            />{' '}
            {author}
          </Label>
        </div>

        <Form>
          <p className="form-label">Associated Neighborhoods</p>
          <MultiSelect
            options={neighborhoods.map((neighborhood) => ({
              value: neighborhood,
              label: neighborhood,
            }))}
            placeholder="Select Neighborhoods"
            onChange={(values) =>
              changeField(
                'neighborhoods',
                values.map(({ value }) => value),
              )
            }
            value={formData.neighborhoods}
            className="neighborhood-dropdown"
          />
          <p className="form-label">Number of Contributors Needed Per Team </p>
          <Form.Group inline widths="equal" className="team-select-group">
            {teams.map((team, index) => (
              <div key={index} className="input-group">
                <FieldTag name={team.name} hexcode={team.color} />
                <Form.Input
                  onChange={(e, { value }) =>
                    changeField('teams', changeTeam(team._id, parseInt(value)))
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
                checked={formData.issues.some(
                  ({ issueFormat }) => issueFormat === 'Print',
                )}
                onChange={(_, { value }) =>
                  changeField('issues', changeIssue(`${value}`))
                }
              />
              <Form.Checkbox
                label={'Online'}
                value={'Online'}
                checked={formData.issues.some(
                  ({ issueFormat }) => issueFormat === 'Online',
                )}
                onChange={(_, { value }) =>
                  changeField('issues', changeIssue(`${value}`))
                }
              />
            </Grid.Column>
            <Grid.Column>
              <p className="form-label">Deadline</p>
              <Form.Input
                value={new Date(formData.deadline).toISOString().split('T')[0]}
                className="prints-input"
                type="date"
                onChange={(e, { value }) =>
                  changeField('deadline', new Date(value))
                }
              />
            </Grid.Column>
            <Grid.Column>
              <p className="form-label">
                Writer <mark className="optional">- Optional</mark>
              </p>
              <Select
                value={formData.writer}
                options={writers.map((writer) => ({
                  value: writer._id,
                  label: getUserFullName(writer),
                }))}
                onChange={(e) => changeField('writer', e ? e.value : '')}
                placeholder="Select"
              />
            </Grid.Column>
            <Grid.Column>
              <p className="form-label">Editors</p>
              <Select
                value={formData.primaryEditor}
                options={filterAdmin(editors).map((editor) => ({
                  value: editor._id,
                  label: getUserFullName(editor),
                }))}
                onChange={(e) => changeField('primaryEditor', e ? e.value : '')}
                placeholder="Select Primary Editor"
              />
              <MultiSelect
                options={editors.map((editor) => ({
                  value: editor._id,
                  label: getUserFullName(editor),
                }))}
                placeholder="Select Secondary Editor - Optional"
                onChange={(values) =>
                  changeField(
                    'secondEditors',
                    values.map(({ value }) => value),
                  )
                }
                value={formData.secondEditors}
              />
              <MultiSelect
                options={editors.map((editor) => ({
                  value: editor._id,
                  label: getUserFullName(editor),
                }))}
                placeholder="Select Tertiary Editor - Optional"
                onChange={(values) =>
                  changeField(
                    'thirdEditors',
                    values.map(({ value }) => value),
                  )
                }
                value={formData.thirdEditors}
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
