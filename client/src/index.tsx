import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import axios from 'axios';

import {
  Directory,
  Profile,
  NotFound,
  PitchDoc,
  Home,
  ResourcePage,
  Login,
} from './pages';
import WizardWrapper from './wizard';
import './styles.css';
import { AuthProvider } from './contexts';
import PrivateRoute from './components/PrivateRoute';

axios.defaults.withCredentials = true;

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <Switch>
          <PrivateRoute exact path="/logout" component={Home} />
          <PrivateRoute exact path="/pitches" component={PitchDoc} />
          <PrivateRoute exact path="/resources" component={ResourcePage} />
          <PrivateRoute exact path="/profile/:userId" component={Profile} />
          <PrivateRoute exact path="/users" component={Directory} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/join" component={WizardWrapper} />
          <Route exact path="*" component={NotFound} />
        </Switch>
      </Router>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
