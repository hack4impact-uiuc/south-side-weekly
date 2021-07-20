import React, { ReactElement, useEffect, useState } from 'react';
import { Button, Card, Menu, Radio } from 'semantic-ui-react';
import { IResource } from 'ssw-common';
import { startCase } from 'lodash';

import { deleteResource, getAllResources, isError } from '../../api';
import { ResourceModal, Header, Sidebar } from '../../components';
import { allTeams } from '../../utils/constants';
import { pages } from '../../utils/enums';
import { useAuth } from '../../contexts';

import './styles.scss';

interface ModalInfo {
  action: 'create' | 'edit';
  isOpen: boolean;
  resource?: IResource;
}

const Resources = (): ReactElement => {
  const [role, setRole] = useState('General');
  const [edit, setEdit] = useState(false);
  const [resources, setResources] = useState<IResource[]>([]);
  const [modal, setModal] = useState<ModalInfo>({
    action: 'edit',
    isOpen: false,
    resource: undefined,
  });

  const { isAdmin } = useAuth();

  const teams = (): string[] =>
    ['General', ...allTeams].map((team) => startCase(team.toLowerCase()));

  const filterResources = (team: string): IResource[] =>
    resources.filter((resouce) => resouce.teamRoles.includes(team));

  const getResources = async (): Promise<void> => {
    const res = await getAllResources();

    if (!isError(res)) {
      setResources(res.data.result);
    }
  };

  useEffect(() => {
    getResources();
  }, [modal.isOpen]);

  const removeResource = async (resource: IResource): Promise<void> => {
    const res = await deleteResource(resource._id);

    if (!isError(res)) {
      getResources();
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
      <Header />
      <Sidebar currentPage={pages.RESOURCES} />
      <ResourceModal
        closeModal={closeModal}
        resource={modal.resource}
        action={modal.action}
        open={modal.isOpen}
        onOpen={() => openModal(modal.action)}
        onClose={closeModal}
      />
      <div className="resources-page">
        <div className="controls">
          <h1>Resource Page</h1>
          <div>
            {isAdmin && (
              <Radio checked={edit} slider onClick={() => setEdit(!edit)} />
            )}
          </div>
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
          {teams().map((team, index) => (
            <Menu.Item
              key={index}
              name={team}
              active={team === role}
              onClick={(e, { name }) => setRole(name!)}
            />
          ))}
        </Menu>

        <div className="resource-group">
          {filterResources(role).map((resource, index) => (
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
                  icon="big minus circle"
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
