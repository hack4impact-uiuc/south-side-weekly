import React, { FC } from 'react';

import { useAuth } from '../../../contexts';

const ApprovedView: FC = ({ children }) => {
  const { isOnboarded } = useAuth();

  return <>{isOnboarded && children}</>;
};

export default ApprovedView;
