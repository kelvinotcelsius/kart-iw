import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import PostPreview from './PostPreview';
import { getPosts } from '../../actions/post';
import GuestSidebar from './GuestSidebar';

const MostLikedPosts = ({ getPosts, post: { posts }, isAuthenticated }) => {
  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return (
    <Fragment>
      <div id='home'>
        <div className='main-wrapper'>
          <div className='main-left-wrapper'>
            {isAuthenticated ? <div>Authenticated!</div> : <GuestSidebar />}
          </div>
          <div className='main-right-wrapper'>
            {posts
              .slice(0) // Make a copy of the posts array then iterate in reverse order
              .reverse()
              .map((post) => (
                <PostPreview
                  key={post._id}
                  caption={post.caption}
                  postURL={post.url}
                  previewImageURL={post.preview}
                  videoURL={post.video}
                  postID={post._id}
                  creatorID={post.creator_id}
                  productID={post.product_id}
                  likes={post.likes}
                />
              ))}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

MostLikedPosts.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { getPosts })(MostLikedPosts);
