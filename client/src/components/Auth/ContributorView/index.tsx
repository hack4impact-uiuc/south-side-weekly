import React, { FC } from 'react';

import { useAuth } from '../../../contexts';

const ContributorView: FC = ({ children }) => {
  const { isContributor, isOnboarded } = useAuth();

  return <>{isOnboarded && isContributor && children}</>;
};

export default ContributorView;
