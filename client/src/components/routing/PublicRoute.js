import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import FinishRegistrationForm from '../auth/FinishRegistrationForm';

// This component is necessary in order to redirect user to finish registration form if not done

const PublicRoute = ({
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
      ) : (
        <Component {...props} />
      )
    }
  />
);

PublicRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PublicRoute);
