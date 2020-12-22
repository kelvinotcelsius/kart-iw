import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';

// Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

// Layout
import Landing from './components/layout/Landing';
import Navbar from './components/layout/Navbar';
import Alert from './components/layout/Alert';

// Auth
import FinishRegistration from './components/auth/FinishRegistration';
import PrivateRoute from './components/routing/PrivateRoute';

// Check if there's a token. If there is, put it in the global axios header
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <div id='container'>
            <Navbar />
            <Alert />
            <Switch>
              <Route exact path='/landing' component={Landing} />
              <PrivateRoute
                exact
                path='/finish-registration'
                component={FinishRegistration}
              />
            </Switch>
          </div>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
