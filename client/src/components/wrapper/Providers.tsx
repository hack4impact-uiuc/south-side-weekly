import React, { FC, useEffect } from 'react';
import toast, { useToasterStore } from 'react-hot-toast';

import { AuthProvider, TeamsProvider, InterestsProvider } from '../../contexts';
import IssuesProvider from '../../contexts/issues/provider';

export const Providers: FC = ({ children }) => {
  const { toasts } = useToasterStore();

  const TOAST_LIMIT = 1;

  useEffect(() => {
    toasts
      .filter((t) => t.visible)
      .filter((_, i) => i >= TOAST_LIMIT)
      .forEach((t) => toast.dismiss(t.id));
  }, [toasts]);

  return (
    <AuthProvider>
      <TeamsProvider>
        <InterestsProvider>
          <IssuesProvider>{children}</IssuesProvider>
        </InterestsProvider>
      </TeamsProvider>
    </AuthProvider>
  );
};
