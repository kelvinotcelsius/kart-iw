const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  post_id: {
    type: Schema.Types.ObjectId,
    ref: 'post',
    required: true,
  },
  creator_id: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  buyer_id: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  product_id: {
    type: Schema.Types.ObjectId,
    ref: 'product',
    required: true,
  },
  quantity: {
    type: Schema.Types.Number,
    required: true,
    default: 1,
  },
  total_paid: {
    type: Schema.Types.Number,
    required: true,
    default: 0,
  },
});

module.exports = Order = mongoose.model('order', OrderSchema);
