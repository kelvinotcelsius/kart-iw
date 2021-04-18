import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useParams, Redirect, Link } from 'react-router-dom';

// import ProfileVideoPreview from './ProfileVideoPreview';
import GuestSidebar from '../posts/GuestSidebar';
import PostPreview from '../posts/PostPreview';

import spinnerGIF from '../layout/spinner.gif';
import Spinner from '../layout/Spinner';

import { getPostsbyUserID } from '../../actions/post';
import { getUser } from '../../actions/user';
import { followUser } from '../../actions/user';
import { setAlert } from '../../actions/alert';

import api from '../../utils/api';

import './Profile.css';

const Profile = ({
  getPostsbyUserID,
  getUser,
  user,
  post,
  auth,
  setAlert,
  followUser,
}) => {
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
    } else {
      followUser(user_id);
    }
  };

  const requestPayout = async () => {
    // If the user doesn't have a stripe ID, then they need to create a Stripe Connect account
    if (!auth.user.stripe_id) {
      setAlert(
        'You must create a Stripe account in order to request a payout',
        'danger'
      );
      return;
    }

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
        try {
          const res = await api.post('/shop/payout');
          setProcessing(false);
          setAlert(res.data, 'success');
        } catch (err) {
          setAlert('Server error, please try again later.', 'danger');
        }
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
                    <div className='upper-wrapper'>
                      <div className='basic-info-wrapper'>
                        <img
                          id='user-profile-pic'
                          src={user.user.profile_pic}
                          alt='Product'
                        />
                        <div className='name-wrapper'>
                          <p id='username'>{user.user.username}</p>
                          <p id='name'>
                            {user.user.first} {user.user.last}
                          </p>
                          <p id='bio'>{user.user.bio}</p>
                        </div>
                      </div>
                      <div className='profile-btn'>
                        {auth.user != null &&
                        user.user._id === auth.user._id ? (
                          <Fragment>
                            {!paymentProcessing ? (
                              <Fragment>
                                <button
                                  className='action-btn'
                                  onClick={() => requestPayout()}
                                >
                                  Request ${user.user.payout} payout
                                </button>
                                {!auth.user.stripe_id ? (
                                  <Link to='/edit-stripe'>
                                    <button className='action-btn'>
                                      Create Stripe account
                                    </button>
                                  </Link>
                                ) : (
                                  <Fragment></Fragment>
                                )}
                              </Fragment>
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
                          <Fragment>
                            {auth.user &&
                            auth.user.following.includes(user.user._id) &&
                            user.user.followers.includes(auth.user._id) ? (
                              <button
                                className='action-btn filled'
                                onClick={() => handleFollow()}
                              >
                                Following
                              </button>
                            ) : (
                              <button
                                className='action-btn'
                                onClick={() => handleFollow()}
                              >
                                Follow
                              </button>
                            )}
                          </Fragment>
                        )}
                      </div>
                    </div>
                    <div className='user-stats-wrapper'>
                      <div className='stat-wrapper'>
                        <span className='stat-number'>
                          {user.user.followers.length}
                        </span>
                        <span className='stat-label'>followers</span>
                      </div>
                      <div className='stat-wrapper'>
                        <span className='stat-number'>
                          {user.user.following.length}
                        </span>
                        <span className='stat-label'>following</span>
                      </div>
                      <div className='stat-wrapper'>
                        <span className='stat-number'>
                          {user.user.likes.length}
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
                  <div className='three-video-wrapper'>
                    {post.posts.map((post) => (
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
                        showUserData={false}
                        showProductData={true}
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
  followUser: PropTypes.func.isRequired,
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
  followUser,
})(Profile);
