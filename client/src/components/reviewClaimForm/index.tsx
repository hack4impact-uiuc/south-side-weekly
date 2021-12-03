import { capitalize, lowerCase, pick, startCase, upperCase } from 'lodash';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import {
  Button,
  Container,
  Form,
  Grid,
  Icon,
  Input,
  Label,
  TextArea,
} from 'semantic-ui-react';
import { IPitch, IPitchAggregate, IUser } from 'ssw-common';

import { FieldTag, LinkDisplay, MultiSelect, UserChip, Select } from '..';
import { updatePitch } from '../../api';
import { useInterests } from '../../contexts';
import { assignmentStatusEnum } from '../../utils/enums';
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
};

const ReviewClaimForm: FC<ReviewClaimFormProps> = ({
  aggregatedPitch,
  callback,
}): ReactElement => {
  const [formData, setFormData] = useState<FormData>(defaultData);
  const [author, setAuthor] = useState<Partial<IUser>>({});
  const [editMode, setEditMode] = useState<boolean>(false);

  const { getInterestById, interests } = useInterests();

  useEffect(() => {
    setFormData(pick(aggregatedPitch, Object.keys(defaultData)) as FormData);
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

  const isChecked = (issueFormat: string): boolean =>
    formData.issues.some(({ format }) => format === issueFormat);

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

  const formatDate = (date: Date | undefined): string =>
    new Date(date || new Date()).toISOString().split('T')[0];

  const findIssueDate = (issueFormat: string): string | undefined =>
    formatDate(
      formData.issues.find((issue) => issue.format === issueFormat)
        ?.publicationDate,
    );

  const handleSave = async (): Promise<void> => {
    setEditMode(false);
    const res = await updatePitch(formData, aggregatedPitch._id);
    await callback();
  };

  return (
    <div className="review-claim-form-content">
      {!editMode && (
        <Label
          className="edit-button"
          onClick={() => setEditMode((v) => !v)}
          as="a"
        >
          <Icon name="pencil" link />
          Edit Pitch Info
        </Label>
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
        <p className="form-label">Status</p>

        {!editMode ? (
          <div>
            <FieldTag name={formData.assignmentStatus} hexcode={'#FEF0DB'} />
          </div>
        ) : (
          <div style={{ width: '40%' }}>
            <Select
              value={formData.assignmentStatus}
              options={Object.values(assignmentStatusEnum).map((status) => ({
                value: status,
                label: startCase(lowerCase(status)),
              }))}
              onChange={(e) =>
                changeField('assignmentStatus', e ? e.value : '')
              }
              placeholder="Select"
            />
          </div>
        )}
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

      {!editMode ? (
        <div className="form-item">
          <Grid columns={2} className="writer-editors-section">
            <Grid.Column className="issue-format-column">
              <p className="form-label">Issue Format</p>
              {formData.issues.map((issue, idx) => {
                console.log('je');
                return (
                  <p key={idx}>
                    {`${startCase(lowerCase(issue.format))} - ${new Date(
                      issue.publicationDate,
                    ).toLocaleDateString('en-US')}`}
                  </p>
                );
              })}
            </Grid.Column>
            <Grid.Column>
              <div className="deadline-text">
                <p className="form-label">Deadline</p>
                <p>{new Date(formData.deadline).toLocaleDateString('en-US')}</p>
              </div>
            </Grid.Column>
          </Grid>
        </div>
      ) : (
        <Grid columns={2} className="writer-editors-section">
          <Grid.Column className="issue-format-column">
            <p className="form-label">Issue Format</p>
            <div className="issue-format-date-row">
              <Form.Checkbox
                label={'Print'}
                value={'PRINT'}
                checked={isChecked('PRINT')}
                onChange={(_, { value }) =>
                  changeField(
                    'issues',
                    changeIssue(`${value}`, new Date(), true),
                  )
                }
                className="format-checkbox"
              />
              {isChecked('PRINT') && (
                <Form.Input
                  className="publication-date"
                  placeholder="Publication Date"
                  size="small"
                  type="date"
                  value={findIssueDate('PRINT')}
                  onChange={(_, { value }) =>
                    changeField(
                      'issues',
                      changeIssue('PRINT', new Date(value), false),
                    )
                  }
                />
              )}
            </div>
            <div className="issue-format-date-row">
              <Form.Checkbox
                label={'Online'}
                value={'ONLINE'}
                checked={isChecked('ONLINE')}
                onChange={(_, { value }) =>
                  changeField('issues', changeIssue(`${value}`, new Date()))
                }
                className="format-checkbox"
              />
              {isChecked('PRINT') && (
                <Form.Input
                  className="publication-date"
                  placeholder="Publication Date"
                  size="small"
                  type="date"
                  value={findIssueDate('ONLINE')}
                  onChange={(_, { value }) =>
                    changeField(
                      'issues',
                      changeIssue('ONLINE', new Date(value), false),
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
        </Grid>
      )}
      {editMode && (
        <div className="action-buttons">
          <Button
            content="Cancel"
            negative
            onClick={() => setEditMode((v) => !v)}
          />
          <Button content="Save" positive onClick={handleSave} />
        </div>
      )}

      <pre>{JSON.stringify(aggregatedPitch, null, 2)}</pre>
    </div>
  );
};

export default ReviewClaimForm;
