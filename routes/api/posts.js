const express = require('express');
const router = express.Router();

// @route   GET api/users
// @desc    Test
// @access  Public
router.get('/', (req, res) => res.send('Posts route'));

module.exports = router;
