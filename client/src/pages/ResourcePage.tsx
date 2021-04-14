import React, { ReactElement, useEffect, useState } from 'react';
import { Button } from 'semantic-ui-react';
import { IResource } from 'ssw-common';

import { getAllResources, isError } from '../utils/apiWrapper';
import AddResourceModal from '../components/ResourceHub/AddResourceModal';
import Sidebar from '../components/Sidebar';
import ResourcePageSVG from '../assets/resource-page.svg';
import '../css/Resource.css';

function defaultResources(): { [key: string]: Array<IResource> } {
  return {
    General: Array<IResource>(),
    Editing: Array<IResource>(),
    Factchecking: Array<IResource>(),
    Illustration: Array<IResource>(),
    Photography: Array<IResource>(),
    Onboarding: Array<IResource>(),
    Visuals: Array<IResource>(),
    Writing: Array<IResource>(),
  };
}

const ResourcePage = (): ReactElement => {
  const [currentValue, setCurrentValue] = useState<string>('General');
  const [edit, setEdit] = useState<boolean>(false);
  const [resourcesPerRole, setResourcesPerRole] = useState(defaultResources);

  async function filterResources(): Promise<void> {
    const res = await getAllResources();
    if (!isError(res)) {
      const allResources = res.data.result;

      const newResourcesPerRole = defaultResources();
      for (const i in allResources) {
        const resource = allResources[i];
        for (const j in resource.teamRoles) {
          const role = resource.teamRoles[j];
          newResourcesPerRole[role].push(resource);
        }
      }

      setResourcesPerRole(newResourcesPerRole);
    }
  }

  useEffect(() => {
    filterResources();
  }, [edit]);

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
  const handleResourceChange = (value: string): void => {
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
            Object.keys(resourcesPerRole).map((role) => (
              <Button
                key={role}
                className={`toggle-button ${role === currentValue && 'active'}`}
                onClick={() => handleResourceChange(role)}
              >
                {role}
              </Button>
            ))
          ) : (
            <AddResourceModal onAdd={filterResources} />
          )}
        </div>

        <div className="resource-btn-group">
          {!edit
            ? resourcesPerRole[currentValue].map((resource, idx) => (
                <Button
                  onClick={() => handleResourceClick(resource.link)}
                  className="resource-btn"
                  key={idx}
                >
                  {resource.name}
                </Button>
              ))
            : resourcesPerRole[currentValue].map((resource, idx) => (
                <div key={idx} className="editable-resource">
                  <Button className="resource-btn" key={idx}>
                    <Button
                      className="delete-btn"
                      circular
                      icon="big minus circle"
                    />
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
