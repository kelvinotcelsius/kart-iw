import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { finishRegistration } from '../../actions/auth';
import { setAlert } from '../../actions/alert';

const initialState = {
  username: '',
  first: '',
  last: '',
  birthday: '',
  phone: '',
  file: '',
};

const FinishRegistrationForm = ({
  history,
  finishRegistration,
  auth,
  setAlert,
}) => {
  const [formData, setFormData] = useState(initialState);
  const { username, first, last, birthday, phone, file } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  useEffect(() => {
    if (!auth.registrationFinished) {
      setAlert('Please finish your profile before continuing', 'danger');
    }
  }, [auth, setAlert]);

  const onSubmit = (e) => {
    e.preventDefault();
    var form_data = new FormData();

    for (var key in formData) {
      form_data.append(key, formData[key]);
    }

    finishRegistration(form_data, history);
  };

  return (
    <Fragment>
      <div id='finish-registration'>
        <h1>Complete profile</h1>
        <form
          className='form-page'
          onSubmit={(e) => onSubmit(e)}
          encType='multipart/form-data'
        >
          <div className='form-row'>
            <div className='form-field-wrapper'>
              <label htmlFor='username' className='form-row-label'>
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
                required
              />
            </div>
          </div>
          <div className='form-row'>
            <div className='form-field-wrapper'>
              <label htmlFor='first' className='form-row-label'>
                First name
              </label>
              <br />
              <input
                id='first'
                className='form-field'
                name='first'
                value={first}
                onChange={(e) => onChange(e)}
                required
              />
            </div>
            <div className='form-field-wrapper'>
              <label htmlFor='last' className='form-row-label'>
                Last name
              </label>
              <br />
              <input
                id='last'
                className='form-field'
                name='last'
                value={last}
                onChange={(e) => onChange(e)}
                required
              />
            </div>
            <div className='form-field-wrapper'>
              <label htmlFor='birthday' className='form-row-label'>
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
                required
              />
            </div>
          </div>
          <div className='form-row'>
            <div className='form-field-wrapper'>
              <label htmlFor='phone' className='form-row-label'>
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
                required
              />
            </div>
          </div>
          <div className='form-row'>
            <div className='form-field-wrapper'>
              <label htmlFor='file' className='form-row-label'>
                Profile picture
              </label>
              <br />
              <input
                type='file'
                id='file'
                name='file'
                className='form-field'
                onChange={(e) => onFileChange(e)}
                required
              />
            </div>
          </div>
          <div className='form-row'>
            <div className='form-field-wrapper'>
              <input type='submit' className='form-btn' value='Start earning' />
            </div>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

FinishRegistrationForm.propTypes = {
  auth: PropTypes.object.isRequired,
  finishRegistration: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { finishRegistration, setAlert })(
  FinishRegistrationForm
);
