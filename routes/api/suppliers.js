const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Product = require('../../models/Product');
const Supplier = require('../../models/Supplier');

// @route   POST api/suppliers
// @desc    Add a supplier
// @access  Public
router.post(
  '/',
  [
    check('name', 'A name is required').not().isEmpty(),
    check('category', 'A description is required').not().isEmpty(),
    check('description', 'A price is required').not().isEmpty(),
    check('url', 'A URL is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const newSupplier = new Supplier({
        name: req.body.name,
        category: req.body.category,
        description: req.body.description,
        url: req.body.url,
      });

      const supplier = await newSupplier.save();

      res.json(supplier);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/suppliers/all
// @desc    Get all suppliers
// @access  Public
router.get('/all', async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
