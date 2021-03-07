import React, { ReactElement, useState, MouseEvent, useEffect } from 'react';
import { Button } from 'semantic-ui-react';

import '../../css/wizard/WizardWrapper.css';
import Logo from '../../assets/ssw-form-header.png';
import ArrowBack from '../../assets/arrow-back.svg';
import ArrowNext from '../../assets/arrow-next.svg';
import SubmitSVG from '../../assets/check.svg';
import WizardPageCounter from '../../components/WizardPageCounter/WizardPageCounter';

import WizardInitialPrompt from './InitialPrompt';
import Onboard1 from './Onboard1';
import Onboard2 from './Onboard2';
import Onboard3 from './Onboard3';
import Onboard4 from './Onboard4';
import Onboard5 from './Onboard5';
import Onboard6 from './Onboard6';
import Onboard7 from './Onboard7';
import Onboard8 from './Onboard8';
import Compleition from './Completion';

enum WizardPage {
  INITIAL_PAGE = 'INITIAL_PAGE',
  ONBOARD_1 = 'ONBOARD_1',
  ONBOARD_2 = 'ONBOARD_2',
  ONBOARD_3 = 'ONBOARD_3',
  ONBOARD_4 = 'ONBOARD_4',
  ONBOARD_5 = 'ONBOARD_5',
  ONBOARD_6 = 'ONBOARD_6',
  ONBOARD_7 = 'ONBOARD_7',
  ONBOARD_8 = 'ONBOARD_8',
  COMPLETION = 'COMPLETION',
}

/**
 * Wrapper function to handle the join SSW form
 */
const WizardWrapper = (): ReactElement => {
  const [page, setPage] = useState<string>(WizardPage.INITIAL_PAGE.toString());
  const [viewablePages, setViewablePages] = useState<Array<string>>(
    Object.values(WizardPage),
  );
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

  useEffect(() => {
    let parsedPages = Object.values(WizardPage);
    if (role === 'STAFF') {
      parsedPages = parsedPages.filter(
        (page) =>
          page !== WizardPage.ONBOARD_4 &&
          page !== WizardPage.ONBOARD_8 &&
          page !== WizardPage.ONBOARD_5,
      );
    }
    setViewablePages(parsedPages);
  }, [role]);

  /**
   * Gos to the next page
   */
  const handlePageNext = (): void => {
    // const pages = getPages();
    const currentIdx = viewablePages.indexOf(page);
    if (currentIdx <= viewablePages.length) {
      setPage(viewablePages[currentIdx + 1]);
    }
  };

  /**
   * Gos back a page
   */
  const handlePagePrevious = (): void => {
    // const pages = getPages();
    const currentIdx = viewablePages.indexOf(page);
    if (currentIdx > 0) {
      setPage(viewablePages[currentIdx - 1]);
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
   * @returns an array of stirngs representing the pages to count in the WizardPageCounter
   */
  const getCountablePages = (): Array<string> => {
    const countablePages = [...viewablePages];

    countablePages.shift();
    countablePages.pop();

    return countablePages;
  };

  /**
   * Submits the form and collects the data
   */
  const handleFormSubmit = (): void => {
    const formData = {
      firstName: firstName,
      lastName: lastName,
      preferredName: preferredName,
      email: '',
      phone: phoneNumber,
      oauthID: '',
      genders: genders,
      pronouns: pronouns,
      masthead: false,
      portfolio: portfolio,
      linkedIn: linkedIn,
      twitter: twitter,
      claimedPitches: [],
      submittedPitches: [],
      currentTeams: currentTeams,
      role: role,
      races: races,
      interests: interests,
    };

    console.log(formData);
    handlePageNext();
  };

  const shouldShowNextBtn = (): boolean => {
    if (role === 'STAFF') {
      return page !== WizardPage.ONBOARD_7.toString();
    } else if (role === 'CONTRIBUTOR') {
      return page !== WizardPage.ONBOARD_8.toString();
    }
    return false;
  };

  return (
    <div className="wizard-wrapper">
      <div className="logo-header">
        <img className="logo" alt="SSW Logo" src={Logo} />
      </div>

      {page !== WizardPage.INITIAL_PAGE.toString() &&
        page !== WizardPage.COMPLETION.toString() && (
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

          {page === WizardPage.ONBOARD_7.toString() && (
            <Onboard7
              portfolio={portfolio}
              linkedIn={linkedIn}
              twitter={twitter}
              setPortfolio={setPortfolio}
              setLinkedIn={setLinkedIn}
              setTwitter={setTwitter}
            />
          )}

          {page === WizardPage.ONBOARD_8.toString() && <Onboard8 />}
          {page === WizardPage.COMPLETION.toString() && <Compleition />}
        </div>

        {page !== WizardPage.INITIAL_PAGE.toString() &&
          page !== WizardPage.COMPLETION && (
            <div className="next-page">
              {shouldShowNextBtn() ? (
                <Button circular onClick={handlePageNext} className="next-icon">
                  <img src={ArrowNext} alt="next arrow" />
                </Button>
              ) : (
                <Button
                  circular
                  onClick={handleFormSubmit}
                  className="check-icon"
                >
                  <img src={SubmitSVG} alt="submit" />
                </Button>
              )}
            </div>
          )}
      </div>

      <div className="wizard-page-counter">
        {page !== WizardPage.INITIAL_PAGE.toString() &&
          page !== WizardPage.COMPLETION.toString() && (
            <WizardPageCounter
              wizardPages={getCountablePages()}
              activePage={page}
            />
          )}
      </div>
    </div>
  );
};

export default WizardWrapper;
export { WizardPage };
