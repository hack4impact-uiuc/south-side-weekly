import React, { ReactElement, useState, useEffect } from 'react';
import { Form, Grid } from 'semantic-ui-react';
import { isEmpty, reject } from 'lodash';
import Swal from 'sweetalert2';

import { useAuth, useInterests, useTeams, useWizard } from '../../contexts';
import { formatNumber, titleCase } from '../../utils/helpers';
import { isError, apiCall } from '../../api';

import './styles.scss';

const Onboard3 = (): ReactElement => {
  const { store, data } = useWizard();
  const { user } = useAuth();

  const [selectedInterests, setInterests] = useState(new Set(data!.interests));
  const [selectedTeams, setSelectedTeams] = useState(new Set(data!.teams));
  const { teams } = useTeams();
  const { interests } = useInterests();

  const onSubmit = (): void => {
    if (data!.role === 'STAFF') {
      staffSubmit();
    } else if (data!.role === 'CONTRIBUTOR') {
      contributorSubmit();
    }
  };

  const contributorSubmit = (): void => {
    const data = {
      interests: Array.from(selectedInterests),
      teams: Array.from(selectedTeams),
    };

    store(data);
  };

  const staffSubmit = (): void => {
    const newUser = {
      firstName: data!.firstName,
      lastName: data!.lastName,
      preferredName: data!.preferredName,
      phone: formatNumber(data!.phone),
      genders: reject(data!.genders, isEmpty),
      pronouns: reject(data!.pronouns, isEmpty),
      dateJoined: new Date(Date.now()),
      teams: Array.from(selectedTeams),
      role: data!.role,
      races: reject(data!.races, isEmpty),
      neighborhood: data!.neighborhood,
      interests: Array.from(selectedInterests),
    };

    const onboardUser = async (): Promise<void> => {
      const res = await apiCall({
        url: `/users/${user!._id}`,
        method: 'PUT',
        body: newUser,
      });
      // const res = await updateUser(newUser, user._id);

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
    const initialInterets = data!.interests.filter(
      (interest) => !isEmpty(interest),
    );

    setInterests(new Set(initialInterets));
  }, [data]);

  const handleInterests = (): void => {
    // if (!selectedInterests.has() && selectedInterests.size === 5) {
    //   Swal.fire({
    //     title: 'Please select a maximum of 5 teams!',
    //     icon: 'error',
    //   });
    //   return;
    // }

    // selectedInterests.has(interest)
    //   ? selectedInterests.delete(interest)
    //   : selectedInterests.add(interest);
    setInterests(new Set(selectedInterests));
  };

  const handleTeams = (): void => {
    // if (!selectedTeams.has(team) && selectedTeams.size === 2) {
    //   Swal.fire({
    //     title: 'Please select a maximum of 2 teams!',
    //     icon: 'error',
    //   });
    //   return;
    // }

    // selectedTeams.has(team)
    //   ? selectedTeams.delete(team)
    //   : selectedTeams.add(team);
    setSelectedTeams(new Set(selectedTeams));
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
            {teams.map((team, index) => (
              <Grid.Column key={index}>
                <Form.Checkbox
                  value={team.name}
                  checked={selectedTeams.has(team)}
                  label={titleCase(team.name)}
                  onClick={handleTeams}
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
            {interests.map((interest, index) => (
              <Grid.Column key={index}>
                <Form.Checkbox
                  value={interest._id}
                  checked={selectedInterests.has(interest)}
                  label={interest.name}
                  onClick={handleInterests}
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
