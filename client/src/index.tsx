import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';

import Home from './pages/Home';
import WizardWrapper from './pages/wizard/WizardWrapper';
import ResourcePage from './pages/ResourcePage';
import Login from './pages/Login';
import Profile from './pages/profile/Profile';
import Homepage from './pages/homepage/Homepage';

import './css/index.css';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/homepage" component={Homepage} />
        <Route exact path="/join" component={WizardWrapper} />
        <Route exact path="/resources" component={ResourcePage} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/profile" component={Profile} />
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
);
