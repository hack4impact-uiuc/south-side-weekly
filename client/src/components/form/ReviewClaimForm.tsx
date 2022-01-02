import { lowerCase, pick, startCase } from 'lodash';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import {
  Button,
  Form,
  FormInput,
  Grid,
  Icon,
  Input,
  Label,
} from 'semantic-ui-react';
import { FullPopulatedPitch, Pitch } from 'ssw-common';
import { FieldTag } from '..';

import { Formik, Form as FormikForm, FormikConfig, Field } from 'formik';
import * as yup from 'yup';

//import { updatePitch } from '../../api';
import { useInterests } from '../../contexts';
import { useIssues } from '../../contexts/issues/context';
import { assignmentStatusEnum, issueStatusEnum } from '../../utils/enums';
import './ReviewClaimForm.scss';

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

export const ReviewClaimForm: FC<FormProps> = ({ pitch }): ReactElement => {
  console.log('hey');

  const handleSave = async (): Promise<void> => {
    //setEditMode(false);
    //await updatePitch(formData, aggregatedPitch._id);
    //await callback();
  };

  return (
    <Formik<FormData>
      initialValues={{
        ...defaultData,
      }}
      onSubmit={handleSave}
      //validationSchema={schema}
    >
      <FormikForm id={'review-claim-form'}>
        <div className="form-wrapper">
          <div className="row">
            <Field component={FormInput} name="lastName" label="Last Name" />
          </div>
        </div>
      </FormikForm>
    </Formik>
  );
};
