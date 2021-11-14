import React, { FC } from 'react';

import { useAuth } from '../../../contexts';
import { onboardingStatusEnum } from '../../../utils/enums';

const ApprovedView: FC = ({ children }) => {
  const { user } = useAuth();

  return (
    <>{user.onboardingStatus === onboardingStatusEnum.ONBOARDED && children}</>
  );
};

export default ApprovedView;
