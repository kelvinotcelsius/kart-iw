import React, { Fragment, useEffect, useState } from 'react';
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

  const [recent, setRecent] = useState(true);
  const [liked, setLiked] = useState(false);

  const changeFilter = (filter) => {
    if (filter === 'most-recent') {
      getMostRecentPosts();
      setLiked(false);
      setRecent(true);
    } else {
      getMostLikedPosts();
      setRecent(false);
      setLiked(true);
    }
  };

  return (
    <Fragment>
      <div id='home'>
        <div className='main-wrapper'>
          <div className='main-left-wrapper'>
            {isAuthenticated ? <div>Authenticated!</div> : <GuestSidebar />}
          </div>
          <div className='main-right-wrapper'>
            <div className='filter-wrapper'>
              <span
                className={`filter-selector ${recent ? 'selected' : ''}`}
                onClick={() => changeFilter('most-recent')}
              >
                Most recent
              </span>
              <span
                className={`filter-selector ${liked ? 'selected' : ''}`}
                onClick={() => changeFilter('most-liked')}
              >
                Most liked
              </span>
            </div>
            <div className='main-three-videos-wrapper'>
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
