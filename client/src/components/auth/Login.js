import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import './Auth.css';
import { login } from '../../actions/auth';

const Login = ({ changeModal, closeModal, login, showGuestMenu }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    closeModal(false);
    if (showGuestMenu) {
      showGuestMenu(false);
    }
    login({ email, password });
  };

  return (
    <div id='auth-modal'>
      <h2 className='modal-title'>Log in to Kart</h2>
      <p className='modal-subtitle'>
        Earn money for making videos, comment on posts, and more
      </p>
      <form id='login-form' onSubmit={(e) => onSubmit(e)}>
        <div className='form-field-wrapper'>
          <input
            type='email'
            className='form-field'
            placeholder='Email address'
            name='email'
            value={email}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className='form-field-wrapper'>
          <input
            type='password'
            className='form-field'
            placeholder='Password'
            name='password'
            value={password}
            onChange={(e) => onChange(e)}
            minLength='8'
          />
        </div>
        <input type='submit' className='form-btn' value='Login' />
      </form>
      <p className='body'>
        Don't have an account?{' '}
        <span className='switch-mode' onClick={() => changeModal(false)}>
          Sign up.
        </span>
      </p>
    </div>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  changeModal: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default connect(null, { login })(Login);
