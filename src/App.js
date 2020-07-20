import React from 'react';
import { Router, Route } from 'react-router-dom';

import './App.css';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import { history } from './helpers/services/history';
import { PrivateRoute } from './helpers/components/PrivateRoute';

function App() {
  return (
    <div id="App">
       <Router history={history}>
					<div>
						<PrivateRoute exact path="/" component={HomePage} />
						<Route path="/login" component={LoginPage} />
					</div>
			</Router>
    </div>
  );
}

export default App;
