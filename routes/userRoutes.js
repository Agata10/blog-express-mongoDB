const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

//GET users and create-POST user
router.route('/').get(userController.getUsers).post(userController.createUser);

//Retrieves all posts by a user with the specified id(optional sortBy query)
router.route('/:id/posts/').get(userController.getPostsByUserId);

//render creating post view
router.route('/:id/posts/create').get((req, res) => {
  res.render('createPost', { userId: req.params.id, title: 'create post' });
});

//GET, PATCH, DELETE the user with specific id parameter
router
  .route('/:id')
  .get(userController.getUserById)
  .patch(userController.updateUserById)
  .delete(userController.delteUserById);

module.exports = router;
