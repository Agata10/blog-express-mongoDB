const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true, //created index, this worked
    },
    title: {
      type: String,
      required: true,
      minLength: 3,
    },
    content: {
      type: String,
      required: true,
      minLength: 10,
    },
  },
  { timestamps: true }
);

///post are often taken based on user id
// postSchema.index({ userId: 1 });
//NOTE it didnt want to work

module.exports = mongoose.model('Post', postSchema);
