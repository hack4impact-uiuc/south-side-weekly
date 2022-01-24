import React, { FC, ReactElement } from 'react';
import { Formik, Form as FormikForm, FormikConfig, Field } from 'formik';
import * as yup from 'yup';
import { BasePopulatedUser, User } from 'ssw-common';

import { FormInput } from '../ui/FormInput';
import { FormMultiSelect } from '../ui/FormMultiSelect';
import { FormSingleSelect } from '../ui/FormSingleSelect';
import { allGenders, allPronouns, allRoles } from '../../utils/constants';
import { useInterests, useTeams } from '../../contexts';

import './EditUserForm.scss';

const schema = yup.object({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  preferredName: yup.string(),
  genders: yup.array().of(yup.string().required()).required().min(1),
  pronouns: yup.array().of(yup.string().required()).required().min(1),
  interests: yup.array().of(yup.string()).required().min(1).max(5),
  teams: yup.array().of(yup.string()).required().min(1).max(2),
  email: yup.string().required(),
  role: yup.string().required(),
  phone: yup.string().required(),
  twitter: yup.string().nullable().notRequired(),
  linkedIn: yup.string().nullable(),
  portfolio: yup.string().nullable(),
});

type UserKeys = keyof BasePopulatedUser;

interface UserPermissions {
  view: UserKeys[];
  edit: UserKeys[];
}

interface FormProps extends FormikConfig<BasePopulatedUser> {
  permissions?: UserPermissions;
  id: string;
  customOnSubmit: (values: User) => void;
}

const defPermissions = {
  view: [],
  edit: [],
};

export const EditUserForm: FC<FormProps> = ({
  id = 'edit-user-form',
  customOnSubmit,
  initialValues,
  permissions = defPermissions,
}): ReactElement => {
  const { interests } = useInterests();
  const { teams, getTeamFromId } = useTeams();

  return (
    <Formik<User>
      initialValues={{
        ...initialValues,
        interests: initialValues.interests.map((i) => i._id),
        teams: initialValues.teams.map((t) => t._id),
      }}
      onSubmit={customOnSubmit}
      validationSchema={schema}
    >
      {({ touched, errors }) => (
        <FormikForm id={id}>
          <div className="form-wrapper">
            <div className="row">
              <div className="left-col">
                {touched['firstName'] && errors['firstName'] && (
                  <div className="error">{errors['firstName']}</div>
                )}
                <Field
                  component={FormInput}
                  name="firstName"
                  label="First Name"
                  viewable={permissions.view.includes('firstName')}
                  editable={permissions.edit.includes('firstName')}
                />
              </div>
              <div className="right-col">
                {touched['lastName'] && errors['lastName'] && (
                  <div className="error">{errors['lastName']}</div>
                )}
                <Field
                  component={FormInput}
                  name="lastName"
                  label="Last Name"
                  viewable={permissions.view.includes('lastName')}
                  editable={permissions.edit.includes('lastName')}
                />
              </div>
            </div>
            <div className="row">
              <div className="left-col">
                {touched['preferredName'] && errors['preferredName'] && (
                  <div className="error">{errors['preferredName']}</div>
                )}
                <Field
                  component={FormInput}
                  name="preferredName"
                  label="Preferred Name"
                  viewable={permissions.view.includes('preferredName')}
                  editable={permissions.edit.includes('preferredName')}
                />
              </div>
            </div>
            <div className="row">
              <div className="left-col">
                {touched['genders'] && errors['genders'] && (
                  <div className="error">{errors['genders']}</div>
                )}
                <Field
                  component={FormMultiSelect}
                  name="genders"
                  label="Genders"
                  options={allGenders.map((g) => ({ value: g, label: g }))}
                  viewable={permissions.view.includes('genders')}
                  editable={permissions.edit.includes('genders')}
                />
              </div>
              <div className="right-col">
                {touched['pronouns'] && errors['pronouns'] && (
                  <div className="error">{errors['pronouns']}</div>
                )}
                <Field
                  component={FormMultiSelect}
                  name="pronouns"
                  label="Pronouns"
                  options={allPronouns.map((p) => ({ value: p, label: p }))}
                  viewable={permissions.view.includes('pronouns')}
                  editable={permissions.edit.includes('pronouns')}
                />
              </div>
            </div>
            <div className="row">
              <div className="left-col">
                {touched['role'] && errors['role'] && (
                  <div className="error">{errors['role']}</div>
                )}
                <Field
                  component={FormSingleSelect}
                  options={allRoles.map((r) => ({ value: r, label: r }))}
                  name="role"
                  label="Role"
                  viewable={permissions.view.includes('role')}
                  editable={permissions.edit.includes('role')}
                />
              </div>
            </div>
            <div className="row">
              <div className="left-col">
                {touched['interests'] && errors['interests'] && (
                  <div className="error">{errors['interests']}</div>
                )}
                <Field
                  component={FormMultiSelect}
                  name="interests"
                  label="Interests"
                  options={interests.map((i) => ({
                    value: i._id,
                    label: i.name,
                  }))}
                  viewable={permissions.view.includes('interests')}
                  editable={permissions.edit.includes('interests')}
                />
              </div>
              <div className="right-col">
                {touched['teams'] && errors['teams'] && (
                  <div className="error">{errors['teams']}</div>
                )}
                <Field
                  component={FormMultiSelect}
                  name="teams"
                  label="Teams"
                  options={teams.map((t) => ({ value: t._id, label: t.name }))}
                  viewable={permissions.view.includes('teams')}
                  editable={permissions.edit.includes('teams')}
                  getTagData={getTeamFromId}
                />
              </div>
            </div>
            <div className="row">
              <div className="left-col">
                {touched['email'] && errors['email'] && (
                  <div className="error">{errors['email']}</div>
                )}
                <Field
                  component={FormInput}
                  name="email"
                  label="Email"
                  viewable={permissions.view.includes('email')}
                  editable={permissions.edit.includes('email')}
                />
              </div>
            </div>
            <div className="row">
              <div className="left-col">
                {touched['phone'] && errors['phone'] && (
                  <div className="error">{errors['phone']}</div>
                )}
                <Field
                  component={FormInput}
                  name="phone"
                  label="Phone Number"
                  viewable={permissions.view.includes('phone')}
                  editable={permissions.edit.includes('phone')}
                />
              </div>
            </div>
            <div className="row">
              <div className="left-col">
                {touched['twitter'] && errors['twitter'] && (
                  <div className="error">{errors['twitter']}</div>
                )}
                <Field
                  component={FormInput}
                  name="twitter"
                  label="Twitter"
                  viewable={permissions.view.includes('twitter')}
                  editable={permissions.edit.includes('twitter')}
                />
              </div>
            </div>
            <div className="row">
              <div className="left-col">
                {touched['linkedIn'] && errors['linkedIn'] && (
                  <div className="error">{errors['linkedIn']}</div>
                )}
                <Field
                  component={FormInput}
                  name="linkedIn"
                  label="LinkedIn"
                  viewable={permissions.view.includes('linkedIn')}
                  editable={permissions.edit.includes('linkedIn')}
                />
              </div>
            </div>
            <div className="row">
              <div className="left-col">
                {touched['portfolio'] && errors['portfolio'] && (
                  <div className="error">{errors['portfolio']}</div>
                )}
                <Field
                  component={FormInput}
                  name="portfolio"
                  label="Website"
                  viewable={permissions.view.includes('portfolio')}
                  editable={permissions.edit.includes('portfolio')}
                />
              </div>
            </div>
          </div>
        </FormikForm>
      )}
    </Formik>
  );
};
