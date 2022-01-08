import { Field, Form as FormikForm, Formik } from 'formik';
import { lowerCase, pick, startCase } from 'lodash';
import React, { FC, ReactElement, useState } from 'react';
import { Button, Form, Icon, Label } from 'semantic-ui-react';
import {
  BasePopulatedPitch,
  FullPopulatedPitch,
  Issue,
  Pitch,
} from 'ssw-common';

import { apiCall, isError } from '../../api';
import { useInterests } from '../../contexts';
import { useIssues } from '../../contexts/issues/context';
import { editStatusEnum, issueStatusEnum } from '../../utils/enums';
import { formatDate } from '../../utils/helpers';
import AddIssue from '../modal/AddIssue';
import UserChip from '../tag/UserChip';
import { FormInput } from '../ui/FormInput';
import { FormMultiSelect } from '../ui/FormMultiSelect';
import { FormSingleSelect } from '../ui/FormSingleSelect';
import { FormTextArea } from '../ui/FormTextArea';
import { LinkDisplay } from '../ui/LinkDisplayButton';
import { PrimaryButton } from '../ui/PrimaryButton';
import { AuthView } from '../wrapper/AuthView';
import './ReviewClaimForm.scss';

interface FormProps {
  pitch: FullPopulatedPitch | null;
  isReadyForFeedback: (
    issueStatuses: FullPopulatedPitch['issueStatuses'],
  ) => void;
}

interface FormData
  extends Pick<
    Pitch,
    | 'title'
    | 'editStatus'
    | 'topics'
    | 'assignmentGoogleDocLink'
    | 'description'
    | 'assignmentStatus'
  > {
  issueStatuses: string[];
  deadline: string;
}

const fields: (keyof FormData)[] = [
  'title',
  'editStatus',
  'topics',
  'assignmentGoogleDocLink',
  'description',
  'deadline',
  'issueStatuses',
];

export const ReviewClaimForm: FC<FormProps> = ({
  pitch,
  isReadyForFeedback,
}): ReactElement => {
  const [editMode, setEditMode] = useState<boolean>(false);
  console.log(fields);
  const { getInterestById, interests } = useInterests();
  const { getIssueFromId, issues, fetchIssues } = useIssues();

  const getIssueFromIssueStatuses = (
    id: string,
  ): { issueId: Issue; issueStatus: string } | undefined =>
    pitch?.issueStatuses.find(({ issueId: { _id } }) => _id === id);

  const handleSave = async (data: FormData): Promise<void> => {
    const newPitch: Partial<Pitch> = {
      ...data,
      deadline: new Date(data.deadline),
      issueStatuses: data.issueStatuses.map((id) => {
        const issue = getIssueFromIssueStatuses(id);

        if (!issue) {
          return { issueId: id, issueStatus: issueStatusEnum.DEFINITELY_IN };
        }
        return { issueId: id, issueStatus: issue.issueStatus };
      }),
    };

    const res = await apiCall<BasePopulatedPitch>({
      method: 'PUT',
      url: `/pitches/${pitch?._id}`,
      body: newPitch,
      query: {
        populate: 'default',
      },
    });

    if (!isError(res)) {
      isReadyForFeedback(res.data.result.issueStatuses);
    }

    setEditMode(false);
  };

  const formatFormDate = (date: Date | undefined): string =>
    new Date(date || new Date()).toISOString().split('T')[0];

  if (!pitch) {
    return <div id="review-claim-form"></div>;
  }

  return (
    <Formik<FormData>
      initialValues={{
        ...pick(pitch, fields),
        topics: pitch.topics.map((i) => i._id),
        issueStatuses: pitch.issueStatuses.map((issue) => issue.issueId._id),
        deadline: formatFormDate(pitch.deadline),
      }}
      onSubmit={handleSave}
    >
      {({ values, handleReset }) => (
        <FormikForm id={'review-claim-form'}>
          {!editMode && (
            <AuthView view="isAdmin">
              <Label
                className="edit-button"
                onClick={() => setEditMode((v) => !v)}
                as="a"
              >
                <Icon name="pencil" link />
                Edit Pitch Info
              </Label>
            </AuthView>
          )}
          <div className="form-wrapper">
            <div className="row">
              <Field
                component={FormInput}
                name="title"
                label="Pitch Title"
                editable={editMode}
              />
            </div>
            <div className="row">
              <span className="form-label">Pitch Creator:</span>
              <UserChip user={pitch.author} />
            </div>
            <div className="row">
              <div className="left-col">
                <Field
                  component={FormSingleSelect}
                  options={Object.values(editStatusEnum).map((status) => ({
                    value: status,
                    label: status,
                  }))}
                  name="editStatus"
                  label="Edit Status"
                  editable={editMode}
                />
              </div>
              {/*TODO: Figure out this field */}
              {/* <div className="right-col">
                <Field
                  component={FormSingleSelect}
                  options={Object.values(issueStatusEnum).map((status) => ({
                    value: status,
                    label: startCase(lowerCase(status)),
                  }))}
                  name="issueStatus"
                  label="Issue Assignment Status"
                />
              </div> */}
            </div>
            <div className="row">
              <Field
                component={FormMultiSelect}
                name="topics"
                label="Associated Topics"
                options={interests.map((interest) => ({
                  value: interest._id,
                  label: interest.name,
                }))}
                getTagData={getInterestById}
                editable={editMode}
              />
            </div>
            <div className="row">
              {!editMode ? (
                <LinkDisplay href={values.assignmentGoogleDocLink} />
              ) : (
                <Field
                  component={FormInput}
                  name="assignmentGoogleDocLink"
                  label="Google Doc Link"
                />
              )}
            </div>

            <Form>
              <div className="row">
                <Field
                  component={FormTextArea}
                  name="description"
                  label="Description"
                  editable={editMode}
                  className=".ui.form textarea"
                />
              </div>
            </Form>

            <div className="row">
              <div className="left-col">
                <Field
                  component={FormInput}
                  name="deadline"
                  label="Pitch Completion Deadline"
                  type="date"
                  editable={editMode}
                />
              </div>
              <div className="right-col form-field">
                {editMode && <AddIssue callback={fetchIssues} />}

                {editMode ? (
                  <Field
                    component={FormMultiSelect}
                    name="issueStatuses"
                    label={'Add Pitch to Issue(s)'}
                    options={issues.map((issue) => ({
                      value: issue._id,
                      label: `${formatDate(issue.releaseDate)} - ${startCase(
                        lowerCase(issue.type),
                      )}`,
                    }))}
                    editable={editMode}
                  />
                ) : (
                  <>
                    <label htmlFor="issueStatuses">Associated Issue(s)</label>
                    {values.issueStatuses.map((issueId, idx) => {
                      const issue = getIssueFromId(issueId);
                      if (!issue) {
                        return <></>;
                      }
                      return (
                        <p className="issue-item" key={idx}>{`${startCase(
                          lowerCase(issue.type),
                        )} - ${new Date(issue.releaseDate).toLocaleDateString(
                          'en-US',
                        )}`}</p>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
            {editMode && (
              <div className="row right">
                <Button
                  content="Cancel"
                  onClick={() => {
                    setEditMode(false);
                    handleReset();
                  }}
                  type="reset"
                  form="review-claim-form"
                />
                <PrimaryButton
                  type="submit"
                  form="review-claim-form"
                  content="Save"
                />
              </div>
            )}
          </div>
        </FormikForm>
      )}
    </Formik>
  );
};
