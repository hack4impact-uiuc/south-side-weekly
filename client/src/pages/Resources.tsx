import React, { ReactElement, useEffect, useState } from 'react';
import { openPopupWidget } from 'react-calendly';
import { Menu } from 'semantic-ui-react';
import { Resource, Team } from 'ssw-common';

import { apiCall, isError } from '../api';
import { useAuth, useTeams } from '../contexts';
import { ResourceModal, Walkthrough, ResourceTable } from '../components';
import { pagesEnum } from '../utils/enums';
import { AuthView } from '../components/wrapper/AuthView';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';

import './Resources.scss';

interface ModalInfo {
  action: 'create' | 'edit';
  isOpen: boolean;
  resource?: Resource;
}

const generalTeam: Team = {
  _id: 'General',
  name: 'General',
  color: '',
  active: false,
};

const Resources = (): ReactElement => {
  const { teams } = useTeams();
  const { isAdmin } = useAuth();

  const [selectedTab, setSelectedTab] = useState('General');
  const [resources, setResources] = useState<Resource[]>([]);
  const [modal, setModal] = useState<ModalInfo>({
    action: 'edit',
    isOpen: false,
    resource: undefined,
  });
  const tabs = [generalTeam, ...teams];

  const filterResources = (team: string): Resource[] => {
    if (team === 'General') {
      return resources.filter((resource) => resource.isGeneral);
    }
    return resources.filter((resource) => resource.teams.includes(team));
  };

  const getResources = async (): Promise<void> => {
    const res = await apiCall<{ data: Resource[]; count: number }>({
      url: '/resources',
      method: 'GET',
    });

    if (!isError(res)) {
      setResources(
        res.data.result.data.sort(
          (a: Resource, b: Resource) =>
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

  const handleResourceAction = (selected: Resource): void => {
    setModal({
      action: 'edit',
      isOpen: true,
      resource: selected,
    });
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
        <div className="page-header-content resource-page-header">
          <Walkthrough
            page={pagesEnum.RESOURCES}
            content="Check out the members on the SSW team and click their profiles to view more details!"
          />
          <div className="controls">
            <h1>Resource Page</h1>
            <div className="push" />
            <AuthView view="isOnboarded">
              {isAdmin ? (
                <PrimaryButton
                  icon="add"
                  onClick={() => openModal('create')}
                  content="Add Resource"
                />
              ) : (
                <SecondaryButton
                  onClick={() =>
                    openPopupWidget({
                      url: 'https://calendly.com/sawhney4/60min',
                    })
                  }
                  content="Schedule Office Hour"
                />
              )}
            </AuthView>
          </div>

          <Menu className="tab-menu" tabular secondary pointing size="large">
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
        </div>
        <div className="page-inner-content">
          <ResourceTable
            resource={filterResources(selectedTab)}
            handleOpen={handleResourceAction}
            isAdmin={isAdmin}
          />
        </div>
      </div>
    </>
  );
};

export default Resources;
