import React, { FC } from 'react';

import { useAuth } from '../../../contexts';

const ApprovedView: FC = ({ children }) => {
  const { user } = useAuth();

  return <>{user.hasRoleApproved && children}</>;
};

export default ApprovedView;
