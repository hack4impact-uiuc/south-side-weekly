import React, { ReactElement } from 'react';
import { Button } from 'semantic-ui-react';

import CompletionSVG from '../../assets/completion-page.svg';
import '../../css/wizard/Completion.css';

const Completion = (): ReactElement => {
  const resourceBtns = [
    {
      buttonText: 'SSW Writer’s Guide',
      link: 'https://southsideweekly.com/',
      key: 0,
    },
    {
      buttonText: 'Other Resource',
      link: 'https://southsideweekly.com/',
      key: 1,
    },
    {
      buttonText: 'Other Resource',
      link: 'https://southsideweekly.com/',
      key: 2,
    },
    {
      buttonText: 'Other Resource',
      link: 'https://southsideweekly.com/',
      key: 3,
    },
    {
      buttonText: 'Other Resource',
      link: 'https://southsideweekly.com/',
      key: 4,
    },
    {
      buttonText: 'Other Resource',
      link: 'https://southsideweekly.com/',
      key: 5,
    },
  ];

  const handleResourceClick = (link: string): void => {
    window.open(link, '_blank');
  };

  return (
    <div className="completion-wrapper">
      <img className="page-svg" alt="Completion Page" src={CompletionSVG} />
      <div className="completion-content">
        <div className="page-text">
          Thank you for singing up and showing your interest in wanting to
          become a Contributor for South Side Weekly. While you wait to be
          Onboarded, please feel free to explore these resources.
          <br />
          <br />
          We look forward to working with you!
        </div>
        <div className="resource-btn-group">
          {resourceBtns.map((resourceBtn) => (
            <Button
              onClick={() => handleResourceClick(resourceBtn.link)}
              className="resource-btn"
              key={resourceBtn.key}
            >
              {resourceBtn.buttonText}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Completion;
