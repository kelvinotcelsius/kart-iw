const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const path = require('path');
const { json } = require('express');

const User = require('../../models/User');
const Post = require('../../models/Post');
const Product = require('../../models/Product');

const { createUserIndices } = require('../utils/createSearchIndices');

// Middleware for handling multipart/form-data
var multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

// AWS
var uploadS3 = require('../utils/uploadS3');

function checkValidCharacters(username) {
  return /^[0-9a-zA-Z_.]+$/.test(username);
}

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post(
  '/',
  [
    // Second param to check() is the custom error msg
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 8 or more characters'
    ).isLength({ min: 8 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return error code 400 with a JSON response containing an array of the errors
      return res.status(400).json({ errors: errors.array() });
    }

    // pull out the fields from req so we don't have to type req.body over and over
    const { email, password } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Email already in use' }] }); // the err msg syntax is looks weird, but the rationale is to match the error msg format of the validation error in line 24
      }

      // Create new user object
      user = new User({
        email,
        password,
      });

      // Encrypt password
      // salt is a variable to do the hashing with
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // Save user; .save() is called on documents (i.e. model instances)
      await user.save();

      // Return JWT
      const payload = {
        user: {
          id: user.id, // Mongoose assigns each schemas an _id field by default with the type ObjectId, and each of your schemas is also assigned a .id virtual getter by default which returns the documents _id field cast to a string
        },
      };

      // create the JWT with our private key
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token }); // sends token back to client
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// Finish creating profile
// @route   PUT api/users/profile
// @desc    Create user profile
// @access  Private
router.put(
  '/profile',
  upload.single('file'),
  [
    auth,
    [
      check('username', 'Username is required').not().isEmpty(),
      check(
        'username',
        'Please enter a username with 3 or more characters'
      ).isLength({ min: 3 }),
      check('first', 'First name is required').not().isEmpty(),
      check('last', 'Last name is required').not().isEmpty(),
      check('phone', 'Phone number is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      username,
      first,
      last,
      profile_pic,
      bio,
      birthday,
      phone,
    } = req.body;

    const file = req.file;

    if (!checkValidCharacters(username)) {
      return res.status(400).json({
        errors: [{ msg: "Please only use letters, numbers, and '_', '.'" }],
      });
    }

    try {
      // See if username exists
      let user = await User.findOne({ username });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Username not available' }] }); // the err msg syntax is looks weird, but the rationale is to match the error msg format of the validation errors (errors.array())
      }

      // See if they uploaded a profile photo
      if (!file) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Please upload a profile picture' }] });
      }

      if (!file.mimetype.startsWith('image')) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Only images accepted' }] });
      }

      // If username doesn't already exist, create user
      user = await User.findById(req.user.id);
      const userFields = {};
      if (username) userFields.username = username;
      if (first) userFields.first = first;
      if (last) userFields.last = last;
      if (profile_pic) userFields.profile_pic = profile_pic;
      if (bio) userFields.bio = bio;
      if (birthday) userFields.birthday = birthday;
      if (phone) userFields.phone = phone;

      // profPicPath = `profile_image_${user._id}${encodeURIComponent(
      //   path.parse(file.originalname).name
      // )}${path.parse(file.originalname).ext}`;

      profPicPath = `profile_image_${user._id}${
        path.parse(file.originalname).ext
      }`;

      userFields.profile_pic = `https://kart-iw.s3.amazonaws.com/${profPicPath}`;

      uploadS3(file, profPicPath);

      user = await User.findOneAndUpdate(
        { _id: req.user.id },
        { $set: userFields },
        { new: true }
      );

      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/users/all
// @desc    Get all users
// @access  Public
router.get('/all', async (req, res) => {
  try {
    // we also want to return the name and avavator, which are part of the User model, so we can do this with populate()
    const users = await User.find();

    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/users/:user_id
// @desc    Get user by id
// @access  Public
router.get('/:user_id', async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.user_id }).select(
      'bio profile_pic follower_count likes amount_earned followers following first last username payout'
    );

    if (!user) return res.status(400).json({ msg: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error(err.message);

    // if the userid doesn't exist, but is still a valid userid (i.e. same length), we want to return a more specific error msg). kind is a property of mongoose errors that is the validator's type, e.g. 'required' or 'regexp'
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'User not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/user
// @desc    Delete user and posts
// @access  Private
router.delete('/', auth, async (req, res) => {
  try {
    // Remove user's posts
    await Post.deleteMany({ creator: req.user.id });

    // Remove user
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/users/purchased_items
// @desc    Get current user's purchased products
// @access  Private
router.get('/my/purchased_items', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'User not found' }] });
    }
    const purchased_items = await Product.find()
      .where('_id')
      .in(user.purchased_items)
      .select('_id name picture')
      .exec();

    res.json(purchased_items);
  } catch (err) {
    console.log(err);
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/users/search/createAlgolia
// @desc    Save user fields as JSON object
// @access  Private
router.get('/search/createAlgolia', auth, async (req, res) => {
  try {
    const users = await User.find();
    const indices = await createUserIndices(users);
    res.json(indices);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/users/follow/:user_id
// @desc    Follow or unfollow the provided user
// @access  Private
router.put('/follow/:user_id', auth, async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.user_id);

    const user = await User.findById(req.user.id);

    if (req.user.id === req.params.user_id) {
      return res.status(400).json({ msg: 'You cannot follow yourself' });
    }

    if (!user || !userToFollow) {
      return res.status(400).json({ msg: 'User not found' });
    }

    // If user is already followed, unfollow
    if (
      user.following.some((userID) => userID.toString() === req.params.user_id)
    ) {
      const removeIndexFollower = userToFollow.followers.indexOf(req.user.id);
      userToFollow.followers.splice(removeIndexFollower, 1);
      userToFollow.follower_count--;

      const removeIndexFollowing = user.following.indexOf(req.params.user_id);
      user.following.splice(removeIndexFollowing, 1);
    } else {
      // else, follow
      userToFollow.followers.unshift(req.user.id);
      user.following.unshift(req.params.user_id);
    }
    await user.save();
    await userToFollow.save();
    res.json(userToFollow);
  } catch (err) {
    console.error(err.message);

    // if the userid doesn't exist, but is still a valid userid (i.e. same length), we want to return a more specific error msg). kind is a property of mongoose errors that is the validator's type, e.g. 'required' or 'regexp'
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'User not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   GET api/users/followers
// @desc    Get all followers
// @access  Private
// router.put('/follow/:user_id', auth, async (req, res) => {

// }

module.exports = router;
