import { isEmpty } from 'lodash';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import {
  Button,
  Form,
  Grid,
  Modal,
  ModalProps,
  Message,
} from 'semantic-ui-react';
import { IPitch, ITeam, IUser } from 'ssw-common';
import Swal from 'sweetalert2';

import {
  approvePitch,
  declinePitch,
  getAggregatedPitch,
  isError,
} from '../../../api';
import { getUsersByTeam } from '../../../api/user';
import { LinkDisplay, MultiSelect, Select } from '../../../components';
import { useAuth, useInterests, useTeams } from '../../../contexts';
import { neighborhoods } from '../../../utils/constants';
import { rolesEnum } from '../../../utils/enums';
import { classNames, getUserFullName } from '../../../utils/helpers';
import FieldTag from '../../FieldTag';
import { PitchRow } from '../../Tables/PitchDoc';
import UserChip from '../../UserChip';
import './styles.scss';

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

type OptionalFields = keyof FormData;

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

const optionalFields: OptionalFields[] = [
  'writer',
  'secondEditors',
  'thirdEditors',
];

const ApprovePitchModal: FC<ApprovePitchProps> = ({
  pitch,
  callback,
  ...rest
}): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const [author, setAuthor] = useState<Partial<IUser>>({});
  const [formData, setFormData] = useState<FormData>(defaultData);
  const [editors, setEditors] = useState<IUser[]>([]);
  const [writers, setWriters] = useState<IUser[]>([]);
  const [reasoning, setReasoning] = useState('');

  const { teams } = useTeams();
  const { getInterestById } = useInterests();
  const { user } = useAuth();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const fetchAggregatedPitch = async (): Promise<void> => {
      const res = await getAggregatedPitch(pitch._id);

      if (!isError(res)) {
        const { author } = res.data.result.aggregated;
        setAuthor(author);

        if (res.data.result.writer) {
          setFormData((f) => ({ ...f, writer: res.data.result.writer }));
        }
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
      setAuthor({});
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

  const changeIssue = (
    issueType: string,
    date: Date,
    checkBox = true,
  ): IPitch['issues'] => {
    const issues = formData.issues;
    const indexOfIssue = issues.findIndex(
      (issue) => issue.format === issueType,
    );
    const notFoundIndex = -1;
    if (indexOfIssue === notFoundIndex) {
      issues.push({ format: issueType, publicationDate: date });
    } else if (checkBox) {
      issues.splice(indexOfIssue, 1);
    } else {
      issues[indexOfIssue].publicationDate = date;
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
    console.log(data);
    setFormData(data);
  };

  const removeOptionalEmptyKeys = (): Partial<IPitch> => {
    const formDataCopy = { ...formData };
    optionalFields.map((field) => {
      if (isEmpty(formDataCopy[field])) {
        delete formDataCopy[field];
      }
    });
    return formDataCopy;
  };

  const handleApprove = async (): Promise<void> => {
    if (user._id === author._id) {
      return;
    }
    const validForm = formData.teams.length > 0;

    if (!validForm) {
      Swal.fire({
        title: 'Please set at least 1 team position',
        icon: 'error',
      });
      return;
    }

    const res = await approvePitch(
      pitch._id,
      removeOptionalEmptyKeys(),
      reasoning,
    );

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
    if (user._id === author._id) {
      return;
    }
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

  const filterPrimaryEditors = (users: IUser[]): IUser[] =>
    users.filter(
      (user) =>
        user.role === rolesEnum.ADMIN &&
        !formData.secondEditors.includes(user._id) &&
        !formData.thirdEditors.includes(user._id),
    );

  const filterSecondaryEditors = (users: IUser[]): IUser[] =>
    users.filter(
      (user) =>
        user._id !== formData.primaryEditor &&
        !formData.thirdEditors.includes(user._id),
    );

  const filterTertiaryEditors = (users: IUser[]): IUser[] =>
    users.filter(
      (user) =>
        user._id !== formData.primaryEditor &&
        !formData.secondEditors.includes(user._id),
    );

  const isChecked = (issueFormat: string): boolean =>
    formData.issues.some(({ format }) => format === issueFormat);

  const formatDate = (date: Date | undefined): string =>
    new Date(date || new Date()).toISOString().split('T')[0];

  const findIssueDate = (issueFormat: string): string | undefined =>
    formatDate(
      formData.issues.find((issue) => issue.format === issueFormat)
        ?.publicationDate,
    );
  const filterTeams = (): ITeam[] =>
    teams.filter((team) => team.name !== 'Writing' && team.name !== 'Editing');

  const filteredTeams = filterTeams();

  return (
    <Modal
      {...rest}
      open={isOpen}
      onClose={() => setIsOpen(false)}
      onOpen={() => setIsOpen(true)}
      trigger={<PitchRow pitch={pitch} />}
      className={classNames('approve-pitch-modal', rest.className)}
    >
      <Modal.Header className="review-pitch-header" content="Review Pitch" />

      <Modal.Content scrolling className="review-pitch-content">
        {user._id === author._id && (
          <Message warning header="You can't approve your own pitch." />
        )}
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

        <div className="pitch-author-section">
          <span className="form-label">Pitch Creator:</span>
          <UserChip user={author} />
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
            {filteredTeams.map((team, index) => (
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
              <div className="issue-format-date-row">
                <Form.Checkbox
                  label={'Print'}
                  value={'Print'}
                  checked={isChecked('Print')}
                  onChange={(_, { value }) =>
                    changeField(
                      'issues',
                      changeIssue(`${value}`, new Date(), true),
                    )
                  }
                  className="format-checkbox"
                />
                {isChecked('Print') && (
                  <Form.Input
                    className="publication-date"
                    placeholder="Publication Date"
                    size="small"
                    type="date"
                    value={findIssueDate('Print')}
                    onChange={(_, { value }) =>
                      changeField(
                        'issues',
                        changeIssue('Print', new Date(value), false),
                      )
                    }
                  />
                )}
              </div>
              <div className="issue-format-date-row">
                <Form.Checkbox
                  label={'Online'}
                  value={'Online'}
                  checked={isChecked('Online')}
                  onChange={(_, { value }) =>
                    changeField('issues', changeIssue(`${value}`, new Date()))
                  }
                  className="format-checkbox"
                />
                {isChecked('Online') && (
                  <Form.Input
                    className="publication-date"
                    placeholder="Publication Date"
                    size="small"
                    type="date"
                    value={findIssueDate('Online')}
                    onChange={(_, { value }) =>
                      changeField(
                        'issues',
                        changeIssue('Online', new Date(value), false),
                      )
                    }
                  />
                )}
              </div>
            </Grid.Column>
            <Grid.Column>
              <p className="form-label">Deadline</p>
              <Form.Input
                value={formatDate(formData.deadline)}
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
                options={filterPrimaryEditors(editors).map((editor) => ({
                  value: editor._id,
                  label: getUserFullName(editor),
                }))}
                onChange={(e) => changeField('primaryEditor', e ? e.value : '')}
                placeholder="Select Primary Editor"
                className="editor-select"
              />
              <MultiSelect
                options={filterSecondaryEditors(editors).map((editor) => ({
                  value: editor._id,
                  label: getUserFullName(editor),
                }))}
                placeholder="Select Secondary Editor - Optional"
                onChange={(values) => {
                  if (values.length > 2) {
                    return;
                  }
                  changeField(
                    'secondEditors',
                    values.map(({ value }) => value),
                  );
                }}
                value={formData.secondEditors}
                className="editor-select"
              />
              <MultiSelect
                options={filterTertiaryEditors(editors).map((editor) => ({
                  value: editor._id,
                  label: getUserFullName(editor),
                }))}
                placeholder="Select Tertiary Editor - Optional"
                onChange={(values) => {
                  if (values.length > 2) {
                    return;
                  }
                  changeField(
                    'thirdEditors',
                    values.map(({ value }) => value),
                  );
                }}
                value={formData.thirdEditors}
              />
            </Grid.Column>
          </Grid>
          <p className="form-label">
            Reasoning <mark className="optional">- Optional</mark>
          </p>
          <Form.Input fluid onChange={(e, { value }) => setReasoning(value)} />
        </Form>
        <Modal.Actions>
          <Button
            disabled={user._id === author._id}
            onClick={handleApprove}
            content="Approve"
            positive
          />
          <Button onClick={handleDecline} content="Decline" negative />
        </Modal.Actions>
      </Modal.Content>
    </Modal>
  );
};

export default ApprovePitchModal;
