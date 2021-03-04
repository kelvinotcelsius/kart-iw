const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const checkObjectId = require('../../middleware/checkObjectId');
const config = require('config');
const { validationResult } = require('express-validator');

const stripeKey = config.get('StripeTestKey');
const stripe = require('stripe')(stripeKey);

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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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

      // Add order to user.orders array and product_id to user.purchased_items
      user.orders.unshift(order._id);
      user.purchased_items.unshift(order.product_id);
      await user.save();

      // Add commission to creator account
      newPayout = user.payout + 0.1 * price;
      user.payout = newPayout;
      await user.save();

      //respond with the client secret and id of the new paymentintent
      res.json({ secret: intent.client_secret, intent_id: intent.id });
    } catch (err) {
      console.log(err);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/shop/:post_id
// @desc    Handle payment confirmation
// @access  Private
router.post('/confirm-payment', async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    //extract payment type from the client request
    const paymentType = String(req.body.payment_type);

    //handle confirmed stripe transaction
    if (paymentType == 'stripe') {
      //get payment id for stripe
      const clientid = String(req.body.payment_id);

      //get the intent based on the provided id
      const paymentIntent = await stripe.paymentIntents.retrieve(clientid);

      //respond to the client that the server confirmed the transaction
      if (paymentIntent.status === 'succeeded') {
        /*YOUR CODE HERE*/
        console.log('confirmed stripe payment: ' + clientid);
        res.json({ success: true });
      } else {
        res.json({ success: false });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/shop/create-stripe-account
// @desc    Create a Stripe account for user
// @access  Private
router.post('/create-stripe-account/:email', async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'US',
      // email: req.params.email,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/shop/payout/:user_id
// @desc    Handle payment confirmation
// @access  Private
router.post(
  '/payout/:user_id',
  [auth, checkObjectId('user_id')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.params.user_id);

      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }

      // checks if the user requesting the payout is the same one as the passed in user_id
      // post.user is of type object id, so we need to to call .toString
      if (user._id.toString() !== req.user.id) {
        return res
          .status(401)
          .json({ msg: 'User not authorized to request payout' });
      }

      // STRIPE STUFF

      res.json('success');
    } catch (err) {
      console.error(err.message);

      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'User not found' });
      }
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/shop/orders
// @desc    Delete all orders
// @access  Private
router.delete('/orders', [auth], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    Order.deleteMany({}, function (err) {
      if (err) {
        console.log(err);
      } else {
        res.json('Successfully deleted all orders');
      }
    });
  } catch (err) {
    console.error(err.message);

    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server Error');
  }
});

// router.post('/onboard-user', async (req, res) => {
//   try {
//     const account = await stripe.accounts.create({ type: 'standard' });
//     req.session.accountID = account.id;
//     console.log(account.id);

//     // const origin = `${req.headers.origin}`;
//     // console.log(origin);

//     const accountLinkURL = await generateAccountLink(account.id);
//     console.log(accountLinkURL);
//     res.send({ url: accountLinkURL });
//   } catch (err) {
//     res.status(500).send({
//       error: err.message,
//     });
//   }
// });

// router.get('/onboard-user/refresh', async (req, res) => {
//   if (!req.session.accountID) {
//     res.redirect('/');
//     return;
//   }
//   try {
//     const { accountID } = req.session;
//     // const origin = `${req.secure ? 'https://' : 'https://'}${req.headers.host}`;

//     const accountLinkURL = await generateAccountLink(accountID);
//     res.redirect(accountLinkURL);
//   } catch (err) {
//     res.status(500).send({
//       error: err.message,
//     });
//   }
// });

// function generateAccountLink(accountID, origin) {
//   return stripe.accountLinks
//     .create({
//       type: 'account_onboarding',
//       account: accountID,
//       refresh_url: `https://www.google.com`,
//       return_url: `https://www.google.com`,
//     })
//     .then((link) => link.url);
// }

module.exports = router;
