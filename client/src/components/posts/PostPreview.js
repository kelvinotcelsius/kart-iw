import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

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
}) => {
  return (
    <Fragment>
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
            <Link to={`/${creatorID}/${postID}`} className='btn-link'>
              View deal
            </Link>
          </button>
        </div>
      </div>
      <div className='preview-video-wrapper'>
        <VideoPreview
          previewImageURL={previewImageURL}
          videoURL={videoURL}
          creatorID={creatorID}
          postID={postID}
        />
        <div className='pause-btn'>
          <button>Hi</button>
        </div>
      </div>
    </Fragment>
  );
};

export default PostPreview;
