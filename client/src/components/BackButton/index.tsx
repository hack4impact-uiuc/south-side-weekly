import React, { FC, ReactElement } from 'react';
import { NavLink } from 'react-router-dom';
import { Header, Icon } from 'semantic-ui-react';

import './styles.scss';

interface BackButtonProps {
  title: string;
  linkTo: string;
}

const BackButton: FC<BackButtonProps> = ({ title, linkTo }): ReactElement => {
  //const { pitchId } = useParams<ParamTypes>();
  console.log('hey');

  return (
    <Header as={NavLink} to={linkTo} className="back-button" size="small">
      <Icon name="chevron left" />
      {title}
    </Header>
  );
};

export default BackButton;
