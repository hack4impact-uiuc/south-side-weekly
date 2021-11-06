import React, { ReactElement, useEffect, useState } from 'react';
import { openPopupWidget } from 'react-calendly';
import { Button, Card, Menu, Radio } from 'semantic-ui-react';
import { IResource, ITeam } from 'ssw-common';
import Swal from 'sweetalert2';

import { deleteResource, getAllResources, isError } from '../../api';
import { useTeams } from '../../contexts';
import { ResourceModal, AdminView, Walkthrough } from '../../components';
import { pagesEnum } from '../../utils/enums';

import './styles.scss';

interface ModalInfo {
  action: 'create' | 'edit';
  isOpen: boolean;
  resource?: IResource;
}

const generalTeam: ITeam = {
  _id: 'General',
  name: 'General',
  color: '',
  active: false,
};

const Resources = (): ReactElement => {
  const [selectedTab, setSelectedTab] = useState('General');
  const [edit, setEdit] = useState(false);
  const [resources, setResources] = useState<IResource[]>([]);
  const [modal, setModal] = useState<ModalInfo>({
    action: 'edit',
    isOpen: false,
    resource: undefined,
  });

  const { teams } = useTeams();
  const tabs = [generalTeam, ...teams];

  const filterResources = (team: string): IResource[] => {
    if (team === 'General') {
      return resources.filter((resource) => resource.isGeneral);
    }
    return resources.filter((resource) => resource.teams.includes(team));
  };

  const getResources = async (): Promise<void> => {
    const res = await getAllResources();

    if (!isError(res)) {
      setResources(res.data.result);
    }
  };

  useEffect(() => {
    getResources();

    return () => setResources([]);
  }, [modal.isOpen]);

  const removeResource = async (resource: IResource): Promise<void> => {
    const res = await deleteResource(resource._id);

    if (!isError(res)) {
      getResources();
      Swal.fire({
        title: 'Successfully deleted resource',
        icon: 'success',
      });
    }
  };

  const closeModal = (): void => {
    modal.isOpen = false;
    setModal({ ...modal });
  };

  const openModal = (action: ModalInfo['action']): void => {
    modal.isOpen = true;
    modal.action = action;
    setModal({ ...modal });
  };

  const handleResourceAction = (selected: IResource): void => {
    if (edit) {
      setModal({
        action: 'edit',
        isOpen: true,
        resource: selected,
      });
    } else {
      const newSite = window.open(selected.link, '_target');
      newSite?.focus();
    }
  };

  return (
    <>
      <ResourceModal
        closeModal={closeModal}
        resource={modal.resource}
        action={modal.action}
        open={modal.isOpen}
        onOpen={() => openModal(modal.action)}
        onClose={closeModal}
      />

      <div className="resources-page">
        <Walkthrough
          page={pagesEnum.RESOURCES}
          content="Check out the members on the SSW team and click their profiles to view more details!"
        />
        <div className="controls">
          <h1>Resource Page</h1>
          <div>
            <AdminView>
              <Radio checked={edit} slider onClick={() => setEdit(!edit)} />
            </AdminView>
          </div>
          {!edit && (
            <Button
              className="calendly-button"
              onClick={() =>
                openPopupWidget({
                  url: 'https://calendly.com/sawhney4/60min',
                })
              }
            >
              Schedule Office Hours
            </Button>
          )}
          <div className="push" />
          {edit && (
            <Button
              onClick={() => openModal('create')}
              content="Create Resource"
              className="default-btn"
            />
          )}
        </div>

        <Menu tabular size="large">
          {tabs.map((tab, index) => (
            <Menu.Item
              key={index}
              name={tab.name}
              value={tab._id}
              active={tab._id === selectedTab}
              onClick={(e, { value }) => setSelectedTab(value)}
            />
          ))}
        </Menu>

        <div className="resource-group">
          {filterResources(selectedTab).map((resource, index) => (
            <Card
              className="resource"
              onClick={() => handleResourceAction(resource)}
              key={index}
            >
              <p>{resource.name}</p>
              {edit && (
                <Button
                  className="delete-btn"
                  circular
                  size="massive"
                  icon="minus circle"
                  onClick={(e) => {
                    removeResource(resource);
                    e.stopPropagation();
                  }}
                />
              )}
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default Resources;
