import React, { FC, ReactElement, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Header, Icon } from 'semantic-ui-react';

import './styles.scss';

interface ApproveClaimCardProps {
  title: string;
  linkTo: string;
}

const ApproveClaimCard: FC<ApproveClaimCardProps> = ({
  title,
  linkTo,
}): ReactElement => {
  //const { pitchId } = useParams<ParamTypes>();
  console.log('hey');

  return (
    <Header as={NavLink} to={linkTo} className="back-button" size="small">
      <Icon name="chevron left" />
      {title}
    </Header>
  );
};

export default ApproveClaimCard;
