import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { finishRegistration } from '../../actions/auth';

const initialState = {
  username: 'ninjawearingnike',
  first: 'kelvin',
  last: 'yu',
  birthday: '1999-03-09',
  phone: '541-403-9010',
  profile_pic: 'prof_pic_URL',
};

const FinishRegistrationForm = ({ history, finishRegistration }) => {
  const [formData, setFormData] = useState(initialState);

  const { username, first, last, birthday, phone, profile_pic } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    finishRegistration(formData, history);
  };

  return (
    <Fragment>
      <h1>Complete profile</h1>
      <form className='form-page' onSubmit={(e) => onSubmit(e)}>
        <div className='form-row'>
          <div className='form-field-wrapper'>
            <label htmlFor='username' className='register-label'>
              Username
            </label>
            <br />
            <input
              id='username'
              className='form-field'
              placeholder='@'
              name='username'
              value={username}
              onChange={(e) => onChange(e)}
            />
          </div>
        </div>
        <div className='form-row'>
          <div className='form-field-wrapper'>
            <label htmlFor='first' className='register-label'>
              First name
            </label>
            <br />
            <input
              id='first'
              className='form-field'
              name='first'
              value={first}
              onChange={(e) => onChange(e)}
            />
          </div>
          <div className='form-field-wrapper'>
            <label htmlFor='last' className='register-label'>
              Last name
            </label>
            <br />
            <input
              id='last'
              className='form-field'
              name='last'
              value={last}
              onChange={(e) => onChange(e)}
            />
          </div>
          <div className='form-field-wrapper'>
            <label htmlFor='birthday' className='register-label'>
              Birthday
            </label>
            <br />
            <input
              id='birthday'
              type='date'
              className='form-field'
              name='birthday'
              value={birthday}
              onChange={(e) => onChange(e)}
            />
          </div>
        </div>
        <div className='form-row'>
          <div className='form-field-wrapper'>
            <label htmlFor='phone' className='register-label'>
              Phone
            </label>
            <br />
            <input
              type='tel'
              id='phone'
              name='phone'
              pattern='[0-9]{3}-[0-9]{3}-[0-9]{4}'
              className='form-field'
              placeholder='Format: 541-132-0912'
              value={phone}
              onChange={(e) => onChange(e)}
            />
          </div>
        </div>
        <div className='form-row'>
          <div className='form-field-wrapper'>
            <label htmlFor='profile_pic' className='register-label'>
              Profile picture
            </label>
            <br />
            <input
              //   type='file'
              id='profile_pic'
              name='profile_pic'
              className='form-field'
              value={profile_pic}
              onChange={(e) => onChange(e)}
            />
          </div>
          <input type='submit' className='form-btn' value='Start earning' />
        </div>
      </form>
    </Fragment>
  );
};

FinishRegistrationForm.propTypes = {
  //   auth: PropTypes.object.isRequired,
  finishRegistration: PropTypes.func.isRequired,
};

// const mapStateToProps = (state) => ({
//   auth: state.auth,
// });

export default connect(null, { finishRegistration })(FinishRegistrationForm);
