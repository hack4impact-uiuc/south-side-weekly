import React, { FC } from 'react';

import { AuthProvider, TeamsProvider, InterestsProvider } from '../../contexts';
import IssuesProvider from '../../contexts/issues/provider';

const ProviderWrapper: FC = ({ children }) => (
  <AuthProvider>
    <TeamsProvider>
      <InterestsProvider>
        <IssuesProvider>{children}</IssuesProvider>
      </InterestsProvider>
    </TeamsProvider>
  </AuthProvider>
);

export default ProviderWrapper;
