import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';

import { Directory, Profile, NotFound, PitchDoc, Home, Login } from './pages';
import Resources from './pages/resources';
import WizardWrapper from './wizard';
import { PrivateRoute } from './components';
import { AuthProvider } from './contexts';
import './styles/styles.scss';

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <Switch>
          <PrivateRoute exact path="/logout" component={Home} />
          <PrivateRoute exact path="/pitches" component={PitchDoc} />
          <PrivateRoute exact path="/resources" component={Resources} />
          <PrivateRoute exact path="/profile/:userId" component={Profile} />
          <PrivateRoute exact path="/users" component={Directory} />
          <PrivateRoute exact path="*" component={NotFound} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/join" component={WizardWrapper} />
        </Switch>
      </Router>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
