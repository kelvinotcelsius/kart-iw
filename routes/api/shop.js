const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const checkObjectId = require('../../middleware/checkObjectId');

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
      const product = await Product.findById(req.params.product_id);
      if (!product) {
        return res.status(400).json({ errors: [{ msg: 'Product not found' }] });
      }
      const post = await Post.findById(req.params.post_id);
      if (!post) {
        return res.status(400).json({ errors: [{ msg: 'Post not found' }] });
      }
      // Create and save order
      const newOrder = new Order({
        post_id: req.params.post_id,
        creator_id: req.params.creator_id,
        buyer_id: user._id,
        product_id: req.params.product_id,
        quantity: req.body.quantity,
        total_paid: req.body.total_paid,
      });
      const order = await newOrder.save();

      // Add order to user.orders array and product to user.purchased_items
      user.orders.unshift(order._id);
      user.purchased_items.unshift(order.product_id);
      await user.save();

      res.json(order);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
