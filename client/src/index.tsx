import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import axios from 'axios';

import Home from './pages/Home';
import Profile from './pages/profile/Profile';
import Login from './pages/Login';
import WizardWrapper from './pages/wizard/WizardWrapper';
import ResourcePage from './pages/ResourcePage';

import './css/index.css';

axios.defaults.withCredentials = true;

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/join" component={WizardWrapper} />
        <Route exact path="/resources" component={ResourcePage} />
        <Route exact path="/profile" component={Profile} />
        <Route exact path="/login" component={Login} />
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
);
