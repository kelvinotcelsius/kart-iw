import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import './App.css';

// Custom routing
import PrivateRoute from './components/routing/PrivateRoute';
import Route from './components/routing/Route';

// Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

// Layout
import Landing from './components/layout/Landing';
import Navbar from './components/layout/Navbar';
import Alert from './components/layout/Alert';

// User
import FinishRegistrationForm from './components/auth/FinishRegistrationForm';

const App = () => {
  useEffect(() => {
    // Check if there's a token. If there is, put it in the global axios header
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

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
              <Route exact path='/' component={Landing} />
              <Route exact path='/hi' component={Landing} />
              <PrivateRoute exact path='/bingeable' component={Landing} />
              <PrivateRoute
                exact
                path='/finish-registration'
                component={FinishRegistrationForm}
              />
            </Switch>
          </div>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
