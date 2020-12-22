import React, { useState, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
// import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import PropTypes from 'prop-types';

import './Auth.css';

const Register = ({ changeModal, closeModal, register, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    register(formData);
  };

  // Redirect if logged in
  if (isAuthenticated) {
    closeModal();
    return <Redirect to='/finish-registration' />;
  }

  return (
    <Fragment>
      <h2 className='modal-title'>Sign up for Kart</h2>
      <p className='modal-subtitle'>
        Earn money for making videos, comment on posts, and more
      </p>
      <form id='register' onSubmit={(e) => onSubmit(e)}>
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
        <input type='submit' className='form-btn' value='Sign Up' />
      </form>
      <p className='body'>Already have an account?</p>
      <button onClick={() => changeModal(true)}>Log in</button>
    </Fragment>
  );
};

Register.propTypes = {
  isAuthenticated: PropTypes.bool,
  changeModal: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
};

// see reducers/auth.js for isAuthenticated field in the auth redux field
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

// connect takes in 2 arguments, the first is any state we want to map, and an object with any objects we want to use (props)
// By passing in setAlert as the 2nd argument, we can now call props.setAlert. Pass in props to Register function (see line 6)
export default connect(mapStateToProps, { register })(Register);
