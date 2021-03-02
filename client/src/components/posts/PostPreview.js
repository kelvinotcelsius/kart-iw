import React, { Fragment, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import redHeart from '../../assets/images/icons/filled-red-heart.svg';
import emptyHeart from '../../assets/images/icons/unfilled-gray-heart.svg';

import { updateLikes } from '../../actions/post';

import VideoPreview from './VideoPreview';
import Spinner from '../layout/Spinner';

import './Post.css';

const PostPreview = ({
  profPic,
  username,
  caption,
  postID,
  creatorID,
  previewImageURL,
  videoURL,
  productName,
  productPic,
  productID,
  likes,
  updateLikes,
  auth,
}) => {
  useEffect(() => {
    if (auth.user) {
      setAuthUserId(auth.user._id);
    }
  }, [auth]);

  let location = useLocation();
  const [authUserId, setAuthUserId] = useState('');

  return (
    <Fragment>
      {auth.loading ? (
        <Spinner />
      ) : (
        <div className='preview-post-wrapper'>
          <div className='preview-top-wrapper'>
            <div className='preview-left-wrapper'>
              <Link to={`/user/${creatorID}`}>
                <img
                  className='preview-profile-pic'
                  src={profPic}
                  alt='profile'
                />
              </Link>
              <div className='preview-user-metadata'>
                <div className='preview-username'>
                  <Link to={`/user/${creatorID}`}>
                    <span id='username'>{username}</span>
                  </Link>
                </div>
                <div className='preview-caption'>
                  <span>{caption}</span>
                </div>
              </div>
            </div>
            <div className='preview-right-wrapper'>
              <div className='like-wrapper'>
                <img
                  className='like-btn'
                  alt='like button'
                  src={likes.includes(authUserId) ? redHeart : emptyHeart}
                  onClick={() => updateLikes(postID)}
                ></img>
                <p className='likes-count'>{likes.length}</p>
              </div>
              <button className='deal-btn'>
                <Link
                  to={{
                    pathname: `/${creatorID}/${postID}`,
                    state: { background: location },
                  }}
                  className='btn-link'
                >
                  View deal
                </Link>
              </button>
            </div>
          </div>
          <VideoPreview
            previewImageURL={previewImageURL}
            videoURL={videoURL}
            creatorID={creatorID}
            postID={postID}
          />
          <Link to={`/product/${productID}`}>
            <div className='product-wrapper'>
              <img className='product-image' src={productPic} alt='product' />
              <p className='product-name'>{productName}</p>
            </div>
          </Link>
        </div>
      )}
    </Fragment>
  );
};

PostPreview.propTypes = {
  updateLikes: PropTypes.func.isRequired,
  profPic: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired,
  postID: PropTypes.string.isRequired,
  creatorID: PropTypes.string.isRequired,
  previewImageURL: PropTypes.string.isRequired,
  videoURL: PropTypes.string.isRequired,
  productName: PropTypes.string.isRequired,
  productPic: PropTypes.string.isRequired,
  productID: PropTypes.string.isRequired,
  likes: PropTypes.array.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { updateLikes })(PostPreview);
