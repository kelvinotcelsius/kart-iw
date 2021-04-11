const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const checkObjectId = require('../../middleware/checkObjectId');
const path = require('path');

// Models
const Post = require('../../models/Post');
const Product = require('../../models/Product');
const User = require('../../models/User');

// Middleware for handling multipart/form-data
var multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

// Utils
var uploadS3 = require('../utils/uploadS3');
const { createPostIndices } = require('../utils/createSearchIndices');

// @route   POST api/posts/product_id
// @desc    Create a post for a product
// @access  Private
router.post(
  '/:product_id',
  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'preview', maxCount: 1 },
  ]),
  [
    auth,
    [
      check('caption', 'A caption is required').not().isEmpty(),
      check('caption', 'The caption must be less than 75 characters').isLength({
        max: 75,
      }),
      checkObjectId('product_id'),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id);
      const product = await Product.findById(req.params.product_id);
      if (!product) {
        return res.status(400).json({ errors: [{ msg: 'Product not found' }] });
      }

      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'User not found' }] });
      }

      // Check if the user has purchased the item
      // if (!user.purchased_items.includes(req.params.product_id)) {
      //   return res
      //     .status(400)
      //     .json({
      //       errors: [
      //         {
      //           msg:
      //             'You cannot create videos for this item because you have not purchased it.',
      //         },
      //       ],
      //     });
      // }

      const videoFile = req.files.video[0];
      const previewFile = req.files.preview[0];

      // See if they uploaded a valid video
      if (!videoFile) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Please upload a video' }] });
      }
      if (!videoFile.mimetype.startsWith('video')) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Only video file types accepted' }] });
      }

      // See if they uploaded a valid cover iamge
      if (!previewFile) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Please upload a cover image' }] });
      }
      if (!previewFile.mimetype.startsWith('image')) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Only image file types accepted' }] });
      }

      // Delete all special characters from file names when adding to path
      const videoFilePath = `video_${req.user.id}${path
        .parse(videoFile.originalname)
        .name.replace(/[^a-zA-Z]/g, '')}${
        path.parse(videoFile.originalname).ext
      }`;
      const previewFilePath = `preview_${req.user.id}${path
        .parse(previewFile.originalname)
        .name.replace(/[^a-zA-Z]/g, '')}${
        path.parse(previewFile.originalname).ext
      }`;

      uploadS3(videoFile, videoFilePath);
      uploadS3(previewFile, previewFilePath);

      awsVideoPath = `https://kart-iw.s3.amazonaws.com/${videoFilePath}`;
      awsPreviewPath = `https://kart-iw.s3.amazonaws.com/${previewFilePath}`;

      const newPost = new Post({
        creator_id: req.user.id,
        creator_profile_pic: user.profile_pic,
        creator_username: user.username,
        caption: req.body.caption,
        video: awsVideoPath,
        preview: awsPreviewPath,
        product_id: product._id,
        product_name: product.name,
        product_picture: product.picture,
      });

      // Add post to posts collection
      const post = await newPost.save();

      // Add post to user.posts array
      user.posts.unshift(post._id);
      await user.save();

      // Add post to product.posts array
      product.posts.unshift(post._id);
      await product.save();

      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/posts/most-recent/:endIndex
// @desc    Get most recent posts
// @access  Public
router.get('/most-recent/:endIndex', async (req, res) => {
  const { endIndex } = req.params;
  try {
    const posts = await Post.find().sort('-date').limit(30);
    const segment = posts.slice(0, parseInt(endIndex) + 1);
    res.json(segment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/posts/most-liked/:endIndex
// @desc    Get most liked posts
// @access  Public
router.get('/most-liked/:endIndex', async (req, res) => {
  const { endIndex } = req.params;
  try {
    const posts = await Post.find().sort({ likes: -1 }).limit(30);
    const segment = posts.slice(0, parseInt(endIndex) + 1);
    res.json(segment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    GET api/posts/:post_id
// @desc     Get post by post ID
// @access   Public
router.get('/:post_id', [checkObjectId('post_id')], async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

// @route    GET api/posts/products/:product_id
// @desc     Get all posts by product ID
// @access   Public
router.get(
  '/products/:product_id',
  [checkObjectId('product_id')],
  async (req, res) => {
    try {
      const posts = await Post.find({ product_id: req.params.product_id }).sort(
        '-date'
      );
      if (!posts) {
        return res.status(404).json({ msg: 'Posts not found' });
      }
      res.json(posts);
    } catch (err) {
      console.error(err.message);

      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Posts not found' });
      }
      res.status(500).send('Server Error');
    }
  }
);

// @route    GET api/posts/user/:user_id
// @desc     Get all posts by user ID
// @access   Public
router.get('/user/:user_id', [checkObjectId('user_id')], async (req, res) => {
  try {
    const posts = await Post.find({ creator_id: req.params.user_id }).sort(
      '-date'
    );
    if (!posts) {
      return res.status(404).json({ msg: 'Posts not found' });
    }
    res.json(posts);
  } catch (err) {
    console.error(err.message);

    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Posts not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/posts/:id
// @desc    Delete post by id
// @access  Private
router.delete(
  '/:post_id',
  [auth, checkObjectId('post_id')],
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.post_id);

      if (!post) {
        return res.status(404).json({ msg: 'Post not found' });
      }

      // checks if the user deleting the post is the user that owns the post
      // post.user is of type object id, so we need to to call .toString
      if (post.creator_id.toString() !== req.user.id) {
        return res
          .status(401)
          .json({ msg: 'User not authorized to delete post' });
      }

      // Remove post id from product.posts array
      var product_id = post.product;
      const product = await Product.findById(product_id);
      if (!product) {
        return res.status(404).json({ msg: 'Product not found' });
      }
      var index = product.posts.indexOf(req.params.post_id.toString());
      if (index !== -1) {
        product.posts.splice(index, 1);
      }
      await product.save();

      // Remove post id from user.posts array
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
      var index = user.posts.indexOf(req.params.post_id.toString());
      if (index !== -1) {
        user.posts.splice(index, 1);
      }
      await user.save();

      // Remove post from Post collction
      await post.remove();

      res.json({ msg: 'Post removed' });
    } catch (err) {
      console.error(err.message);

      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Post not found' });
      }
      res.status(500).send('Server Error');
    }
  }
);

// @route    PUT api/posts/like/:id
// @desc     Like/unlike a post
// @access   Private
router.put('/like/:id', [auth, checkObjectId('id')], async (req, res) => {
  try {
    /* Update post model */
    const post = await Post.findById(req.params.id);
    const user = await User.findById(req.user.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // If post is already liked, unlike it
    if (post.likes.some((like) => like.toString() === req.user.id)) {
      const removeIndexPost = post.likes.indexOf(req.user.id);
      post.likes.splice(removeIndexPost, 1);

      const removeIndexUser = user.likes.indexOf(req.params.id);
      user.likes.splice(removeIndexUser, 1);
    } else {
      // else, like it
      post.likes.unshift(req.user.id);
      user.likes.unshift(req.params.id);
    }

    await post.save();
    await user.save();

    return res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/posts/search/createAlgolia
// @desc    Save post fields as JSON object
// @access  Private
router.get('/search/createAlgolia', auth, async (req, res) => {
  try {
    const posts = await Post.find();
    const indices = await createPostIndices(posts);
    res.json(indices);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
