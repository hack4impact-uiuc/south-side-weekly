import { FastField, Form as FormikForm, Formik, FormikConfig } from 'formik';
import React, { FC, ReactElement } from 'react';
import { Form } from 'semantic-ui-react';
import { PitchFeedback } from 'ssw-common';

import { useTeams } from '../../contexts';
import { pitchQuestionOptions } from '../../utils/constants';
import { FormTextArea } from '../ui/FormTextArea';
import './PitchFeedbackForm.scss';

/* const schema = yup.object({
  name: yup.string().required(),
  link: yup.string().required(),
  teams: yup.array().of(yup.string()).min(1),
  isGeneral: yup.boolean().required(),
  visibility: yup.string().required(),
}); */

interface FormProps extends FormikConfig<Partial<PitchFeedback>> {
  id?: string;
}

export const PitchFeedbackForm: FC<FormProps> = ({
  id,
  ...rest
}): ReactElement => (
  <Formik<Partial<PitchFeedback>>
    {...rest}
    initialValues={rest.initialValues}
    onSubmit={rest.onSubmit}
    enableReinitialize
  >
    <FormikForm id={id}>
      <div className="form-wrapper">
        {pitchQuestionOptions.map(({ value, text }) => (
          <Form key={value}>
            <FastField component={FormTextArea} name={value} label={text} />
          </Form>
        ))}
      </div>
    </FormikForm>
  </Formik>
);
