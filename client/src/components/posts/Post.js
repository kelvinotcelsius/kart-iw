import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';

import { getPost } from '../../actions/post';

import Spinner from '../layout/Spinner';

const Post = ({ getPost, post: { post, loading }, match }) => {
  const history = useHistory();
  useEffect(() => {
    getPost(match.params.post_id);
  }, [getPost, match.params.post_id]);

  return loading || post === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <button
        className='back-btn'
        onClick={() => {
          history.goBack();
        }}
      ></button>
    </Fragment>
  );
};

Post.propTypes = {
  getPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post,
});

export default connect(mapStateToProps, { getPost })(Post);
