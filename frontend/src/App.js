import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import TopBar from './TopBar/TopBar';
import BottomBar from './BottomBar/BottomBar';
import RawData from './Tabs/RawData/RawData';
import './App.css';

import 'semantic-ui-css/semantic.min.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <TopBar />
          <div id="content">
            <Route exact path="/" render={() => <Redirect to="/raw" />} />
            <Route path="/box" component={RawData} />
            <Route path="/scatter" component={RawData} />
            <Route path="/time" component={RawData} />
            <Route path="/login" component={RawData} />
            <Route path="/raw" component={RawData} />
          </div>
          <BottomBar />
        </div>
      </Router>
    );
  }
}

export default App;
