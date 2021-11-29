import React, { FC, ReactElement, useEffect, useState } from 'react';
import { Button, Form, Icon, Modal, ModalProps } from 'semantic-ui-react';
import { IPitch, IUser } from 'ssw-common';
import Swal from 'sweetalert2';
import * as yup from 'yup';
import { Formik, Field, Form as FormikForm } from 'formik';

import { InterestsSelect, MultiSelect, PitchRow } from '../..';
import { isError, submitPitchClaim, updateUser } from '../../../api';
import { getAggregatedPitch } from '../../../api/pitch';
import { useAuth, useTeams } from '../../../contexts';
import { emptyAggregatePitch } from '../../../utils/constants';
import { pluralize } from '../../../utils/helpers';
import FieldTag from '../../FieldTag';
import LinkDisplay from '../../LinkDisplay';
import UserChip from '../../UserChip';
import './styles.scss';

interface EditProfileProps extends ModalProps {
  // pitch: IPitch;
  // callback(): void;

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

  const { getTeamFromId } = useTeams();

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
      // callback();
      Swal.fire({
        title: 'Successfully submitted claim for pitch!',
        icon: 'success',
      });
      setIsOpen(false);
    }
  };

  // const didUserClaim = (): boolean =>
  //   pitch.assignmentContributors.some(({ userId }) => user._id === userId);

  // const didUserSubmitClaimReq = (): boolean =>
  //   pitch.pendingContributors.some(({ userId }) => user._id === userId);

  // const getHeader = (): string => {
  //   if (didUserClaim()) {
  //     return 'You have already claimed this pitch!';
  //   } else if (didUserSubmitClaimReq()) {
  //     return 'You have already submitted your claim for this pitch';
  //   }

  //   return 'Claim Pitch';
  // };

  // const isUserOnTeam = (team: string): boolean => user.teams.includes(team);
  // const disableCheckbox = (team: string): boolean => !isUserOnTeam(team);

  // const getContributorChipFor = (
  //   users: Partial<IUser>[],
  //   title: string,
  // ): JSX.Element => (
  //   <>
  //     <span style={{ fontWeight: 'bold' }}>{title}:</span>
  //     {users.length === 0 || users.every((user) => !user)
  //       ? 'None'
  //       : users.map((user) => <UserChip user={user} key={user._id} />)}
  //   </>
  // );

  // const getContributors = (): JSX.Element => (
  //   <div className="contributors-lists">
  //     <div className="contributor-list">
  //       {getContributorChipFor(
  //         [aggregatedPitch.aggregated.author],
  //         'Pitch Creator',
  //       )}
  //       {getContributorChipFor([aggregatedPitch.aggregated.writer], 'Writer')}
  //     </div>
  //     <div className="contributor-list">
  //       {getContributorChipFor(
  //         [aggregatedPitch.aggregated.primaryEditor],
  //         'Primary Editor',
  //       )}
  //       {getContributorChipFor(
  //         aggregatedPitch.aggregated.secondaryEditors,
  //         'Second Editors',
  //       )}
  //       {getContributorChipFor(
  //         aggregatedPitch.aggregated.thirdEditors,
  //         'Third Editors',
  //       )}
  //     </div>
  //   </div>
  // );

  // const getOtherContributors = (): JSX.Element => {
  //   if (teamMap.size === 0) {
  //     return <p>There are no other contributors on this pitch.</p>;
  //   }

  //   return (
  //     <div className="other-contributors">
  //       <div className="contributor-list">
  //         {[...teamMap.entries()].map(([teamId, users]) =>
  //           getContributorChipFor(users, getTeamFromId(teamId)!.name),
  //         )}
  //       </div>
  //     </div>
  //   );
  // };

  // const getSelectableTeams = (): JSX.Element => {
  //   const {
  //     aggregated: { teams },
  //   } = aggregatedPitch;

  //   if (teams.length === 0) {
  //     return <p>There are no more teams available.</p>;
  //   }

  //   return (
  //     <>
  //       {teams.map((team, i) => (
  //         <div className="checkbox-wrapper" key={i}>
  //           {teams.length === 1 ? (
  //             <Field
  //               type="radio"
  //               name="checkboxes"
  //               value={team._id}
  //               disabled={team.target <= 0 || disableCheckbox(team._id)}
  //             />
  //           ) : (
  //             <Field
  //               type="checkbox"
  //               name="checkboxes"
  //               value={team._id}
  //               disabled={team.target <= 0 || disableCheckbox(team._id)}
  //             />
  //           )}
  //           <p>
  //             <span style={{ fontWeight: 'bold' }}>{team.name}</span> -{' '}
  //             {team.target} {pluralize('spot', team.target)} left
  //           </p>
  //         </div>
  //       ))}
  //     </>
  //   );
  // };

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
            twitter: user.twitter,
            linkedIn: user.linkedIn,
            portfolio: user.portfolio,
          }}
          onSubmit={updateProfile}
          validationSchema={userProfileSchema}
        >
          {({ values }) => (
            <FormikForm id="formik-form">
              <Form.Group>
              <h5>First Name</h5>
                <Form.Input
      
                  value={values.firstName}
                />
                <h5>Last Name</h5>
                <Form.Input
  
                  value={values.lastName}
                />
          
                <h5>Preferred Name</h5>
                <Form.Input
                  name = "preferredName"
                />
       
              <h5>Genders</h5>
              <MultiSelect
                options={allGenders.map((gender) => ({
                  value: gender,
                  label: gender,
                }))}
                onChange={() => void 0}
                value={values.genders}
              ></MultiSelect>
              <h5>Pronouns</h5>
              <MultiSelect
                options={allPronouns.map((pronoun) => ({
                  value: pronoun,
                  label: pronoun,
                }))}
                onChange={() => void 0}
                value={values.pronouns}
              ></MultiSelect>
              <h4>Topic Interests</h4>
              <InterestsSelect 
                onChange={() => void 0}
                values={values.interests}/>
              <h4>Email</h4>
              <Form.Input
                 name = "email"
                 value={values.email}
               />
               <h4>Phone Number</h4>
              <Form.Input
                 
                 value={values.phone}
               />
               <h4>Twitter - optional</h4>
              <Form.Input
                 
                 value={values.twitter}
               />
               <h4>LinkedIn - optional</h4>
              <Form.Input
                 
                 value={values.linkedIn}
               />
               <h4>Website - optional</h4>
              <Form.Input
                 
                 value={values.portfolio}
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
