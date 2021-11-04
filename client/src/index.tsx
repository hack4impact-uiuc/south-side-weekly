import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import 'semantic-ui-css/semantic.min.css';

import {
  Directory,
  Profile,
  NotFound,
  Login,
  PitchDoc,
  Resources,
} from './pages';
import Wizard from './wizard';
import { PrivateRoute, ProviderWrapper } from './components';

import './styles/styles.scss';

const routes = [
  {
    path: '/users',
    component: Directory,
  },
  {
    path: '/profile/:userId',
    component: Profile,
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/pitches',
    component: PitchDoc,
  },
  {
    path: '/resources',
    component: Resources,
  },
  {
    path: '/join',
    component: Wizard,
  },
  {
    path: '*',
    component: NotFound,
  },
];

ReactDOM.render(
  <React.StrictMode>
    <Toaster />
    <ProviderWrapper>
      <Router>
        <Switch>
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
          {routes.map(({ path, component }) => (
            <PrivateRoute key={path} exact path={path} component={component} />
          ))}
        </Switch>
      </Router>
    </ProviderWrapper>
  </React.StrictMode>,
  document.getElementById('root'),
);
