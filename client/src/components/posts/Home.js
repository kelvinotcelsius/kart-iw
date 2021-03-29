import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import PostPreview from './PostPreview';
import { getMostRecentPosts } from '../../actions/post';
import { getMostLikedPosts } from '../../actions/post';
import GuestSidebar from './GuestSidebar';

const Home = ({
  getMostRecentPosts,
  getMostLikedPosts,
  post: { posts },
  isAuthenticated,
}) => {
  useEffect(() => {
    getMostRecentPosts();
  }, [getMostRecentPosts]);

  const changeFilter = (filter) => {
    if (filter === 'most-recent') {
      getMostRecentPosts();
    } else {
      getMostLikedPosts();
    }
  };

  return (
    <Fragment>
      <div id='home'>
        <div className='main-wrapper'>
          <div className='main-left-wrapper'>
            {isAuthenticated ? <div>Authenticated!</div> : <GuestSidebar />}
            <select
              name='filters'
              id='filter'
              onChange={(e) => changeFilter(e.target.value)}
            >
              <option value='most-recent'>Most recent</option>
              <option value='most-liked'>Most liked</option>
            </select>
          </div>
          <div className='main-right-wrapper'>
            {posts.map((post) => (
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
                showUserData={true}
                showProductData={true}
              />
            ))}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

Home.propTypes = {
  getMostRecentPosts: PropTypes.func.isRequired,
  getMostLikedPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {
  getMostRecentPosts,
  getMostLikedPosts,
})(Home);
