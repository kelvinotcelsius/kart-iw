import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import CreditCardForm from './CreditCardForm';
import './Payments.css';

const PaymentWrapper = ({
  showPayment,
  triggerPayment,
  keys,
  productID,
  creatorID,
  postID,
  price,
}) => {
  return (
    <Fragment>
      <div id='payment-wrapper'>
        <button
          id='payment-back-btn'
          onClick={() => triggerPayment(!showPayment)}
        >
          Back
        </button>
        <Elements stripe={loadStripe(keys.stripe)}>
          <CreditCardForm
            productID={productID}
            creatorID={creatorID}
            postID={postID}
            price={price}
            triggerPayment={triggerPayment}
          />
        </Elements>
      </div>
    </Fragment>
  );
};

PaymentWrapper.propTypes = {
  triggerPayment: PropTypes.func.isRequired,
  showPayment: PropTypes.bool.isRequired,
  price: PropTypes.number.isRequired,
  creatorID: PropTypes.string.isRequired,
  postID: PropTypes.string.isRequired,
  productID: PropTypes.string.isRequired,
};

export default PaymentWrapper;
