import React, { ReactElement, useState } from 'react';
import { Button } from 'semantic-ui-react';

import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ResourcePageSVG from '../assets/resource-page.svg';
import {pages} from "../utils/enums";
import '../css/Resource.css';

const generalResources = [
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

const role1Resources = [
  {
    buttonText: 'SSW Writer’s Guide 1',
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
const role2Resources = [
  {
    buttonText: 'SSW Writer’s Guide 2',
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

const role3Resources = [
  {
    buttonText: 'SSW Writer’s Guide 3',
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

const role4Resources = [
  {
    buttonText: 'SSW Writer’s Guide 4',
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

const role5Resources = [
  {
    buttonText: 'SSW Writer’s Guide 5',
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

const ResourcePage = (): ReactElement => {
  interface IResource {
    buttonText: string;
    link: string;
    key: number;
  }

  const [currentValue, setCurrentValue] = useState<string>('General');
  const [resources, setResources] = useState<Array<IResource>>(
    generalResources,
  );

  const resourceRoleBtns = [
    { value: 'General', resources: generalResources },
    { value: 'Role 1', resources: role1Resources },
    { value: 'Role 2', resources: role2Resources },
    { value: 'Role 3', resources: role3Resources },
    { value: 'Role 4', resources: role4Resources },
    { value: 'Role 5', resources: role5Resources },
  ];

  /**
   * Opens a link in a new tab
   *
   * @param link the link to open in the new tab
   */
  const handleResourceClick = (link: string): void => {
    window.open(link, '_blank');
  };

  /**
   * Changes the resources display to show the user
   * @param resources the list of resources
   * @param value the current role's resources that is being shown
   */
  const handleResourceChange = (
    resources: Array<IResource>,
    value: string,
  ): void => {
    setResources(resources);
    setCurrentValue(value);
  };

  return (
    <div className="resource-page-wrapper">
      <img className="page-svg" alt="Resource Page" src={ResourcePageSVG} />
      <Header large={false} />
      <Sidebar currentPage={pages.RESOURCES}/>
      <div className="resource-page-content">
        <div className="page-text">Resource Hub</div>
        <div className="resource-toggle-group">
          {resourceRoleBtns.map((button) => (
            <Button
              key={button.value}
              className={`toggle-button ${
                button.value === currentValue && 'active'
              }`}
              onClick={() =>
                handleResourceChange(button.resources, button.value)
              }
            >
              {button.value}
            </Button>
          ))}
        </div>
        <div className="resource-btn-group">
          {resources.map((button) => (
            <Button
              onClick={() => handleResourceClick(button.link)}
              className="resource-btn"
              key={button.key}
            >
              {button.buttonText}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourcePage;
