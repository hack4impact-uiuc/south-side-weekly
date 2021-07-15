import React, { ReactElement } from 'react';
import { Container, Grid, Image } from 'semantic-ui-react';

import './styles.css';
import Sidebar from '../../components/Sidebar';
import { pages } from '../../utils/enums';
import Error from '../../assets/404-error.png';

const NotFound = (): ReactElement => (
  <>
    <Sidebar currentPage={pages.HOME} />
    <Container className="not-found-page">
      <Grid>
        <Grid.Row>
          <Grid.Column textAlign="center">
            <Image
              size="medium"
              src={Error}
              alt={'Page not found. Error 404'}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  </>
);

export default NotFound;
