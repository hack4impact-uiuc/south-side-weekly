import React, { ReactElement } from 'react';

import { Walkthrough } from '../../components';
import { UsersView } from '../../components/view/UsersView';
import { AuthView } from '../../components/wrapper/AuthView';
import { Tabs } from '../../layouts/tabs/Tabs';
import { pagesEnum } from '../../utils/enums';

import './styles.scss';

const Directory = (): ReactElement => (
  <div className="directory-page">
    <div className="page-header-content directory-page-header">
      <Walkthrough
        page={pagesEnum.DIRECTORY}
        content="Check out the members on the SSW team and click their profiles to view more details!"
      />
      <AuthView view="nonAdmin">
        <UsersView type="approved" />
      </AuthView>
    </div>
    <Tabs
      views={[
        {
          title: 'Approved Users',
          content: <UsersView type="approved" />,
        },
        {
          title: 'Pending Users',
          content: <UsersView type="pending" />,
        },
        {
          title: 'Rejected Users',
          content: <UsersView type="denied" />,
        },
      ]}
      adminView
    />
  </div>
);

export default Directory;
