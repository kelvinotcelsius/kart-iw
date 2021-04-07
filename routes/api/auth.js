const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

// @route   GET api/auth
// @desc    Get user data
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // in the auth.js middleware we set req.user to be decoded.user, which is why we can reference req.user here. req.user refers the user object in the jwt's payload. See users.js in 'routes/api' for how we create the token and the payload
    const user = await User.findById(req.user.id).select('-password'); // .select(-password) omits the password in the returned object

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/auth
// @desc    Authenticate user, log in, and get token
// @access  Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return error code 400 with a JSON response containing an array of the errors
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] }); // the err msg syntax is looks weird, but the rationale is to match the error msg format of the validation error in line 24
      }

      const isMatch = await bcrypt.compare(password, user.password); // .compare() returns whether the plain-text password matches the encrypted password (user.password)

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      var registrationFinished = 'false';
      if (user.username) {
        registrationFinished = 'true';
      }
      // Return JWT
      const payload = {
        user: {
          id: user.id,
        },
      };
      // create the JWT with our private key
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token, registrationFinished }); // sends token back to client
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
