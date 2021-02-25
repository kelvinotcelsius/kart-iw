import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

import VideoPreview from '../shop/VideoPreview';
import GuestSidebar from '../posts/GuestSidebar';
import Spinner from '../layout/Spinner';

import { getPostsbyUserID } from '../../actions/post';
import { getUser } from '../../actions/user';

import './Profile.css';

const Profile = ({
  getPostsbyUserID,
  getUser,
  user,
  post,
  isAuthenticated,
}) => {
  let { user_id } = useParams();
  useEffect(() => {
    async function fetchData() {
      await getUser(user_id);
      await getPostsbyUserID(user_id);
    }
    fetchData();
  }, [getPostsbyUserID, getUser, user_id]);

  return (
    <Fragment>
      <div id='profile'>
        <div className='main-wrapper'>
          <div className='main-left-wrapper'>
            {isAuthenticated ? <div>Authenticated!</div> : <GuestSidebar />}
          </div>
          <div className='main-right-wrapper'>
            {post.loading || user.loading ? (
              <Spinner />
            ) : (
              <Fragment>
                <div className='profile-top-wrapper'>
                  <img
                    id='user-profile-pic'
                    src={user.user.profile_pic}
                    alt='Product'
                  />
                  <div className='basic-info-wrapper'>
                    <p id='username'>{user.user.username}</p>
                    <p id='name'>
                      {user.user.first} {user.user.last}
                    </p>
                    <p id='bio'>{user.user.bio}</p>
                    <div className='user-stats-wrapper'>
                      <div className='stat-wrapper'>
                        <span className='stat-number'>
                          {user.user.follower_count}
                        </span>
                        <span className='stat-label'>followers</span>
                      </div>
                      <div className='stat-wrapper'>
                        <span className='stat-number'>
                          {user.user.likes_count}
                        </span>
                        <span className='stat-label'>likes</span>
                      </div>
                      <div className='stat-wrapper'>
                        <span className='stat-number'>
                          ${user.user.amount_earned}
                        </span>
                        <span className='stat-label'>earned</span>
                      </div>
                    </div>
                  </div>
                  <button id='follow-btn'>Follow</button>
                </div>
                <div className='three-video-wrapper'>
                  {post.posts.map((post) => (
                    <VideoPreview
                      key={post._id}
                      previewImageURL={post.preview}
                      videoURL={post.video}
                      postID={post._id}
                      creatorID={post.creator_id}
                    />
                  ))}
                </div>
              </Fragment>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

Profile.propTypes = {
  getPostsbyUserID: PropTypes.func.isRequired,
  getUser: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  getProduct: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post,
  user: state.user,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { getPostsbyUserID, getUser })(Profile);
