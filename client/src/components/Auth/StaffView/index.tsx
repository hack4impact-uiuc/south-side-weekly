import React, { FC } from 'react';

import { useAuth } from '../../../contexts';

const StaffView: FC = ({ children }) => {
  const { isStaff, isAdmin } = useAuth();

  return <>{(isStaff || isAdmin) && children}</>;
};

export default StaffView;
