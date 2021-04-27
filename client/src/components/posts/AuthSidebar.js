import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import userIcon from '../../assets/images/icons/user.svg';
import homeIcon from '../../assets/images/icons/home.svg';

const AuthSidebar = ({ changeFilter, setAll, all, following }) => {
  return (
    <Fragment>
      <div id='sidebar'>
        <div
          className={`video-option-wrapper ${all ? 'selected' : ''}`}
          onClick={() => changeFilter('all')}
        >
          <img
            className='video-option-icon'
            src={homeIcon}
            alt='home icon'
          ></img>
          <span className='video-option-label'>For You</span>
        </div>
        <div
          className={`video-option-wrapper ${following ? 'selected' : ''}`}
          onClick={() => changeFilter('following')}
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

AuthSidebar.propTypes = {
  changeFilter: PropTypes.func.isRequired,
  setAll: PropTypes.func.isRequired,
  following: PropTypes.bool.isRequired,
  all: PropTypes.bool.isRequired,
};

export default AuthSidebar;
