import React, { ReactElement, useState, useEffect } from 'react';
import { Form, Grid } from 'semantic-ui-react';
import { isEmpty, reject, toArray } from 'lodash';
import Swal from 'sweetalert2';

import { useAuth, useWizard } from '../../contexts';
import { allInterests, allTeams } from '../../utils/constants';
import { formatNumber, titleCase } from '../../utils/helpers';
import { isError, updateUser } from '../../api';

import './styles.scss';

const Onboard3 = (): ReactElement => {
  const { store, data } = useWizard();
  const { user } = useAuth();

  const [interests, setInterests] = useState(new Set<string>(data.interests));
  const [teams, setTeams] = useState(new Set<string>(data.currentTeams));

  const onSubmit = (): void => {
    if (data.role === 'STAFF') {
      staffSubmit();
    } else if (data.role === 'CONTRIBUTOR') {
      contributorSubmit();
    }
  };

  const contributorSubmit = (): void => {
    const data = {
      interests: toArray(interests) as [string],
      currentTeams: toArray(teams) as [string],
    };

    store(data);
  };

  const staffSubmit = (): void => {
    const newUser = {
      firstName: data.firstName,
      lastName: data.lastName,
      preferredName: data.preferredName,
      phone: formatNumber(data.phone),
      genders: reject(data.genders, isEmpty) as [string],
      pronouns: reject(data.pronouns, isEmpty) as [string],
      dateJoined: new Date(Date.now()),
      currentTeams: toArray(teams) as [string],
      role: data.role,
      races: reject(data.races, isEmpty) as [string],
      interests: toArray(interests) as [string],
    };

    const onboardUser = async (): Promise<void> => {
      const res = await updateUser(newUser, user._id);

      if (!isError(res)) {
        store(newUser);
      } else {
        Swal.fire({
          title: 'Failed to create account.',
          icon: 'error',
          text: 'Please contact an SSW Admin.',
        });
      }
    };

    onboardUser();
  };

  useEffect(() => {
    const initialTeams = data.currentTeams.filter((team) => !isEmpty(team));
    const initialInterets = data.interests.filter(
      (interest) => !isEmpty(interest),
    );

    setTeams(new Set(initialTeams));
    setInterests(new Set(initialInterets));
  }, [data.currentTeams, data.interests]);

  const handleInterests = (interest: string): void => {
    if (!interests.has(interest) && interests.size === 5) {
      Swal.fire({
        title: 'Please select a maximum of 5 teams!',
        icon: 'error',
      });
      return;
    }

    interests.has(interest)
      ? interests.delete(interest)
      : interests.add(interest);
    setInterests(new Set(interests));
  };

  const handleTeams = (team: string): void => {
    if (!teams.has(team) && teams.size === 2) {
      Swal.fire({
        title: 'Please select a maximum of 2 teams!',
        icon: 'error',
      });
      return;
    }

    teams.has(team) ? teams.delete(team) : teams.add(team);
    setTeams(new Set(teams));
  };

  return (
    <Form className="onboard3-wrapper" id="onboard-3" onSubmit={onSubmit}>
      <Grid columns={2}>
        <Grid.Column className="top-column">
          <div className="prompt">
            <b>What do you want to do at the Weekly?</b>
            <br />
            Please limit your selection to no more than 2.
          </div>
          <Grid columns={2}>
            {allTeams.map((team, index) => (
              <Grid.Column key={index}>
                <Form.Checkbox
                  value={team}
                  checked={teams.has(team)}
                  label={titleCase(team)}
                  onClick={() => handleTeams(team)}
                />
              </Grid.Column>
            ))}
          </Grid>
        </Grid.Column>
        <Grid.Column className="top-column">
          <div className="prompt">
            <b>What topics are you interested in working on?</b> <br />
            Please limit your selection to no more than 5.
          </div>
          <Grid columns={2}>
            {allInterests.map((interest, index) => (
              <Grid.Column key={index}>
                <Form.Checkbox
                  value={interest}
                  checked={interests.has(interest)}
                  label={titleCase(interest)}
                  onClick={() => handleInterests(interest)}
                />
              </Grid.Column>
            ))}
          </Grid>
        </Grid.Column>
      </Grid>
    </Form>
  );
};

export default Onboard3;
