import React, {
  ReactElement,
  useState,
  MouseEvent,
  useEffect,
  useCallback,
} from 'react';
import { Button } from 'semantic-ui-react';

import '../../css/wizard/WizardWrapper.css';
import Header from '../../components/Header';
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
import Compleition from './Completion';

/**
 * Enum to represent which on boarding page the user is on
 */
enum WizardPage {
  INITIAL_PAGE = 'INITIAL_PAGE',
  ONBOARD_1 = 'ONBOARD_1',
  ONBOARD_2 = 'ONBOARD_2',
  ONBOARD_3 = 'ONBOARD_3',
  ONBOARD_4 = 'ONBOARD_4',
  ONBOARD_5 = 'ONBOARD_5',
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

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [scheduleConfirmed, setScheduleConfirmed] = useState<boolean>(false);

  /**
   * React hook to update the viewable pages based on the role change
   */
  useEffect(() => {
    let parsedPages = Object.values(WizardPage);
    if (role === 'STAFF') {
      parsedPages = parsedPages.filter(
        (page) =>
          page !== WizardPage.ONBOARD_4 && page !== WizardPage.ONBOARD_5,
      );
    }
    setViewablePages(parsedPages);
  }, [role]);

  /**
   * Sets the current page in view to a specific page
   *
   * @param page the page to change to
   */
  const updateCurrentPage = (page: string): void => {
    setPage(page);
  };

  /**
   * Gos to the next page
   */
  const handlePageNext = useCallback((): void => {
    const currentIdx = viewablePages.indexOf(page);
    if (currentIdx <= viewablePages.length) {
      setPage(viewablePages[currentIdx + 1]);
    }
  }, [viewablePages, page]);

  /**
   * Gos back a page
   */
  const handlePagePrevious = (): void => {
    const currentIdx = viewablePages.indexOf(page);
    if (currentIdx > 0) {
      setPage(viewablePages[currentIdx - 1]);
    }
  };

  /**
   * Updates the role and triggers the next page event
   *
   * @param event the mouse event from clicking on the button
   */
  const handleRole = (event: MouseEvent<HTMLButtonElement>): void => {
    setRole(event.currentTarget.value);
    handlePageNext();
  };

  /**
   * Gets all of
   *
   * @returns an array of strings representing the pages to count in the WizardPageCounter
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
  const submitForm = useCallback(() => {
    if (!scheduleConfirmed && role === 'CONTRIBUTOR') {
      setOpenModal(true);
      return;
    }

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
  }, [
    firstName,
    lastName,
    preferredName,
    phoneNumber,
    genders,
    pronouns,
    portfolio,
    linkedIn,
    twitter,
    currentTeams,
    role,
    races,
    interests,
    scheduleConfirmed,
    handlePageNext,
  ]);

  /**
   * React hook to call formSubmit after the user confirms they scheduled a meeting
   */
  useEffect(() => {
    if (
      scheduleConfirmed &&
      page === WizardPage.ONBOARD_5.toString() &&
      role === 'CONTRIBUTOR'
    ) {
      submitForm();
      setOpenModal(false);
    }
  }, [scheduleConfirmed, submitForm, role, page]);

  /**
   * Decides whether or not to show the next button on the page
   * @returns true if role is staff and page is not equal to Onboard 7,
   *          true if role is contributor and page is not equal to Onboard 8
   *          else false
   */
  const shouldShowNextBtn = (): boolean => {
    if (role === 'STAFF') {
      return page !== WizardPage.ONBOARD_3.toString();
    } else if (role === 'CONTRIBUTOR') {
      return page !== WizardPage.ONBOARD_5.toString();
    }
    return false;
  };

  return (
    <div className="wizard-wrapper">
      <Header />
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
              races={races}
              setRaces={setRaces}
            />
          )}

          {page === WizardPage.ONBOARD_3.toString() && (
            <Onboard3
              currentTeams={currentTeams}
              setCurrentTeams={setCurrentTeams}
              interests={interests}
              setInterests={setInterests}
            />
          )}
          {page === WizardPage.ONBOARD_4.toString() && (
            <Onboard4
              reasonsForInvolvement={reasonForInvolvement}
              setReasonsForInvolvement={setReasonForInvolvement}
            />
          )}

          {page === WizardPage.ONBOARD_5.toString() && (
            <Onboard5
              isModalOpen={openModal}
              setScheduleConfirmed={setScheduleConfirmed}
              setModalOpen={setOpenModal}
            />
          )}
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
                <Button circular onClick={submitForm} className="check-icon">
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
              pageChanger={updateCurrentPage}
            />
          )}
      </div>
    </div>
  );
};

export default WizardWrapper;
export { WizardPage };
