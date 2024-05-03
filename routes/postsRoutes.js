const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const postController = require('../controllers/postController');

//GET and POST posts
router.route('/').get(postController.getPosts).post(postController.createPost);

//GET posts by id, PUT by id, DELETE by id
router
  .route('/:id')
  .get(postController.getPostById)
  .put(postController.updatePostById)
  .delete(postController.deletePostById);

module.exports = router;
