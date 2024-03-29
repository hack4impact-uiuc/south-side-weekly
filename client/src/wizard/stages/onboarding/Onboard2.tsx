import React, { ReactElement, useState } from 'react';
import { Form, Grid } from 'semantic-ui-react';

import { WizardListTitle, WizardSvg } from '../../../components';
import { useWizard } from '../../../contexts';
import {
  allGenders,
  allPronouns,
  allRaces,
  neighborhoods,
} from '../../../utils/constants';
import { titleCase } from '../../../utils/helpers';
import { wizardPages } from '../../../utils/enums';

import './Onboard2.scss';

const Onboard2 = (): ReactElement => {
  const { store, data } = useWizard();

  const [genders, setGenders] = useState(new Set(data!.genders));
  const [pronouns, setPronouns] = useState(new Set(data!.pronouns));
  const [races, setRaces] = useState(new Set(data!.races));
  const [neighborhood, setNeighborhood] = useState(data!.neighborhood);

  const onSubmit = (): void => {
    const data = {
      genders: Array.from(genders),
      pronouns: Array.from(pronouns),
      races: Array.from(races),
      neighborhood: neighborhood,
    };
    store(data);
  };

  const handleGender = (gender: string): void => {
    genders.has(gender) ? genders.delete(gender) : genders.add(gender);
    setGenders(new Set(genders));
  };

  const handlePronoun = (pronoun: string): void => {
    pronouns.has(pronoun) ? pronouns.delete(pronoun) : pronouns.add(pronoun);
    setPronouns(new Set(pronouns));
  };

  const handleRace = (race: string): void => {
    races.has(race) ? races.delete(race) : races.add(race);
    setRaces(new Set(races));
  };

  return (
    <div className="onboard2-wrapper">
      <div className="header">
        These fields are optional. If you feel comfortable answering, your
        responses will not be used to evaulate your submission. Select all that
        apply or leave it blank.
      </div>
      <Form id="onboard-2" onSubmit={onSubmit}>
        <Grid columns={4}>
          <Grid.Column width={6}>
            <div className="neighborhood">
              <WizardListTitle value="Neighborhood" />
              <Form.Dropdown
                placeholder="select"
                fluid
                search
                selection
                required
                options={neighborhoods.map((neighborhood) => ({
                  value: neighborhood,
                  key: neighborhood,
                  text: neighborhood,
                }))}
                value={neighborhood}
                onChange={(event, data) => {
                  setNeighborhood(data!.value ? data!.value?.toString() : '');
                }}
                className="neighborhood-drop"
              />
            </div>
            <WizardSvg className="image" page={wizardPages.ONBOARD_2} />
          </Grid.Column>
          <Grid.Column width={3}>
            <WizardListTitle value="Genders" />
            {allGenders.map((gender, index) => (
              <div className="checkbox-wrapper" key={index}>
                <Form.Checkbox
                  value={gender}
                  defaultChecked={genders.has(gender)}
                  label={titleCase(gender)}
                  onClick={() => handleGender(gender)}
                />
              </div>
            ))}
          </Grid.Column>
          <Grid.Column width={3}>
            <WizardListTitle value="Pronouns" />
            {allPronouns.map((pronoun, index) => (
              <div className="checkbox-wrapper" key={index}>
                <Form.Checkbox
                  value={pronoun}
                  defaultChecked={pronouns.has(pronoun)}
                  label={titleCase(pronoun)}
                  onClick={() => handlePronoun(pronoun)}
                />
              </div>
            ))}
          </Grid.Column>
          <Grid.Column width={3}>
            <WizardListTitle value="Races" />
            {allRaces.map((race, index) => (
              <div className="checkbox-wrapper" key={index}>
                <Form.Checkbox
                  value={race}
                  defaultChecked={races.has(race)}
                  label={titleCase(race)}
                  onClick={() => handleRace(race)}
                />
              </div>
            ))}
          </Grid.Column>
        </Grid>
      </Form>
    </div>
  );
};

export default Onboard2;
