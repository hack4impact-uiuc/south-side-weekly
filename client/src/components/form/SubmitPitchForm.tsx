import { Pitch } from 'ssw-common';
import React, { FC, ReactElement } from 'react';
import { Formik, Form as FormikForm, FormikConfig, Field } from 'formik';
import * as yup from 'yup';

import { FormInput } from '../ui/FormInput';
import { FormMultiSelect } from '../ui/FormMultiSelect';
import { useAuth, useInterests } from '../../contexts';
import { FormRadio } from '../ui/FormRadio';

import './SubmitPitchForm.scss';

const schema = yup.object({
  title: yup.string().required(),
  assignmentGoogleDocLink: yup.string().required(),
  description: yup.string().required(),
  topics: yup.array().of(yup.string().required()).required().min(1),
  writerIntent: yup.boolean().required(),
  conflictOfInterest: yup.boolean().required(),
});

export interface SubmitPitchFields
  extends Pick<
    Pitch,
    | 'title'
    | 'assignmentGoogleDocLink'
    | 'description'
    | 'topics'
    | 'conflictOfInterest'
  > {
  writerIntent: boolean;
}

interface FormProps extends FormikConfig<SubmitPitchFields> {
  id?: string;
}

export const SubmitPitchForm: FC<FormProps> = ({
  id,
  ...rest
}): ReactElement => {
  const { interests } = useInterests();
  const { user } = useAuth();

  return (
    <Formik<SubmitPitchFields>
      {...rest}
      initialValues={rest.initialValues}
      onSubmit={rest.onSubmit}
      validationSchema={schema}
    >
      <FormikForm id={id}>
        <div className="form-wrapper">
          <div className="row">
            <Field component={FormInput} name="title" label="Title" />
          </div>
          <div className="row">
            <Field
              component={FormInput}
              name="assignmentGoogleDocLink"
              label="Google Doc Link"
            />
          </div>
          <div className="row">
            <Field
              component={FormInput}
              name="description"
              label="Description"
            />
          </div>
          <div className="row">
            <Field
              component={FormMultiSelect}
              name="topics"
              label="Associated Topics (select 1-4 topics)"
              options={interests.map((i) => ({
                label: i.name,
                value: i._id,
              }))}
            />
          </div>
          {user!.teams.findIndex(
            (team) => team.name.toLowerCase() === 'writing',
          ) > 0 && (
            <div className="row">
              <div>
                <p>
                  <b>Do you want to be the writer of the story?</b>
                </p>
                <div className="select-group">
                  <Field
                    type="radio"
                    component={FormRadio}
                    name="writerIntent"
                    label="Yes"
                    value="true"
                  />
                  <Field
                    type="radio"
                    component={FormRadio}
                    name="writerIntent"
                    label="No, I want someone else to write this story."
                    value="false"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="row">
            <div>
              <p>
                <b>Conflict of Interest Disclosure</b>
                <br />
                Are you involved with the events or people covered in your
                pitch? i.e. do you have a relationship with them as an employee,
                family member, friend, or donor?
              </p>
              <div className="select-group">
                <Field
                  type="radio"
                  component={FormRadio}
                  name="conflictOfInterest"
                  label="Yes"
                  value="true"
                />
                <Field
                  type="radio"
                  component={FormRadio}
                  name="conflictOfInterest"
                  label="No"
                  value="false"
                />
              </div>
            </div>
          </div>
        </div>
      </FormikForm>
    </Formik>
  );
};
