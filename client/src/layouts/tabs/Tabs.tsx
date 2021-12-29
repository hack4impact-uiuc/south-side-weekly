import React, { FC, ReactElement, useMemo } from 'react';
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
  const panes = useMemo(
    () =>
      views.map(({ title, content }) => ({
        menuItem: title,
        render: function show() {
          return <Tab.Pane>{content}</Tab.Pane>;
        },
      })),
    [views],
  );

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
