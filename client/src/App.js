import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Switch, useLocation } from 'react-router-dom';
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

// Posts
import UploadForm from './components/posts/UploadForm';
import PostModal from './components/posts/PostModal';

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
        <Routes />
      </Router>
    </Provider>
  );
};

// Taken from https://reactrouter.com/web/example/modal-gallery
const Routes = () => {
  let location = useLocation();
  let background = {
    pathname: '/',
  };
  if (location.state && location.state.background) {
    background = location.state && location.state.background;
  }

  console.log(background);

  return (
    <Fragment>
      <div id='container'>
        <Navbar />
        <Alert />
        <Switch location={location || background}>
          <Route exact path='/' component={Landing} />
          <PrivateRoute exact path='/upload' component={UploadForm} />
          <PrivateRoute
            exact
            path='/finish-registration'
            component={FinishRegistrationForm}
          />
          {background && (
            <Route
              exact
              path='/:creator_id/:post_id'
              children={<PostModal background={background} />}
            />
          )}
        </Switch>
      </div>
    </Fragment>
  );
};

export default App;
