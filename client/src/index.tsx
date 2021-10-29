import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
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
import { PrivateRoute } from './components';
import { AuthProvider, TeamsProvider, InterestsProvider } from './contexts'; 

import './styles/styles.scss';

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <InterestsProvider>
      <TeamsProvider>
        <Router>
          <Switch>
            <Route exact path="/">
              <Redirect to="/login" />
            </Route>
            <PrivateRoute exact path="/pitches" component={PitchDoc} />
            <PrivateRoute exact path="/resources" component={Resources} />
            <PrivateRoute exact path="/profile/:userId" component={Profile} />
            <PrivateRoute exact path="/users" component={Directory} />
            <PrivateRoute exact path="/login" component={Login} />
            <PrivateRoute exact path="/join" component={Wizard} />
            <PrivateRoute exact path="*" component={NotFound} />
          </Switch>
        </Router>
      </TeamsProvider>
      </InterestsProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
