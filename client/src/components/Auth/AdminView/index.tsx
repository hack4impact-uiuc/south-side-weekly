import React, { FC } from 'react';

import { useAuth } from '../../../contexts';

const AdminView: FC = ({ children }) => {
  const { isAdmin, isOnboarded } = useAuth();

  return <>{isAdmin && isOnboarded && children}</>;
};

export default AdminView;
