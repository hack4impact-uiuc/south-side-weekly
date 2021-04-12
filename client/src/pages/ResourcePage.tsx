import React, { ReactElement, useEffect, useState } from 'react';
import { Button } from 'semantic-ui-react';
import { IResource } from 'ssw-common';

import { getAllResources, isError } from '../utils/apiWrapper';
import AddResourceModal from '../components/ResourceHub/AddResourceModal';
import Sidebar from '../components/Sidebar';
import ResourcePageSVG from '../assets/resource-page.svg';
import '../css/Resource.css';

// const roles = [
//   'General',
//   'Editing',
//   'Factchecking',
//   'Illustration',
//   'Photography',
//   'Onboarding',
//   'Visuals',
//   'Writing',
// ];

const resourcesPerRole: { [key: string]: Array<IResource> } = {
  General: Array<IResource>(),
  Editing: Array<IResource>(),
  Factchecking: Array<IResource>(),
  Illustration: Array<IResource>(),
  Photography: Array<IResource>(),
  Onboarding: Array<IResource>(),
  Visuals: Array<IResource>(),
  Writing: Array<IResource>(),
};

const ResourcePage = (): ReactElement => {
  const [currentValue, setCurrentValue] = useState<string>('General');
  const [resources, setResources] = useState<Array<IResource>>(
    resourcesPerRole['General'],
  );
  const [edit, setEdit] = useState<boolean>(false);

  const resourceRoleBtns = [
    { value: 'General', resources: resourcesPerRole['General'] },
    { value: 'Editing', resources: resourcesPerRole['Editing'] },
    { value: 'Factchecking', resources: resourcesPerRole['Factchecking'] },
    { value: 'Illustration', resources: resourcesPerRole['Illustration'] },
    { value: 'Photography', resources: resourcesPerRole['Photography'] },
    { value: 'Onboarding', resources: resourcesPerRole['Onboarding'] },
    { value: 'Visuals', resources: resourcesPerRole['Visuals'] },
    { value: 'Writing', resources: resourcesPerRole['Writing'] },
  ];

  useEffect(() => {
    async function filterResources(): Promise<void> {
      const res = await getAllResources();
      if (!isError(res)) {
        const allResources = res.data.result;

        for (const i in allResources) {
          const resource = allResources[i];
          for (const j in resource.teamRoles) {
            const role = resource.teamRoles[j];
            resourcesPerRole[role].push(resource);
          }
        }
      }
    }

    if (resourcesPerRole['General'].length === 0) {
      filterResources();
    }
  });

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
            ? resources.map((resource, idx) => (
                <Button
                  onClick={() => handleResourceClick(resource.link)}
                  className="resource-btn"
                  key={idx}
                >
                  {resource.name}
                </Button>
              ))
            : resources.map((resource, idx) => (
                <div key={idx} className="editable-resource">
                  <Button
                    className="delete-btn"
                    circular
                    icon="minus circle"
                  ></Button>
                  <Button className="resource-btn" key={idx}>
                    {resource.name}
                  </Button>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default ResourcePage;
