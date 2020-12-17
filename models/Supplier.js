const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SupplierSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  url: {
    type: String,
    required: true,
  },
  products: {
    type: [Schema.Types.ObjectId],
    ref: 'product',
  },
});

module.exports = Supplier = mongoose.model('supplier', SupplierSchema);
