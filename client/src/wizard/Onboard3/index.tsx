import React, { ReactElement, useState } from 'react';
import { Form, Grid } from 'semantic-ui-react';
import { toArray } from 'lodash';

import { useForm } from '../../contexts';
import { allInterests, allTeams } from '../../utils/constants';
import { titleCase } from '../../utils/helpers';

import './styles.scss';

const Onboard3 = (): ReactElement => {
  const { updateOnboardingData, formData } = useForm();

  const [interests, setInterests] = useState(new Set<string>());
  const [teams, setTeams] = useState(new Set<string>());

  const onSubmit = (): void => {
    const data = {
      interests: toArray(interests) as [string],
      currentTeams: toArray(teams) as [string],
    };

    updateOnboardingData(data, true);
  };

  const handleInterests = (interest: string): void => {
    interests.has(interest)
      ? interests.delete(interest)
      : interests.add(interest);
    setInterests(new Set(interests));
  };

  const handleTeams = (team: string): void => {
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
                  defaultChecked={formData.currentTeams.includes(team)}
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
                  defaultChecked={formData.interests.includes(interest)}
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
