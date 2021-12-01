import React, { ReactElement, useEffect, useState } from 'react';
import { openPopupWidget } from 'react-calendly';
import { Button, Icon, Menu } from 'semantic-ui-react';
import { IResource, ITeam } from 'ssw-common';

import { getAllResources, isError } from '../../api';
import { useAuth, useTeams } from '../../contexts';
import {
  ResourceModal,
  Walkthrough,
  ApprovedView,
  ResourceTable,
} from '../../components';
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
  const { teams } = useTeams();
  const { isAdmin } = useAuth();

  const [selectedTab, setSelectedTab] = useState('General');
  const [resources, setResources] = useState<IResource[]>([]);
  const [modal, setModal] = useState<ModalInfo>({
    action: 'edit',
    isOpen: false,
    resource: undefined,
  });
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
      setResources(
        res.data.result.sort(
          (a: IResource, b: IResource) =>
            +new Date(b.updatedAt) - +new Date(a.updatedAt),
        ),
      );
    }
  };

  useEffect(() => {
    getResources();

    return () => setResources([]);
  }, [modal.isOpen]);

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
    if (isAdmin) {
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
          <div className="push" />
          <ApprovedView>
            {isAdmin ? (
              <Button
                onClick={() => openModal('create')}
                className="default-btn"
              >
                <Icon name="add" /> Add Resource
              </Button>
            ) : (
              <Button
                onClick={() =>
                  openPopupWidget({
                    url: 'https://calendly.com/sawhney4/60min',
                  })
                }
                content="Schedule Office Hour"
                className="calendly-button"
              />
            )}
          </ApprovedView>
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

        <ResourceTable
          resource={filterResources(selectedTab)}
          handleOpen={handleResourceAction}
          isAdmin={isAdmin}
        />
      </div>
    </>
  );
};

export default Resources;
