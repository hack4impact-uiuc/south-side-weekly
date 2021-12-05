import React from 'react';
import ReactDOM from 'react-dom';
import { Toaster } from 'react-hot-toast';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import { PrivateRoute, ProviderWrapper } from './components';
import {
  Directory,
  Login,
  NotFound,
  PitchDoc,
  Profile,
  Resources,
} from './pages';
import Homepage from './pages/home';
import ReviewClaim from './pages/reviewClaim';
import './styles/styles.scss';
import Wizard from './wizard';

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
    component: PitchDoc,
  },
  {
    path: '/pitches/reviewClaim/:pitchId',
    component: ReviewClaim,
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
    <ProviderWrapper>
      <Toaster />
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
