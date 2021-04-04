const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const checkObjectId = require('../../middleware/checkObjectId');

const Product = require('../../models/Product');
const Supplier = require('../../models/Supplier');

const { createProductIndices } = require('../utils/createSearchIndices');

// @route   POST api/products
// @desc    Add a product
// @access  Private
router.post(
  '/',
  auth,
  [
    check('name', 'A name is required').not().isEmpty(),
    check('description', 'A description is required').not().isEmpty(),
    check('price', 'A price is required').not().isEmpty(),
    check('team_price', 'A team price is required').not().isEmpty(),
    check('collections', 'At least one collection is required').not().isEmpty(),
    check('categories', 'At least one category is required').not().isEmpty(),
    check('picture', 'A picture is required').not().isEmpty(),
    check('supplier_id', 'A supplier ID is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    supplier = await Supplier.findOne({ _id: req.body.supplier_id });

    if (!supplier) {
      return res.status(400).send('Supplier not found');
    }

    try {
      // Add new product to product collection
      const newProduct = new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        team_price: req.body.team_price,
        collections: req.body.collections,
        categories: req.body.categories,
        picture: req.body.picture,
        external_url: req.body.external_url,
        supplier_id: supplier._id,
      });
      const product = await newProduct.save();

      // Add new product to supplier collection
      supplier.products.push(product._id);
      await supplier.save();

      res.json(product);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/products/all
// @desc    Get all products
// @access  Public
router.get('/all', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/products/:post_id
// @desc    Get a product by the post ID
// @access  Public
router.get('/post/:post_id', [checkObjectId('post_id')], async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const product = await Product.findById(post.product_id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

// @route   GET api/products/:product_id
// @desc    Get a product by the product ID
// @access  Public
router.get('/:product_id', [checkObjectId('product_id')], async (req, res) => {
  try {
    const product = await Product.findById(req.params.product_id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/products/search/createAlgolia
// @desc    Save product fields as JSON object
// @access  Private
router.get('/search/createAlgolia', auth, async (req, res) => {
  try {
    const products = await Product.find();
    const indices = await createProductIndices(products);
    res.json(indices);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
