import { FastField, Form as FormikForm, Formik, FormikHelpers } from 'formik';
import { cloneDeep, difference, lowerCase, pick, startCase } from 'lodash';
import React, { FC, ReactElement, useState } from 'react';
import { MultiValue } from 'react-select';
import { Button, Form, Icon, Label } from 'semantic-ui-react';
import { BasePopulatedPitch, FullPopulatedPitch, Pitch } from 'ssw-common';

import { FieldTag } from '..';
import { apiCall, isError } from '../../api';
import { useInterests } from '../../contexts';
import { useIssues } from '../../contexts/issues/context';
import { editStatusEnum, issueStatusEnum } from '../../utils/enums';
import { formatDate } from '../../utils/helpers';
import AddIssue from '../modal/AddIssue';
import { MultiSelect } from '../select/MultiSelect';
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
  notApproved: boolean;
  callback: () => Promise<void>;
}

interface FormData
  extends Pick<
    Pitch,
    | 'title'
    | 'editStatus'
    | 'topics'
    | 'assignmentGoogleDocLink'
    | 'description'
  > {
  issueStatuses: FullPopulatedPitch['issueStatuses'];
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
  notApproved,
  callback,
}): ReactElement => {
  const [editMode, setEditMode] = useState<boolean>(false);

  const { getInterestById, interests } = useInterests();
  const { getIssueFromId, issues, fetchIssues } = useIssues();

  const handleSave = async (
    data: FormData,
    { resetForm }: FormikHelpers<FormData>,
  ): Promise<void> => {
    const newPitch: Partial<Pitch> = {
      ...data,
      deadline: new Date(data.deadline),
      issueStatuses: data.issueStatuses.map(
        ({ issueId: { _id }, issueStatus, releaseDate }) => ({
          issueId: _id,
          issueStatus,
          releaseDate,
        }),
      ),
    };

    console.log('NEW PITCH', newPitch);

    const pitchIds = pitch!.issueStatuses.map(({ issueId: { _id } }) => _id);
    const newIds = data.issueStatuses.map(({ issueId: { _id } }) => _id);

    const res = await Promise.all([
      apiCall<BasePopulatedPitch>({
        method: 'PUT',
        url: `/pitches/${pitch?._id}`,
        body: newPitch,
      }),
      apiCall({
        method: 'PUT',
        url: `/issues/updatePitchIssues/${pitch!._id}`,
        body: {
          addToIssues: difference(newIds, pitchIds),
          removeFromIssues: difference(pitchIds, newIds),
        },
      }),
    ]);

    if (!isError(res[0]) && !isError(res[1])) {
      resetForm({ values: data, isSubmitting: true });
      await callback();
    }

    setEditMode(false);
  };

  const formatFormDate = (date: Date | undefined): string =>
    new Date(date || new Date()).toISOString().split('T')[0];

  const updateIssueStatuses = (
    values: FormData,
    newValues: MultiValue<{ label: string; value: string }>,
  ): FullPopulatedPitch['issueStatuses'] => {
    const newIds = newValues.map(({ value }) => value);
    const currentIssues = cloneDeep(values.issueStatuses);

    if (newIds.length < currentIssues.length) {
      const removedIdx = currentIssues.findIndex(
        ({ issueId: { _id } }) => !newIds.includes(_id),
      );

      const notFound = -1;

      if (removedIdx !== notFound) {
        currentIssues.splice(removedIdx, 1);
      }
    } else {
      const addedId = difference(
        newIds,
        currentIssues.map(({ issueId: { _id } }) => _id),
      );

      if (addedId) {
        const issue = getIssueFromId(addedId[0]);
        if (issue) {
          currentIssues.push({
            issueId: issue,
            issueStatus: issueStatusEnum.DEFINITELY_IN,
            releaseDate: issue.releaseDate,
          });
        }
      }
    }
    return currentIssues;
  };

  const formatIssue = (releaseDate: string, type: string): string =>
    `${formatDate(releaseDate)} - ${startCase(lowerCase(type))}`;

  if (!pitch) {
    return <div id="review-claim-form"></div>;
  }

  return (
    <Formik<FormData>
      initialValues={{
        ...pick(pitch, fields),
        topics: pitch.topics.map((i) => i._id),
        deadline: formatFormDate(pitch.deadline),
      }}
      onSubmit={handleSave}
    >
      {({ values, handleReset, setFieldValue, setSubmitting }) => (
        <FormikForm id={'review-claim-form'}>
          {!editMode && !notApproved && (
            <AuthView view="isAdmin">
              <Label
                className="edit-button"
                onClick={() => {
                  setEditMode((v) => {
                    setSubmitting(!v);
                    return !v;
                  });
                }}
                as="a"
              >
                <Icon name="pencil" link />
                Edit Pitch Info
              </Label>
            </AuthView>
          )}
          <div className="form-wrapper">
            <div className="row">
              <FastField
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
                <FastField
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
            </div>
            <div className="row">
              <FastField
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
                <FastField
                  component={FormInput}
                  name="assignmentGoogleDocLink"
                  label="Google Doc Link"
                />
              )}
            </div>

            <Form>
              <div className="row">
                <FastField
                  component={FormTextArea}
                  name="description"
                  label="Description"
                  editable={editMode}
                  className=".ui.form textarea"
                />
              </div>
            </Form>

            <div className={editMode ? 'column' : 'row'}>
              <div className={editMode ? 'issue-column' : 'left-col'}>
                {editMode && <AddIssue callback={fetchIssues} />}

                {editMode ? (
                  <>
                    <div>
                      {console.log('hey')}
                      <b>Add Pitch to Issue(s)</b>
                      <MultiSelect
                        options={issues.map((issue) => ({
                          value: issue._id,
                          label: formatIssue(issue.releaseDate, issue.type),
                        }))}
                        value={values.issueStatuses.map(
                          ({ issueId: { _id } }) => _id,
                        )}
                        onChange={(newValues) => {
                          setFieldValue(
                            'issueStatuses',
                            updateIssueStatuses(values, newValues),
                          );
                        }}
                      />
                    </div>
                    {values.issueStatuses.map(
                      ({ issueId: { type, _id, releaseDate } }, idx) => (
                        <div key={_id} className="issue-type-row">
                          <div className="text">
                            {formatIssue(releaseDate, type)}
                          </div>
                          <FastField
                            component={FormSingleSelect}
                            options={Object.values(issueStatusEnum).map(
                              (status) => ({
                                value: status,
                                label: startCase(lowerCase(status)),
                              }),
                            )}
                            name={`issueStatuses[${idx}].issueStatus`}
                            className="select"
                          />
                        </div>
                      ),
                    )}
                  </>
                ) : (
                  <>
                    <b>Associated Issue(s)</b>
                    {values.issueStatuses.map(({ issueId, issueStatus }) => (
                      <div key={issueId._id} className="issue-text-tag">
                        <p className="issue-item">
                          {formatIssue(issueId.releaseDate, issueId.type)}
                        </p>
                        <FieldTag
                          content={startCase(lowerCase(issueStatus))}
                          className="issue-tag"
                        />
                      </div>
                    ))}
                  </>
                )}
              </div>
              <div className="right-col">
                <FastField
                  component={FormInput}
                  name="deadline"
                  label="Pitch Completion Deadline"
                  type="date"
                  editable={editMode}
                />
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
