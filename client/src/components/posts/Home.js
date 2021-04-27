import React, { Fragment, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import PostPreview from './PostPreview';
import {
  getMostRecentPostsAll,
  getMostLikedPostsAll,
  getMostRecentPostsFollowing,
  getMostLikedPostsFollowing,
} from '../../actions/post';
import GuestSidebar from './GuestSidebar';
import AuthSidebar from './AuthSidebar';

// const segment = posts.slice(0, parseInt(endIndex) + 1);

const Home = ({
  getMostRecentPostsAll,
  getMostLikedPostsAll,
  getMostRecentPostsFollowing,
  getMostLikedPostsFollowing,
  post: { posts },
  isAuthenticated,
}) => {
  const VIDEOS_PER_LOAD = 3;
  const MAX_VIDEOS_PER_PAGE = 12;
  const [endIndex, setEndIndex] = useState(VIDEOS_PER_LOAD - 1);

  const [all, setAll] = useState(true);
  const [following, setFollowing] = useState(false);
  const [recent, setRecent] = useState(true);
  const [liked, setLiked] = useState(false);

  const loadVideos = useCallback(async () => {
    if (recent && all) {
      console.log('recent all');
      await getMostRecentPostsAll();
    }
    if (liked && all) {
      console.log('liked all');
      await getMostLikedPostsAll();
    }
    if (recent && following) {
      console.log('recent following');
      await getMostRecentPostsFollowing();
    }
    if (liked && following) {
      console.log('liked following');
      await getMostLikedPostsFollowing();
    }
  }, [
    recent,
    all,
    liked,
    following,
    getMostLikedPostsAll,
    getMostRecentPostsAll,
    getMostLikedPostsFollowing,
    getMostRecentPostsFollowing,
  ]);

  const changeFilter = useCallback(
    async (filter) => {
      console.log(filter);
      if (filter === 'liked') {
        setRecent(false);
        setLiked(true);
      }
      if (filter === 'recent') {
        setRecent(true);
        setLiked(false);
      }
      if (filter === 'following') {
        setFollowing(true);
        setAll(false);
      }
      if (filter === 'all') {
        setFollowing(false);
        setAll(true);
      }

      await loadVideos();
    },
    [setRecent, setLiked, setFollowing, setAll, loadVideos]
  );

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  const showMore = () => {
    console.log(posts.length);
    console.log(endIndex);
    setEndIndex(endIndex + VIDEOS_PER_LOAD);
  };

  return (
    <Fragment>
      <div id='home'>
        <div className='main-wrapper'>
          <div className='main-left-wrapper'>
            {isAuthenticated ? (
              <AuthSidebar
                changeFilter={changeFilter}
                all={all}
                setAll={setAll}
                following={following}
              />
            ) : (
              <GuestSidebar />
            )}
          </div>
          <div className='main-right-wrapper'>
            <div className='filter-wrapper'>
              <span
                className={`filter-selector ${recent ? 'selected' : ''}`}
                onClick={() => changeFilter('recent')}
              >
                Most recent
              </span>
              <span
                className={`filter-selector ${liked ? 'selected' : ''}`}
                onClick={() => changeFilter('liked')}
              >
                Most liked
              </span>
            </div>
            <div className='main-three-videos-wrapper'>
              {posts.slice(0, parseInt(endIndex) + 1).map((post) => (
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
            {posts.length > endIndex + 1 &&
            endIndex + 1 <= MAX_VIDEOS_PER_PAGE ? (
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
  getMostRecentPostsAll: PropTypes.func.isRequired,
  getMostLikedPostsAll: PropTypes.func.isRequired,
  getMostRecentPostsFollowing: PropTypes.func.isRequired,
  getMostLikedPostsFollowing: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {
  getMostRecentPostsAll,
  getMostLikedPostsAll,
  getMostRecentPostsFollowing,
  getMostLikedPostsFollowing,
})(Home);
