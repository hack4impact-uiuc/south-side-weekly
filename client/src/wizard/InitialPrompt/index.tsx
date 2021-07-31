import React, { ReactElement } from 'react';
import { Button, Header, Icon, Popup } from 'semantic-ui-react';

import { WizardSvg } from '../../components';
import { useForm } from '../../contexts';
import { rolesEnum, wizardPages } from '../../utils/enums';

import './styles.scss';

const InitialPrompt = (): ReactElement => {
  const { updateOnboardingData } = useForm();

  const chooseRole = (role: string): void => {
    updateOnboardingData({ role }, true);
  };

  return (
    <>
      <div className="initial-wrapper">
        <Header className="title" size="huge" content="Are you joining as..." />
        <div className="group">
          <Button
            onClick={(e, { value }) => chooseRole(value)}
            value={rolesEnum.CONTRIBUTOR}
            size="massive"
            content="Contributor"
          />
          <Popup
            trigger={<Icon name="info circle" size="big" />}
            size="large"
            position="right center"
            content="If you're interested in writing, editing, designing, illustrating,
          photographing, or fact-checking, this one is for you!"
          />
        </div>

        <div className="group">
          <Button
            onClick={(e, { value }) => chooseRole(value)}
            value={rolesEnum.STAFF}
            size="massive"
            content="Staff Member"
          />
          <Popup
            trigger={<Icon name="info circle" size="big" />}
            size="large"
            position="right center"
            content=" If you're an employee or a contractor, this one is for you!"
          />
        </div>
      </div>
      <WizardSvg className="svg" page={wizardPages.INITIAL_PAGE} />
    </>
  );
};

export default InitialPrompt;
