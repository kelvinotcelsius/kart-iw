import React, { Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';

import VideoPreview from './VideoPreview';
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
}) => {
  let location = useLocation();

  return (
    <Fragment>
      <div className='preview-post-wrapper'>
        <div className='preview-top-wrapper'>
          <div className='preview-left-wrapper'>
            <img className='preview-profile-pic' src={profPic} alt='profile' />
            <div className='preview-user-metadata'>
              <div className='preview-username'>
                <span>{username}</span>
              </div>
              <div className='preview-caption'>
                <span>{caption}</span>
              </div>
            </div>
          </div>
          <div className='preview-right-wrapper'>
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
    </Fragment>
  );
};

export default PostPreview;
