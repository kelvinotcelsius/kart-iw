const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  creator_id: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  creator_profile_pic: {
    type: String,
    required: true,
  },
  creator_username: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
  video: {
    type: String,
    required: true,
  },
  preview: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  product_id: {
    type: Schema.Types.ObjectId,
    ref: 'product',
    required: true,
  },
  buyers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  ],
  comments: [
    {
      user_id: {
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
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  ],
});

module.exports = Post = mongoose.model('post', PostSchema);
