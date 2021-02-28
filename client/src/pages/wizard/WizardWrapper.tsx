import React, { ReactElement, useState, MouseEvent } from 'react';
import { Button } from 'semantic-ui-react';

import '../../css/wizard/WizardWrapper.css';
import Logo from '../../assets/ssw-form-header.png';

import WizardInitialPrompt from './InitialPrompt';
import BasicInfo from './BasicInfo';
import Identity from './Identity';
import WizardPageCounter from '../../components/WizardPageCounter/WizardPageCounter';
import ArrowBack from '../../assets/arrow-back.svg';
import ArrowNext from '../../assets/arrow-next.svg';

enum WizardPage {
  INITIAL_PAGE = 'INITIAL_PAGE',
  BASIC_INFO_PAGE = 'BASIC_INFO_PAGE',
  IDENTITY_PAGE = 'IDENTITY_PAGE',
  RESPONSE_PAGE = 'RESPONSE_PAGE',
  WORK_SECTION_PAGE = 'WORK_SECTION_PAGE',
  INTERESTS_PAGE = 'INTERESTS_PAGE',
  LINKS_PAGE = 'LINKS_PAGE',
  SCHEDULE_PAGE = 'SCHEDULE_PAGE',
  EXIT_PAGE = 'EXIT_PAGE',
}

/**
 * Wrapper function to handle the join SSW form
 */
const WizardWrapper = (): ReactElement => {
  const [page, setPage] = useState<string>(WizardPage.INITIAL_PAGE.toString());
  const [pages, setPages] = useState<Array<string>>([]);
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

  const handlePageNext = (): void => {
    console.log(getPages());
    const pages = getPages();
    const currentIdx = pages.indexOf(page);
    if (currentIdx <= pages.length) {
      setPage(pages[currentIdx + 1]);
    }
  };

  const handlePagePrevious = (): void => {
    const pages = getPages();
    const currentIdx = pages.indexOf(page);
    if (currentIdx > 0) {
      setPage(pages[currentIdx - 1]);
    }
  };

  const handleRole = (event: MouseEvent<HTMLButtonElement>): void => {
    setRole(event.currentTarget.value);
    handlePageNext();
  };

  const getPages = (): Array<string> => {
    let parsedPages = Object.values(WizardPage);
    if (role === 'STAFF') {
      parsedPages = parsedPages.filter(
        (page) =>
          page !== WizardPage.RESPONSE_PAGE &&
          page !== WizardPage.SCHEDULE_PAGE &&
          page !== WizardPage.WORK_SECTION_PAGE,
      );
    }
    return parsedPages;
  }

  return (
    <div className="wizard-wrapper">
      <div className="logo-header">
        <img className="logo" alt="SSW Logo" src={Logo} />
      </div>

      {page !== WizardPage.INITIAL_PAGE.toString() && (
        <div className="previous-page">
          <Button
            circular
            onClick={handlePagePrevious}
            className="previous-icon"
          >
            <img width="70%" src={ArrowBack} alt="back arrow" />
          </Button>
        </div>
      )}

      <div className="wizard-content">
        <div className="wizard-pages">
          {page === WizardPage.INITIAL_PAGE.toString() && (
            <WizardInitialPrompt handleRole={handleRole} />
          )}

          {page === WizardPage.BASIC_INFO_PAGE.toString() && (
            <BasicInfo
              firstName={firstName}
              lastName={lastName}
              preferredName={preferredName}
              phoneNumber={phoneNumber}
              setFirstName={setFirstName}
              setLastName={setLastName}
              setPhoneNumber={setPhoneNumber}
              setPreferredName={setPreferredName}
              handlePageNext={handlePageNext}
            />
          )}

          {page === WizardPage.IDENTITY_PAGE.toString() && (
            <Identity
              setGenders={setGenders}
              setPronouns={setPronouns}
              setRaces={setRaces}
            />
          )}
        </div>

        {page !== WizardPage.INITIAL_PAGE.toString() && (
          <div className="next-page">
            <Button circular onClick={handlePageNext} className="next-icon">
              <img src={ArrowNext} alt="next arrow" />
            </Button>
          </div>
        )}
      </div>

      <div className="wizard-page-counter">
        {page !== WizardPage.INITIAL_PAGE.toString() && (
          <WizardPageCounter wizardPages={getPages().slice(1)} activePage={page} />
        )}
      </div>
    </div>
  );
};

export default WizardWrapper;
export { WizardPage };
