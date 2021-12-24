import React, { FC, ReactElement } from 'react';

import { useAuth } from '../../contexts';

type ViewTypes =
  | 'isContributor'
  | 'isStaff'
  | 'isAdmin'
  | 'isOnboarded'
  | 'minContributor'
  | 'minStaff'
  | 'nonAdmin';

interface AuthViewProps {
  view: ViewTypes;
}

export const AuthView: FC<AuthViewProps> = ({
  children,
  view,
}): ReactElement => {
  const { isContributor, isStaff, isAdmin, isOnboarded } = useAuth();

  const viewConditions = {
    isContributor: isContributor,
    isStaff: isStaff,
    isAdmin: isAdmin,
    isOnboarded: isOnboarded,
    minContributor: isContributor || isStaff || isAdmin,
    minStaff: isStaff || isAdmin,
    nonAdmin: !isAdmin,
  };

  if (!isOnboarded) {
    return <></>;
  }

  return <>{viewConditions[view] && children}</>;
};
