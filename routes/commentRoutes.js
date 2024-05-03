const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

//GET and POST comment
//GET posts by UserId or PostId query
router
  .route('/')
  .get(commentController.getComment)
  .post(commentController.createComment);

router
  .route('/:id')
  .get(commentController.getCommentById)
  .patch(commentController.updateComment)
  .delete(commentController.deleteComment);

module.exports = router;
