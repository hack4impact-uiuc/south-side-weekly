import { Pitch } from 'ssw-common';
import React, { FC, ReactElement, useMemo } from 'react';
import { Formik, Form as FormikForm, FormikConfig, Field } from 'formik';
import * as yup from 'yup';

import { FormInput } from '../ui/FormInput';
import { FormMultiSelect } from '../ui/FormMultiSelect';
import { useAuth, useInterests } from '../../contexts';
import { FormRadio } from '../ui/FormRadio';
import { FormTextArea } from '../ui/FormTextArea';

import './SubmitPitchForm.scss';

const schema = yup.object({
  title: yup.string().required(),
  assignmentGoogleDocLink: yup.string().nullable(),
  description: yup.string().required(),
  topics: yup.array().of(yup.string().required()).required().min(0),
  writerIntent: yup.string().nullable(),
  conflictOfInterest: yup.string().nullable().required(),
});

export interface SubmitPitchFields
  extends Pick<
    Pitch,
    'title' | 'assignmentGoogleDocLink' | 'description' | 'topics'
  > {
  writerIntent?: string;
  conflictOfInterest: string | null;
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

  const isWriter = useMemo(
    () => user!.teams.findIndex((team) => team.name === 'Writing') >= 0,
    [user],
  );

  if (isWriter) {
    schema.fields.writerIntent = schema.fields.writerIntent.required();
  }

  return (
    <Formik<SubmitPitchFields>
      {...rest}
      initialValues={rest.initialValues}
      onSubmit={rest.onSubmit}
      validationSchema={schema}
    >
      {({ touched, errors }) => (
        <FormikForm id={id}>
          <div className="form-wrapper">
            <div className="row">
              <Field component={FormInput} name="title" label="Title" />
            </div>
            {touched['title'] && errors['title'] && (
              <div className="error">{errors['title']}</div>
            )}
            <div className="row">
              <Field
                component={FormInput}
                name="assignmentGoogleDocLink"
                label="Google Doc Link"
              />
            </div>
            <div className="row">
              <Field
                component={FormTextArea}
                name="description"
                label={
                  <span>
                    Description -{' '}
                    <span style={{ fontWeight: 'normal' }}>
                      Please add a link to blank google doc here and change the
                      share settings to “allow anyone with the link” to be an
                      editor. We’ll use this document to work on your first
                      draft together.
                    </span>
                  </span>
                }
                className="description"
              />
            </div>
            {touched['description'] && errors['description'] && (
              <div className="error">{errors['description']}</div>
            )}
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
            {touched['topics'] && errors['topics'] && (
              <div className="error">{errors['topics']}</div>
            )}
            {isWriter && (
              <>
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
                {touched['writerIntent'] && errors['writerIntent'] && (
                  <div className="error">{errors['writerIntent']}</div>
                )}
              </>
            )}

            <div className="row">
              <div>
                <p>
                  <b>Conflict of Interest Disclosure</b>
                  <br />
                  Are you involved with the events or people covered in your
                  pitch? i.e. do you have a relationship with them as an
                  employee, family member, friend, or donor?
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
            {touched['conflictOfInterest'] && errors['conflictOfInterest'] && (
              <div className="error">{errors['conflictOfInterest']}</div>
            )}
          </div>
        </FormikForm>
      )}
    </Formik>
  );
};
