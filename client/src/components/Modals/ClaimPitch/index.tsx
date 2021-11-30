import React, { FC, ReactElement, useEffect, useState } from 'react';
import { Button, Form, Icon, Modal, ModalProps } from 'semantic-ui-react';
import { IPitch, IUser } from 'ssw-common';
import Swal from 'sweetalert2';
import * as yup from 'yup';
import { Formik, Field, Form as FormikForm } from 'formik';

import { PitchRow } from '../..';
import { isError, submitPitchClaim } from '../../../api';
import { getAggregatedPitch } from '../../../api/pitch';
import { useAuth, useTeams } from '../../../contexts';
import { emptyAggregatePitch } from '../../../utils/constants';
import { pluralize } from '../../../utils/helpers';
import FieldTag from '../../FieldTag';
import LinkDisplay from '../../LinkDisplay';
import UserChip from '../../UserChip';
import './styles.scss';

interface ClaimPitchProps extends ModalProps {
  pitch: IPitch;
  callback(): void;
}

const ClaimPitchModal: FC<ClaimPitchProps> = ({
  pitch,
  callback,
  ...rest
}): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const [aggregatedPitch, setAggregatedPitch] = useState(emptyAggregatePitch);

  const pitchClaimSchema = yup.object({
    message: yup.string().required(),
    checkboxes: yup.array().of(yup.string().required()).required().min(1),
  });

  type pitchClaim = yup.InferType<typeof pitchClaimSchema>;

  const { user } = useAuth();
  const { getTeamFromId } = useTeams();

  const teamMap = new Map<string, Partial<IUser>[]>();
  aggregatedPitch.aggregated.assignmentContributors.map(
    ({ user, teams: teamIds }) => {
      for (const teamId of teamIds) {
        const teamList = teamMap.get(teamId) ?? [];
        teamList.push(user);
        teamMap.set(teamId, teamList);
      }
    },
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const fetchAggregatedPitch = async (id: string): Promise<void> => {
      const res = await getAggregatedPitch(id);

      if (!isError(res)) {
        setAggregatedPitch(res.data.result);
      }
    };

    fetchAggregatedPitch(pitch._id);
  }, [isOpen, pitch.teams, pitch._id]);

  const claimPitch = async (values: pitchClaim): Promise<void> => {
    const pitchRes = await submitPitchClaim(
      pitch._id,
      user._id,
      values.checkboxes,
      values.message,
    );

    if (!isError(pitchRes)) {
      callback();
      Swal.fire({
        title: 'Successfully submitted claim for pitch!',
        icon: 'success',
      });
      setIsOpen(false);
    }
  };

  const didUserClaim = (): boolean =>
    pitch.assignmentContributors.some(({ userId }) => user._id === userId);

  const didUserSubmitClaimReq = (): boolean =>
    pitch.pendingContributors.some(({ userId }) => user._id === userId);

  const getHeader = (): string => {
    if (didUserClaim()) {
      return 'You have already claimed this pitch!';
    } else if (didUserSubmitClaimReq()) {
      return 'You have already submitted your claim for this pitch';
    }

    return 'Claim Pitch';
  };

  const isUserOnTeam = (team: string): boolean => user.teams.includes(team);
  const disableCheckbox = (team: string): boolean => !isUserOnTeam(team);

  const getContributorChipFor = (
    users: Partial<IUser>[],
    title: string,
  ): JSX.Element => (
    <>
      <span style={{ fontWeight: 'bold' }}>{title}:</span>
      <span className="contributor-chip-list">
        {users.length === 0
          ? 'None'
          : users.map((user) => <UserChip user={user} key={user._id} />)}
      </span>
    </>
  );

  const getContributors = (): JSX.Element => (
    <div className="contributors-lists">
      <div className="contributor-list">
        {getContributorChipFor(
          [aggregatedPitch.aggregated.author],
          'Pitch Creator',
        )}
        {getContributorChipFor([aggregatedPitch.aggregated.writer], 'Writer')}
      </div>
      <div className="contributor-list">
        {getContributorChipFor(
          [aggregatedPitch.aggregated.primaryEditor],
          'Primary Editor',
        )}
        {getContributorChipFor(
          aggregatedPitch.aggregated.secondaryEditors,
          'Second Editors',
        )}
        {getContributorChipFor(
          aggregatedPitch.aggregated.thirdEditors,
          'Third Editors',
        )}
      </div>
    </div>
  );

  const getOtherContributors = (): JSX.Element => {
    if (teamMap.size === 0) {
      return <p>There are no other contributors on this pitch.</p>;
    }

    return (
      <div className="other-contributors">
        <div className="contributor-list">
          {[...teamMap.entries()].map(([teamId, users]) =>
            getContributorChipFor(users, getTeamFromId(teamId)!.name),
          )}
        </div>
      </div>
    );
  };

  const getSelectableTeams = (): JSX.Element => {
    const {
      aggregated: { teams },
    } = aggregatedPitch;

    if (teams.length === 0) {
      return <p>There are no more teams available.</p>;
    }

    return (
      <>
        {teams.map((team, i) => (
          <div className="checkbox-wrapper" key={i}>
            {teams.length === 1 ? (
              <Field
                type="radio"
                name="checkboxes"
                value={team._id}
                disabled={team.target <= 0 || disableCheckbox(team._id)}
              />
            ) : (
              <Field
                type="checkbox"
                name="checkboxes"
                value={team._id}
                disabled={team.target <= 0 || disableCheckbox(team._id)}
              />
            )}
            <p>
              <span style={{ fontWeight: 'bold' }}>{team.name}</span> -{' '}
              {team.target} {pluralize('spot', team.target)} left
            </p>
          </div>
        ))}
      </>
    );
  };

  return (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      onOpen={() => setIsOpen(true)}
      trigger={<PitchRow pitch={pitch} />}
      className="claim-modal"
      {...rest}
    >
      <Modal.Header>
        <div className="modal-header">
          {getHeader()}
          <Icon name="close" onClick={() => setIsOpen(false)} />
        </div>
      </Modal.Header>
      <Modal.Content scrolling>
        <h1 className="pitch-title">
          {pitch.title}
          <LinkDisplay href={pitch.assignmentGoogleDocLink} />
        </h1>
        <div className="topics-section">
          {aggregatedPitch.aggregated.interests.map((interest, index) => (
            <FieldTag
              key={index}
              name={interest.name}
              hexcode={interest.color}
            />
          ))}
        </div>
        <p className="description">{pitch.description}</p>
        <details className="contributors">
          <summary className="contributors-summary">
            <h4>Contributors Currently on Pitch</h4>
          </summary>
          {getContributors()}
          <h4>Other Contributors Currently on Pitch</h4>
          <hr></hr>
          {getOtherContributors()}
        </details>
        <Formik
          initialValues={{
            message: '',
            checkboxes: [],
          }}
          onSubmit={claimPitch}
          validationSchema={pitchClaimSchema}
        >
          {({ values }) => (
            <FormikForm id="formik-form">
              <Form.Group className="team-select-group">
                <p className="select-team-message">Select Team(s) to Join</p>
                {getSelectableTeams()}
              </Form.Group>
              <h4>Why are you a good fit for this story?</h4>
              <Field
                className="message-field"
                as="textarea"
                rows={4}
                name="message"
                maxLength={250}
              />
              <p className="word-limit">{values.message.length} / 250</p>
            </FormikForm>
          )}
        </Formik>
      </Modal.Content>
      <Modal.Actions>
        <Button
          type="submit"
          form="formik-form"
          content="Submit Claim Request"
          secondary
          disabled={didUserClaim() || didUserSubmitClaimReq()}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default ClaimPitchModal;
