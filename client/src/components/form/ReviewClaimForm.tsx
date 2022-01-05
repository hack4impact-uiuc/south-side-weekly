import { lowerCase, pick, startCase } from 'lodash';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import { Button, Form, Grid, Icon, Input, Label } from 'semantic-ui-react';
import { FullPopulatedPitch, Pitch } from 'ssw-common';
import { FieldTag } from '..';

import { Formik, Form as FormikForm, FormikConfig, Field } from 'formik';
import * as yup from 'yup';

//import { updatePitch } from '../../api';
import { useInterests } from '../../contexts';
import { useIssues } from '../../contexts/issues/context';
import {
  assignmentStatusEnum,
  editStatusEnum,
  issueStatusEnum,
} from '../../utils/enums';
import './ReviewClaimForm.scss';
import { FormSingleSelect } from '../ui/FormSingleSelect';
import { FormInput } from '../ui/FormInput';
import { FormMultiSelect } from '../ui/FormMultiSelect';
import { FormTextArea } from '../ui/FormTextArea';
import AddIssue from '../modal/AddIssue';
import { AuthView } from '../wrapper/AuthView';
import UserChip from '../tag/UserChip';
import { LinkDisplay } from '../ui/LinkDisplayButton';
import { formatDate } from '../../utils/helpers';
import { PrimaryButton } from '../ui/PrimaryButton';
import { apiCall } from '../../api';
import { MultiSelect } from '../select/MultiSelect';

export interface ReviewClaimFields {
  teams: string[];
  message: '';
}

interface FormProps {
  pitch: FullPopulatedPitch | null;
}

type FormData = Pick<
  Pitch,
  | 'title'
  | 'assignmentGoogleDocLink'
  | 'description'
  | 'topics'
  | 'teams'
  | 'primaryEditor'
  | 'secondEditors'
  | 'thirdEditors'
  | 'writer'
  | 'assignmentStatus'
  | 'deadline'
  | 'issueStatuses'
  | 'editStatus'
>;

const defaultData: FormData = {
  title: '',
  assignmentGoogleDocLink: '',
  description: '',
  topics: [],
  teams: [],
  writer: '',
  primaryEditor: '',
  secondEditors: [],
  thirdEditors: [],
  assignmentStatus: '',
  deadline: new Date(),
  issueStatuses: [],
  editStatus: '',
};

export const ReviewClaimForm: FC<FormProps> = ({ pitch }): ReactElement => {
  const [editMode, setEditMode] = useState<boolean>(false);

  const { getInterestById, interests } = useInterests();
  const { getIssueFromId, issues, fetchIssues } = useIssues();

  const handleSave = async (data: any): Promise<void> => {
    //setEditMode(false);
    //await updatePitch(formData, aggregatedPitch._id);
    //await callback();
    console.log(data);

    await apiCall({
      method: 'PUT',
      url: `/pitches/${pitch?._id}`,
      body: {
        deadline: data.deadline,
      },
    });

    await void 0;
  };

  const formatFormDate = (date: Date | undefined): string =>
    new Date(date || new Date()).toISOString().split('T')[0];

  const getLatestIssueStatus = (
    status: FullPopulatedPitch['issueStatuses'],
  ) => {
    const latestIssue = status.reduce((a, b): any => {
      a.issueId.releaseDate > b.issueId.releaseDate ? a : b;
    });

    console.log('latest', latestIssue);
    return latestIssue.issueStatus;
  };

  //getLatestIssueStatus(pitch.issueStatuses);

  /* const changeIssueAssignmentStatus = (
    issueId: string,
    value: string,
  ): Pitch['issueStatuses'] => {
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
  }; */

  if (!pitch) {
    return <div id="review-claim-form"></div>;
  }

  return (
    <Formik<any>
      initialValues={{
        ...pitch,
        topics: pitch.topics.map((i) => i._id),
        issues: pitch.issueStatuses.map((issue) => issue.issueId._id),
        deadline: formatFormDate(pitch.deadline),
        //issueStatus: getLatestIssueStatus(pitch.issueStatuses),

        //...{ title: 'hifdf', boo: 'jjj' },
      }}
      onSubmit={handleSave}
      enableReinitialize
      //validationSchema={schema}
    >
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
            {console.log('AUTHOR:', pitch.author)}
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
            <div className="right-col">
              <Field
                component={FormSingleSelect}
                options={Object.values(issueStatusEnum).map((status) => ({
                  value: status,
                  label: startCase(lowerCase(status)),
                }))}
                name="issueStatus"
                label="Issue Assignment Status"
              />
            </div>
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
              <LinkDisplay href={pitch.assignmentGoogleDocLink} />
            ) : (
              <Field
                component={FormInput}
                name="assignmentGoogleDocLink"
                label="Google Doc Link"
              />
            )}
          </div>
          <div className="row">
            <Field
              component={FormTextArea}
              name="description"
              label="Description"
              editable={editMode}
            />
          </div>
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
            <div className="right-col">
              {editMode && <AddIssue callback={fetchIssues} />}
              <Field
                component={FormMultiSelect}
                name="issues"
                label={
                  editMode ? 'Add Pitch to Issue(s)' : 'Associated Issue(s)'
                }
                options={issues.map((issue) => ({
                  value: issue._id,
                  label: `${formatDate(issue.releaseDate)} - ${startCase(
                    lowerCase(issue.type),
                  )}`,
                }))}
                editable={editMode}
              />
            </div>
          </div>
          <div className="row">
            <Button content="Cancel" onClick={() => setEditMode(false)} />
            <PrimaryButton
              type="submit"
              form="review-claim-form"
              content="Save"
            />
          </div>
        </div>
      </FormikForm>
    </Formik>
  );
};
