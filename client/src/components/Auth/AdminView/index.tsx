import React, { FC } from 'react';

import { useAuth } from '../../../contexts';

const AdminView: FC = ({ children }) => {
  const { isAdmin, user } = useAuth();

  return <>{isAdmin && user.hasRoleApproved && children}</>;
};

export default AdminView;
