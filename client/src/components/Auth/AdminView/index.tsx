import React, { FC } from 'react';

import { useAuth } from '../../../contexts';

const AdminView: FC = ({ children }) => {
  const { isAdmin } = useAuth();

  return <>{isAdmin && children}</>;
};

export default AdminView;
