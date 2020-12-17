const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../../models/User');
const Post = require('../../models/Post');

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

// Create profile
// @route   POST api/user/profile
// @desc    Create user profile
// @access  Private
router.post(
  '/profile',
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

    try {
      // See if username exists
      let user = await User.findOne({ username });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Username not available' }] }); // the err msg syntax is looks weird, but the rationale is to match the error msg format of the validation error in line 24
      }

      // If username doesn't exist, finish creating user
      user = await User.findById(req.user.id);
      const userFields = {};
      if (username) userFields.username = username;
      if (first) userFields.first = first;
      if (last) userFields.last = last;
      if (profile_pic) userFields.profile_pic = profile_pic;
      if (bio) userFields.bio = bio;
      if (birthday) userFields.birthday = birthday;
      if (phone) userFields.phone = phone;

      user = await User.findOneAndUpdate(
        { _id: req.user.id },
        { $set: userFields },
        { new: true }
      );

      res.json(user);
      console.log(user);
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

// @route   GET api/user/:user_id
// @desc    Get user by id
// @access  Public
router.get('/:user_id', async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.user_id });

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

module.exports = router;
