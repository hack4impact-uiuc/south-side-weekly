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

axios.defaults.withCredentials = true;

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/join" component={WizardWrapper} />
        <Route exact path="/pitches" component={PitchDoc} />
        <Route exact path="/resource" component={ResourcePage} />
        <Route exact path="/resources" component={ResourcePage} />
        <Route exact path="/profile/:userId" component={Profile} />
        <Route exact path="/users" component={Directory} />
        <Route exact path="/login" component={Login} />
        <Route exact path="*" component={NotFound} />
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
);
