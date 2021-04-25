import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import redHeart from '../../assets/images/icons/filled-red-heart.svg';
import emptyHeart from '../../assets/images/icons/unfilled-white-heart.svg';

import { updateLikes } from '../../actions/post';
import { setAlert } from '../../actions/alert';

import VideoPreview from './VideoPreview';
import Spinner from '../layout/Spinner';

import api from '../../utils/api';

import './Post.css';

const MAX_LENGTH = 18;

const PostPreview = ({
  caption,
  postID,
  creatorID,
  previewImageURL,
  videoURL,
  productID,
  likes,
  updateLikes,
  auth,
  setAlert,
  showUserData,
  showProductData,
}) => {
  const [authUserId, setAuthUserId] = useState('');
  const [creator, setCreator] = useState('');
  const [product, setProduct] = useState('');

  useEffect(() => {
    async function initializeData() {
      const creatorData = await api.get(`/users/${creatorID}`);
      setCreator(creatorData.data);

      const productData = await api.get(`/products/${productID}`);
      setProduct(productData.data);

      if (auth.user) {
        setAuthUserId(auth.user._id);
      }
    }
    initializeData();
  }, [creatorID, productID, auth.user]);

  const handleLikes = (postID) => {
    if (!auth.isAuthenticated) {
      setAlert(
        `Please sign up or log in to like ${creator.username}'s post`,
        'danger'
      );
    } else {
      updateLikes(postID);
    }
  };

  return (
    <Fragment>
      {auth.loading || creator === '' || product === '' ? (
        <Spinner />
      ) : (
        <div className='preview-post-wrapper'>
          <div
            className={`preview-top-wrapper ${showUserData ? 'show' : 'hide'}`}
          >
            <div className='preview-user-wrapper'>
              <Link to={`/user/${creatorID}`}>
                <img
                  className='preview-profile-pic'
                  src={creator.profile_pic}
                  alt='profile'
                />
              </Link>
              <div className='preview-user-metadata'>
                <div className='preview-username'>
                  <Link to={`/user/${creatorID}`}>
                    <span className='username'>{creator.username}</span>
                  </Link>
                </div>
                <div className='preview-caption'>
                  <span>
                    {caption.length > MAX_LENGTH
                      ? caption.substring(0, MAX_LENGTH).concat('...')
                      : caption}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <VideoPreview
            previewImageURL={previewImageURL}
            videoURL={videoURL}
            creatorID={creatorID}
            postID={postID}
          />
          <Link to={`/product/${productID}`}>
            <div
              className={`product-wrapper ${showProductData ? 'show' : 'hide'}`}
            >
              <div className='img-text-wrapper'>
                <img
                  className='product-image'
                  src={product.picture}
                  alt='product'
                />
                <p className='product-name'>
                  {product.name.length > MAX_LENGTH
                    ? product.name.substring(0, MAX_LENGTH).concat('...')
                    : product.name}
                </p>
              </div>
              <p className='product-price'>${product.price}</p>
            </div>
          </Link>
          <div className='post-stats'>
            <div className='metadata-wrapper'>
              <div className='img-text-wrapper'>
                <img
                  className='like-btn'
                  alt='like button'
                  src={likes.includes(authUserId) ? redHeart : emptyHeart}
                  onClick={() => handleLikes(postID)}
                ></img>
                <span className='likes-count'>{likes.length}</span>
              </div>
              <span className='purchased-count'>
                {product.total_purchased} bought
              </span>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

PostPreview.propTypes = {
  updateLikes: PropTypes.func.isRequired,
  caption: PropTypes.string.isRequired,
  postID: PropTypes.string.isRequired,
  creatorID: PropTypes.string.isRequired,
  previewImageURL: PropTypes.string.isRequired,
  videoURL: PropTypes.string.isRequired,
  productID: PropTypes.string.isRequired,
  likes: PropTypes.array.isRequired,
  auth: PropTypes.object.isRequired,
  showUserData: PropTypes.bool.isRequired,
  showProductData: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { updateLikes, setAlert })(PostPreview);
