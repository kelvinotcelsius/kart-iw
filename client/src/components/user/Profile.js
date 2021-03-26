import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useParams, Redirect } from 'react-router-dom';

import ProfileVideoPreview from './ProfileVideoPreview';
import GuestSidebar from '../posts/GuestSidebar';

import spinnerGIF from '../layout/spinner.gif';
import Spinner from '../layout/Spinner';

import { getPostsbyUserID } from '../../actions/post';
import { getUser } from '../../actions/user';
import { setAlert } from '../../actions/alert';

import api from '../../utils/api';

import './Profile.css';

const Profile = ({ getPostsbyUserID, getUser, user, post, auth, setAlert }) => {
  let { user_id } = useParams();

  useEffect(() => {
    async function fetchData() {
      await getPostsbyUserID(user_id);
      await getUser(user_id);
    }
    fetchData();
  }, [getPostsbyUserID, getUser, user_id]);

  const [paymentProcessing, setProcessing] = useState(false);

  const handleFollow = async () => {
    if (auth.user === null) {
      setAlert('Please sign in to follow users', 'danger');
      return;
    }
  };

  const requestPayout = async () => {
    if (user.user.payout < 1) {
      setAlert(
        'You can only request a payout if you have more than $1.',
        'danger'
      );
      return;
    }

    setProcessing(true);
    // Check if user already has Stripe account
    const stripeRes = await api.get('/shop/stripe');
    // If not, redirect to register account form
    if (!stripeRes.data.success) {
      setProcessing(false);
      <Redirect to='/update-stripe' />;
    } else {
      // If so, check if transfers are enabled
      const transfersRes = await api.get('/shop/stripe-transfers-active');
      // If transfers are not active, return error msg
      if (!transfersRes.data.success) {
        setProcessing(false);
        setAlert(
          'Your Stripe account is not configured for transfers. Please contact zkyu@princeton.edu',
          'danger'
        );
      } else {
        // If transfers are active, initiate payout
        const res = await api.post('/shop/payout');
        setProcessing(false);
        setAlert(res.data, 'success');
      }
    }
  };

  return (
    <Fragment>
      {user.loading === false && !user.user ? (
        <Redirect to='/' />
      ) : (
        <div id='profile'>
          <div className='main-wrapper'>
            <div className='main-left-wrapper'>
              {auth.isAuthenticated ? (
                <div>Authenticated!</div>
              ) : (
                <GuestSidebar />
              )}
            </div>
            <div className='main-right-wrapper'>
              {post.loading || user.loading || auth.loading ? (
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
                    {auth.user != null && user.user._id === auth.user._id ? (
                      <Fragment>
                        {!paymentProcessing ? (
                          <button
                            className='action-btn'
                            onClick={() => requestPayout()}
                          >
                            Request ${user.user.payout} payout
                          </button>
                        ) : (
                          <img
                            src={spinnerGIF}
                            style={{
                              width: '75px',
                              height: '75px',
                              margin: '10px 0 10px 30px',
                              padding: '0px',
                              display: 'block',
                            }}
                            alt='Loading...'
                          />
                        )}
                      </Fragment>
                    ) : (
                      <button
                        className='action-btn'
                        onClick={() => handleFollow()}
                      >
                        Follow
                      </button>
                    )}
                  </div>
                  <div className='three-video-wrapper'>
                    {post.posts.map((post) => (
                      <ProfileVideoPreview
                        key={post._id}
                        previewImageURL={post.preview}
                        videoURL={post.video}
                        postID={post._id}
                        creatorID={post.creator_id}
                        productID={post.product_id}
                      />
                    ))}
                    {post.posts.length === 0 ? (
                      <p style={{ marginTop: '2.5em' }}>
                        User has not posted any videos yet.
                      </p>
                    ) : (
                      <Fragment></Fragment>
                    )}
                  </div>
                </Fragment>
              )}
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

Profile.propTypes = {
  getPostsbyUserID: PropTypes.func.isRequired,
  getUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  setAlert: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post,
  user: state.user,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  getPostsbyUserID,
  getUser,
  setAlert,
})(Profile);
