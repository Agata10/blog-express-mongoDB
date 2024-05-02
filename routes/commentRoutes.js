const express = require('express');
const router = express.Router();
const comments = require('../data/comments');
const users = require('../data/users');
const posts = require('../data/posts');

const Post = require('../models/postModel');
const User = require('../models/userModel');

//GET and POST comment
//GET posts by UserId or PostId query
router
  .route('/')
  .get(async (req, res, next) => {
    if (req.query.userId) {
      const isUser = await User.findById(req.query.userId);
      if (!isUser) {
        next();
      }
      const userComments = await Comment.find({ userId: req.query.userId });
      return res.json(userComments);
    } else if (req.query.postId) {
      const isPost = await Post.findById(req.query.postId);
      if (!isPost) {
        next();
      }
      const postComments = comments.filter((c) => c.postId == req.query.postId);
      return res.json(postComments);
    } else {
      res.json(comments);
    }
  })
  .post((req, res) => {
    if (req.body.userId && req.body.postId && req.body.body) {
      const isUser = users.find((u) => u.id == req.body.userId);
      if (!isUser) return res.json({ error: 'No user with that id exists' });
      const isPost = posts.find((p) => p.id == req.body.postId);
      if (!isPost) return res.json({ error: 'No post with that id exists' });
      const comment = {
        id: comments[comments.length - 1].id + 1,
        userId: Number(req.body.userId),
        postId: Number(req.body.postId),
        body: req.body.body,
      };
      comments.push(comment);
      return res.json(comments[comments.length - 1]);
    } else {
      return res.json({ error: 'Invalid data' });
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
