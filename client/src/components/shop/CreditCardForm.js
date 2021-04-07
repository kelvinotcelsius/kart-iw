import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { Redirect } from 'react-router-dom';

import './Payments.css';

import Spinner from '../layout/Spinner';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import Field from './Field';

import { setAlert } from '../../actions/alert';
import api from '../../utils/api';

//credit card element specific styling
const CARD_OPTIONS = {
  iconStyle: 'solid',
  style: {
    base: {
      fontWeight: 500,
      fontFamily: 'Open Sans, Segoe UI, sans-serif',
      fontSize: '18px',
      color: '#424770',
      fontSmoothing: 'antialiased',
      ':-webkit-autofill': {
        color: '#cccccc',
      },
      '::placeholder': {
        color: '#888',
      },
    },
    invalid: {
      iconColor: 'red',
      color: 'red',
    },
  },
};

const CreditCardForm = ({
  productID,
  creatorID,
  postID,
  price,
  setAlert,
  user,
  triggerPayment,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  // const [success, setSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [billingDetails, setBillingDetails] = useState({
    email: `${user.email}`,
    name: `${user.first} ${user.last}`,
    address: {
      line1: '',
      city: '',
      state: '',
      postal_code: '',
    },
  });

  //resets state on completion
  const reset = () => {
    setError(null);
    setProcessing(false);
    // setPaymentMethod('');
    // setPrice(0);
    // setSuccess(false);
    setBillingDetails({
      email: '',
      name: '',
      address: {
        line1: '',
        city: '',
        state: '',
        postal_code: '',
      },
    });
  };

  /*
	This code runs when a card transaction is submitted
	There are three main components to this function:
		1. create a new stripe payment method using the form data
		2. get a payment intent from the server using the speficied price
		3. confirm the payment intent using the new payment method
		4. send a confiemation to the server if the payment succeeded
	*/
  const handleSubmit = async (event) => {
    event.preventDefault();

    ///if stripe api is loaded
    if (!stripe || !elements) {
      return;
    }

    // handle errors
    if (error) {
      elements.getElement('card').focus();
      return;
    }

    //start processing animation on submit button
    setProcessing(true);

    //STEP 1:
    const cardElement = elements.getElement(CardElement);
    //create new payment method based on card and form information
    const payload = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: billingDetails,
    });

    //handle errors, otherwise set the new payment method in state
    if (payload.error) {
      setError(payload.error.message);
      return;
    }

    //STEP 2:
    //create a new payment request and get irs client secret + id from the server
    const formData = {
      quantity: 1,
    };

    try {
      var intentData = await api.post(
        `/shop/${productID}/${postID}/${creatorID}`,
        formData
      );
    } catch (err) {
      console.log(err);
      setError(err);
      return err;
    }

    //STEP 3:
    //confirm the payment and use the new payment method
    const result = await stripe.confirmCardPayment(intentData.data.secret, {
      payment_method: payload.paymentMethod.id,
    });

    //handle errors again
    if (result.error) {
      setError(result.error);
      return;
    }

    //STEP 4:
    // The payment has been processed! send a confirmation to the server
    if (result.paymentIntent.status === 'succeeded') {
      const confirmedPayment = await api
        .post('/shop/confirm-payment', {
          payment_id: intentData.data.intent_id,
          payment_type: 'stripe',
        })
        .then(
          (response) => {
            return response.data.success;
          },
          (error) => {
            console.log(error);
            setError(error);
            return error;
          }
        );

      //reset the state and show the success message
      if (confirmedPayment) {
        //reset the form
        reset();

        /* YOUR APPLICATION SPECIFIC CODE HERE: for this example all we do is render a modal */
        // setSuccess(true);
        setAlert('Payment successful! Your order is on the way.', 'success');
        triggerPayment(false); // go back to product view
      }
    }
  };

  return (
    <form className='form-wrapper' onSubmit={handleSubmit}>
      {error ? (
        <div className='status error'>
          <span className='status-msg error'>
            {JSON.stringify(error).replace('"', '')}
          </span>
          <button
            className='close-status-btn error'
            onClick={() => setError(null)}
          >
            x
          </button>
        </div>
      ) : null}

      {/* {success ? (
        <div className='status success'>
          <span className='status-msg success'>
            Payment successful. Your order is on the way!
          </span>
          <button
            className='close-status-btn success'
            onClick={() => setSuccess(null)}
          >
            x
          </button>
        </div>
      ) : null} */}

      {/* Credit Card Payment Form */}
      <h5>Shipping and billing</h5>
      <fieldset className='form-group'>
        <Field
          label='Name'
          id='name'
          type='text'
          placeholder='Julia Smith'
          required={true}
          autoComplete='shipping name'
          value={billingDetails.name}
          onChange={(event) => {
            setBillingDetails({ ...billingDetails, name: event.target.value });
          }}
        />
        <Field
          label='Email'
          id='email'
          type='email'
          placeholder='julias@gmail.com'
          required={true}
          autoComplete='shipping email'
          value={billingDetails.email}
          onChange={(event) => {
            setBillingDetails({ ...billingDetails, email: event.target.value });
          }}
        />
        <Field
          label='Address'
          id='line1'
          type='address-line1'
          placeholder='1234 NW 13th Street Suite 50'
          required={true}
          autoComplete='shipping address-line1'
          value={billingDetails.address.line1}
          onChange={(event) => {
            setBillingDetails({
              ...billingDetails,
              address: {
                line1: event.target.value,
                city: billingDetails.address.city,
                state: billingDetails.address.state,
                postal_code: billingDetails.address.postal_code,
              },
            });
          }}
        />
        <Field
          label='City'
          id='city'
          type='address-city'
          placeholder='San Francisco'
          required={true}
          autoComplete='shipping address-level2'
          value={billingDetails.address.city}
          onChange={(event) => {
            setBillingDetails({
              ...billingDetails,
              address: {
                city: event.target.value,
                line1: billingDetails.address.line1,
                state: billingDetails.address.state,
                postal_code: billingDetails.address.postal_code,
              },
            });
          }}
        />
        <Field
          label='State'
          id='state'
          type='address-state'
          placeholder='CA'
          required={true}
          autoComplete='shipping address-level1'
          value={billingDetails.address.state}
          onChange={(event) => {
            setBillingDetails({
              ...billingDetails,
              address: {
                state: event.target.value,
                city: billingDetails.address.city,
                line1: billingDetails.address.line1,
                postal_code: billingDetails.address.postal_code,
              },
            });
          }}
        />
        <Field
          label='Zip code'
          id='postal_code'
          type='address-postal_code'
          placeholder='85440'
          required={true}
          minLength='5'
          maxLength='5'
          autoComplete='shipping postal-code'
          value={billingDetails.address.postal_code}
          onChange={(event) => {
            setBillingDetails({
              ...billingDetails,
              address: {
                postal_code: event.target.value,
                city: billingDetails.address.city,
                state: billingDetails.address.state,
                line1: billingDetails.address.line1,
              },
            });
          }}
        />
      </fieldset>

      {/* credit card field and submit button */}
      <Fragment>
        <h5>Credit card</h5>
        <CardElement
          options={CARD_OPTIONS}
          onChange={(event) => {
            if (event.error.message) {
              setError(event.error.message);
            }
          }}
        />
      </Fragment>
      {/* submit */}
      {!processing ? (
        <button
          className='form-submit'
          type='submit'
          error={error}
          disabled={processing || !stripe}
        >
          <span>Pay ${price}</span>
        </button>
      ) : (
        <Spinner />
      )}
    </form>
  );
};

CreditCardForm.propTypes = {
  price: PropTypes.number.isRequired,
  creatorID: PropTypes.string.isRequired,
  postID: PropTypes.string.isRequired,
  productID: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  setAlert: PropTypes.func.isRequired,
  triggerPayment: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

// export default CreditCardForm;
export default connect(mapStateToProps, { setAlert })(CreditCardForm);
