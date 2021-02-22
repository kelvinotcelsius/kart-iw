import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import MostLikedPosts from '../posts/MostLikedPosts';

const Landing = ({ isAuthenticated }) => {
  return (
    <Fragment>
      <MostLikedPosts auth={isAuthenticated} />
    </Fragment>
  );
};

Landing.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

// see reducers/auth.js for isAuthenticated field in the auth redux field
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

// connect takes in 2 arguments, the first is any state we want to map, and an object with any objects we want to use (props)
// By passing in setAlert as the 2nd argument, we can now call props.setAlert. Pass in props to Landing function (see line 6)
export default connect(mapStateToProps)(Landing);
