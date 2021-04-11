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
  const VIDEOS_PER_PAGE = 3;
  const [endIndex, setEndIndex] = useState(VIDEOS_PER_PAGE - 1);

  useEffect(() => {
    getMostRecentPosts(endIndex);
  }, [getMostRecentPosts, endIndex]);

  const [recent, setRecent] = useState(true);
  const [liked, setLiked] = useState(false);

  const changeFilter = (filter) => {
    if (filter === 'most-recent') {
      getMostRecentPosts(endIndex);
      setLiked(false);
      setRecent(true);
    } else {
      getMostLikedPosts(endIndex);
      setRecent(false);
      setLiked(true);
    }
  };

  const showMore = () => {
    setEndIndex(endIndex + VIDEOS_PER_PAGE - 1);
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
            {endIndex < 31 ? (
              <div className='show-more-wrapper'>
                <button className='show-more-btn' onClick={() => showMore()}>
                  Show more
                </button>
              </div>
            ) : (
              <Fragment></Fragment>
            )}
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
