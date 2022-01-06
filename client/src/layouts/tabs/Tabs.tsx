import React, { FC, ReactElement, ReactNode, useMemo } from 'react';
import { Tab, TabProps } from 'semantic-ui-react';
import cn from 'classnames';

import { AuthView } from '../../components/wrapper/AuthView';

import './Tabs.scss';

interface Props extends TabProps {
  views: {
    title: string;
    content: ReactElement;
  }[];
  className?: string;
  adminView?: boolean;
}

export const Tabs: FC<Props> = ({
  views,
  className,
  adminView = false,
  ...rest
}): ReactElement => {
  const panes = useMemo(() => {
    const tabPanes: {
      menuItem: any;
      render?: () => ReactElement | undefined;
    }[] = views.map(({ title, content }) => ({
      menuItem: title,
      render: function show() {
        return <Tab.Pane>{content}</Tab.Pane>;
      },
    }));
    return tabPanes;
  }, [views]);

  const tabs = (
    <Tab
      {...rest}
      className={cn('page-tabs', className)}
      menu={{ secondary: true, pointing: true }}
      panes={panes}
    />
  );

  if (adminView) {
    return <AuthView view="isAdmin">{tabs}</AuthView>;
  }

  return tabs;
};
