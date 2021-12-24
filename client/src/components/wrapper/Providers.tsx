import React, { FC } from 'react';

import { AuthProvider, TeamsProvider, InterestsProvider } from '../../contexts';
import IssuesProvider from '../../contexts/issues/provider';

export const Providers: FC = ({ children }) => (
  <AuthProvider>
    <TeamsProvider>
      <InterestsProvider>
        <IssuesProvider>{children}</IssuesProvider>
      </InterestsProvider>
    </TeamsProvider>
  </AuthProvider>
);
