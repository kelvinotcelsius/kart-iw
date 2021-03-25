// const express = require('express');
// const router = express.Router();
// const auth = require('../../middleware/auth');
// const { validationResult } = require('express-validator');

// const config = require('config');
// const stripeKey = config.get('StripeTestKey');
// const stripe = require('stripe')(stripeKey);

// // Models
// // const Post = require('../../models/Post');
// // const Product = require('../../models/Product');
// const User = require('../../models/User');

// // @route   POST api/stripe/create-stripe-account/
// // @desc    Create a Stripe standard account for creators seeking payout
// // @access  Private
// router.post('/create-standard-account', [auth], async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }
//   try {
//     const user = await User.findById(req.user.id);
//     if (!user) {
//       return res.status(400).json({ errors: [{ msg: 'User not found' }] });
//     }

//     const account = await stripe.accounts.create({
//       type: 'standard',
//     });

//     user.stripe_id = account.id;
//     user.save();
//     res.json(user);
//   } catch (err) {
//     res.status(500).send({
//       error: err.message,
//     });
//   }
// });

// router.post('/create-account-link', [auth], async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   try {
//     const user = await User.findById(req.user.id);
//     if (!user) {
//       return res.status(400).json({ errors: [{ msg: 'User not found' }] });
//     }

//     const accountLinks = await stripe.accountLinks.create({
//       account: user.stripe_id,
//       refresh_url: 'http://localhost:3000/',
//       return_url: 'http://localhost:3000/',
//       type: 'account_onboarding',
//     });

//     res.json(accountLinks);
//   } catch (err) {
//     res.status(500).send({
//       error: err.message,
//     });
//   }
// });

// module.exports = router;
