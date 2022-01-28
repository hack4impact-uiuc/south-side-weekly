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
  teams: yup.array().of(yup.string()).min(1),
  isGeneral: yup.boolean().required(),
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
      {({ values, errors, touched }) => (
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
            {errors['name'] && touched['name'] && (
              <p className="error">{errors['name']}</p>
            )}
            <div className="row">
              <Field component={FormInput} name="link" label="Link" />
            </div>
            {errors['link'] && touched['link'] && (
              <p className="error">{errors['link']}</p>
            )}
            <div className="row">
              <Field
                component={FormMultiSelect}
                name="teams"
                label="Teams"
                options={teams.map((t) => ({
                  label: t.name,
                  value: t._id,
                }))}
                maxMenuHeight={200}
              />
            </div>
            <div className="row">
              <Field
                component={FormCheckbox}
                name="isGeneral"
                label="Is General"
              />
            </div>
            {!values['isGeneral'] && errors['teams'] && (
              <p className="error">
                You need to select 1 team or make it a general resource
              </p>
            )}
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
              {errors['visibility'] && touched['visibility'] && (
                <p className="error">{errors['visibility']}</p>
              )}
            </div>
          </div>
        </FormikForm>
      )}
    </Formik>
  );
};
