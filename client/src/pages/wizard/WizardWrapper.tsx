import React, { ReactElement, useState, MouseEvent } from 'react';
import { Button } from 'semantic-ui-react';

import '../../css/wizard/WizardWrapper.css';
import Logo from '../../assets/ssw-form-header.png';

import WizardInitialPrompt from './InitialPrompt';
import Onboard1 from './Onboard1';
import Onboard2 from './Onboard2';
import Onboard3 from './Onboard3';
import Onboard4 from './Onboard4';
import Onboard5 from './Onboard5';
import Onboard6 from './Onboard6';
import WizardPageCounter from '../../components/WizardPageCounter/WizardPageCounter';
import ArrowBack from '../../assets/arrow-back.svg';
import ArrowNext from '../../assets/arrow-next.svg';

enum WizardPage {
  INITIAL_PAGE = 'INITIAL_PAGE',
  ONBOARD_1 = 'ONBOARD_1',
  ONBOARD_2 = 'ONBOARD_2',
  ONBOARD_3 = 'ONBOARD_3',
  ONBOARD_4 = 'ONBOARD_4',
  ONBOARD_5 = 'ONBOARD_5',
  ONBOARD_6 = 'ONBOARD_6',
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
  const [currentTeams, setCurrentTeams] = useState<Array<string>>([]);
  const [interests, setInterests] = useState<Array<string>>([]);
  const [portfolio, setPortfolio] = useState<string>('');
  const [linkedIn, setLinkedIn] = useState<string>('');
  const [twitter, setTwitter] = useState<string>('');

  /**
   * Gos to the next page
   */
  const handlePageNext = (): void => {
    console.log(getPages());
    const pages = getPages();
    const currentIdx = pages.indexOf(page);
    if (currentIdx <= pages.length) {
      setPage(pages[currentIdx + 1]);
    }
  };

  /**
   * Gos back a page
   */
  const handlePagePrevious = (): void => {
    const pages = getPages();
    const currentIdx = pages.indexOf(page);
    if (currentIdx > 0) {
      setPage(pages[currentIdx - 1]);
    }
  };

  /**
   * Updatse the role and triggers the next page event
   * @param event the mouse event from clicking on the button
   */
  const handleRole = (event: MouseEvent<HTMLButtonElement>): void => {
    setRole(event.currentTarget.value);
    handlePageNext();
  };

  /**
   * @returns an array of stirngs representing the valid pages to go to based on the role
   */
  const getPages = (): Array<string> => {
    let parsedPages = Object.values(WizardPage);
    if (role === 'STAFF') {
      parsedPages = parsedPages.filter(
        (page) =>
          page !== WizardPage.ONBOARD_4 &&
          page !== WizardPage.SCHEDULE_PAGE &&
          page !== WizardPage.ONBOARD_5,
      );
    }
    return parsedPages;
  };

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

          {page === WizardPage.ONBOARD_1.toString() && (
            <Onboard1
              firstName={firstName}
              lastName={lastName}
              preferredName={preferredName}
              phoneNumber={phoneNumber}
              setFirstName={setFirstName}
              setLastName={setLastName}
              setPhoneNumber={setPhoneNumber}
              setPreferredName={setPreferredName}
            />
          )}

          {page === WizardPage.ONBOARD_2.toString() && (
            <Onboard2
              genders={genders}
              pronouns={pronouns}
              setGenders={setGenders}
              setPronouns={setPronouns}
            />
          )}

          {page === WizardPage.ONBOARD_3.toString() && (
            <Onboard3 races={races} setRaces={setRaces} />
          )}

          {page === WizardPage.ONBOARD_4.toString() && (
            <Onboard4
              reasonsForInvolvement={reasonForInvolvement}
              setReasonsForInvolvement={setReasonForInvolvement}
            />
          )}
          {page === WizardPage.ONBOARD_5.toString() && (
            <Onboard5
              currentTeams={currentTeams}
              setCurrentTeams={setCurrentTeams}
            />
          )}
          {page === WizardPage.ONBOARD_6.toString() && (
            <Onboard6 interests={interests} setInterests={setInterests} />
          )}
        </div>

        {page !== WizardPage.INITIAL_PAGE.toString() &&
          page !== WizardPage.EXIT_PAGE && (
            <div className="next-page">
              <Button circular onClick={handlePageNext} className="next-icon">
                <img src={ArrowNext} alt="next arrow" />
              </Button>
            </div>
          )}
      </div>

      <div className="wizard-page-counter">
        {page !== WizardPage.INITIAL_PAGE.toString() && (
          <WizardPageCounter
            wizardPages={getPages().slice(1)}
            activePage={page}
          />
        )}
      </div>
    </div>
  );
};

export default WizardWrapper;
export { WizardPage };
