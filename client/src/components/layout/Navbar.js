import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Popup from 'reactjs-popup';

import Login from '../auth/Login';
import Register from '../auth/Register';

import './Layout.css';

const Navbar = () => {
  const [loginModal, changeModal] = useState(true); // true = show login modal, false = show sign in modal

  const guestLinks = (
    <Popup
      modal
      className='popup'
      contentStyle={{
        borderRadius: '10px',
        height: '600px',
        overflowY: 'auto',
        textAlign: 'center',
        backgroundColor: 'white',
        border: '1px solid ',
      }}
      trigger={
        <div className='nav-btn-wrapper'>
          <button className='nav-btn'>Log in</button>
        </div>
      }
    >
      {loginModal === true ? (
        <Login changeModal={changeModal} />
      ) : (
        <Register changeModal={changeModal} />
      )}
    </Popup>
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
