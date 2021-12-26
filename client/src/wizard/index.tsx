import React, { ReactElement, useEffect, useState } from 'react';

import { PageCounter, PrevButton, SubmitButton } from '../components';
import { Header } from '../layouts';
import { useWizard, WizardProvider } from '../contexts';

import Completion from './Completion';
import InitialPrompt from './InitialPrompt';
import Onboard1 from './Onboard1';
import Onboard2 from './Onboard2';
import Onboard3 from './Onboard3';
import Onboard4 from './Onboard4';
import Onboard5 from './Onboard5';

import './styles.scss';

const IGNORE_COUNT = 2;

const contributor = [
  InitialPrompt,
  Onboard1,
  Onboard2,
  Onboard3,
  Onboard4,
  Onboard5,
  Completion,
];
const staff = [InitialPrompt, Onboard1, Onboard2, Onboard3, Completion];

const ProviderWrapper = (): ReactElement => (
  <WizardProvider>
    <Wizard />
  </WizardProvider>
);

const Wizard = (): ReactElement => {
  const { currentPage, data } = useWizard();

  const [pages, setPages] = useState(staff);

  useEffect(() => {
    setPages(data!.role === 'STAFF' ? staff : contributor);
  }, [data]);

  const formLength = pages.length - IGNORE_COUNT;
  const isFormPage = currentPage > 0 && currentPage < formLength;
  const isLastPage = currentPage === formLength;
  const canGoBack = currentPage > 0 && currentPage <= formLength;

  return (
    <div className="pages-wrapper">
      <Header />
      {canGoBack && <PrevButton />}
      {isFormPage && <SubmitButton action="next" />}
      {isLastPage && <SubmitButton action="complete" />}

      {React.createElement(pages[currentPage])}

      {canGoBack && <PageCounter numberOfPages={formLength} />}
    </div>
  );
};

export default ProviderWrapper;
