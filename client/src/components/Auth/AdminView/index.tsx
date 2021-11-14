import React, { FC } from 'react';

import { useAuth } from '../../../contexts';
import { onboardingStatusEnum } from '../../../utils/enums';

const AdminView: FC = ({ children }) => {
  const { isAdmin, user } = useAuth();

  return (
    <>
      {isAdmin &&
        user.onboardingStatus === onboardingStatusEnum.ONBOARDED &&
        children}
    </>
  );
};

export default AdminView;
