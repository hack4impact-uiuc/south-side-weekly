import React, { FC, ReactElement } from 'react';
import { Formik, Form as FormikForm, FormikConfig, Field } from 'formik';
import * as yup from 'yup';
import { Resource } from 'ssw-common';

import { FormInput } from '../ui/FormInput';
import { FormMultiSelect } from '../ui/FormMultiSelect';
import { useTeams } from '../../contexts';
import { FormCheckbox } from '../ui/FormCheckbox';
import { FormRadio } from '../ui/FormRadio';

import './ResourceForm.scss';

const schema = yup.object({
  name: yup.string().required(),
  link: yup.string().required(),
  teams: yup.array().of(yup.string().required()).required().min(1),
  isGeneral: yup.boolean(),
  visibility: yup.string().required(),
});

interface FormProps extends FormikConfig<Resource> {
  id?: string;
}

export const ResourceForm: FC<FormProps> = ({ id, ...rest }): ReactElement => {
  const { teams } = useTeams();

  return (
    <Formik<Resource>
      {...rest}
      initialValues={rest.initialValues}
      onSubmit={rest.onSubmit}
      validationSchema={schema}
    >
      <FormikForm id={id}>
        <div className="form-wrapper">
          <div className="row">
            <Field
              style={{ width: '100%' }}
              fluid
              component={FormInput}
              name="name"
              label="Name"
            />
          </div>
          <div className="row">
            <Field component={FormInput} name="link" label="Link" />
          </div>
          <div className="row">
            <Field
              component={FormMultiSelect}
              name="teams"
              label="Teams"
              options={teams.map((t) => ({
                label: t.name,
                value: t._id,
              }))}
            />
          </div>
          <div className="row">
            <Field
              component={FormCheckbox}
              name="isGeneral"
              label="Is General"
            />
          </div>
          <div className="row">
            <div>
              <div>
                <b>Resource Visibility</b>
              </div>
              <div id="vis-group">
                <Field
                  type="radio"
                  component={FormRadio}
                  name="visibility"
                  label="Public"
                  value="PUBLIC"
                />
                <Field
                  type="radio"
                  component={FormRadio}
                  name="visibility"
                  label="Private"
                  value="PRIVATE"
                />
              </div>
            </div>
          </div>
        </div>
      </FormikForm>
    </Formik>
  );
};
