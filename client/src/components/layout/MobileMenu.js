import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Popup from 'reactjs-popup';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Login from '../auth/Login';
import Register from '../auth/Register';

import { logout } from '../../actions/auth';

import menuIcon from '../../assets/images/icons/menu.svg';
import closeIcon from '../../assets/images/icons/close.svg';
// import uploadIcon from '../../assets/images/icons/upload.svg';

const MobileMenu = ({ auth: { isAuthenticated, user }, logout }) => {
  const [authMenuState, showAuthMenu] = useState(false);
  const [guestMenuState, showGuestMenu] = useState(false);
  const [userID, setUserID] = useState(null);
  const [profPicURL, setProfPicURL] = useState(
    'https://kart-iw.s3.amazonaws.com/default_prof_pic.png'
  );
  const [loginModal, changeModal] = useState(true);
  const [modalStatus, showModal] = useState(false);
  const closeModal = () => showModal(false);

  useEffect(() => {
    // Make sure the profile picure is updated
    if (user) {
      setProfPicURL(user.profile_pic);
      setUserID(user._id);
    }
  }, [user]);

  const showMenu = (type) => {
    if (type === 'guest') {
      showGuestMenu(!guestMenuState);
      showAuthMenu(false);
    } else {
      showAuthMenu(!authMenuState);
      showGuestMenu(false);
    }
  };

  const handleAuth = (type) => {
    if (type === 'logout') {
      showGuestMenu(false);
      showAuthMenu(false);
      logout();
    }
  };

  const guestLinks = (
    <ul className='nav-items'>
      <li className='nav-item' onClick={() => showModal(!modalStatus)}>
        Log in
      </li>
      <div className='modal'>
        <Popup
          className='popup'
          open={modalStatus}
          onClose={closeModal}
          closeOnDocumentClick
          contentStyle={{
            borderRadius: '10px',
            height: '600px',
            overflowY: 'auto',
            textAlign: 'center',
            backgroundColor: 'white',
            border: '1px solid ',
          }}
        >
          {loginModal === true ? (
            <Login
              changeModal={changeModal}
              closeModal={closeModal}
              showGuestMenu={showGuestMenu}
            />
          ) : (
            <Register
              changeModal={changeModal}
              closeModal={closeModal}
              showGuestMenu={showGuestMenu}
            />
          )}
        </Popup>
      </div>
    </ul>
  );

  const authLinks = (
    <ul className='nav-items'>
      <li className='nav-item'>
        <Link to='/upload'>
          {/* <img id='upload-icon' src={uploadIcon} alt='upload icon'></img> */}
          Upload video
        </Link>
      </li>
      <li className='nav-item'>
        <Link to={`/user/${userID}`}>My profile</Link>
      </li>
      <li className='nav-item'>
        <Link to='/edit-stripe'>Create or edit Stripe account</Link>
      </li>
      <li className='nav-item' onClick={() => handleAuth('logout')}>
        Logout
      </li>
    </ul>
  );

  return (
    <Fragment>
      {isAuthenticated ? (
        <img
          className='profile-pic'
          alt='profile pic'
          src={profPicURL}
          onClick={() => showMenu('auth')}
        />
      ) : (
        <img
          className='menu-pic'
          alt='menu pic'
          src={!authMenuState && !guestMenuState ? menuIcon : closeIcon}
          onClick={() => showMenu('guest')}
        />
      )}
      <nav id='mobile-nav-wrapper'>
        {authMenuState && authLinks}
        {guestMenuState && guestLinks}
      </nav>
    </Fragment>
  );
};

MobileMenu.propTypes = {
  auth: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(MobileMenu);
