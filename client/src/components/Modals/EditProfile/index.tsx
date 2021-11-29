import React, { FC, ReactElement, useEffect, useState } from 'react';
import { Button, Form, Icon, Modal, ModalProps } from 'semantic-ui-react';
import { IUser } from 'ssw-common';
import Swal from 'sweetalert2';
import * as yup from 'yup';
import { Formik, Form as FormikForm } from 'formik';

import { InterestsSelect, MultiSelect, PitchRow } from '../..';
import { isError, updateUser } from '../../../api';

import './styles.scss';
import { values } from 'lodash';

interface EditProfileProps extends ModalProps {
  user: IUser;
}

const EditProfileModal: FC<EditProfileProps> = ({
  user,
  ...rest
}): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const allGenders = ['Man', 'Woman', 'Nonbinary', 'Other'];
  const allPronouns = ['He/his', 'She/her', 'They/them', 'Ze/hir', 'Other'];

  const userProfileSchema = yup.object({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    preferredName: yup.string().required(),
    genders: yup.array().of(yup.string().required()).required().min(1),
    pronouns: yup.array().of(yup.string().required()).required().min(1),
    interests: yup.array().of(yup.string().required()).required().min(1),
    email: yup.string().required(),
    phone: yup.string().required(),
    twitter: yup.string(),
    linkedIn: yup.string(),
    portfolio: yup.string(),
  });

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
        twitter: values.twitter,
        linkedIn: values.linkedIn,
        portfolio: values.portfolio,
      },
      user._id,
    );

    if (!isError(userRes)) {
      Swal.fire({
        title: 'Successfully submitted claim for pitch!',
        icon: 'success',
      });
      setIsOpen(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      onOpen={() => setIsOpen(true)}
      trigger={<Button>Edit Profile</Button>}
      className="claim-modal"
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
            twitter: '',
            linkedIn: '',
            portfolio: '',
          }}
          onSubmit={updateProfile}
          validationSchema={userProfileSchema}
        >
          {props => (
            <FormikForm id="formik-form">
              <Form.Group>
              <h5>First Name</h5>
                <Form.Input
                  value={props.values.firstName}
                  onChange={props.handleChange}
                  name = "firstName"
                />
                <h5>Last Name</h5>
                <Form.Input
                  value={props.values.lastName}
                  onChange={props.handleChange}
                  name = "lastName"
                />
          
                <h5>Preferred Name</h5>
                <Form.Input
                  name = "preferredName"
                  value = {props.values.preferredName}
                  onChange = {props.handleChange}
                />
       
              <h5>Genders</h5>
              <MultiSelect
                options={allGenders.map((gender) => ({
                  value: gender,
                  label: gender,
                }))}
                onChange={(values) => props.setFieldValue("genders", values.map((item) => item.value))}
                value={props.values.genders}
              ></MultiSelect>
              <h5>Pronouns</h5>
              <MultiSelect
                options={allPronouns.map((pronoun) => ({
                  value: pronoun,
                  label: pronoun,
                }))}
                onChange={(values) => props.setFieldValue("pronouns", values.map((item) => item.value))}
                value={props.values.pronouns}
                
              ></MultiSelect>
              <h4>Topic Interests</h4>
              <InterestsSelect 
                onChange={(values) => props.setFieldValue("interests", values.map((item) => item.value))}
                values={props.values.interests}/>
              <h4>Email</h4>
              <Form.Input
                 name = "email"
                 value={props.values.email}
               />
               <h4>Phone Number</h4>
              <Form.Input
                 onChange={props.handleChange}
                 value={props.values.phone}
                 name = "phone"
               />
               <h4>Twitter - optional</h4>
              <Form.Input
                 onChange={props.handleChange}
                 value={props.values.twitter}
                 name = "twitter"
               />
               <h4>LinkedIn - optional</h4>
              <Form.Input
                 onChange={props.handleChange}
                 value={props.values.linkedIn}
                 name = "linkedIn"
               />
               <h4>Website - optional</h4>
              <Form.Input
                 onChange={props.handleChange}
                 value={props.values.portfolio}
                 name = "portfolio"
               />
              </Form.Group>
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
