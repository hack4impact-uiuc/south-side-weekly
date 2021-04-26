import React, { ReactElement, useEffect, useState } from 'react';
import { Button } from 'semantic-ui-react';
import { IResource } from 'ssw-common';

import { getAllResources, deleteResource, isError } from '../utils/apiWrapper';
import AddResourceModal from '../components/ResourceHub/AddResourceModal';
import EditResourceModal from '../components/ResourceHub/EditResourceModal';
import ResourcePageSVG from '../assets/resource-page.svg';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import '../css/Resource.css';
import { pages } from '../utils/enums';

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
  const [resourceToEdit, setResourceToEdit] = useState<IResource | undefined>(
    undefined,
  );
  const [showEditModal, setShowEditModal] = useState<boolean>(false);

  const filterResources = async (): Promise<void> => {
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
  };

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

  const enableEdit = (): void => {
    setEdit(true);
  };

  const cancelEdit = (): void => {
    setEdit(false);
  };

  const removeResource = async (resourceId: string): Promise<void> => {
    const res = await deleteResource(resourceId);
    if (!isError(res)) {
      filterResources();
    }
  };

  function closeModal(): void {
    setShowEditModal(false);
  }

  return (
    <div className="resource-page-wrapper">
      <Sidebar currentPage={pages.RESOURCES}></Sidebar>
      <Header />
      <img className="page-svg" alt="Resource Page" src={ResourcePageSVG} />
      <div className="resource-page-content">
        <div className="resource-title-container">
          <div className="resource-title-item">Resource Hub</div>
          <div className="resource-title-item">
            <div className="resource-edit-btns">
              <Button className={!edit ? 'active' : ''} onClick={cancelEdit}>
                View Resources
              </Button>
              <Button className={edit ? 'active' : ''} onClick={enableEdit}>
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
                  <Button
                    className="resource-btn"
                    key={idx}
                    onClick={() => {
                      setShowEditModal(true);
                      setResourceToEdit(resource);
                    }}
                  >
                    <Button
                      className="delete-btn"
                      circular
                      icon="big minus circle"
                      onClick={() => removeResource(resource._id)}
                    />
                    {resource.name}
                  </Button>
                </div>
              ))}
        </div>

        <div>
          {showEditModal ? (
            <EditResourceModal
              isOpen
              resource={resourceToEdit}
              closeModal={closeModal}
            />
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourcePage;
