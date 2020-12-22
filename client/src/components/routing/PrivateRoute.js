import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import FinishRegistrationForm from '../auth/FinishRegistrationForm';

const PrivateRoute = ({
  component: Component,
  auth: { isAuthenticated, loading, registrationFinished },
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) =>
      loading ? (
        <Spinner />
      ) : !registrationFinished && isAuthenticated ? (
        <Redirect exact to='/finish-registration' /> && (
          <FinishRegistrationForm {...props} />
        )
      ) : isAuthenticated ? (
        <Component {...props} />
      ) : (
        <Redirect to='/' />
      )
    }
  />
);

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
