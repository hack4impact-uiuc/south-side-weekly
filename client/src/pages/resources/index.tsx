import React, { ReactElement, useEffect, useState } from 'react';
import { Button, Card, Menu, Radio } from 'semantic-ui-react';
import { IResource } from 'ssw-common';
import Swal from 'sweetalert2';

import { deleteResource, getAllResources, isError } from '../../api';
import { ResourceModal, AdminView } from '../../components';
import { useTeams } from '../../contexts';
import { titleCase } from '../../utils/helpers';

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

  const { teams: allTeams } = useTeams();

  const teams = ['General', ...allTeams.map((team) => team.name)].map(titleCase);

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
        <div className="controls">
          <h1>Resource Page</h1>
          <div>
            <AdminView>
              <Radio checked={edit} slider onClick={() => setEdit(!edit)} />
            </AdminView>
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
          {teams.map((team, index) => (
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
