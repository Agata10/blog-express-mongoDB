const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const users = require('../data/users');
const posts = require('../data/posts');

const Post = require('../models/postModel');
const User = require('../models/userModel');
const Comment = require('../models/commentModel');
//GET and POST comment
//GET posts by UserId or PostId query
router
  .route('/')
  .get(async (req, res, next) => {
    if (req.query.userId) {
      if (!mongoose.Types.ObjectId.isValid(req.query.userId)) {
        next();
        return;
      }
      const isUser = await User.findById(req.query.userId);

      if (!isUser) {
        next();
        return;
      }
      const userComments = await Comment.find({ userId: req.query.userId });
      return res.json(userComments);
    } else if (req.query.postId) {
      if (!mongoose.Types.ObjectId.isValid(req.query.postId)) {
        next();
        return;
      }
      const isPost = await Post.findById(req.query.postId);
      if (!isPost) {
        next();
        return;
      }
      const postComments = await Comment.find({ postId: req.query.postId });
      return res.json(postComments);
    } else {
      const comments = await Comment.find();
      if (!comments) return res.json({ error: 'No comments found' });
      res.json(comments);
    }
  })
  .post(async (req, res) => {
    try {
      const isUser = await User.findById(req.body.userId);
      if (!isUser) return res.json({ error: 'No user with that id exists' });
      const isPost = await Post.findById(req.body.postId);
      if (!isPost) return res.json({ error: 'No post with that id exists' });
      const comments = await Comment.create(req.body);
      return res.json(comments);
    } catch (err) {
      return res.json({ err: err.message });
    }
  });

router
  .route('/:id')
  .get(async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.json({ error: 'Id is not valid' }).status(404);
    }
    try {
      const comment = await Comment.findById(req.params.id);
      if (comment) {
        return res.json(comment);
      } else {
        next();
        return;
      }
    } catch (err) {
      res.json({ error: 'Error: ' + err });
    }
  })
  .patch(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.json({ error: 'Id is not valid' }).status(404);
    }

    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      {
        new: true,
      }
    );
    if (!comment) return res.json('Comment not found');
    return res.json(comment);
  })
  .delete(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.json({ error: 'Id is not valid' }).status(404);
    }
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (comment) {
      return res.json(comment);
    } else {
      return res.json('Comment not found');
    }
  });

module.exports = router;
