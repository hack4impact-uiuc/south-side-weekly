import React, { ReactElement, useState } from 'react';
import { Button } from 'semantic-ui-react';

import AddResourceModal from '../components/ResourceHub/AddResourceModal';
import Sidebar from '../components/Sidebar';
import ResourcePageSVG from '../assets/resource-page.svg';
import '../css/Resource.css';

const generalResources = [
  {
    buttonText: 'SSW Writer’s Guide',
    link: 'https://southsideweekly.com/',
    key: 0,
  },
  {
    buttonText: 'Organizational Structure',
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
    buttonText: 'Organizational Structure',
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
    buttonText: 'Organizational Structure',
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
    buttonText: 'Organizational Structure',
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
    buttonText: 'Organizational Structure',
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
    buttonText: 'Organizational Structure',
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
  const [edit, setEdit] = useState<boolean>(false);

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

  function enableEdit(): void {
    setEdit(true);
  }

  function cancelEdit(): void {
    setEdit(false);
  }

  return (
    <div className="resource-page-wrapper">
      {console.log(edit)}
      <Sidebar></Sidebar>
      <img className="page-svg" alt="Resource Page" src={ResourcePageSVG} />
      <div className="resource-page-content">
        <div className="resource-title-container">
          <div className="resource-title-item">Resource Hub</div>
          <div className="resource-title-item">
            <div className="resource-toggle-group">
              <Button
                className={'toggle-button' && (!edit ? 'active' : '')}
                onClick={cancelEdit}
              >
                View Resources
              </Button>
              <Button
                className={'toggle-button' && (edit ? 'active' : '')}
                onClick={enableEdit}
              >
                Edit Resources
              </Button>
            </div>
          </div>
        </div>

        <div className="resource-toggle-group">
          {!edit ? (
            resourceRoleBtns.map((button) => (
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
            ))
          ) : (
            <AddResourceModal />
          )}
        </div>
        <div className="resource-btn-group">
          {!edit
            ? resources.map((button) => (
                <Button
                  onClick={() => handleResourceClick(button.link)}
                  className="resource-btn"
                  key={button.key}
                >
                  {button.buttonText}
                </Button>
              ))
            : resources.map((button, index) => (
                <div key={index} className="editable-resource">
                  <Button
                    className="delete-btn"
                    circular
                    icon="minus circle"
                  ></Button>
                  <Button className="resource-btn" key={button.key}>
                    {button.buttonText}
                  </Button>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default ResourcePage;
