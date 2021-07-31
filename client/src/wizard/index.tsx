import React, { FC, ReactElement, useState, useEffect } from 'react';
import { Button } from 'semantic-ui-react';

import { Header, PageCounter } from '../components';
import { useForm } from '../contexts';
import { wizardPages } from '../utils/enums';

import Completition from './Completion';
import InitialPrompt from './InitialPrompt';
import Onboard1 from './Onboard1';
import Onboard2 from './Onboard2';
import Onboard3 from './Onboard3';
import Onboard4 from './Onboard4';
import Onboard5 from './Onboard5';

import './styles.scss';

const staffPages = [
  wizardPages.ONBOARD_1,
  wizardPages.ONBOARD_2,
  wizardPages.ONBOARD_3,
];
const contributorPages = [
  wizardPages.ONBOARD_1,
  wizardPages.ONBOARD_2,
  wizardPages.ONBOARD_3,
  wizardPages.ONBOARD_4,
  wizardPages.ONBOARD_5,
];

const Wizard: FC = (): ReactElement => {
  const { currentPage, prevPage, formData } = useForm();
  const [pages, setPages] = useState<string[]>([]);

  useEffect(() => {
    if (formData.role === 'STAFF') {
      setPages(staffPages);
    } else if (formData.role === 'CONTRIBUTOR') {
      setPages(contributorPages);
    }
  }, [formData.role]);

  return (
    <div className="pages-wrapper">
      <Header />
      {currentPage > 0 && currentPage <= pages.length && (
        <Button
          className="go-back"
          icon="arrow left"
          circular
          size="massive"
          onClick={prevPage}
        />
      )}
      {currentPage > 0 && currentPage < pages.length && (
        <Button
          className="submit"
          icon="arrow right"
          circular
          size="massive"
          type="submit"
          form={`onboard-${currentPage}`}
        />
      )}
      {pages.length > 0 && currentPage === pages.length && (
        <Button
          className="submit"
          icon="check"
          circular
          size="massive"
          type="submit"
          form={`onboard-${currentPage}`}
        />
      )}

      {currentPage === 0 && <InitialPrompt />}
      {currentPage === 1 && <Onboard1 />}
      {currentPage === 2 && <Onboard2 />}
      {currentPage === 3 && <Onboard3 />}
      {currentPage === 4 && <Onboard4 />}
      {currentPage === 5 && <Onboard5 />}
      {currentPage === 6 && <Completition />}
      {currentPage > 0 && currentPage < pages.length && (
        <PageCounter pages={pages} />
      )}
    </div>
  );
};

export default Wizard;
