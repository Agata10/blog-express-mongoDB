const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Post = require('../models/postModel');
const User = require('../models/userModel');

//GET and POST posts
router
  .route('/')
  .get(async (req, res, next) => {
    //for userId query
    if (req.query.userId) {
      if (!mongoose.Types.ObjectId.isValid(req.query.userId)) {
        next();
        return;
      }
      let userPosts = await Post.find({ userId: req.query.userId });
      if (userPosts.length > 0) {
        res.render('posts', { title: 'posts', posts: userPosts });
      } else {
        next();
        return;
      }
    } else {
      const posts = await Post.find();
      res.render('posts', { title: 'posts', posts });
    }

    //res.json(posts);
  })
  .post(async (req, res) => {
    const userExists = await User.findById(req.body.userId);
    if (!userExists) {
      return res.json({ error: 'Not user found' });
    }
    try {
      const post = await Post.create(req.body);
      res.json(post);
    } catch (err) {
      return res.json({ error: 'error: ' + err.message });
    }
  });

//GET posts by id, PUT by id, DELETE by id
router
  .route('/:id')
  .get(async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.json({ error: 'Id is not valid' }).status(404);
    }
    const post = await Post.findById(req.params.id);
    if (post) {
      res.json(post);
    } else {
      next();
    }
  })
  .put(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.json({ error: 'Id is not valid' }).status(404);
    }
    try {
      const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!post) {
        return res.status(404).json({ error: 'Not such post' });
      }
      res.json(post);
    } catch (err) {
      res.json({ error: `Error ${err.message}` });
    }
  })
  .delete(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.json({ error: 'Id is not valid' }).status(404);
    }
    try {
      const post = await Post.findByIdAndDelete(req.params.id);
      if (!post) {
        return res.json({ error: 'Post not found' });
      }
      res.json(post);
    } catch (err) {
      res.json({ error: `Error ${err.message}` });
    }
  });

module.exports = router;
