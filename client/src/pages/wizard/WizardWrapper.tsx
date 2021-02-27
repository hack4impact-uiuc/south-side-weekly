import React, { ReactElement, useState, MouseEvent } from 'react';

import '../../css/wizard/WizardWrapper.css';
import Logo from '../../assets/ssw-form-header.png';

import WizardInitialPrompt from './InitialPrompt';
import BasicInfo from './BasicInfo';
import Identity from './Identity';
import WizardPageCounter from '../../components/WizardPageCounter/WizardPageCounter';

enum WizardPage {
  INITIAL_PAGE = 'INITIAL_PAGE',
  BASIC_INFO_PAGE = 'BASIC_INFO_PAGE',
  IDENTITY_PAGE = 'IDENTITY_PAGE',
  RESPONSE_PAGE = 'RESPONSE_PAGE',
  INTERESTS_PAGE = 'INTERESTS_PAGE',
  LINKS_PAGE = 'LINKS_PAGE',
  SCHEDULE_PAGE = 'SCHEDULE_PAGE',
  EXIT_PAGE = 'EXIT_PAGE',
}

/**
 * Wrapper function to handle the join SSW form
 */
const WizardWrapper = (): ReactElement => {
  const [page, setPage] = useState<WizardPage>(WizardPage.INITIAL_PAGE);
  const [role, setRole] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [preferredName, setPreferredName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [genders, setGenders] = useState<Array<string>>([]);
  const [pronouns, setPronouns] = useState<Array<string>>([]);
  const [races, setRaces] = useState<Array<string>>([]);
  const [reasonForInvolvement, setReasonForInvolvement] = useState<string>('');
  const [interests, setInterests] = useState<string>('');
  const [portfolio, setPortfolio] = useState<string>('');
  const [linkedIn, setLinkedIn] = useState<string>('');
  const [twitter, setTwitter] = useState<string>('');

  const handlePageChange = (newPage: WizardPage): void => {
    setPage(newPage);
  };

  const handleRole = (event: MouseEvent<HTMLButtonElement>): void => {
    setRole(event.currentTarget.value);
    handlePageChange(WizardPage.BASIC_INFO_PAGE);
  };

  return (
    <div className="wizard-wrapper">
      <div className="logo-header">
        <img className="logo" alt="SSW Logo" src={Logo} />
      </div>

      {page === WizardPage.INITIAL_PAGE && (
        <WizardInitialPrompt handleRole={handleRole} />
      )}

      {page === WizardPage.BASIC_INFO_PAGE && (
        <BasicInfo
          setFirstName={setFirstName}
          setLastName={setLastName}
          setPhoneNumber={setPhoneNumber}
          setPreferredName={setPreferredName}
          handlePageChange={handlePageChange}
        />
      )}

      {page === WizardPage.IDENTITY_PAGE && (
        <Identity
          setGenders={setGenders}
          setPronouns={setPronouns}
          setRaces={setRaces}
        />
      )}

      <div className="wizard-page-counter">
        {page !== WizardPage.INITIAL_PAGE && (
          <WizardPageCounter
            wizardPages={Object.values(WizardPage).slice(1)}
            activePage={page}
          />
        )}
      </div>
    </div>
  );
};

export default WizardWrapper;
export { WizardPage };
