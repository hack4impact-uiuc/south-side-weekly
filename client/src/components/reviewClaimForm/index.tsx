import { lowerCase, pick, startCase } from 'lodash';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import { Button, Form, Grid, Icon, Input, Label } from 'semantic-ui-react';
import { IPitch, IPitchAggregate, IUser } from 'ssw-common';

import {
  AddIssue,
  AdminView,
  FieldTag,
  LinkDisplay,
  MultiSelect,
  Select,
  UserChip,
} from '..';
import { updatePitch } from '../../api';
import { useInterests } from '../../contexts';
import { useIssues } from '../../contexts/issues/context';
import { assignmentStatusEnum, issueStatusEnum } from '../../utils/enums';
import './styles.scss';

interface ReviewClaimFormProps {
  aggregatedPitch: IPitchAggregate;
  callback: () => Promise<void>;
}

type FormData = Pick<
  IPitch,
  | 'title'
  | 'assignmentGoogleDocLink'
  | 'description'
  | 'topics'
  | 'issues'
  | 'teams'
  | 'primaryEditor'
  | 'secondEditors'
  | 'thirdEditors'
  | 'writer'
  | 'assignmentStatus'
  | 'deadline'
  | 'issueStatuses'
>;

const defaultData: FormData = {
  title: '',
  assignmentGoogleDocLink: '',
  description: '',
  topics: [],
  teams: [],
  issues: [],
  writer: '',
  primaryEditor: '',
  secondEditors: [],
  thirdEditors: [],
  assignmentStatus: '',
  deadline: new Date(),
  issueStatuses: [],
};

const ReviewClaimForm: FC<ReviewClaimFormProps> = ({
  aggregatedPitch,
  callback,
}): ReactElement => {
  const [formData, setFormData] = useState<FormData>(defaultData);
  const [author, setAuthor] = useState<Partial<IUser>>({});
  const [editMode, setEditMode] = useState<boolean>(false);
  const [originalData, setOriginalData] = useState<FormData>(defaultData);

  const { getInterestById, interests } = useInterests();
  const { getIssueFromId, issues, fetchIssues } = useIssues();

  useEffect(() => {
    const original = pick(
      aggregatedPitch,
      Object.keys(defaultData),
    ) as FormData;
    setOriginalData(original);
    setFormData(original);

    setAuthor(aggregatedPitch.aggregated.author);
  }, [aggregatedPitch]);

  const changeField = <T extends keyof FormData>(
    key: T,
    value: FormData[T],
  ): void => {
    const data = { ...formData };
    data[key] = value;
    setFormData(data);
  };

  const formatDate = (date: Date | undefined): string =>
    new Date(date || new Date()).toISOString().split('T')[0];

  const handleSave = async (): Promise<void> => {
    setEditMode(false);
    await updatePitch(formData, aggregatedPitch._id);
    await callback();
  };

  const changeIssueAssignmentStatus = (
    issueId: string,
    value: string,
  ): IPitch['issueStatuses'] => {
    const issueStatuses = formData.issueStatuses;
    const indexOfIssueStatus = issueStatuses.findIndex(
      (issue) => issue.issueStatus === issueId,
    )!;
    const notFoundIndex = -1;
    if (indexOfIssueStatus !== notFoundIndex) {
      issueStatuses[indexOfIssueStatus].issueStatus = value;
    }
    const issueStatusesCopy = [...issueStatuses];
    return issueStatusesCopy;
  };

  const renderIssueAssignmentStatus = (): JSX.Element => {
    const pitchIssues = formData.issueStatuses.map(({ issueId }) =>
      getIssueFromId(issueId),
    );

    if (pitchIssues.length === 0) {
      return <></>;
    }

    const latestIssue = pitchIssues.reduce((a, b) => {
      if (a && b) {
        a.releaseDate > b.releaseDate ? a : b;
      } else {
        return undefined;
      }
    });

    let status: { issueId: string; issueStatus: string } | undefined;

    if (latestIssue) {
      status = formData.issueStatuses.find(
        ({ issueId }) => issueId === latestIssue._id,
      );
    } else {
      status = undefined;
    }

    if (status) {
      return !editMode ? (
        <div>
          <FieldTag name={status.issueStatus} hexcode={'#E7F2FC'} />
        </div>
      ) : (
        <div>
          <Select
            value={'Definitely In'}
            options={Object.values(issueStatusEnum).map((s) => ({
              value: s,
              label: startCase(lowerCase(s)),
            }))}
            onChange={(e) =>
              changeField(
                'issueStatuses',
                changeIssueAssignmentStatus(
                  status ? status.issueId : '',
                  e ? e.value : '',
                ),
              )
            }
            placeholder="Select"
            className="issue-assignment-status-select"
          />
        </div>
      );
    }
    return <></>;
  };

  return (
    <div className="review-claim-form-content">
      {!editMode && (
        <AdminView>
          <Label
            className="edit-button"
            onClick={() => setEditMode((v) => !v)}
            as="a"
          >
            <Icon name="pencil" link />
            Edit Pitch Info
          </Label>
        </AdminView>
      )}
      <div className="form-item">
        <p className="form-label">Pitch Title</p>
        {!editMode ? (
          <p>{formData.title}</p>
        ) : (
          <Input
            value={formData.title}
            onChange={(_, { value }) => changeField('title', value)}
            fluid
          />
        )}
      </div>

      <div className="form-label-section">
        <span className="form-label row">Pitch Creator:</span>
        {console.log('AUTHOR:', author)}
        <UserChip user={author} />
      </div>

      <div className="form-item">
        <Grid columns={2} className="status-grid">
          <Grid.Column width={editMode ? 7 : 4}>
            <p className="form-label">Edit Status</p>

            {!editMode ? (
              <div>
                <FieldTag
                  name={startCase(lowerCase(formData.assignmentStatus))}
                  hexcode={'#FEF0DB'}
                />
              </div>
            ) : (
              <div>
                <Select
                  value={formData.assignmentStatus}
                  options={Object.values(assignmentStatusEnum).map(
                    (status) => ({
                      value: status,
                      label: startCase(lowerCase(status)),
                    }),
                  )}
                  onChange={(e) =>
                    changeField('assignmentStatus', e ? e.value : '')
                  }
                  placeholder="Select"
                  className="assignment-status-select"
                />
              </div>
            )}
          </Grid.Column>
          <Grid.Column width={editMode ? 7 : 8}>
            <p className="form-label">Issue Assignment Status</p>
            {renderIssueAssignmentStatus()}
          </Grid.Column>
        </Grid>
      </div>

      <div className="form-item">
        <p className="form-label">Associated Topics</p>

        {!editMode ? (
          <div>
            {formData.topics.map((topic, index) => {
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
        ) : (
          <MultiSelect
            options={interests.map((interest) => ({
              value: interest._id,
              label: interest.name,
            }))}
            onChange={(values) => {
              changeField(
                'topics',
                values.map(({ value }) => value),
              );
            }}
            value={formData.topics}
          />
        )}
      </div>

      <div className="form-item">
        {!editMode ? (
          <LinkDisplay href={formData.assignmentGoogleDocLink} />
        ) : (
          <div>
            <p className="form-label">Google Doc Link</p>

            <Input
              value={formData.assignmentGoogleDocLink}
              onChange={(_, { value }) =>
                changeField('assignmentGoogleDocLink', value)
              }
              fluid
            />
          </div>
        )}
      </div>

      <div className="form-item">
        <p className="form-label">Description</p>

        {!editMode ? (
          <p>{formData.description}</p>
        ) : (
          <Form>
            <Form.TextArea
              value={formData.description}
              onChange={({ target: { value } }) =>
                changeField('description', value)
              }
              rows={4}
            />
          </Form>
        )}
      </div>

      <div className="form-item">
        <Grid columns={2} className="issues-deadline-grid">
          <Grid.Column width={editMode ? 8 : 6}>
            <p className="form-label">Associated Issue(s)</p>
            {!editMode ? (
              formData.issues.map((issueId, idx) => {
                const issue = getIssueFromId(issueId)!;
                return (
                  <p key={idx}>
                    {`${startCase(lowerCase(issue.type))} - ${new Date(
                      issue.releaseDate,
                    ).toLocaleDateString('en-US')}`}
                  </p>
                );
              })
            ) : (
              <>
                <AddIssue callback={fetchIssues} />

                <MultiSelect
                  options={issues.map((issue) => ({
                    value: issue._id,
                    label: `${formatDate(issue.releaseDate)} - ${startCase(
                      lowerCase(issue.type),
                    )}`,
                  }))}
                  placeholder="Select Issue(s)"
                  onChange={(values) => {
                    changeField(
                      'issues',
                      values.map((value) => value.value),
                    );
                  }}
                  value={formData.issues}
                  className="issue-select"
                />
              </>
            )}
          </Grid.Column>
          <Grid.Column width={editMode ? 8 : 6}>
            <p className="form-label">Pitch Completion Deadline</p>
            {!editMode ? (
              <p>{new Date(formData.deadline).toLocaleDateString('en-US')}</p>
            ) : (
              <Form.Input
                value={formatDate(formData.deadline)}
                className="prints-input"
                type="date"
                onChange={(e, { value }) =>
                  changeField('deadline', new Date(value))
                }
              />
            )}
          </Grid.Column>
        </Grid>
      </div>

      {editMode && (
        <div className="action-buttons">
          <Button
            content="Cancel"
            negative
            onClick={() => {
              setEditMode((v) => !v);
              setFormData(originalData);
            }}
          />
          <Button content="Save" positive onClick={handleSave} />
        </div>
      )}
    </div>
  );
};

export default ReviewClaimForm;
