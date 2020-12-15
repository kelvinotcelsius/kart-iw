const express = require('express');
const router = express.Router();

// @route   GET api/users
// @desc    Test
// @access  Public
router.get('/', (req, res) => res.send('Shopping route'));

module.exports = router;
