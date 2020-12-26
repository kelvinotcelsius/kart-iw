const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const path = require('path');

// Models
const Post = require('../../models/Post');
const Product = require('../../models/Product');
const User = require('../../models/User');

// Middleware for handling multipart/form-data
var multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

// AWS
var uploadS3 = require('../../config/uploadS3');

// @route   POST api/posts
// @desc    Create a post for a product
// @access  Private
router.post(
  '/:productID',
  upload.fields([
    { name: 'videoFile', maxCount: 1 },
    { name: 'previewFile', maxCount: 1 },
  ]),
  [auth, [check('caption', 'A caption is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.body.creator);
      const product = await Product.findById(req.params.productID);

      if (!product) {
        return res.status(400).json({ errors: [{ msg: 'Product not found' }] });
      }

      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'User not found' }] });
      }

      const videoFile = req.files.videoFile[0];
      const previewFile = req.files.previewFile[0];

      videoFilePath = `video_${req.body.creator}${encodeURIComponent(
        path.parse(videoFile.originalname).name
      )}${path.parse(videoFile.originalname).ext}`;
      previewFilePath = `preview_${req.body.creator}${encodeURIComponent(
        path.parse(previewFile.originalname).name
      )}${path.parse(previewFile.originalname).ext}`;

      uploadS3(videoFile, videoFilePath);
      uploadS3(previewFile, previewFilePath);

      awsVideoPath = `https://kart-iw.s3.amazonaws.com/${videoFilePath}`;
      awsPreviewPath = `https://kart-iw.s3.amazonaws.com/${previewFilePath}`;

      const newPost = new Post({
        creator: req.body.creator,
        caption: req.body.caption,
        video: awsVideoPath,
        preview: awsPreviewPath,
        product: product._id,
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

// @route   POST api/posts/all
// @desc    Get all posts
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

// @route   DELETE api/posts/:id
// @desc    Delete post by id
// @access  Private
router.delete('/:postID', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postID);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // checks if the user deleting the post is the user that owns the post
    // post.user is of type object id, so we need to to call .toString
    if (post.creator.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ msg: 'User not authorized to delete post' });
    }

    // Remove post id from product.posts array
    productID = post.product;
    const product = await Product.findById(productID);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    var index = product.posts.indexOf(req.params.postID.toString());
    if (index !== -1) {
      product.posts.splice(index, 1);
    }
    await product.save();

    // Remove post id from user.posts array
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    var index = user.posts.indexOf(req.params.postID.toString());
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
});

module.exports = router;
