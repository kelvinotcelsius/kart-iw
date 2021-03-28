const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const checkObjectId = require('../../middleware/checkObjectId');
const config = require('config');
const { check, validationResult } = require('express-validator');

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

      // Add commission to creator account and total_earned amount
      creator.payout += 0.1 * price;
      creator.amount_earned += 0.1 * price;
      await creator.save();

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
router.post('/confirm-payment', [auth], async (req, res) => {
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

// @route   GET api/shop/stripe
// @desc    See if this creator has a Stripe account
// @access  Private
router.get('/stripe', [auth], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'User not found' }] });
    }
    if (user.stripe_id) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/shop/stripe
// @desc    See if this creator has a Stripe account with transfers enabled
// @access  Private
router.get('/stripe-transfers-active', [auth], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'User not found' }] });
    }

    const account = await stripe.accounts.retrieve(user.stripe_id);

    if (account.capabilities.transfers === 'active') {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/shop/create-stripe-account/
// @desc    Create a Stripe account for creators seeking payout
// @access  Private
router.post(
  '/create-stripe-account',
  [
    auth,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('routing_number', 'Routing number is required').not().isEmpty(),
      check('account_number', 'Checking account number is required')
        .not()
        .isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      routing_number,
      account_number,
      city,
      line1,
      line2,
      postal_code,
      state,
    } = req.body;

    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'User not found' }] });
      }
      const birthday = user.birthday.toISOString().split('-');
      const dob_year = birthday[0];
      const dob_month = birthday[1];
      const dob_day = birthday[2].split('T')[0];

      if (!user.stripe_id) {
        const account = await stripe.accounts.create({
          type: 'custom',
          country: 'US',
          email: user.email,
          business_type: 'individual',
          individual: {
            first_name: user.first,
            last_name: user.last,
            email: user.email,
            phone: user.phone,
            dob: {
              day: dob_day,
              year: dob_year,
              month: dob_month,
            },
            address: {
              city: city,
              country: 'US',
              line1: line1,
              line2: line2,
              postal_code: postal_code,
              state: state,
            },
            id_number: req.body.social_security_num,
          },
          tos_acceptance: {
            date: Math.floor(Date.now() / 1000),
            ip: req.ip, // Assumes you're not using a proxy; https://stripe.com/docs/connect/updating-accounts#tos-acceptance
          },
          business_profile: {
            mcc: 5969, // Direct marketing, Other from https://stripe.com/docs/connect/setting-mcc
            url: `https://www.shopkart.com/user/${user._id}`,
          },
          capabilities: {
            card_payments: { requested: true },
            transfers: { requested: true },
          },
          external_account: {
            object: 'bank_account',
            country: 'US',
            currency: 'usd',
            account_holder_name: name,
            routing_number: routing_number,
            account_number: account_number,
          },
        });
        user.stripe_id = account.id;
        user.save();
      } else {
        await stripe.accounts.update(user.stripe_id, {
          individual: {
            address: {
              city: city,
              country: 'US',
              line1: line1,
              line2: line2,
              postal_code: postal_code,
              state: state,
            },
          },
          external_account: {
            object: 'bank_account',
            country: 'US',
            currency: 'usd',
            account_holder_name: name,
            routing_number: routing_number,
            account_number: account_number,
          },
        });
      }
      console.log(user.stripe_id);
      res.json(true);
    } catch (err) {
      console.log(err);
      res.status(500).send('Server Error');
    }
  }
);

// @route   POST api/shop/stripe-payout
// @desc    Create a Stripe transfer from Kart to creator
// @access  Private
router.post('/payout', [auth], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const transfer = await stripe.transfers.create({
      amount: user.payout * 100,
      currency: 'usd',
      description: 'Kart payout',
      destination: user.stripe_id,
      transfer_group: 'CREATOR',
    });

    user.transfers.unshift(transfer.id);
    const oldPayout = user.payout;
    user.payout = 0;
    user.save();
    res.json(`You were paid out $${oldPayout}!`);
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
});

// // @route   GET api/shop/payout/:user_id
// // @desc    Handle payment confirmation
// // @access  Private
// router.post(
//   '/payout/:user_id',
//   [auth, checkObjectId('user_id')],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//       const user = await User.findById(req.params.user_id);

//       if (!user) {
//         return res.status(404).json({ msg: 'User not found' });
//       }

//       // checks if the user requesting the payout is the same one as the passed in user_id
//       // post.user is of type object id, so we need to to call .toString
//       if (user._id.toString() !== req.user.id) {
//         return res
//           .status(401)
//           .json({ msg: 'User not authorized to request payout' });
//       }

//       // STRIPE STUFF

//       res.json('success');
//     } catch (err) {
//       console.error(err.message);

//       if (err.kind === 'ObjectId') {
//         return res.status(404).json({ msg: 'User not found' });
//       }
//       res.status(500).send('Server Error');
//     }
//   }
// );

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
