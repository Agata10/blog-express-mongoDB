const mongoose = require('mongoose');
const User = require('../models/userModel');
const Post = require('../models/postModel');

//GET posts
module.exports.getPosts = async (req, res, next) => {
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
};

//Create post
module.exports.createPost = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.body.userId)) {
    return res.json({ error: 'Id is not valid' }).status(404);
  }
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
};

//GET post by id
module.exports.getPostById = async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.json({ error: 'Id is not valid' }).status(404);
  }
  const post = await Post.findById(req.params.id);
  if (post) {
    res.json(post);
  } else {
    next();
  }
};

//Update post
module.exports.updatePostById = async (req, res) => {
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
};

//Delete post
module.exports.deletePostById = async (req, res) => {
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
};
