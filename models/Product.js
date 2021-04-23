const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  picture: {
    type: String,
    required: true,
  },
  external_url: {
    type: String,
    required: true,
  },
  reviews: [
    {
      rating: {
        type: Number,
        required: true,
      },
      description: {
        type: String,
      },
    },
  ],
  review_count: {
    type: Number,
    required: true,
    default: 0,
  },
  total_purchased: {
    type: Number,
    required: true,
    default: 0,
  },
  avg_rating: {
    type: Number,
    required: true,
    default: 0,
  },
  supplier_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'supplier',
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'post',
    },
  ],
});

module.exports = Product = mongoose.model('product', ProductSchema);
