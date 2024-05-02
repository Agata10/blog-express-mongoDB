const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    body: {
      type: String,
      required: true,
      minLength: 10,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);
