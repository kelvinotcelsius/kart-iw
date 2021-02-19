import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import PostPreview from '../posts/PostPreview';
import { getPosts } from '../../actions/post';

const Product = ({ getPosts, post: { posts } }) => {
  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return (
    <Fragment>
      <div className='home-wrapper'>
        <div className='video-preview-wrapper'>
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
            />
          ))}
        </div>
      </div>
    </Fragment>
  );
};

Product.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post,
});

export default connect(mapStateToProps, { getPosts })(Product);
