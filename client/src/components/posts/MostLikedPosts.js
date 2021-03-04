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
      <div className='main-wrapper'>
        <div className='main-left-wrapper'>
          {isAuthenticated ? <div>Authenticated!</div> : <GuestSidebar />}
        </div>
        <div className='main-right-wrapper'>
          {posts.map((post) => (
            <PostPreview
              key={post._id}
              profPic={post.creator_profile_pic}
              username={post.creator_username}
              caption={post.caption}
              postURL={post.url}
              previewImageURL={post.preview}
              videoURL={post.video}
              postID={post._id}
              creatorID={post.creator_id}
              productName={post.product_name}
              productPic={post.product_picture}
              productID={post.product_id}
              likes={post.likes}
            />
          ))}
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
