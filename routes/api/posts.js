const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const Product = require('../../models/Product');
const User = require('../../models/User');

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post(
  '/',
  [auth, [check('caption', 'A caption is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user_id = await User.findById(req.user.id).select('_id');
      const product_id = await Product.findOne({ name: req.body.product });

      if (!product_id) {
        return res.status(400).send('Product not found');
      }

      const newPost = new Post({
        creator: user_id,
        caption: req.body.caption,
        video: req.body.video,
        date: req.body.date,
        product: product_id,
      });

      const post = await newPost.save();

      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   POST api/posts/all
// @desc    Get all post
// @access  Public
router.get('/all', async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
