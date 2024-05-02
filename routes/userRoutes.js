const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//const users = require('../data/users');
const userController = require('../controllers/userController');
const posts = require('../data/posts');
const User = require('../models/userModel');
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
router.route('/:id/posts/').get((req, res, next) => {
  const userPosts = posts.filter((p) => p.userId == req.params.id);
  const userName = users.find((u) => u.id == req.params.id).name;
  if (req.query.sortBy === 'id:desc') {
    userPosts.sort((a, b) => {
      return b.id - a.id;
    });
  } else if (req.query.sortBy === 'id:asc') {
    userPosts.sort((a, b) => {
      return a.id - b.id;
    });
  }
  if (userPosts) {
    return res.render('users', { title: 'posts', users, userPosts, userName });
  } else {
    next();
  }
});

//render creating post view
router.route('/:id/posts/create').get((req, res, next) => {
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
