import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Home from './pages/Home';
import WizardWrapper from './pages/wizard/WizardWrapper';

import 'semantic-ui-css/semantic.min.css';
import './css/index.css';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/join" component={WizardWrapper} />
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
);
