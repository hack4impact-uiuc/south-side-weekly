import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryParamProvider } from 'use-query-params';

import {
  Directory,
  Profile,
  NotFound,
  Login,
  Resources,
  Issues,
} from './pages';
import Wizard from './wizard';
import { PrivateRoute } from './components';
import 'semantic-ui-css/semantic.min.css';
import './styles/styles.scss';
import Homepage from './pages/home';
import { Providers } from './components/wrapper/Providers';
import { PitchDocPage } from './pages/PitchDoc';

const routes = [
  {
    path: '/home',
    component: Homepage,
  },
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
    component: PitchDocPage,
  },
  {
    path: '/issues',
    component: Issues,
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
    <Providers>
      <Toaster position="bottom-right" />
      <Router>
        <QueryParamProvider ReactRouterRoute={Route}>
          <Switch>
            <Route exact path="/">
              <Redirect to="/login" />
            </Route>
            {routes.map(({ path, component }) => (
              <PrivateRoute
                key={path}
                exact
                path={path}
                component={component}
              />
            ))}
          </Switch>
        </QueryParamProvider>
      </Router>
    </Providers>
  </React.StrictMode>,
  document.getElementById('root'),
);
