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
  .get((req, res, next) => {
    const comment = comments.find((c) => c.id == req.params.id);
    if (comment) {
      return res.json(comment);
    } else {
      next();
      return;
    }
  })
  .patch((req, res) => {
    const comment = comments.find((c) => c.id == req.params.id);
    if (comment) {
      for (let key in req.body) {
        comment[key] = req.body[key];
        if (key == 'userId' || key == 'postId') {
          comment[key] = Number(req.body[key]);
        }
      }
      return res.json(comment);
    } else {
      return res.json('Comment not found');
    }
  })
  .delete((req, res) => {
    const comment = comments.find((c, i) => {
      if (c.id == req.params.id) {
        comments.splice(i, 1);
        return true;
      }
    });
    if (comment) {
      return res.json(comment);
    } else {
      return res.json('Comment not found');
    }
  });

module.exports = router;
