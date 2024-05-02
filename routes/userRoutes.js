const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//const users = require('../data/users');
const userController = require('../controllers/userController');
const posts = require('../data/posts');
const User = require('../models/userModel');
const Post = require('../models/postModel');
//GET users and create-POST user
router
  .route('/')
  .get(userController.getUsers)
  .post(async (req, res) => {
    const foundUser = await User.findOne({ username: req.body.username });
    if (foundUser) {
      return res.json({ error: 'Username Already Taken' });
    }
    try {
      const result = await User.create(req.body);
      res.json(result);
    } catch (err) {
      console.log(err.message);
      res.json({ error: err.message });
    }
  });

//Retrieves all posts by a user with the specified id
//it might have query to sort by id either desc or asc
router.route('/:id/posts/').get(async (req, res, next) => {
  try {
    let userPosts = await Post.find({ userId: req.params.id });
    const user = await User.findById(req.params.id);
    const users = await User.find();
    const userName = user.username;
    if (req.query.sortBy === 'desc') {
      userPosts = await Post.find({ userId: req.params.id }).sort({
        createdAt: -1,
      });

      console.log(userPosts);
    } else if (req.query.sortBy === 'asc') {
      userPosts = await Post.find({ userId: req.params.id }).sort({
        createdAt: 1,
      });
    }
    if (userPosts) {
      return res.render('users', {
        title: 'posts',
        users,
        userPosts,
        userName,
      });
    }
  } catch (err) {
    next();
  }
});

//render creating post view
router.route('/:id/posts/create').get((req, res) => {
  res.render('createPost', { userId: req.params.id, title: 'create post' });
});

//GET, PATCH, DELETE the user with specific id parameter
router
  .route('/:id')
  .get(async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.json({ error: 'Id is not valid' }).status(404);
    }
    const user = await User.findById(req.params.id);

    if (user) {
      res.json(user);
    } else {
      next();
      return;
    }
  })
  .patch(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.json({ error: 'Id is not valid' }).status(404);
    }
    try {
      const result = await User.findByIdAndUpdate(
        req.params.id,
        { ...req.body },
        {
          new: true,
        }
      );
      if (!result) {
        return res.status(404).json({ error: 'Not such user' });
      }
      res.json(result);
    } catch (err) {
      res.json({ error: `Error ${err.message}` });
    }
  })
  .delete(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.json({ error: 'Id is not valid' }).status(404);
    }
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'Not such user' });
      }
      res.json(user);
    } catch (err) {
      res.json({ error: `Error ${err.message}` });
    }
  });

module.exports = router;
