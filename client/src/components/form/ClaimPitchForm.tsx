import { Formik, Form as FormikForm, Field, FormikConfig } from 'formik';
import React, { FC, ReactElement, ReactNode, useMemo } from 'react';
import { Form } from 'semantic-ui-react';
import { FullPopulatedPitch } from 'ssw-common';
import * as yup from 'yup';

import { useAuth } from '../../contexts';
import { getClaimableTeams } from '../list/ClaimableTeamsList';
import { FormTextArea } from '../ui/FormTextArea';

import './ClaimPitchForm.scss';

const MAX_MESSAGE_LENGTH = 250;

const schema = yup.object({
  teams: yup.array(yup.string()).min(1).nullable(),
  message: yup.string().required(),
});

export interface ClaimPitchFields {
  teams: string[];
  message: '';
}

interface FormProps extends FormikConfig<ClaimPitchFields> {
  id?: string;
  pitch: FullPopulatedPitch | null;
  disabled?: boolean;
}

export const ClaimPitchForm: FC<FormProps> = ({
  id = '',
  pitch,
  disabled = false,
  ...rest
}): ReactElement => {
  const { user } = useAuth();

  const availableTeams = useMemo(
    () => getClaimableTeams(user!, pitch),
    [user, pitch],
  );

  const handleSelect = (teams: string[] | null, teamId: string): string[] => {
    if (teams === null) {
      return [];
    }

    const set = new Set(teams);
    if (set.has(teamId)) {
      set.delete(teamId);
    } else {
      set.add(teamId);
    }

    return [...set];
  };

  const getTargetLabel = (name: string, target: number): ReactNode => {
    let label = `${target} `;

    if (target === 1) {
      label = label.concat('spot left');
    } else {
      label = label.concat('spots left');
    }

    return (
      <label>
        <b>{name}</b> - {label}
      </label>
    );
  };

  return (
    <Formik<ClaimPitchFields> {...rest} validationSchema={schema}>
      {({ values, setFieldValue, errors, touched }) => (
        <FormikForm id={id === '' ? 'claim-pitch-form' : id}>
          <Form.Group className="team-select-group">
            <div className="teams">
              <h4>Select Team(s) to Join</h4>
              {availableTeams.map((team) => (
                <div key={team.teamId._id}>
                  <Field name="teams">
                    {() => (
                      <Form.Checkbox
                        name={team.teamId._id}
                        value={team.teamId._id}
                        onChange={() =>
                          setFieldValue(
                            'teams',
                            handleSelect(values.teams, team.teamId._id),
                          )
                        }
                        label={getTargetLabel(team.teamId.name, team.target)}
                        disabled={disabled}
                      />
                    )}
                  </Field>
                </div>
              ))}
            </div>
            {errors['teams'] && touched['teams'] && (
              <p className="error">{errors['teams']}</p>
            )}
          </Form.Group>
          <h4>Why are you a good fit for this story?</h4>
          <Field
            className="message-field"
            component={FormTextArea}
            name="message"
            maxLength={MAX_MESSAGE_LENGTH}
            disabled={disabled}
          />
          <p id="word-limit">{values.message.length} / 250</p>
          {errors['message'] && touched['message'] && (
            <p className="error">{errors['message']}</p>
          )}
        </FormikForm>
      )}
    </Formik>
  );
};
