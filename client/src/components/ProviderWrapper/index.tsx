import React, { FC } from 'react';

import { AuthProvider, TeamsProvider, InterestsProvider } from '../../contexts';

const ProviderWrapper: FC = ({ children }) => (
  <AuthProvider>
    <TeamsProvider>
      <InterestsProvider>{children}</InterestsProvider>
    </TeamsProvider>
  </AuthProvider>
);

export default ProviderWrapper;
