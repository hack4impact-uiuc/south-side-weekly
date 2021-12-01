import React, { FC, ReactElement, useEffect, useState } from 'react';
import { Dropdown , Button, Form, Grid, Icon, Modal, ModalProps } from 'semantic-ui-react';
import toast from 'react-hot-toast';
import { IUser } from 'ssw-common';
import * as yup from 'yup';
import { Formik, Form as FormikForm } from 'formik';


import { InterestsSelect, MultiSelect } from '../..';
import { isError, updateUser } from '../../../api';
import { IPermissions } from '../../../pages/profile/types';
import { allGenders, allPronouns } from '../../../utils/constants';

import './styles.scss';


interface EditProfileProps extends ModalProps {
  user: IUser;
  permissions: IPermissions;
  callback(): void;
}

const EditProfileModal: FC<EditProfileProps> = ({
  user,
  permissions,
  callback,
  ...rest
}): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const userProfileSchema = yup.object({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    preferredName: yup.string().required(),
    genders: yup.array().of(yup.string().required()).required().min(1),
    pronouns: yup.array().of(yup.string().required()).required().min(1),
    interests: yup.array().of(yup.string().required()).required().min(1),
    email: yup.string().required(),
    role: yup.string().required(),
    teams: yup.array().of(yup.string().required()).required().min(1),
    phone: yup.string().matches(phoneRegExp).required(),
    twitter: yup.string().nullable().notRequired(),
    linkedIn: yup.string().nullable(),
    portfolio: yup.string().nullable(),
  });

  /**
   * Determines if a field is viewable to current user
   *
   * @param field the field to check
   * @returns true if field is viewable, else false
   */
  const isViewable = (field: keyof IUser): boolean =>
    permissions.view.includes(field);

  /**
   * Determines if a field is editable to the current user
   *
   * @param field the field to check
   * @returns true if field is editable, else false
   */
  const isEditable = (field: keyof IUser): boolean =>
    permissions.edit.includes(field);

  type userProfile = yup.InferType<typeof userProfileSchema>;

  useEffect(() => {
    if (!isOpen) {
      return;
    }
  }, [isOpen]);

  const updateProfile = async (values: userProfile): Promise<void> => {
    const userRes = await updateUser(
      {
        firstName: values.firstName,
        lastName: values.lastName,
        preferredName: values.preferredName,
        genders: values.genders,
        pronouns: values.pronouns,
        interests: values.interests,
        email: values.email,
        phone: values.phone,
        role: values.role,
        teams: values.teams,
        twitter: values.twitter ?? undefined,
        linkedIn: values.linkedIn ?? undefined,
        portfolio: values.portfolio ?? undefined,
      },
      user._id,
    );

    if (!isError(userRes)) {
      callback();
      toast.success('Profile updated successfully!');
      setIsOpen(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      onOpen={() => setIsOpen(true)}
      trigger={<Button>Edit Profile</Button>}
      className="edit-profile-modal"
      {...rest}
    >
      <Modal.Header>
        <div className="modal-header">
          Edit Profile
          <Icon name="close" onClick={() => setIsOpen(false)} />
        </div>
      </Modal.Header>
      <Modal.Content scrolling>
        <Formik
          initialValues={{
            firstName: user.firstName,
            lastName: user.lastName,
            preferredName: user.preferredName,
            genders: user.genders,
            pronouns: user.pronouns,
            interests: user.interests,
            email: user.email,
            phone: user.phone,
            twitter: user.twitter,
            linkedIn: user.linkedIn,
            portfolio: user.portfolio,
            role: user.role,
            teams: user.teams,
          }}
          initialValues={user}
          onSubmit={updateProfile}
          validationSchema={userProfileSchema}
        >
          {(props) => (
            <FormikForm id="formik-form">
              <Grid columns={2}>
                <Grid.Column>
                  <h5>First Name</h5>
                  <Form.Input
                    value={props.values.firstName}
                    onChange={props.handleChange}
                    name="firstName"
                    fluid
                    disabled={!isEditable('firstName')}
                    viewable={isViewable('firstName')}
                  />

                  <h5>Preferred Name</h5>
                  <Form.Input
                    name="preferredName"
                    value={props.values.preferredName}
                    onChange={props.handleChange}
                    disabled={!isEditable('preferredName')}
                    viewable={isViewable('preferredName')}
                    fluid
                  />
                </Grid.Column>

                <Grid.Column>
                  <h5>Last Name</h5>
                  <Form.Input
                    value={props.values.lastName}
                    onChange={props.handleChange}
                    fluid
                    name="lastName"
                    disabled={!isEditable('lastName')}
                    viewable={isViewable('lastName')}
                  />
                </Grid.Column>
              </Grid>

              <Grid columns={2}>
                <Grid.Column>
                  {isEditable('genders') && (
                    <>
                      <h5>Genders</h5>
                      <MultiSelect
                        options={allGenders.map((gender) => ({
                          value: gender,
                          label: gender,
                        }))}
                        onChange={(values) =>
                          props.setFieldValue(
                            'genders',
                            values.map((item) => item.value),
                          )
                        }
                        value={props.values.genders}
                      ></MultiSelect>{' '}
                    </>
                  )}
                  <h5>Role</h5>
                  </Grid.Column>
                  {isEditable('pronouns') && (
                  <Grid.Column>
                    <h5>Pronouns</h5>
                    <MultiSelect
                      options={allPronouns.map((pronoun) => ({
                        value: pronoun,
                        label: pronoun,
                      }))}
                      onChange={(values) =>
                        props.setFieldValue(
                          'pronouns',
                          values.map((item) => item.value),
                        )
                      }
                      value={props.values.pronouns}
                    ></MultiSelect>
                  </Grid.Column>
                )}
                </Grid>
                <Grid columns = {2}>
                  <Grid.Column>

                  {isEditable('interests') && (
                    <>
                      <h4>Topic Interests</h4>
                      <InterestsSelect
                        onChange={(values) =>
                          props.setFieldValue(
                            'interests',
                            values.map((item) => item.value),
                          )
                        }
                        values={props.values.interests}
                      />
                    </>
                  )}

                  <h4>Email</h4>
                  <Form.Input
                    onChange={props.handleChange}
                    name="email"
                    value={props.values.email}
                    disabled={!isEditable('email')}
                    viewable={isViewable('email')}
                    fluid
                  />

                  <h4>Phone Number</h4>
                  <Form.Input
                    onChange={props.handleChange}
                    value={props.values.phone}
                    name="phone"
                    disabled={!isEditable('phone')}
                    viewable={isViewable('phone')}
                    fluid
                  />

                  <h4>
                    <span>Twitter</span>
                    <span className="grey-text"> - Optional</span>
                  </h4>
                  <Form.Input
                    onChange={props.handleChange}
                    value={props.values.twitter}
                    name="twitter"
                    disabled={!isEditable('twitter')}
                    viewable={isViewable('twitter')}
                    placeholder={'https://twitter.com/username'}
                    fluid
                  />

                  <h4>
                    <span>LinkedIn</span>
                    <span className="grey-text"> - Optional</span>
                  </h4>
                  <Form.Input
                    onChange={props.handleChange}
                    value={props.values.linkedIn}
                    name="linkedIn"
                    disabled={!isEditable('linkedIn')}
                    viewable={isViewable('linkedIn')}
                    placeholder={'https://linkedin.com/in/username'}
                    fluid
                  />

                  <h4>
                    <span>Website</span>
                    <span className="grey-text"> - Optional</span>
                  </h4>
                  <Form.Input
                    onChange={props.handleChange}
                    value={props.values.portfolio}
                    name="portfolio"
                    disabled={!isEditable('portfolio')}
                    viewable={isViewable('portfolio')}
                    placeholder={'https://website.com'}
                    fluid
                  />
           
                {isEditable('pronouns') && (
                  <>
                    <h5>Pronouns</h5>
                    <MultiSelect
                      options={allPronouns.map((pronoun) => ({
                        value: pronoun,
                        label: pronoun,
                      }))}
                      onChange={(values) =>
                        props.setFieldValue(
                          'pronouns',
                          values.map((item) => item.value),
                        )
                      }
                      value={props.values.pronouns}
                    ></MultiSelect>
                    </>
                )}
                </Grid.Column>
                <Grid.Column>
                  <h5>Teams</h5>
                 
                </Grid.Column>
                </Grid>
      
            </FormikForm>
          )}
        </Formik>
      </Modal.Content>
      <Modal.Actions>
        <Button type="submit" form="formik-form" content="Save" secondary />
      </Modal.Actions>
    </Modal>
  );
};

export default EditProfileModal;
