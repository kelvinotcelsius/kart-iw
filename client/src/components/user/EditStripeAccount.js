import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { setAlert } from '../../actions/alert';

import api from '../../utils/api';

import spinnerGIF from '../layout/spinner.gif';

const EditStripeAccount = ({ setAlert }) => {
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    routing_number: '',
    account_number: '',
    social_security_num: '',
    city: '',
    line1: '',
    line2: '',
    postal_code: '',
    state: '',
  });

  const {
    name,
    routing_number,
    account_number,
    social_security_num,
    city,
    line1,
    line2,
    postal_code,
    state,
  } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    var form_data = new FormData();

    for (var key in formData) {
      form_data.append(key, formData[key]);
    }

    try {
      const body = JSON.stringify({
        name,
        routing_number,
        account_number,
        social_security_num,
        city,
        line1,
        line2,
        postal_code,
        state,
      });
      const res = await api.post('/shop/create-stripe-account', body);
      console.log(res);
      if (res.data) {
        setProcessing(false);
        setAlert(
          'Your Stripe account was created successfully. You may request payouts now if you have more than $1 to be paid out.',
          'success'
        );
      } else {
        setProcessing(false);
        setAlert('An error occured. Please try again later.', 'danger');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Fragment>
      <div id='stripe-form'>
        <h1>Create or edit Stripe account</h1>
        <form className='form-page' onSubmit={(e) => onSubmit(e)}>
          <div className='form-row'>
            <div className='form-field-wrapper'>
              <label htmlFor='name' className='form-row-label'>
                Name*
              </label>
              <input
                id='name'
                className='form-field'
                placeholder='Kelvin Yu'
                name='name'
                value={name}
                onChange={(e) => onChange(e)}
                maxLength='40'
                required
              />
            </div>
          </div>
          <div className='form-row'>
            <div className='form-field-wrapper'>
              <label htmlFor='routing_number' className='form-row-label'>
                Bank routing number*
              </label>
              <br />
              <input
                id='routing_number'
                className='form-field'
                placeholder='110000000'
                name='routing_number'
                value={routing_number}
                onChange={(e) => onChange(e)}
                maxLength='9'
                required
              />
            </div>
            <div className='form-field-wrapper'>
              <label htmlFor='account_number' className='form-row-label'>
                Checking account number*
              </label>
              <br />
              <input
                id='account_number'
                className='form-field'
                placeholder='000123456789'
                name='account_number'
                value={account_number}
                onChange={(e) => onChange(e)}
                maxLength='13'
                required
              />
            </div>
            <div className='form-field-wrapper'>
              <label htmlFor='social_security_num' className='form-row-label'>
                Social security number*
              </label>
              <br />
              <input
                id='social_security_num'
                className='form-field'
                placeholder='123238203'
                name='social_security_num'
                value={social_security_num}
                onChange={(e) => onChange(e)}
                maxLength='9'
                required
              />
            </div>
          </div>
          <div className='form-row'>
            <div className='form-field-wrapper'>
              <label htmlFor='line1' className='form-row-label'>
                Address 1* (U.S. addresses only)
              </label>
              <br />
              <input
                id='line1'
                className='form-field'
                placeholder='1387 SW 38th Street'
                name='line1'
                value={line1}
                onChange={(e) => onChange(e)}
                required
              />
            </div>
            <div className='form-field-wrapper'>
              <label htmlFor='line2' className='form-row-label'>
                Address 2
              </label>
              <br />
              <input
                id='line2'
                className='form-field'
                placeholder='Apartment, suite, unit, etc.'
                name='line2'
                value={line2}
                onChange={(e) => onChange(e)}
              />
            </div>
          </div>
          <div className='form-row'>
            <div className='form-field-wrapper'>
              <label htmlFor='city' className='form-row-label'>
                City*
              </label>
              <br />
              <input
                id='city'
                className='form-field'
                placeholder='CA'
                name='city'
                value={city}
                onChange={(e) => onChange(e)}
              />
            </div>
            <div className='form-field-wrapper'>
              <label htmlFor='state' className='form-row-label'>
                State*
              </label>
              <br />
              <input
                id='state'
                className='form-field'
                placeholder='CA'
                name='state'
                value={state}
                onChange={(e) => onChange(e)}
              />
            </div>
            <div className='form-field-wrapper'>
              <label htmlFor='postal_code' className='form-row-label'>
                Zip code*
              </label>
              <br />
              <input
                id='postal_code'
                className='form-field'
                placeholder='89330'
                name='postal_code'
                value={postal_code}
                onChange={(e) => onChange(e)}
                maxLength='5'
              />
            </div>
          </div>
          <div className='form-row'>
            {processing ? (
              <img
                src={spinnerGIF}
                style={{ width: '100px', margin: 'auto', display: 'block' }}
                alt='Loading...'
              />
            ) : (
              <input
                type='submit'
                id='submit-btn'
                className='form-btn'
                value='Post'
              />
            )}
          </div>
        </form>
      </div>
    </Fragment>
  );
};

EditStripeAccount.propTypes = {
  setAlert: PropTypes.func.isRequired,
};

export default connect(null, { setAlert })(EditStripeAccount);
