import React, { Fragment, useState } from 'react';

import userIcon from '../../assets/images/icons/user.svg';
import homeIcon from '../../assets/images/icons/home.svg';

const AuthSidbar = () => {
  const [videoOption, setVideoOption] = useState(true); // true = for you, false = following
  return (
    <Fragment>
      <div id='sidebar'>
        <div
          className={`video-option-wrapper ${videoOption ? 'selected' : ''}`}
          onClick={() => setVideoOption(true)}
        >
          <img
            className='video-option-icon'
            src={homeIcon}
            alt='home icon'
          ></img>
          <span className='video-option-label'>For You</span>
        </div>
        <div
          className={`video-option-wrapper ${!videoOption ? 'selected' : ''}`}
          onClick={() => setVideoOption(false)}
        >
          <img
            className='video-option-icon'
            src={userIcon}
            alt='user icon'
          ></img>
          <span className='video-option-label'>Following</span>
        </div>
      </div>
    </Fragment>
  );
};

export default AuthSidbar;
