import React, { useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Popup from 'reactjs-popup';

import Login from '../auth/Login';
import Register from '../auth/Register';

import './Layout.css';

const Navbar = () => {
  const [loginModal, changeModal] = useState(true); // true = show login modal, false = show sign in modal

  const [modalStatus, showModal] = useState(false); // true = show modal, false = close modal
  const closeModal = () => showModal(false);

  const guestLinks = (
    <Fragment>
      <div className='nav-btn-wrapper'>
        <button className='nav-btn' onClick={() => showModal((o) => !o)}>
          Log in
        </button>
      </div>
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
            <Login changeModal={changeModal} closeModal={closeModal} />
          ) : (
            <Register changeModal={changeModal} closeModal={closeModal} />
          )}
        </Popup>
      </div>
    </Fragment>
  );

  return (
    <nav className='navbar'>
      <div className='navbar-left-wrapper'>
        <h1 className='logo'>
          <Link to='/'>KART</Link>
        </h1>
        <ul className='nav-items'>
          <li className='nav-item'>
            <Link className='nav-primary-link' to='/bingeable'>
              BINGEABLE
            </Link>
            <div className='nav-secondary-menu'>
              <Link className='nav-secondary-link' to='/favorites'>
                Favorites
              </Link>
              <Link className='nav-secondary-link' to='/chips'>
                Chips
              </Link>
              <Link className='nav-secondary-link' to='/fruit'>
                Fruit
              </Link>
            </div>
          </li>
          <li className='nav-item'>
            <Link className='nav-primary-link' to='/bingeable'>
              BINGEABLE
            </Link>
            <div className='nav-secondary-menu'>
              <Link className='nav-secondary-link' to='/favorites'>
                Favorites
              </Link>
              <Link className='nav-secondary-link' to='/chips'>
                Chips
              </Link>
              <Link className='nav-secondary-link' to='/fruit'>
                Fruit
              </Link>
            </div>
          </li>
          <li className='nav-item'>
            <Link className='nav-primary-link' to='/bingeable'>
              BINGEABLE
            </Link>
            <div className='nav-secondary-menu'>
              <Link className='nav-secondary-link' to='/favorites'>
                Favorites
              </Link>
              <Link className='nav-secondary-link' to='/chips'>
                Chips
              </Link>
              <Link className='nav-secondary-link' to='/fruit'>
                Fruit
              </Link>
            </div>
          </li>
        </ul>
      </div>
      <div className='navbar-right-wrapper'>{guestLinks}</div>
    </nav>
  );
};

export default Navbar;
