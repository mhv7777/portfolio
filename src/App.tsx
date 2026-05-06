import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import ProjectDetail from './pages/ProjectDetail';
import Info from './pages/Info';

const App = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/admin" component={Admin} />
      <Route path="/projects/:id" component={ProjectDetail} />
      <Route path="/info" component={Info} />
    </Switch>
  </Router>
);

export default App;