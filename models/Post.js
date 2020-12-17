const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  caption: {
    type: String,
    required: true,
  },
  video: {
    type: String,
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'product',
  },
  buyers: {
    type: [Schema.Types.ObjectId],
    ref: 'user',
  },
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
      text: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  likes: {
    type: [Schema.Types.ObjectId],
    ref: 'user',
  },
});

module.exports = Post = mongoose.model('post', PostSchema);
