import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';

import Home from './pages/Home';
import PitchDoc from './pages/pitchDoc/PitchDoc';
import WizardWrapper from './pages/wizard/WizardWrapper';
import ResourcePage from './pages/ResourcePage';

import './css/index.css';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/join" component={WizardWrapper} />
        <Route exact path="/pitchDoc" component={PitchDoc} />
        <Route exact path="/resource" component={ResourcePage} />
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
);
