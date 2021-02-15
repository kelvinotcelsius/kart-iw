const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const checkObjectId = require('../../middleware/checkObjectId');
const stripe = require('stripe')(
  'sk_test_51IJgQfH8gVlzmKACEcZfehO6sM6RpqIkvQ6EIPX6x2JUn9O05BzmcL4W9eCjZBtmzEKskAumcCZria8TOYgw1JhL00gmur2frc'
);

// Models
const Post = require('../../models/Post');
const Product = require('../../models/Product');
const User = require('../../models/User');
const Order = require('../../models/Order');

// @route   POST api/shop/:product_id/:post_id/:creator_id
// @desc    Create a order
// @access  Private
router.post(
  '/:product_id/:post_id/:creator_id',
  [
    auth,
    [
      checkObjectId('product_id'),
      checkObjectId('post_id'),
      checkObjectId('creator_id'),
    ],
  ],
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'User not found' }] });
      }
      const creator = await User.findById(req.params.creator_id);
      if (!creator) {
        return res.status(400).json({ errors: [{ msg: 'Creator not found' }] });
      }
      const product = await Product.findById(req.params.product_id);
      if (!product) {
        return res.status(400).json({ errors: [{ msg: 'Product not found' }] });
      }
      const post = await Post.findById(req.params.post_id);
      if (!post) {
        return res.status(400).json({ errors: [{ msg: 'Post not found' }] });
      }

      const price = product.price * req.body.quantity;
      const intent = await stripe.paymentIntents.create({
        amount: price * 100,
        currency: 'usd',
      });
      // Create and save order
      const newOrder = new Order({
        post_id: req.params.post_id,
        creator_id: req.params.creator_id,
        buyer_id: user._id,
        product_id: req.params.product_id,
        quantity: req.body.quantity,
        total_paid: price,
      });
      const order = await newOrder.save();

      // Add order to user.orders array and product to user.purchased_items
      user.orders.unshift(order._id);
      user.purchased_items.unshift(order.product_id);
      await user.save();

      // res.json(order);
      //respond with the client secret and id of the new paymentintent
      res.json({ secret: intent.client_secret, intent_id: intent.id });
    } catch (err) {
      console.log(err);
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//handle payment confirmations
router.post('/confirm-payment', async (req, res) => {
  //extract payment type from the client request
  const paymentType = String(req.body.payment_type);

  //handle confirmed stripe transaction
  if (paymentType == 'stripe') {
    //get payment id for stripe
    const clientid = String(req.body.payment_id);

    //get the transaction based on the provided id
    stripe.paymentIntents.retrieve(clientid, function (err, paymentIntent) {
      //handle errors
      if (err) {
        console.log(err);
      }

      //respond to the client that the server confirmed the transaction
      if (paymentIntent.status === 'succeeded') {
        /*YOUR CODE HERE*/

        console.log('confirmed stripe payment: ' + clientid);
        res.json({ success: true });
      } else {
        console.log(paymentIntent.status);
        console.log(paymentIntent);
        res.json({ success: false });
      }
    });
  }
});

module.exports = router;
