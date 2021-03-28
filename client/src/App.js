import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import './App.css';

// Custom routing
import PrivateRoute from './components/routing/PrivateRoute';
import PublicRoute from './components/routing/PublicRoute';
import ScrollToTop from './components/routing/ScrollToTop';

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
import Profile from './components/user/Profile';
import EditStripeAccount from './components/user/EditStripeAccount';

// Posts
import UploadForm from './components/posts/UploadForm';
import Post from './components/posts/Post';

// Products
import Product from './components/shop/Product';

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
        <ScrollToTop>
          <Routes />
        </ScrollToTop>
      </Router>
    </Provider>
  );
};

// Taken from https://reactrouter.com/web/example/modal-gallery
const Routes = () => {
  return (
    <Fragment>
      <div id='container'>
        <Navbar />
        <Alert />
        <Switch>
          <PublicRoute exact path='/' component={Landing} />
          <PublicRoute exact path='/product/:product_id' component={Product} />
          <PublicRoute exact path='/user/:user_id' component={Profile} />
          <PrivateRoute exact path='/upload' component={UploadForm} />
          <PrivateRoute
            exact
            path='/finish-registration'
            component={FinishRegistrationForm}
          />
          <PublicRoute exact path='/:creator_id/:post_id' component={Post} />
          <PrivateRoute
            exact
            path='/edit-stripe'
            component={EditStripeAccount}
          />
          <PublicRoute component={Landing} />
        </Switch>
      </div>
    </Fragment>
  );
};

export default App;
